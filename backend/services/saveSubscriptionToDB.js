const Users = require('../Models/users'); 

async function saveSubscriptionToDB(subscriptionData, isFileUpload = false, userID) {
  try {
    // Apply defaults if data comes from a file
    if (isFileUpload) {
      subscriptionData.every = subscriptionData.every || 1; // Default value
      subscriptionData.renewalPeriod = subscriptionData.renewalPeriod || 'month';
      subscriptionData.type = subscriptionData.type || 'subscription';
      subscriptionData.createdAt = new Date();
    }

    // Convert fields to correct types
    subscriptionData.cost = Number(subscriptionData.cost);
    subscriptionData.every = Number(subscriptionData.every);
    subscriptionData.renewalDate = new Date(subscriptionData.renewalDate);
    subscriptionData.notifications = subscriptionData.notifications === true;

    // Push subscription into the user's subscriptions array
    const updatedUser = await Users.findOneAndUpdate(
      { _id: userID },
      { $push: { subscriptions: subscriptionData } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return subscriptionData;
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
}

module.exports = saveSubscriptionToDB;
