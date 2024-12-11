import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import { City, CityPreview } from '../types/CommonInterfaces';
import { Place } from '../types/PlacesInterfaces';
import apiClient from '../config/apiClient';

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

function getPreview(languageId: number, slug: string) {
    console.log('languageid : ', languageId)
    const cityData = (citiesData as any[]).find(
        (c) =>
            c.slug === slug ||
            c.translations.some((t: any) => t.slug === slug && t.language === languageId)
    );

    if (!cityData) return null;

    const originalSlug = cityData.slug;
    let translation = cityData.translations.find((t: any) => t.language === languageId);

    if (!translation && languageId === 1) {
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

async function fetchInitialPlaces(languageId: number, slug: string): Promise<Places> {
    const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
        params: { languageId, limit: 8, offset: 0 },
    });
    return {
        restaurantsBars: data.places?.restaurantsBars || [],
        hotels: data.places?.hotels || [],
        touristAttractions: data.places?.touristAttractions || [],
    };
}

async function fetchRemainingPlaces(languageId: number, slug: string, currentPlaces: Places): Promise<Places> {
    const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
        params: { languageId, limit: 999, offset: 8 },
    });
    return {
        restaurantsBars: [...currentPlaces.restaurantsBars, ...(data.places?.restaurantsBars || [])],
        hotels: [...currentPlaces.hotels, ...(data.places?.hotels || [])],
        touristAttractions: [...currentPlaces.touristAttractions, ...(data.places?.touristAttractions || [])],
    };
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
            // On ne lance rien si la langue n'est pas encore chargée
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

            // On peut mettre un petit délai si besoin (ex: 50ms)
            setTimeout(() => {
                setCity(result.preview);
                setIsPreview(true);
                setPendingLoad({ originalSlug: result.originalSlug, preview: result.preview });
            }, 50);
        },
        [isFetching, language.id, isLanguageLoaded, resetCity]
    );

    // Effet séparé pour charger les données après la preview
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

            const fullCity: City = {
                id: preview.id || 0,
                lat: preview.lat || 0,
                lng: preview.lng || 0,
                slug: preview.slug || '',
                country: {
                    id: 0,
                    slug: originalSlug,
                    code: preview.country.code || '',
                    translation: {
                        slug: originalSlug,
                        name: preview.country.name || '',
                        description: '',
                        meta_description: '',
                    },
                },
                translation: {
                    slug: preview.slug || '',
                    name: preview.name || '',
                    description: preview.description || '',
                    meta_description: '',
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
