import { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [subscription, setSubscription] = useState([]);
  const [renewalPeriod, setRenewalPeriod] = useState('month');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [every, setEvery] = useState('');
  const [autoRenewal, setAutoRenewal] = useState('no');
  const [type, setType] = useState('subscription');
  const [notifications, setNotifications] = useState('');

  return (
    <DataContext.Provider value={{
      subscription, setSubscription,
      renewalPeriod, setRenewalPeriod,
      companyName, setCompanyName,
      description, setDescription,
      cost, setCost,
      renewalDate, setRenewalDate,
      every, setEvery,
      autoRenewal, setAutoRenewal,
      type, setType,
      notifications, setNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
