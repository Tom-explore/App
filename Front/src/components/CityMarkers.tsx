import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CityMap } from '../types/CommonInterfaces';

interface CityMarkersProps {
    cities: CityMap[];
    zoomLevel: number; // Recevoir le niveau de zoom en temps réel
}

const CityMarkers: React.FC<CityMarkersProps> = ({ cities, zoomLevel }) => {
    const calculateMarkerSize = (zoom: number): [number, number] => {
        const baseSize = 50;
        const scaleFactor = 10;
        const size = baseSize + (zoom - 6) * scaleFactor;
        return [Math.max(size, 20), Math.max(size * 1.2, 24)];
    };

    return (
        <>
            {cities.map((city) => {
                const [iconWidth, iconHeight] = calculateMarkerSize(zoomLevel);

                const customIcon = L.icon({
                    iconUrl: city.markerIcon,
                    iconSize: [iconWidth, iconHeight],
                    iconAnchor: [iconWidth / 2, iconHeight],
                    popupAnchor: [0, -iconHeight],
                    className: 'custom-marker-icon',
                });

                return (
                    <Marker key={city.id} position={[city.lat, city.lng]} icon={customIcon}>
                        <Popup>
                            <div className="popup-content">
                                <img src={city.img} alt={city.name} className="popup-image" />
                                <strong className="popup-title">{city.name}</strong>
                                <p className="popup-description">{city.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default CityMarkers;
