const axios = require('axios');
require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const SubscriptionRouter = require('./routes/subscription-route')
const cors = require('cors')
const parseCsv = require('./services/parseCsv')
const multer = require('multer');
const auth = require('./routes/auth')
const authMiddleware = require('./Middleware/authMiddleware')

app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(express.json())
app.use('/api/v1/subscription', authMiddleware, SubscriptionRouter);

app.use('/api/v1/auth', auth )

//recieve csv file and parse it
const update = multer({dest: 'files/'})
app.post('/api/v1/csv', update.single('file'), authMiddleware, async (req, res) => {
  console.log('File upload received!');

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const userId = req.user.userId; 
  const filePath = req.file.path;
  const downloadTime = req.body.downloadTime;

  await parseCsv(filePath, downloadTime, userId);

  res.status(200).json({ message: 'File uploaded and processing started' });
});


function start(){
  try{
    connectDB(process.env.MONGO_URI)
    app.listen(5000,()=>{
      console.log('Server is listening on port 5000...')
    })
  }catch(error){
    console.error(error)
  }
}


start()


