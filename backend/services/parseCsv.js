const csv = require('csv-parser');
const fs = require('fs');
const { analyseCsv } = require('./analyseCSV');
const sendToDatabase = require('./sendToDatabase');

function parseCsv(file, downloadTime, userID) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(file)
      .pipe(csv(['Date', 'Amount', 'Transaction', 'Balancing']))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const subscriptions = await analyseCsv(results, downloadTime);
          await sendToDatabase(subscriptions, userID);
          console.log('Data successfully sent to the database');
          resolve(); // Resolve the promise after processing
        } catch (error) {
          console.error('Error processing CSV data:', error);
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error('File read error:', err);
        reject(err);
      });
  });
}


module.exports = parseCsv;
