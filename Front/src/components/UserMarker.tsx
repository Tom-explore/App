// UserMarker.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeolocationContext } from '../context/geolocationContext'; // Adjust the path as necessary
import '../styles/components/UserMarker.css'; // Ensure this CSS file exists

// Import default Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths (necessary for some build setups)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom icon for the user marker with rotation based on heading
const createRotatedIcon = (heading: number) => {
    return L.divIcon({
        className: 'user-marker-icon',
        html: `
            <div class="user-marker" style="transform: rotate(${heading}deg);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
                </svg>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

const UserMarker: React.FC = () => {
    const {
        geolocation,
        deviceHeading,
        loading,
        error,
        orientationPermission,
        orientationError,
    } = useContext(GeolocationContext);

    const map = useMap();
    const [icon, setIcon] = useState<L.DivIcon | L.Icon>(new L.Icon.Default());

    useEffect(() => {
        if (deviceHeading !== null) {
            const newIcon = createRotatedIcon(deviceHeading);
            setIcon(newIcon);
        } else {
            // Reset to default icon if no heading is available
            setIcon(new L.Icon.Default());
        }
    }, [deviceHeading]);

    useEffect(() => {
        if (geolocation && !loading && !error) {
            const { lat, lng } = geolocation;
            map.setView([lat, lng], map.getZoom(), { animate: true });
        }
    }, [geolocation, loading, error, map]);

    if (!geolocation || loading || error) {
        return null;
    }

    return (
        <Marker position={[geolocation.lat, geolocation.lng]} icon={icon}>
            <Popup>
                <div>
                    <strong>Your Location</strong>
                    <br />
                    Heading: {deviceHeading !== null ? `${deviceHeading.toFixed(2)}°` : 'N/A'}
                    <br />
                    {/* Show orientation error if any */}
                    {orientationError && (
                        <div className="orientation-error">
                            {orientationError}
                        </div>
                    )}

                </div>
            </Popup>
        </Marker>
    );
};

export default UserMarker;
