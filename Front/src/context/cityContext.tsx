// src/context/CityContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import { City, CityPreview } from '../types/CommonInterfaces';
import { Place } from '../types/PlacesInterfaces';
import apiClient from '../config/apiClient';

// Updated Places type remains the same since Place now includes attributes and categories
type Places = {
    restaurantsBars: Place[];
    hotels: Place[];
    touristAttractions: Place[];
};

type CityState = {
    city: City | CityPreview | null;
    places: Places;
    isPreview: boolean;
    setCityPreviewAndFetchData: (slug: string) => void;
    resetCity: () => void;
};

const CityContext = createContext<CityState | undefined>(undefined);

/**
 * Fetch the city preview based on language and slug.
 */
function getPreview(languageId: number, slug: string) {
    console.log('languageId:', languageId);
    const cityData = (citiesData as any[]).find(
        (c) =>
            c.slug === slug ||
            c.translations.some((t: any) => t.slug === slug && t.language === languageId)
    );

    if (!cityData) return null;

    const originalSlug = cityData.slug;
    let translation = cityData.translations.find((t: any) => t.language === languageId);

    if (!translation && languageId === 1) {
        // Fallback to default language if translation not found
        translation = { slug: cityData.slug, name: cityData.name, description: cityData.description };
    }

    const countryTranslation = cityData.country.translations.find((t: any) => t.language === languageId);

    const preview: CityPreview = {
        id: cityData.id,
        lat: cityData.lat,
        lng: cityData.lng,
        slug: translation?.slug || cityData.slug,
        name: translation?.name || cityData.name || 'Unknown name',
        description: translation?.description || cityData.description || 'No description available',
        country: {
            code: cityData.country.code,
            name: countryTranslation?.name || cityData.country.name || cityData.country.code,
        },
    };

    return { preview, originalSlug };
}

/**
 * Fetch initial set of places with pagination.
 */
async function fetchInitialPlaces(languageId: number, slug: string): Promise<Places> {
    try {
        const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
            params: { languageId, limit: 8, offset: 0 },
        });
        return {
            restaurantsBars: data.places?.restaurantsBars || [],
            hotels: data.places?.hotels || [],
            touristAttractions: data.places?.touristAttractions || [],
        };
    } catch (error) {
        console.error('Error fetching initial places:', error);
        return {
            restaurantsBars: [],
            hotels: [],
            touristAttractions: [],
        };
    }
}

/**
 * Fetch remaining places after the initial set.
 */
async function fetchRemainingPlaces(languageId: number, slug: string, currentPlaces: Places): Promise<Places> {
    try {
        const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
            params: { languageId, limit: 999, offset: 8 },
        });
        return {
            restaurantsBars: [...currentPlaces.restaurantsBars, ...(data.places?.restaurantsBars || [])],
            hotels: [...currentPlaces.hotels, ...(data.places?.hotels || [])],
            touristAttractions: [...currentPlaces.touristAttractions, ...(data.places?.touristAttractions || [])],
        };
    } catch (error) {
        console.error('Error fetching remaining places:', error);
        return currentPlaces;
    }
}

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language, isLanguageLoaded } = useLanguage();
    const [city, setCity] = useState<City | CityPreview | null>(null);
    const [places, setPlaces] = useState<Places>({
        restaurantsBars: [],
        hotels: [],
        touristAttractions: [],
    });
    const [isPreview, setIsPreview] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [pendingLoad, setPendingLoad] = useState<{
        originalSlug: string;
        preview: CityPreview;
    } | null>(null);

    const resetCity = useCallback(() => {
        setCity(null);
        setPlaces({
            restaurantsBars: [],
            hotels: [],
            touristAttractions: [],
        });
        setIsPreview(false);
    }, []);

    const setCityPreviewAndFetchData = useCallback(
        (slug: string) => {
            // Do not proceed if the language is not loaded yet
            if (!isLanguageLoaded) {
                console.warn("Language not loaded yet, cannot fetch city preview.");
                return;
            }
            if (isFetching) return;
            resetCity();
            setIsFetching(true);

            const result = getPreview(language.id, slug);
            if (!result || !result.preview) {
                console.error('[CityContext] No preview available for slug:', slug);
                setIsFetching(false);
                return;
            }

            // Optional small delay if needed (e.g., 50ms)
            setTimeout(() => {
                setCity(result.preview);
                setIsPreview(true);
                setPendingLoad({ originalSlug: result.originalSlug, preview: result.preview });
            }, 50);
        },
        [isFetching, language.id, isLanguageLoaded, resetCity]
    );

    // Separate effect to load data after setting the preview
    useEffect(() => {
        if (!pendingLoad || !isLanguageLoaded) return;

        const { originalSlug, preview } = pendingLoad;
        let canceled = false;

        (async () => {
            const initial = await fetchInitialPlaces(language.id, originalSlug);
            if (canceled) return;
            setPlaces(initial);

            const finalPlaces = await fetchRemainingPlaces(language.id, originalSlug, initial);
            if (canceled) return;
            setPlaces(finalPlaces);

            // Construct the full City object with translations and country data
            const fullCity: City = {
                id: preview.id || 0,
                lat: preview.lat || 0,
                lng: preview.lng || 0,
                slug: preview.slug || '',
                scrapio: '', // Update if available
                timezone: '', // Update if available
                duration: 0, // Update if available
                country: {
                    id: 0, // Update if available
                    slug: originalSlug,
                    code: preview.country.code || '',
                    translation: {
                        slug: originalSlug,
                        name: preview.country.name || '',
                        description: '', // Update if available
                        meta_description: '', // Update if available
                    },
                },
                translation: {
                    slug: preview.slug || '',
                    name: preview.name || '',
                    description: preview.description || '',
                    meta_description: '', // Update if available
                },
                places: finalPlaces,
            };

            if (!canceled) {
                setCity(fullCity);
                setIsPreview(false);
                setIsFetching(false);
                setPendingLoad(null);
            }
        })();

        return () => {
            canceled = true;
        };
    }, [pendingLoad, language.id, isLanguageLoaded]);

    return (
        <CityContext.Provider value={{ city, places, isPreview, setCityPreviewAndFetchData, resetCity }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};
