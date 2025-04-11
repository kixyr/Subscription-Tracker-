const axios = require('axios')
const {prevThreeDays, getNextDay, getPreviousMonth, getDownloadTimeDate } = require('../utils/dateFunctions')
const countryDict = require('../utils/countryDict.json')

/*
Example CommBank CSV Expense Transaction
(Only expense rows are shown, as used in the subscription tracker)

Format:
Date, Amount (negative), Description, Balance

Sample entries:
11/02/2025, "-6.99", "Spotify P33E65168D Sydney AU AUS Card xx2784 Value Date: 09/02/2025", "+61.72"
06/02/2025, "-14.99", "NBA League Pass Secaucus NJ USA Card xx2784 AUD 14.99 Value Date: 05/02/2025", "+519.01"
*/

async function analyseCsv(file, downloadTime){
  const formattedFile = preFilterFile(file)
  const subscriptions = await checkPreviousMonths(file, formattedFile, downloadTime)
  console.log(subscriptions)
  return subscriptions
  }


  
/* main function that iterates thorugh the current month and previous months for valid subscriptions
it checks if the subscription name is in the transaction name and if the payment occurs once a month */
async function checkPreviousMonths(file,formattedFile, downloadTime){

  let countMonth=0;

  let changeInMonth = file[0].Date.split('/')[1]
  
  const [lastDay, lastMonth, lastYear] = getDownloadTimeDate(downloadTime)

  const subscriptions = []
  let subName
  for(transaction of file){
    if(Number(transaction.Amount) > 0 || !transaction.Transaction.split(' ').includes('Card') || transaction.Amount.includes('+')){
      continue
    }
    
    const [day, month, year] = (transaction.Date).split('/')
    
    const minDays = 3
    const gracePeriod = 6
    //makes sure to check only the most recent 2 months so it doenst access old subscripitions
    if(countMonth === 1){
      if(day < (lastDay - minDays) && month<=lastMonth && year<= lastYear) {
        return subscriptions}
    }
    //if subscription is in the name, find the name and add it to the subscriptions array
    if(checkSubInName(transaction.Transaction, month)){
      console.log(transaction)
      subName = await ifSubscriptionInName(transaction)
  
      subscriptions.push(subName);
      continue
    }
    if(month != changeInMonth) {

      countMonth++
      changeInMonth = month
    
    }
    if(countMonth === 2) return subscriptions

    let foundConsecutivePayment = false
    let sameTransactionDate
    let [prevDay, prevMonth, prevYear] = getPreviousMonth(day, month , year)
    let [currentDay, currentMonth, currentYear] = prevThreeDays(prevDay, prevMonth, prevYear, minDays)

    //accesses previous months Transactions
    for(let i=0; i<gracePeriod; i++){
      const currentMonthTransactions =   formattedFile[currentMonth + '-' + currentYear ] || []
      
    let dailyTransactions = []
    
    if(currentMonthTransactions) {
      dailyTransactions = currentMonthTransactions[currentDay + '-' + currentMonth + '-' + currentYear] || []

    }
    if(dailyTransactions.length === 0){
      [currentDay, currentMonth, currentYear] = getNextDay(currentDay, currentMonth, currentYear)
      continue
    }
      //checks if current Transaction is identical to any previous months Transactions 
      for (const dailyTransaction of dailyTransactions) {
        
        subName = await checkIfPaymentsSame(dailyTransaction, transaction, formattedFile)
        if (subName) {
            sameTransactionDate = dailyTransaction;
            break;
        }
    }
  
    if(sameTransactionDate) {
      foundConsecutivePayment = true
      break
    }
    else{
      [currentDay, currentMonth, currentYear] = getNextDay(currentDay, currentMonth, currentYear)
      }

  }

  if (foundConsecutivePayment) {
    subscriptions.push(subName);
  }
}

return subscriptions

}



