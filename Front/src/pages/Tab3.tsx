import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { GeolocationContext } from '../context/geolocationContext';
import './Compass.css';

const TARGET_COORDINATES = { lat: 48.1159843, lng: -1.729643 };

const CompassOrientationDisplay: React.FC = () => {
  const {
    geolocation,
    error,
    requestBrowserGeolocation,
    disableBrowserGeolocation,
  } = useContext(GeolocationContext);

  const compassNeedleRef = useRef<HTMLDivElement>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [orientationPermission, setOrientationPermission] = useState<boolean>(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [isAligned, setIsAligned] = useState(false);

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

  const calcDegreeToTarget = (latitude: number, longitude: number) => {
    const phiK = (TARGET_COORDINATES.lat * Math.PI) / 180.0;
    const lambdaK = (TARGET_COORDINATES.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round((psi + 360) % 360);
  };

  useEffect(() => {
    if (geolocation) {
      setBearing(calcDegreeToTarget(geolocation.lat, geolocation.lng));
    }
  }, [geolocation]);

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
      if (bearing !== null && compassNeedleRef.current) {
        const rotationAngle = (bearing - deviceHeading + 360) % 360;
        compassNeedleRef.current.style.transform = `rotate(${rotationAngle}deg)`;
        setIsAligned(Math.abs(rotationAngle) <= 15);
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, [bearing]);

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
          <div className="compass-circle">
            <div ref={compassNeedleRef} className="compass-needle">
              <img
                src="/assets/img/compass.png"
                alt="Compass Needle"
                className="compass-needle-image"
              />
            </div>
          </div>
          <div className="target-indicator" style={{ opacity: isAligned ? 1 : 0.5 }}>
            Target Aligned!
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol>
              <p>
                <strong>Target Coordinates:</strong> <br />
                Latitude: {TARGET_COORDINATES.lat.toFixed(5)}, Longitude: {TARGET_COORDINATES.lng.toFixed(5)}
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>

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
