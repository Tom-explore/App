import React, { useEffect, useState } from 'react';
import { IonText, IonSpinner } from '@ionic/react';
import './Meteo.css';

interface WeatherData {
    temp: number;
    weather: { icon: string }[];
    sunrise: number;
    sunset: number;
}

interface MeteoProps {
    lat: number;
    lng: number;
}

const Meteo: React.FC<MeteoProps> = ({ lat, lng }) => {
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily,alerts&units=metric&lang=fr&appid=56e8c113f10d0692038d39767ef49e63`;

    useEffect(() => {
        const fetchWeather = async () => {
            console.log(lat, lng);
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                const data = await response.json();
                setCurrentWeather({
                    temp: data.current.temp,
                    weather: data.current.weather,
                    sunrise: data.current.sunrise,
                    sunset: data.current.sunset,
                });
            } catch (err) {
                setError((err as Error).message);
            }
        };
        fetchWeather();
    }, [apiUrl]);

    if (error) return <IonText color="danger">Erreur : {error}</IonText>;

    if (!currentWeather) {
        return (
            <div className="meteo-loading">
                <IonSpinner />
            </div>
        );
    }

    return (
        <div className="meteo-container">
            <div className="meteo-top">
                <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    className="meteo-icon"
                />
                <IonText className="meteo-temp">{currentWeather.temp.toFixed(0)}°</IonText>
            </div>
            <div className="meteo-bottom">
                <IonText>☀ {new Date(currentWeather.sunrise * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</IonText>
                <IonText>🌙 {new Date(currentWeather.sunset * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</IonText>
            </div>
        </div>
    );
};

export default Meteo;