/*filters file to remove all transactions that are obviously not subscriptions, such as transfers, refunds, and other transactions that are not related to subscriptions.It also groups transactions by month and day. */
function preFilterFile(file){
  let [currentDay, currentMonth, currentYear] = (file[0].Date).split('/')
  
  const filteredByDateFile = {}
  let monthlyTransactions = {}
  let dailyTransactions = []
   file.forEach((transaction) =>{
    // Skip this transaction if it's a positive amount or not a card transaction
    if(Number(transaction.Amount) > 0 || !transaction.Transaction.split(' ').includes('Card') || transaction.Amount.includes('+')){
      return
    }
    const [day, month, year] = (transaction.Date).split('/')
   // If the day, month, or year changes, it's time to store the previous day's data
    if(currentDay != day || currentMonth!=month || currentYear != year){
      monthlyTransactions[currentDay+ '-' + currentMonth +'-'+ currentYear] = dailyTransactions
      if(currentMonth != month || currentYear != year){

        if (!filteredByDateFile[currentMonth + '-' + currentYear]) {
          filteredByDateFile[currentMonth + '-' + currentYear] = {}
      }
      filteredByDateFile[currentMonth + '-' + currentYear] = monthlyTransactions
      // Reset for the new month
      monthlyTransactions = {}
      }
      
      currentMonth = month
      currentYear = year
      currentDay = day
       // Reset for new day
      dailyTransactions =[]

    }
    dailyTransactions.push(transaction)
  })
  // Store the last day's transactions
  if (dailyTransactions.length > 0) {
    monthlyTransactions[currentDay + '-' + currentMonth + '-' + currentYear] = dailyTransactions;
  }

    // Store last month's transactions after loop ends
    if (!filteredByDateFile[currentMonth + '-' + currentYear]) {
      filteredByDateFile[currentMonth + '-' + currentYear] = {};
    }
    filteredByDateFile[currentMonth + '-' + currentYear] = monthlyTransactions
    return filteredByDateFile
}

function checkSubInName(transaction){
  const lowerCaseTransactions = transaction.toLowerCase()
  return (lowerCaseTransactions.includes('subscr') || lowerCaseTransactions.includes('monthly') || lowerCaseTransactions.includes('premium') || lowerCaseTransactions.includes('plus'))  
}


/*checks if the word is valid and not an ID or area code as subscriptions may be the same with only differing areacode/ID */
function isValidWord(word) {
  let letterCount = 0, numberCount = 0;
  
  for (let char of word) {
      if (char >= '0' && char <= '9') numberCount++
      else if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) letterCount++
  }

  // Skip long number sequences (area codes, IDs) or if only numbers are present
  if (numberCount > 3 || letterCount === 0) return 0
  
  return word
}

