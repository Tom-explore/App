import React, { useContext, useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { GeolocationContext } from '../context/geolocationContext';
import './compass.css';

interface Coordinates {
  lat: number;
  lng: number;
}

const CompassOrientationDisplay: React.FC = () => {
  const {
    geolocation,
    error,
    requestBrowserGeolocation,
    disableBrowserGeolocation,
  } = useContext(GeolocationContext);

  const [heading, setHeading] = useState<number | null>(null);
  const [orientationPermission, setOrientationPermission] = useState<boolean>(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [targetCoordinates, setTargetCoordinates] = useState<Coordinates | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);

  const requestOrientationPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function'
    ) {
      try {
        const response = await (window as any).DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setOrientationPermission(true);
          requestBrowserGeolocation();
        } else {
          setOrientationError("Permission refusée pour l'orientation (iOS).");
        }
      } catch (err) {
        setOrientationError("Erreur lors de la demande de permission (iOS).");
      }
    } else {
      setOrientationPermission(true);
      requestBrowserGeolocation();
    }
  };

  useEffect(() => {
    function handleDeviceOrientation(event: DeviceOrientationEvent) {
      let deviceHeading = 0;
      const anyEvent = event as any;
      if (typeof anyEvent.webkitCompassHeading === 'number') {
        deviceHeading = anyEvent.webkitCompassHeading;
      } else if (event.alpha != null) {
        deviceHeading = 360 - event.alpha;
      }
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
  }, [geolocation, targetCoordinates]);

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
    let angle = (bearing - heading + 360) % 360;
    return angle;
  })();

  const handleCoordinateChange = (e: CustomEvent, type: 'lat' | 'lng') => {
    const value = parseFloat(e.detail.value);
    if (!isNaN(value)) {
      setTargetCoordinates((prev) => ({
        ...prev,
        [type]: value,
      } as Coordinates));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Compass Orientation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Current GPS Position</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {geolocation ? (
              <p>
                <strong>Latitude:</strong> {geolocation.lat.toFixed(5)}<br />
                <strong>Longitude:</strong> {geolocation.lng.toFixed(5)}
              </p>
            ) : (
              <p>Waiting for geolocation...</p>
            )}
          </IonCardContent>
        </IonCard>

        <div className="compass-container">
          <div
            style={{ transform: `rotate(${angleToTarget}deg)` }}
          >
            <img
              src="/assets/img/compass.png"
              alt="Compass Needle"
              className="compass-needle-image"
            />
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Target Latitude</IonLabel>
                <IonInput
                  type="number"
                  step="0.0001"
                  onIonChange={(e) => handleCoordinateChange(e, 'lat')}
                />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Target Longitude</IonLabel>
                <IonInput
                  type="number"
                  step="0.0001"
                  onIonChange={(e) => handleCoordinateChange(e, 'lng')}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton expand="block" onClick={calculateBearingToTarget}>
          Calculate Bearing
        </IonButton>

        <IonButton expand="block" onClick={requestOrientationPermission}>
          Enable Compass Access
        </IonButton>

        <IonButton
          expand="block"
          color="danger"
          onClick={disableBrowserGeolocation}
        >
          Disable Geolocation
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CompassOrientationDisplay;
