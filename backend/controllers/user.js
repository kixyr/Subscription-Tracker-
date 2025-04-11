const User = require('../Models/users')
const { StatusCodes } = require('http-status-codes');
require('dotenv').config()

const registerUser = async (req,res) =>{
  const {name, email,password} = req.body
  if(!name || !email || !password){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "must enter email, name and password"})
  }
 
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  
  res.status(StatusCodes.CREATED).json({user: {name}, token})


}

const loginUser = async (req,res) =>{
  const {email, password} = req.body
  if(!email || !password){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "must enter email and password"})
  }
  const user = await User.findOne({email})
  if(!user){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "email not found."})

  }
  if(!await user.comparePassword(password)){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "Wrong password. Try again"})
  }
  const token = user.createJWT()
  await checkSubscriptions(email)
  //check if the user has any subscriptions and send email if they do
  res.status(StatusCodes.OK).json({user: {name:user.name}, token})
}
const {Resend} = require('resend');

const resend = new Resend(process.env.EMAIL_API_KEY);

async function handleEmail(email, subscriptionName, subscriptionCost) {
  console.log('sending email...')
  console.log(subscriptionName, subscriptionCost)
  const { data, error } = await resend.emails.send({
    from: 'Subscription Tracker <onboarding@resend.dev>',
    to: [email],
    subject: 'REMINDER ',
    html: `<strong>subscription: ${subscriptionName} cost: ${subscriptionCost}will renew in 2 days!</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

}
async function checkSubscriptions(email){
  console.log('checking subscriptions...')
  //emails are unique in the database
  const user = await User.findOne({email})
  if(!user){
    console.log('user not found')
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "email not found."})
  }

  if (!user.subscriptions && user.subscriptions.length === 0) {
    console.log('no subs')
    return; // or log "No subscriptions for this user"
  }
  for (let i = 0; i < user.subscriptions.length; i++) {
    const subscription = user.subscriptions[i]; 
    if (subscription.notifications) {
      const currentDate = new Date();
      const renewalDate = new Date(subscription.renewalDate);

      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const renewal = new Date(renewalDate.getFullYear(), renewalDate.getMonth(), renewalDate.getDate());

      const diffTime = renewal - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (true) {
        // Send email reminder
        await handleEmail(email, subscription.companyName, subscription.cost);
        console.log(` Subscription to ${subscription.companyName} renews in 2 days!`);
      }
    }
  }
  
  
}
module.exports = {registerUser, loginUser}



