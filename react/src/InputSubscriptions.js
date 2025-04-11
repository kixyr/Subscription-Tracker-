import axios from 'axios';

export async function fetchSubscriptions() { 
  try {
    const response = await axios.get('http://localhost:5000/api/v1/subscription/get');
    return response.data; 
  } catch (error) {
    console.log(error);
    return [];
  }
}
function getDateFormat(date){
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return formattedDate;
  
}




export function DisplaySubscriptions({ subscriptions, onDelete }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.delete(`http://localhost:5000/api/v1/subscription/delete/${id}`, config);
      onDelete();  // refresh after delete
    } catch (error) {
      console.error("Error deleting:", error.response?.data || error.message);
    }
  }
  const hanldeEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/subscription/update/${id}`);
      onDelete(); 
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  return (
    <div>
      <table className="container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Billing Period</th>
            <th>Next Payment</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions ? (
            subscriptions.map((subscription) => (
              <tr key={subscription._id}>
                <td>{subscription.companyName}</td>
                <td>{'$'+subscription.cost}</td>
                <td>{subscription.renewalPeriod}</td>
                <td>{getDateFormat(subscription.renewalDate)}</td>
                <td>
                <button 
                  className='edit-btn' 
                  onClick={() => handleDelete(subscription._id)}
                >
                  Edit
                </button>
                <button 
                  className='delete-btn' 
                  onClick={() => handleDelete(subscription._id)}
                >
                  Delete
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No subscriptions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