/*gets the index from where the location starts in the transaction */
async function getTransactionLocation(transaction) {
  //find index where card is located in the transaction name, as before this point is the location
  let mainTransac = transaction.findIndex((element) => element === 'card');
  if (mainTransac === -1) return 0

  // now start at the index before card
  if (mainTransac > 1) mainTransac -= 1
  
  let country = "Unknown"
  console.log(transaction[mainTransac])
  //word before card is always country name
  if (transaction[mainTransac] && countryDict[transaction[mainTransac]]) {
      country = countryDict[transaction[mainTransac]];
  }

  let count = 0
  let query = [',' + country];
  mainTransac -= 1

  //checks string from backwards to seperate location and subscription name. Allows second chance until 2 fails.
  while (mainTransac > 0) {
      query.push(transaction[mainTransac]);
      console.log(query)
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.join(' '))}&format=json&addressdetails=1`;
      try {
          const response = await axios.get(url);

          if (response.data.length === 0) {
              count += 1
          }
          else {
            // Reset count if a valid location is found.
            count = 0 
        } 
        if (count === 2) {
            console.log(mainTransac + 1)
            console.log(transaction[mainTransac + 1])
            return mainTransac + 1; // This means we found a valid location after failing twice.
          } 

          mainTransac -= 1

      } catch (error) {
          console.error("Error fetching location:", error)
          return -1; // Return a default value in case of an error.
      }
  }
  console.log('count ' + count)
  // in case the word last checked is apart of the subscription name
  if(count >= 1) return mainTransac + 1; 
  return mainTransac; 
}

/* This function only runs if checkSubInName returns true, meaning it's confirmed 
to be a subscription so all we need to do is just extract the name. */
async function ifSubscriptionInName(transaction){
  const transactionDetails = transaction.Transaction.toLowerCase().split(' ')
  let transacIndex = await getTransactionLocation(transactionDetails)
  if (transacIndex <= 0) {
    // If location detection failed, simply grab the first word as the name
    return [transactionDetails[0], transaction.Date, transaction.Amount]   
}
  const subName = []
  while(transacIndex >= 0){
    
    if(isValidWord(transactionDetails[transacIndex])) subName.push(transactionDetails[transacIndex])
    transacIndex--
  }
  
  return {
    //cleans and formats the companyName to make it more readable
    companyName:subName.length > 1 ? subName.reverse().join(' ') : subName.join(' '), 
    date: transaction.Date, 
    cost: transaction.Amount}

}


//first words are realted to the company name and last words are related to location
async function checkIfPaymentsSame(prevMonthTransaction , transaction, formattedFile) {

  const transactionDetails = transaction.Transaction.toLowerCase().split(' ')
  if(transactionDetails[0] === 'nba'){
    console.log("yuuuur")
  }
  const prevMonthTransactionDetails = prevMonthTransaction.Transaction.toLowerCase().split(' ')

  //first words is always the company first name so they must be the same and payment must occur once in month
  if((prevMonthTransaction.Amount != transaction.Amount) || (isValidWord(prevMonthTransactionDetails[0]) != isValidWord(transactionDetails[0])) || !checkIfPaymentOccursOnce(prevMonthTransaction, formattedFile)){
    return false
  }

  let transacIndex = await getTransactionLocation(transactionDetails)

  if (transacIndex <= 0 ) {
    return false
  }

  const subName = []
  // reads the transaction backwards from the start of the location to the start of the compnay name
  while(transacIndex >= 0){
    if(isValidWord(transactionDetails[transacIndex]) != isValidWord(prevMonthTransactionDetails[transacIndex])){
      if(transactionDetails[0] === 'nba'){
        console.log(transactionDetails[transacIndex])
      }
      return false
    }
    if(isValidWord(transactionDetails[transacIndex])) subName.push(transactionDetails[transacIndex])
    
    transacIndex--
  }
  return {companyName: subName.length > 1 ? subName.reverse().join(' ') : subName.join(' '), date: transaction.Date, cost: transaction.Amount}

}

/*checks if the payment occurs once a month by checking the current month transactions*/
function checkIfPaymentOccursOnce(sameTransactionDate, file){
  let [day, month , year] = sameTransactionDate.Date.split('/')
  day = 1
  const monthTransactions =  file[month + '-' + year ]
  const currentMonth = month
  let count = 0
  //only checls the current month for duplicate payments
  while(currentMonth === month){
    
    const dailyTransactions = monthTransactions[day + '-' + month + '-' + year] || []

     const foundSameTransaction = dailyTransactions.find((transaction) =>{
      // basic check if the transaction amount and name match exactly match
      return (sameTransactionDate.Amount === transaction.Amount && sameTransactionDate.Transaction.split('Value')[0].trim() === transaction.Transaction.split('Value')[0].trim())
    })
    if(foundSameTransaction){
      count++
      
    }
    //count will be 2 if the payment occurs twice in the month
    if(count == 2){
      return false
    }
    [day, month, year] = getNextDay(day, month, year)
  }

  return true
  

}

module.exports = {analyseCsv}