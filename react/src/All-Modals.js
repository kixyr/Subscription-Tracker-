
export function Modal0({ companyName, setCompanyName, description, setDescription, type, setType, handleSubmit, handleCancel }) {
  return (
    <div className="modal">
      <div className="overlay">
        <div className="blank-screen">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <h2>New</h2>

              <label htmlFor="Company">Company:</label>
              <input
                type="text"
                placeholder="Name"
                id="Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <label htmlFor="Description">Description:</label>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label htmlFor="Type">Type:</label>
              <select
                id="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="subscription">Subscription</option>
                <option value="trial">Trial</option>
                <option value="lifetime">LifeTime</option>
              </select>

              <div className="modal-buttons">
                <button className="cancel-btn" type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="next-btn" type="submit">
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Modal1({
  renewalDate,
  setRenewalDate,
  every,
  setEvery,
  renewalPeriod,
  setRenewalPeriod,
  autoRenewal,
  setAutoRenewal,
  handleSubmit,
  handleCancel,
  handleBack
}) {
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <h2>New</h2>

            <label htmlFor="date">Next Payment Date:</label>
            <input 
              type="date" 
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              id="date" 
              required 
            />
            
            <label htmlFor="Billing-Cycle">Billing Cycle:</label>
            <div className="billing">
              <input 
                className="every" 
                type="number" 
                value={every}
                onChange={(e) => setEvery(e.target.value)}
                placeholder="1"
                required
              />
              <select 
                className="time-period" 
                value={renewalPeriod} 
                onChange={(e) => setRenewalPeriod(e.target.value)}
              >
                <option value="month">Month</option>
                <option value="day">Day</option>
                <option value="year">Year</option>
                <option value="week">Week</option>
              </select>
            </div>

            <label htmlFor="Renew">Does It Auto Renew:</label>
            <select 
              value={autoRenewal} 
              onChange={(e) => setAutoRenewal(e.target.value)} 
              id="Renew"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            <div className="modal-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button type="button" className="back-btn" onClick={handleBack}>Back</button>
              <button type="submit" className="next-btn">Next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


export function Modal2({ cost, setCost, handleSubmit, handleCancel, handleBack }) {
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <h2>New</h2>

            <label htmlFor="Cost">Cost</label>
            <input 
              type="number" 
              placeholder="0.00" 
              id="Cost" 
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required 
            />

            <label htmlFor="currency">Currency:</label>
            <p>AUD</p>

            <div className="modal-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button type="button" className="back-btn" onClick={handleBack}>Back</button>
              <button type="submit" className="next-btn">Next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function Modal3({ handleFormCompletion, setNotifications, handleBack }) {
  const handleClick = async (value, e) => {
    e.preventDefault();
    setNotifications(value);
    await handleFormCompletion(e);
  }

  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <form>
            <h2>New</h2>
            <p>Do you want to set a reminder alert?</p>
            <button onClick={(e) => handleClick(true, e)}>
              Yes, I want to be email notified
            </button>
            <button onClick={(e) => handleClick(false, e)}>
              No Thanks
            </button>
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
