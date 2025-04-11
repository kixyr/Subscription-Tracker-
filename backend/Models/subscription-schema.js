const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    autoRenewal: {
      type: String,
      enum: ["yes", "no"],
      default: "yes"
    },
    type: {
      type: String,
      enum: ["subscription", "trial", "lifetime"],
      required: true
      
    },
    renewalDate: {
      type: Date,
      required: true
    },
    every: {
      type: Number,
      required: true
    },
    renewalPeriod: {
      type: String,
      enum: ["month", "year", "week", "day"],
      required: true,
    },
    cost: {
      type: Number,
      required: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now   
    }
  

});


module.exports = subscriptionSchema;
