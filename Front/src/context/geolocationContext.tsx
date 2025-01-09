// src/context/geolocationContext.tsx

import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import citiesData from '../data/cities.json';

// Interface pour les coordonnées géographiques
interface Coordinates {
    lat: number;
    lng: number;
}

// Interface pour les propriétés du contexte
interface GeolocationContextProps {
    nearestCitySlug: string | null;
    geolocation: Coordinates | null;
    isGeolocationEnabled: boolean;
    loading: boolean;
    error: string | null;
    orientationPermission: boolean;
    orientationError: string | null;
    deviceHeading: number | null; // Nouvelle propriété
    requestBrowserGeolocation: () => void;
    disableBrowserGeolocation: () => void;
    calculateDistanceFromPlace: (coord1: Coordinates, coord2: Coordinates) => number;
    refreshGeolocation: () => void;
}

// Création du contexte avec des valeurs par défaut
export const GeolocationContext = createContext<GeolocationContextProps>({
    nearestCitySlug: null,
    geolocation: null,
    isGeolocationEnabled: false,
    loading: true,
    error: null,
    orientationPermission: false,
    orientationError: null,
    deviceHeading: null, // Nouvelle propriété initialisée à null
    requestBrowserGeolocation: () => { },
    disableBrowserGeolocation: () => { },
    calculateDistanceFromPlace: () => 0,
    refreshGeolocation: () => { },
});

interface GeolocationProviderProps {
    children: ReactNode;
}

