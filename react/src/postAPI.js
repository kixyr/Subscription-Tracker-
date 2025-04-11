import axios from 'axios'

async function handleSubscriptionApi(subscriptionDetails) {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(
      'http://localhost:5000/api/v1/subscription/post',
      subscriptionDetails,
      config
    );

  } catch (error) {
    console.log('Error adding subscription:', error.response?.data || error.message);
  }
}

export default handleSubscriptionApi;
