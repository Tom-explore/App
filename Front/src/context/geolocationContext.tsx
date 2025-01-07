// src/context/geolocationProvider.tsx

import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useRef,
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
    heading: number | null; // Ajout du heading
    listenerAdded: boolean; // Ajout de listenerAdded
    requestIPGeolocation: () => void;
    requestBrowserGeolocation: () => void;
    disableBrowserGeolocation: () => void;
    calculateDistanceFromPlace: (coord1: Coordinates, coord2: Coordinates) => number;
    refreshGeolocation: () => void;
}

export const GeolocationContext = createContext<GeolocationContextProps>({
    nearestCitySlug: null,
    geolocation: null,
    isGeolocationEnabled: false,
    loading: true,
    error: null,
    heading: null,
    listenerAdded: false, // Initial value
    requestIPGeolocation: () => { },
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
    const [heading, setHeading] = useState<number | null>(null); // État pour le heading
    const [listenerAdded, setListenerAdded] = useState<boolean>(false); // Nouvel état

    const watchIdRef = useRef<number | null>(null); // Pour la surveillance de la géolocalisation réelle
    const stopHeadingRef = useRef<(() => void) | null>(null);

    // Fonctions utilitaires pour le calcul des distances
    const deg2rad = (deg: number): number => deg * (Math.PI / 180);

    const getDistanceFromLatLonInKm = (
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
    };

    // Calculer la distance entre deux coordonnées
    const calculateDistanceFromPlace = useCallback((coord1: Coordinates, coord2: Coordinates): number => {
        return getDistanceFromLatLonInKm(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
    }, []);

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
    }, []);

    // Géolocalisation basée sur l'IP
    const getLocationFromIP = async (): Promise<Coordinates> => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la localisation via IP');
            }
            const data = await response.json();
            return { lat: data.latitude, lng: data.longitude };
        } catch (err) {
            throw new Error('Impossible de déterminer la localisation via IP');
        }
    };

    const requestIPGeolocation = useCallback(() => {
        setLoading(true);
        setError(null);
        getLocationFromIP()
            .then(({ lat, lng }) => {
                setGeolocation({ lat, lng });
                const nearestSlug = findNearestCity(lat, lng);
                setNearestCitySlug(nearestSlug);
            })
            .catch((ipError: any) => {
                console.error(ipError);
                setError(ipError.message);
            })
            .finally(() => setLoading(false));
    }, [findNearestCity]);

    // Fonction pour commencer la surveillance de l'orientation via l'API Web
    const startWatchingHeading = useCallback(() => {
        if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
            console.warn('DeviceOrientationEvent n\'est pas supporté sur cet appareil.');
            setError('Orientation du dispositif non supportée.');
            return;
        }

        try {
            const handleOrientation = (event: DeviceOrientationEvent) => {
                if (event.alpha !== null) {
                    setHeading(event.alpha);
                }
            };

            window.addEventListener('deviceorientation', handleOrientation, true);
            setListenerAdded(true); // Mettre à jour l'état de l'écouteur

            // Retourner une fonction de nettoyage pour retirer l'écouteur
            const stopWatching = () => {
                window.removeEventListener('deviceorientation', handleOrientation, true);
                setListenerAdded(false); // Mettre à jour l'état de l'écouteur
            };

            return stopWatching;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'écouteur d\'orientation:', error);
            setError('Erreur lors de l\'ajout de l\'écouteur d\'orientation.');
            return;
        }
    }, []);

    // Géolocalisation réelle via l'API Web Geolocation
    const requestBrowserGeolocation = useCallback(() => {
        if (isGeolocationEnabled) {
            // Déjà activé, pas besoin de demander à nouveau
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

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setGeolocation({ lat: latitude, lng: longitude });
                const nearestSlug = findNearestCity(latitude, longitude);
                setNearestCitySlug(nearestSlug);
                setError(null);
                setLoading(false);
                startWatchingRealGeolocation();
                const stopWatchingHeading = startWatchingHeading(); // Démarrer la surveillance du heading
                if (stopWatchingHeading) {
                    (stopHeadingRef.current as React.MutableRefObject<() => void | null>['current']) = stopWatchingHeading;
                }
            },
            async (geoError) => {
                console.warn('La géolocalisation réelle a échoué ou a été refusée. Utilisation de la géolocalisation IP.', geoError);
                setIsGeolocationEnabled(false);
                setError('La géolocalisation réelle a échoué. Utilisation de la localisation IP.');
                await requestIPGeolocation();
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [isGeolocationEnabled, findNearestCity, requestIPGeolocation, startWatchingHeading]);

    // Fonction pour commencer la surveillance de la géolocalisation réelle
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

    // Fonction pour désactiver la géolocalisation réelle
    const disableBrowserGeolocation = useCallback(() => {
        setIsGeolocationEnabled(false);
        setError(null);
        // Arrêter la surveillance de la géolocalisation réelle
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        // Arrêter la surveillance du heading via l'API Web
        if (stopHeadingRef.current) {
            stopHeadingRef.current(); // Appeler la fonction pour nettoyer
            stopHeadingRef.current = null; // Assigner null
        }
        // Retour à la géolocalisation IP
        requestIPGeolocation();
    }, [requestIPGeolocation]);


    // Fonction pour rafraîchir la géolocalisation actuelle
    const refreshGeolocation = useCallback(() => {
        if (isGeolocationEnabled) {
            requestBrowserGeolocation();
        } else {
            requestIPGeolocation();
        }
    }, [isGeolocationEnabled, requestBrowserGeolocation, requestIPGeolocation]);

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            // Arrêter la surveillance de la géolocalisation réelle
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            // Arrêter la surveillance du heading via l'API Web
            if (stopHeadingRef.current) {
                stopHeadingRef.current();
            }
        };
    }, []);

    // Fetch initial géolocalisation (IP-based) si la géolocalisation réelle n'est pas activée
    useEffect(() => {
        if (!isGeolocationEnabled) {
            requestIPGeolocation();
        }
    }, [isGeolocationEnabled, requestIPGeolocation]);

    return (
        <GeolocationContext.Provider
            value={{
                nearestCitySlug,
                geolocation,
                isGeolocationEnabled,
                loading,
                error,
                heading, // Exposition du heading
                listenerAdded, // Exposition de listenerAdded
                requestIPGeolocation,
                requestBrowserGeolocation,
                disableBrowserGeolocation,
                calculateDistanceFromPlace,
                refreshGeolocation,
            }}
        >
            {children}
        </GeolocationContext.Provider>
    );
};

export default GeolocationProvider;