const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
    const [nearestCitySlug, setNearestCitySlug] = useState<string | null>(null);
    const [geolocation, setGeolocation] = useState<Coordinates | null>(null);
    const [isGeolocationEnabled, setIsGeolocationEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orientationPermission, setOrientationPermission] = useState<boolean>(false);
    const [orientationError, setOrientationError] = useState<string | null>(null);
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null); // Nouveau état

    const watchIdRef = useRef<number | null>(null);

    // Fonctions utilitaires pour le calcul des distances
    const deg2rad = useCallback((deg: number): number => deg * (Math.PI / 180), []);

    const getDistanceFromLatLonInKm = useCallback((
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance en km
        return d;
    }, [deg2rad]);

    // Calculer la distance entre deux coordonnées
    const calculateDistanceFromPlace = useCallback((coord1: Coordinates, coord2: Coordinates): number => {
        return getDistanceFromLatLonInKm(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
    }, [getDistanceFromLatLonInKm]);

    // Fonction pour trouver la ville la plus proche basée sur les coordonnées
    const findNearestCity = useCallback((userLat: number, userLng: number): string | null => {
        if (citiesData.length === 0) return null;
        let nearestCity = citiesData[0];
        let minDistance = getDistanceFromLatLonInKm(userLat, userLng, nearestCity.lat, nearestCity.lng);

        for (let i = 1; i < citiesData.length; i++) {
            const currentCity = citiesData[i];
            const distance = getDistanceFromLatLonInKm(userLat, userLng, currentCity.lat, currentCity.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = currentCity;
            }
        }

        return nearestCity.slug;
    }, [getDistanceFromLatLonInKm]);

    // Fonction pour demander la permission d'orientation
    const requestOrientationPermission = useCallback(async () => {
        if (
            typeof window !== 'undefined' &&
            typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function'
        ) {
            try {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setOrientationPermission(true);
                } else {
                    setOrientationError("Permission refusée pour l'orientation (iOS).");
                }
            } catch (err) {
                setOrientationError("Erreur lors de la demande de permission (iOS).");
            }
        } else {
            setOrientationPermission(true);
        }
    }, []);

    // Fonction pour gérer les événements d'orientation
    const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
        let heading = 0;

        // iOS: use webkitCompassHeading
        const anyEvent = event as any;
        if (typeof anyEvent.webkitCompassHeading === 'number') {
            heading = anyEvent.webkitCompassHeading; // [0..360)
        } else if (event.alpha != null) {
            // Android/Chrome: alpha=0 quand le téléphone pointe vers le Nord
            heading = (360 - event.alpha) % 360;
        }

        // Normaliser [0..360)
        heading = (heading + 360) % 360;

        setDeviceHeading(heading);
    }, []);

    // Fonction pour demander la géolocalisation et l'orientation
    const requestBrowserGeolocation = useCallback(() => {
        if (isGeolocationEnabled) {
            return;
        }

        setLoading(true);
        setError(null);
        setIsGeolocationEnabled(true);

        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas supportée par ce navigateur.');
            setLoading(false);
            setIsGeolocationEnabled(false);
            return;
        }

        const getCurrentPositionPromise = (): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });
        };

        const orientationPromise = requestOrientationPermission();

        Promise.all([getCurrentPositionPromise(), orientationPromise])
            .then(([position]) => {
                const { latitude, longitude } = position.coords;
                setGeolocation({ lat: latitude, lng: longitude });
                const nearestSlug = findNearestCity(latitude, longitude);
                setNearestCitySlug(nearestSlug);
                setError(null);
                setLoading(false);
                startWatchingRealGeolocation();

                if (orientationPermission) {
                    // Ajouter l'écouteur d'événements si la permission est déjà accordée
                    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                }
            })
            .catch((geoError: any) => {
                setIsGeolocationEnabled(false);
                setError('La géolocalisation a échoué.');
                setLoading(false);
            });
    }, [isGeolocationEnabled, findNearestCity, requestOrientationPermission, handleDeviceOrientation, orientationPermission]);

    // Fonction pour commencer la surveillance de la géolocalisation
    const startWatchingRealGeolocation = useCallback(() => {
        if (watchIdRef.current !== null) {
            return;
        }

        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas supportée par ce navigateur.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setGeolocation({ lat: latitude, lng: longitude });
                const nearestSlug = findNearestCity(latitude, longitude);
                setNearestCitySlug(nearestSlug);
            },
            (err) => {
                setError(err.message || 'Erreur de surveillance de la géolocalisation');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        watchIdRef.current = watchId;
    }, [findNearestCity]);

    // Fonction pour désactiver la géolocalisation
    const disableBrowserGeolocation = useCallback(() => {
        setIsGeolocationEnabled(false);
        setError(null);
        setOrientationPermission(false);
        setOrientationError(null);
        setDeviceHeading(null);
        setGeolocation(null);
        setNearestCitySlug(null);
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        // Nettoyer l'écouteur d'événements d'orientation
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    }, [handleDeviceOrientation]);

    // Fonction pour rafraîchir la géolocalisation
    const refreshGeolocation = useCallback(() => {
        requestBrowserGeolocation();
    }, [requestBrowserGeolocation]);

    // Ajouter l'écouteur d'événements d'orientation lorsque les permissions sont accordées
    useEffect(() => {
        if (orientationPermission) {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        };
    }, [orientationPermission, handleDeviceOrientation]);

    // Nettoyage lors du démontage du contexte
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        };
    }, [handleDeviceOrientation]);

    const contextValue = useMemo(() => ({
        nearestCitySlug,
        geolocation,
        isGeolocationEnabled,
        loading,
        error,
        orientationPermission,
        orientationError,
        deviceHeading, // Fournir deviceHeading dans le contexte
        requestBrowserGeolocation,
        disableBrowserGeolocation,
        calculateDistanceFromPlace,
        refreshGeolocation,
    }), [
        nearestCitySlug,
        geolocation,
        isGeolocationEnabled,
        loading,
        error,
        orientationPermission,
        orientationError,
        deviceHeading,
        requestBrowserGeolocation,
        disableBrowserGeolocation,
        calculateDistanceFromPlace,
        refreshGeolocation,
    ]);

    return (
        <GeolocationContext.Provider value={contextValue}>
            {children}
        </GeolocationContext.Provider>
    );
};

export default GeolocationProvider;
