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
  IonButtons,
  IonIcon,
  IonText,
} from '@ionic/react';
import { GeolocationContext } from '../context/geolocationContext';
import { addOutline, menuOutline } from 'ionicons/icons';

const TARGET_COORDINATES = { lat: 48.1159843, lng: -1.729643 };

const CompassOrientationDisplay: React.FC = () => {
  const {
    geolocation,
    error,
    requestBrowserGeolocation,
    disableBrowserGeolocation,
    loading,
    isGeolocationEnabled,
  } = useContext(GeolocationContext);

  const compassNeedleRef = useRef<HTMLDivElement>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [orientationPermission, setOrientationPermission] = useState<boolean>(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [isAligned, setIsAligned] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    deviceType: '',
    os: '',
    browser: '',
    headingRequested: false,
    headingAvailable: false,
    geolocationRequested: false,
    lastGeolocationTime: null as number | null,
  });

  // Détection de l'appareil et du navigateur
  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);
    const isFirefox = ua.includes('Firefox');
    const isChrome = ua.includes('Chrome');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');

    setDebugInfo(prev => ({
      ...prev,
      deviceType: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop',
      os: isIOS ? 'iOS' : isAndroid ? 'Android' : navigator.platform,
      browser: isFirefox ? 'Firefox' : isChrome ? 'Chrome' : isSafari ? 'Safari' : 'Unknown',
      headingAvailable: typeof (window as any).DeviceOrientationEvent !== 'undefined',
    }));
  }, []);

  const requestOrientationPermission = async () => {
    setDebugInfo(prev => ({ ...prev, headingRequested: true }));

    if (
      typeof window !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function'
    ) {
      try {
        const response = await (window as any).DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setOrientationPermission(true);
          requestBrowserGeolocation();
          setDebugInfo(prev => ({ ...prev, geolocationRequested: true }));
        } else {
          setOrientationError("Permission refusée pour l'orientation (iOS).");
        }
      } catch (err) {
        setOrientationError("Erreur lors de la demande de permission (iOS).");
      }
    } else {
      setOrientationPermission(true);
      requestBrowserGeolocation();
      setDebugInfo(prev => ({ ...prev, geolocationRequested: true }));
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

  useEffect(() => {
    if (geolocation) {
      setBearing(calcDegreeToTarget(geolocation.lat, geolocation.lng));
      setDebugInfo(prev => ({
        ...prev,
        lastGeolocationTime: Date.now()
      }));
    }
  }, [geolocation]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton aria-label="Menu">
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Compass Debug</IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="Ajouter">
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Debug Card */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Debug Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <h4>Device Information</h4>
                  <p>Device Type: {debugInfo.deviceType}</p>
                  <p>OS: {debugInfo.os}</p>
                  <p>Browser: {debugInfo.browser}</p>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <h4>Permissions & Status</h4>
                  <p>Heading Available: {debugInfo.headingAvailable ? 'Yes' : 'No'}</p>
                  <p>Heading Requested: {debugInfo.headingRequested ? 'Yes' : 'No'}</p>
                  <p>Heading Permission: {orientationPermission ? 'Granted' : 'Not Granted'}</p>
                  <p>Current Heading: {heading !== null ? `${heading.toFixed(2)}°` : 'N/A'}</p>
                  <p>Geoloc Requested: {debugInfo.geolocationRequested ? 'Yes' : 'No'}</p>
                  <p>Geoloc Enabled: {isGeolocationEnabled ? 'Yes' : 'No'}</p>
                  <p>Geoloc Loading: {loading ? 'Yes' : 'No'}</p>
                  {debugInfo.lastGeolocationTime && (
                    <p>Last Geoloc Update: {new Date(debugInfo.lastGeolocationTime).toLocaleTimeString()}</p>
                  )}
                </IonCol>
              </IonRow>

              {error && (
                <IonRow>
                  <IonCol>
                    <h4>Errors</h4>
                    <IonText color="danger">
                      <p>Geolocation Error: {error}</p>
                      {orientationError && <p>Orientation Error: {orientationError}</p>}
                    </IonText>
                  </IonCol>
                </IonRow>
              )}

              <IonRow>
                <IonCol>
                  <h4>Current Position</h4>
                  {geolocation ? (
                    <>
                      <p>Latitude: {geolocation.lat.toFixed(6)}</p>
                      <p>Longitude: {geolocation.lng.toFixed(6)}</p>
                      <p>Bearing to Target: {bearing !== null ? `${bearing.toFixed(2)}°` : 'N/A'}</p>
                    </>
                  ) : (
                    <p>No position data</p>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Compass existant */}
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
