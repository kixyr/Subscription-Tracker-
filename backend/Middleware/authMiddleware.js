const { HttpStatusCode } = require('axios')
const User = require('../Models/users')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes');
require('dotenv').config()

const authenticate = (req,res,next) =>{
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "invlaid authorisation key"})
  }
  const token = authHeader.split(' ')[1]
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId, name: payload.name };    
    next()
  }catch(error){
    console.log(error)
  }
}

module.exports = authenticate