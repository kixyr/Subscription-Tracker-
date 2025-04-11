const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SubscriptionSchema = require('./subscription-schema');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'must enter password'],
    minlength: 7,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'must enter a name'],
    maxlength: 25,
  },
  subscriptions: [SubscriptionSchema] // ✅ this should be inside the schema object
}, {
  timestamps: true
});
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  console.log(isMatch)
  return isMatch
}
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET , {expiresIn: process.env.JWT_LIFETIME})
}


module.exports = mongoose.model('users', UserSchema)