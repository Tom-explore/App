import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';
import citiesData from '../data/cities.json';

interface GeolocationContextProps {
    nearestCitySlug: string | null;
    geolocation: { lat: number; lng: number } | null;
    isGeolocationEnabled: boolean;
    loading: boolean;
    error: string | null;
    requestIPGeolocation: () => void;
    requestBrowserGeolocation: () => void;
    disableBrowserGeolocation: () => void;
    calculateDistanceFromPlace: (userCoords: { lat: number; lng: number }, placeCoords: { lat: number; lng: number }) => number;
}

export const GeolocationContext = createContext<GeolocationContextProps>({
    nearestCitySlug: null,
    geolocation: null,
    isGeolocationEnabled: false,
    loading: true,
    error: null,
    requestIPGeolocation: () => { },
    requestBrowserGeolocation: () => { },
    disableBrowserGeolocation: () => { },
    calculateDistanceFromPlace: () => 0, // Default implementation
});

interface GeolocationProviderProps {
    children: ReactNode;
}

const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
    const [nearestCitySlug, setNearestCitySlug] = useState<string | null>(null);
    const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGeolocationEnabled, setIsGeolocationEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Utility functions for distance calculation
    const deg2rad = (deg: number): number => deg * (Math.PI / 180);

    const getDistanceFromLatLonInKm = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    // New function to calculate distance between user and a place
    const calculateDistanceFromPlace = (
        userCoords: { lat: number; lng: number },
        placeCoords: { lat: number; lng: number }
    ): number => {
        return getDistanceFromLatLonInKm(
            userCoords.lat,
            userCoords.lng,
            placeCoords.lat,
            placeCoords.lng
        );
    };

    // Function to find the nearest city based on coordinates
    const findNearestCity = (userLat: number, userLng: number): string | null => {
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
    };

    // IP-Based Geolocation
    const getLocationFromIP = async (): Promise<{ lat: number; lng: number }> => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Error retrieving location from IP');
            }
            const data = await response.json();
            return { lat: data.latitude, lng: data.longitude };
        } catch (err) {
            throw new Error('Unable to determine location via IP');
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
    }, []);

    // Browser-Based Geolocation with Fallback to IP-Based
    const requestBrowserGeolocation = useCallback(() => {
        setLoading(true);
        setError(null);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setGeolocation({ lat: latitude, lng: longitude });
                    const nearestSlug = findNearestCity(latitude, longitude);
                    setNearestCitySlug(nearestSlug);
                    setIsGeolocationEnabled(true);
                    setLoading(false);
                },
                async (geoError) => {
                    console.warn('Browser geolocation failed or was denied. Falling back to IP-based geolocation.', geoError);
                    try {
                        const { lat, lng } = await getLocationFromIP();
                        setGeolocation({ lat, lng });
                        const nearestSlug = findNearestCity(lat, lng);
                        setNearestCitySlug(nearestSlug);
                    } catch (ipError: any) {
                        console.error(ipError);
                        setError(ipError.message);
                    } finally {
                        setLoading(false);
                    }
                },
                { timeout: 10000 } // 10 seconds timeout
            );
        } else {
            console.warn('Browser does not support geolocation. Falling back to IP-based geolocation.');
            requestIPGeolocation();
        }
    }, [requestIPGeolocation]);

    const disableBrowserGeolocation = useCallback(() => {
        setIsGeolocationEnabled(false);
        setError(null);
        // Revert to IP-based geolocation
        requestIPGeolocation();
    }, [requestIPGeolocation]);

    // Initial Geolocation Fetch (IP-Based)
    useEffect(() => {
        if (!isGeolocationEnabled) {
            // Automatically fetch location via IP without user interaction
            requestIPGeolocation();
        }
        // If geolocation is enabled, do not fetch via IP
    }, [isGeolocationEnabled, requestIPGeolocation]);

    return (
        <GeolocationContext.Provider
            value={{
                nearestCitySlug,
                geolocation,
                isGeolocationEnabled,
                loading,
                error,
                requestIPGeolocation,
                requestBrowserGeolocation,
                disableBrowserGeolocation,
                calculateDistanceFromPlace, // Added the function to context
            }}
        >
            {children}
        </GeolocationContext.Provider>
    );
};

export default GeolocationProvider;
