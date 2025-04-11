const saveSubscriptionToDB = require('./saveSubscriptionToDB.js');
const { getNextMonth } = require('../utils/dateFunctions.js');

function getNextMonthAsDate(date) {
  const [Day, Month, Year] = date.split('/');
  const [newDay, newMonth, newYear] = getNextMonth(Day, Month, Year);
  return new Date(`${newYear}-${newMonth}-${newDay}T00:00:00Z`);
}
//sends each valid subscription from file to database
async function sendToDatabase(data, userID) {
  try {
    for (const subscription of data) {
      const { companyName, date, cost } = subscription;

      await saveSubscriptionToDB({
        companyName,
        cost: Number(cost) * -1, // Convert cost to positive
        renewalDate: getNextMonthAsDate(date),
        
      }, true, userID);}
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
}

module.exports = sendToDatabase;
