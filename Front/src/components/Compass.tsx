// src/components/Compass.tsx

import React, { useContext, useEffect, useRef } from 'react';
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
    const { geolocation, error } = useContext(GeolocationContext);
    const compassNeedleRef = useRef<HTMLImageElement>(null);

    const orientationPermissionRef = useRef<boolean>(false);
    const orientationErrorRef = useRef<string | null>(null);
    const bearingRef = useRef<number | null>(null);

    const requestOrientationPermission = async () => {
        if (
            typeof window !== 'undefined' &&
            typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function'
        ) {
            // iOS
            try {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    orientationPermissionRef.current = true;
                    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                } else {
                    orientationErrorRef.current = "Permission pour l'orientation refusée (iOS).";
                    console.error(orientationErrorRef.current);
                }
            } catch (err) {
                orientationErrorRef.current = "Erreur lors de la demande de permission pour l'orientation (iOS).";
                console.error(orientationErrorRef.current);
            }
        } else {
            // Android ou navigateurs qui ne nécessitent pas de permission explicite
            orientationPermissionRef.current = true;
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        }
    };

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
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

        // Calculer la bearing si la géolocalisation est disponible
        if (geolocation) {
            calculateBearingToTarget(geolocation, targetCoordinates, deviceHeading);
        }
    };

    const calculateBearingToTarget = (
        geolocation: { lat: number; lng: number },
        target: Coordinates,
        deviceHeading: number
    ) => {
        const lat1 = geolocation.lat * (Math.PI / 180);
        const lon1 = geolocation.lng * (Math.PI / 180);
        const lat2 = 48.1159843 * (Math.PI / 180);
        const lon2 = -1.729643 * (Math.PI / 180);

        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let bearingDeg = Math.atan2(y, x) * (180 / Math.PI);
        bearingDeg = (bearingDeg + 360) % 360;

        bearingRef.current = bearingDeg;

        // Calculer l'angle de rotation
        const rotationAngle = (bearingDeg - deviceHeading + 360) % 360;
        if (compassNeedleRef.current) {
            compassNeedleRef.current.style.transform = `rotate(${rotationAngle}deg)`;
        }
    };

    useEffect(() => {
        requestOrientationPermission();

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Recalculer la bearing si les coordonnées cibles changent
        if (geolocation && targetCoordinates && orientationPermissionRef.current) {
            // Vous pouvez forcer une recalcul en simulant un événement
            window.dispatchEvent(new DeviceOrientationEvent('deviceorientation'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geolocation, targetCoordinates]);

    return (
        <div className="compass-icon-container">
            {error && <p className="error-text">Geo Error: {error}</p>}
            {orientationErrorRef.current && <p className="error-text">{orientationErrorRef.current}</p>}
            <img
                src="/assets/img/compass.png"
                alt="Compass Needle"
                className="compass-needle-image"
                ref={compassNeedleRef}
            />
            {bearingRef.current !== null && (
                <span className="bearing-text">{Math.trunc(bearingRef.current)}°</span>
            )}
        </div>
    );
};

export default Compass;
