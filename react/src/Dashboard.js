import { useState, useEffect } from 'react';
import { DisplaySubscriptions } from './InputSubscriptions.js';
import AddSubscription from './Addsubcription.js';
import axios from 'axios';

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchSubscriptions();
  }, [])
  

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem('token');
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  
    try {
      const response = await axios.get('http://localhost:5000/api/v1/subscription/get', config);
      if (response.data.subscriptions?.length > 0) {
        console.log('Subscriptions found:');
        setSubscriptions(response.data.subscriptions);
      } else {
        console.log('No subscriptions found');
        setSubscriptions(0);
      }
      
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error.response?.data || error.message);
    }
  };
  
  
  const handleSubsciptionChanges = async () => {
    await fetchSubscriptions()
  }
  
  const handleCSVUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }
  // Start loading
    setLoading(true); 
  
    const formData = new FormData();
    formData.append("file", file);
    //current time
    formData.append("downloadTime", new Date().toISOString());
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/csv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      await handleSubsciptionChanges();
      setLoading(false); 
      console.log("File uploaded successfully:", response.data);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
     
    
  };
  
  return (
    <>
  <h3>All Subscriptions</h3>
  {loading && <p style={{ color: 'red', fontWeight: 'bold' }}>Loading...</p>}

  <input 
    type="file"
    id="myFileInput"
    name="file"
    accept=".csv"
    className="file-input"
    onChange={handleCSVUpload}
    disabled={loading}
  />

  <AddSubscription onSubscriptionAdded={handleSubsciptionChanges} />
  <DisplaySubscriptions subscriptions={subscriptions} onDelete={handleSubsciptionChanges} />
</>
  );
};


export default Dashboard
