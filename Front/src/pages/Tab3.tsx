import React, { useContext, useState } from 'react';
import { GeolocationContext } from '../context/geolocationContext';
import { useCity } from '../context/cityContext';

const Tab3: React.FC = () => {
  const { nearestCitySlug, error } = useContext(GeolocationContext);
  const { city, setCityPreviewAndFetchData, isPreview, places, fetchAllPlaces } = useCity();
  const [citySlug, setCitySlug] = useState('');

  const handleShowNearestCity = () => {
    console.log('handleShowNearestCity called');
    if (error) {
      console.log(`Error: ${error}`);
      alert(`Error: ${error}`);
    } else {
      console.log(`Nearest city slug: ${nearestCitySlug}`);
      alert(`Nearest city slug: ${nearestCitySlug}`);
    }
  };

  const handleRequestGeolocation = () => {
    console.log('handleRequestGeolocation called');
    if ("geolocation" in navigator) {
      console.log('Geolocation is supported by the browser');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`Geolocation successful: Latitude=${position.coords.latitude}, Longitude=${position.coords.longitude}`);
          alert(`Geolocation successful!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
        },
        (err) => {
          console.log(`Geolocation error: ${err.message}`);
          alert(`Geolocation error: ${err.message}`);
        }
      );
    } else {
      console.log('Geolocation is not supported by the browser');
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleFetchCity = async () => {
    console.log(`Fetching city with slug: ${citySlug}`);
    await setCityPreviewAndFetchData(citySlug);
    await fetchAllPlaces();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Geolocation Context Tester</h1>
      <button onClick={handleShowNearestCity} style={{ margin: '10px' }}>Show Nearest City</button>
      <button onClick={handleRequestGeolocation} style={{ margin: '10px' }}>Request Geolocation</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!error && nearestCitySlug && <p>Nearest City: {nearestCitySlug}</p>}


    </div>
  );
};

export default Tab3;
