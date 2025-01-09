// src/components/MapPlacesDisplay.tsx
import { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Map from './Map';
import PlacesMarkers from './PlaceMarker'; // <-- On importe
import { Place } from '../types/PlacesInterfaces';

interface MapPlacesDisplayProps {
    places: Place[];
}

const MapPlacesDisplay: React.FC<MapPlacesDisplayProps> = ({ places }) => {
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [zoom, setZoom] = useState<number>(3.5);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const initialZoom = isMobile ? 3.5 : 5;
    const position: [number, number] = isMobile ? [38.134, 11.5799] : [48.134, 11.5799];

    useEffect(() => {
        if (places.length === 0) {
            setCenter(null);
            setZoom(initialZoom);
            return;
        }
        if (places.length === 1) {
            const { lat, lng } = places[0];
            const adjustedLat = isMobile ? lat - 0.1 : lat;
            setCenter([adjustedLat, lng]);
            setZoom(9);
        } else {
            const latitudes = places.map((place) => place.lat);
            const longitudes = places.map((place) => place.lng);
            const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
            const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;
            setCenter(isMobile ? [avgLat - 10, avgLng] : [avgLat, avgLng]);
            setZoom(isMobile ? 3 : 6);
        }
    }, [places, isMobile, initialZoom]);

    if (!center) {
        return null; // ou un loading...
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <Map
                    initialZoom={initialZoom}
                    initialPosition={position}
                    center={center}
                    zoom={zoom}
                    isMobile={isMobile}
                >
                    {/* PlacesMarkers reçoit la liste et le niveau de zoom */}
                    <PlacesMarkers places={places} zoomLevel={zoom} />
                </Map>
            </IonContent>
        </IonPage>
    );
};

export default MapPlacesDisplay;
