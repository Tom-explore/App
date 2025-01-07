// src/components/Compass.tsx

import React, { useContext, useState, useEffect } from 'react';
import { GeolocationContext } from '../context/geolocationContext';
import '../styles/components/Compass.css';

interface Coordinates {
    lat: number;
    lng: number;
}

interface CompassProps {
    targetCoordinates: Coordinates;
}

const Compass: React.FC<CompassProps> = ({ targetCoordinates }) => {
    const {
        geolocation,
        error,
        requestBrowserGeolocation,
        disableBrowserGeolocation,
    } = useContext(GeolocationContext);

    const [heading, setHeading] = useState<number | null>(null);

    const [orientationPermission, setOrientationPermission] = useState<boolean>(false);
    const [orientationError, setOrientationError] = useState<string | null>(null);

    const [bearing, setBearing] = useState<number | null>(null);

    const requestOrientationPermission = async () => {
        if (
            typeof window !== 'undefined' &&
            typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function'
        ) {
            // iOS
            try {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setOrientationPermission(true);
                    // requestBrowserGeolocation(); // Active la géolocalisation
                } else {
                    setOrientationError("Permission pour l'orientation refusée (iOS).");
                }
            } catch (err) {
                setOrientationError("Erreur lors de la demande de permission pour l'orientation (iOS).");
            }
        } else {
            // Android ou navigateurs qui ne nécessitent pas de permission explicite
            setOrientationPermission(true);
            // requestBrowserGeolocation();
        }
    };


    useEffect(() => {
        function handleDeviceOrientation(event: DeviceOrientationEvent) {
            let deviceHeading = 0;

            // iOS: use webkitCompassHeading
            const anyEvent = event as any;
            if (typeof anyEvent.webkitCompassHeading === 'number') {
                deviceHeading = anyEvent.webkitCompassHeading; // [0..360)
            } else if (event.alpha != null) {
                // Android/Chrome: alpha=0 quand le tél pointe vers l'Est
                deviceHeading = (360 - event.alpha) % 360;
            }

            // Normalize [0..360)
            deviceHeading = (deviceHeading + 360) % 360;
            setHeading(deviceHeading);
        }

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        };
    }, []);

    useEffect(() => {
        if (geolocation && targetCoordinates) {
            calculateBearingToTarget();
        }
    }, [geolocation, targetCoordinates, heading, bearing]);

    const calculateBearingToTarget = () => {
        if (!geolocation || !targetCoordinates) return;

        const lat1 = geolocation.lat * (Math.PI / 180);
        const lon1 = geolocation.lng * (Math.PI / 180);
        const lat2 = targetCoordinates.lat * (Math.PI / 180);
        const lon2 = targetCoordinates.lng * (Math.PI / 180);

        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let bearingDeg = Math.atan2(y, x) * (180 / Math.PI);
        bearingDeg = (bearingDeg + 360) % 360;

        setBearing(bearingDeg);
    };

    const angleToTarget = (() => {
        if (bearing === null || heading === null) return 0;
        return (bearing - heading + 360) % 360;
    })();


    useEffect(() => {
        requestOrientationPermission();
    }, []);


    return (
        <div className="compass-container">
            {error && <p style={{ color: 'red' }}>Geo Error: {error}</p>}
            {orientationError && <p style={{ color: 'red' }}>Orientation Error: {orientationError}</p>}
            <img
                src="/assets/img/compass.png"
                alt="Compass Needle"
                className="compass-needle"
                style={{ transform: `rotate(${angleToTarget}deg)` }}
            />
            {bearing !== null && (
                <span>{Math.trunc(bearing)}</span>
            )}
        </div>
    );
};

export default Compass;
