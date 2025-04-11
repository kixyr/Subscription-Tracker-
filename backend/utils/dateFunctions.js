
function prevThreeDays(day,month, year, minDays){
  for(let i=0; i < minDays; i++){
    const [previDay, previMonth, previYear] = prevDay(day, month , year)
    day = previDay
    month = previMonth
    year = previYear
  }
  return [day, month, year]

}

function prevDay(day, month, year ){
  const daysInMonth = {
    "01": 31, "02": 28, "03": 31, "04": 30, "05": 31, "06": 30,
    "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31
};

// Leap year check for February
if (month === "02") {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) daysInMonth["02"] = 29;
}

let prevDay = Number(day) - 1;
let prevMonth = month;
let prevYear = year;

if (prevDay === 0 ) {
  
    prevMonth = String(Number(month) - 1).padStart(2, "0");

    // If next month exceeds 12, reset to 01 and move to next year
    if (prevMonth  === "00") {
        prevMonth = "12";
        prevYear = String(Number(year) - 1);
    }
    prevDay = daysInMonth[prevMonth]

}

return [String(prevDay).padStart(2, "0"), prevMonth, prevYear];
}

function getNextDay(day, month, year) {
  const daysInMonth = {
      "01": 31, "02": 28, "03": 31, "04": 30, "05": 31, "06": 30,
      "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31
  };

  // Leap year check for February
  if (month === "02") {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (isLeapYear) daysInMonth["02"] = 29;
  }

  let nextDay = Number(day) + 1;
  let nextMonth = month;
  let nextYear = year;

  // If next day exceeds days in the month, reset to 1 and move to next month
  if (nextDay > daysInMonth[month]) {
      nextDay = 1;
      nextMonth = String(Number(month) + 1).padStart(2, "0");

      // If next month exceeds 12, reset to 01 and move to next year
      if (nextMonth > "12") {
          nextMonth = "01";
          nextYear = String(Number(year) + 1);
      }
  }

  return [String(nextDay).padStart(2, "0"), nextMonth, nextYear];
}

function getPreviousMonth(day,month,year){
if(month === '01'){
  return [day,'12',String(Number(year)-1)]
}

const formattedMonth = String(Number(month)-1).padStart(2, '0'); 
return [day,formattedMonth, year]

}

function getNextMonth(day, month, year){
if(month === '12'){
  return [day,'01',String(Number(year)+1)]

}
const formattedMonth = String(Number(month)+1).padStart(2, '0'); 
return [day,formattedMonth, year]
}
//gets the time the file was downloaded and formats it to a date
function getDownloadTimeDate(downloadTime){
  const date = new Date(downloadTime);
  const year = date.getUTCFullYear();  
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return [day, month, year]
}

module.exports = {
  prevThreeDays,
  prevDay,
  getNextDay,
  getPreviousMonth,
  getNextMonth,
  getDownloadTimeDate
}