import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import '../style/App.css';

const apiUrl = process.env.REACT_APP_IS_DEV === 'true' 
  ? process.env.REACT_APP_DEV_API_URL 
  : process.env.REACT_APP_PROD_API_URL;

console.log('api url ' + apiUrl);
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/users/1/sayHello`)
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => console.error('Erreur lors de la récupération des données ? :', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Message de ta dafhryhegbr : {message || 'Chargement...'}</p>
        <p>TEST</p>

      </header>
    </div>
  );
}

export default App;
