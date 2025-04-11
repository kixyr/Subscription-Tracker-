const SubscriptionSchema = require('../Models/subscription-schema.js')
const axios = require('axios')
const Users = require('../Models/users')

const addSubscription = async (req, res) => {
  console.log('Adding subscription...');

  try {
    const { userId } = req.user;

    const newSub = {
      ...req.body,
      cost: Number(req.body.cost),
      every: Number(req.body.every),
      notifications: req.body.notifications === true,
      renewalDate: new Date(req.body.renewalDate)
    };

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { $push: { subscriptions: newSub } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ subscriptions: updatedUser.subscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add subscription" });
  }
};




const getAllSubscriptions = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await Users.findById(userId);

    if (!user) return res.status(404).json({ subscriptions: [] });

    res.status(200).json({ subscriptions: user.subscriptions || [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get subscriptions" });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { userId } = req.user;
    const subId = req.params.id;

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { $pull: { subscriptions: { _id: subId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({ subscriptions: updatedUser.subscriptions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete subscription" });
  }
};


const updateSubscription = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.user;

    const updated = await SubscriptionSchema.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found or not authorized" });

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update subscription" });
  }
};


module.exports = {addSubscription, getAllSubscriptions, deleteSubscription, updateSubscription}
