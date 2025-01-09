// src/components/Compass.tsx

import React, { useContext, useEffect, useRef, useCallback, useState } from 'react';
import { GeolocationContext } from '../context/geolocationContext';
import '../styles/components/Compass.css';

interface Coordinates {
    lat: number;
    lng: number;
}

interface CompassProps {
    targetCoordinates: Coordinates;
}

const Compass: React.FC<CompassProps> = React.memo(({ targetCoordinates }) => {
    const { geolocation, error, deviceHeading } = useContext(GeolocationContext);
    const compassNeedleRef = useRef<HTMLImageElement>(null);

    const [bearing, setBearing] = useState<number | null>(null);

    const calculateBearingToTarget = useCallback((
        geolocation: { lat: number; lng: number },
        target: Coordinates,
        deviceHeading: number
    ) => {
        const lat1 = geolocation.lat * (Math.PI / 180);
        const lon1 = geolocation.lng * (Math.PI / 180);
        const lat2 = target.lat * (Math.PI / 180);
        const lon2 = target.lng * (Math.PI / 180);

        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let bearingDeg = Math.atan2(y, x) * (180 / Math.PI);
        bearingDeg = (bearingDeg + 360) % 360;

        // Calculer l'angle de rotation
        const rotationAngle = (bearingDeg - deviceHeading + 360) % 360;
        setBearing(bearingDeg);

        if (compassNeedleRef.current) {
            compassNeedleRef.current.style.transform = `rotate(${rotationAngle}deg)`;
        }
    }, []);

    useEffect(() => {
        if (geolocation && targetCoordinates && deviceHeading !== null) {
            calculateBearingToTarget(geolocation, targetCoordinates, deviceHeading);
        }
    }, [geolocation, targetCoordinates, deviceHeading, calculateBearingToTarget]);

    return (
        <div className="compass-icon-container">
            {error && <p className="error-text">Geo Error: {error}</p>}
            {/* L'affichage des erreurs d'orientation n'est plus nécessaire ici car géré dans le contexte */}
            <img
                src="/assets/img/compass.png"
                alt="Compass Needle"
                className="compass-needle-image"
                ref={compassNeedleRef}
            />
            {bearing !== null && (
                <span className="bearing-text">{Math.trunc(bearing)}°</span>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    // Comparaison des props pour éviter les re-renders si targetCoordinates n'ont pas changé
    return (
        prevProps.targetCoordinates.lat === nextProps.targetCoordinates.lat &&
        prevProps.targetCoordinates.lng === nextProps.targetCoordinates.lng
    );
});

export default Compass;
