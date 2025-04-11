import { useState, useContext } from 'react';
import DataContext from './context/DataProvider.js';
import handleSubscriptionApi from './postAPI.js';
import { Modal0, Modal1, Modal2, Modal3 } from './All-Modals.js';

function AddSubscription({ onSubscriptionAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCount, setModalCount] = useState(0);

  const {
    renewalPeriod, setRenewalPeriod,
    companyName, setCompanyName,
    description, setDescription,
    cost, setCost,
    renewalDate, setRenewalDate,
    every, setEvery,
    autoRenewal, setAutoRenewal,
    type, setType,
    notifications, setNotifications
  } = useContext(DataContext);
  const handleRefresh = () => {
  setCompanyName('');
  setDescription('');
  setType('subscription');
  setRenewalDate('');
  setEvery('');
  setRenewalPeriod('month');
  setAutoRenewal('no');
  setCost('');
  setNotifications(true);
  setModalCount(0);
  setIsModalOpen(false);


  }
  const handleCancel = () => {
    setIsModalOpen(false);
    handleRefresh();
    setModalCount(0);
  };

  const handleBack = () => {
    if (modalCount === 0) {
      setIsModalOpen(false);
    } else {
      setModalCount((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setModalCount((prev) => prev + 1);
  };

  const handleFormCompletion = async (e) => {
    e.preventDefault();
    const subscriptionDetails = {
      renewalPeriod, companyName, description,
      cost, renewalDate, every, autoRenewal,
      type, notifications
    };

    await handleSubscriptionApi(subscriptionDetails);
    onSubscriptionAdded();
    handleRefresh();
    setIsModalOpen(false);
    setModalCount(0);
  };

  return (
    <>
      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        Add Subscription
      </button>

      {isModalOpen && modalCount === 0 && (
        <Modal0
          companyName={companyName}
          setCompanyName={setCompanyName}
          description={description}
          setDescription={setDescription}
          type={type}
          setType={setType}
          handleSubmit={(e) => { e.preventDefault(); handleNext(); }}
          handleCancel={handleCancel}
        />
      )}

      {modalCount === 1 && (
        <Modal1
          renewalDate={renewalDate}
          setRenewalDate={setRenewalDate}
          every={every}
          setEvery={setEvery}
          renewalPeriod={renewalPeriod}
          setRenewalPeriod={setRenewalPeriod}
          autoRenewal={autoRenewal}
          setAutoRenewal={setAutoRenewal}
          handleSubmit={(e) => { e.preventDefault(); handleNext(); }}
          handleBack={handleBack}
          handleCancel={handleCancel}
        />
      )}

      {modalCount === 2 && (
        <Modal2
          cost={cost}
          setCost={setCost}
          handleSubmit={(e) => { e.preventDefault(); handleNext(); }}
          handleBack={handleBack}
          handleCancel={handleCancel}
        />
      )}

      {modalCount === 3 && (
        <Modal3
          handleFormCompletion={handleFormCompletion}
          setNotifications={setNotifications}
          handleBack={handleBack}
        />
      )}
    </>
  );
}

export default AddSubscription;
