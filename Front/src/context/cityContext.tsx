import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import { City, CityPreview } from '../types/CommonInterfaces';
import { Place } from '../types/PlacesInterfaces';
import apiClient from '../config/apiClient';

// Définition des types de places
type Places = {
    restaurantsBars: Place[];
    hotels: Place[];
    touristAttractions: Place[];
};

type Category = 'restaurant_bar' | 'hotel' | 'tourist_attraction';

type HasMorePlaces = {
    restaurant_bar: boolean;
    hotel: boolean;
    tourist_attraction: boolean;
};

type CityState = {
    city: City | CityPreview | null;
    originalSlug: string | null;
    places: Places;
    isPreview: boolean;
    isLoadingPlaces: HasMorePlaces;
    hasMorePlaces: HasMorePlaces;
    setCityPreviewAndFetchData: (slug: string) => void;
    resetCity: () => void;
    fetchMorePlaces: (category: Category) => void;
    fetchInitialPlacesByCategory: (category: Category) => void;
    fetchAllPlaces: () => void; // Nouvelle fonction
};

const CityContext = createContext<CityState | undefined>(undefined);

/**
 * Récupère l'aperçu de la ville basé sur la langue et le slug.
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
        // Fallback à la langue par défaut si la traduction n'est pas trouvée
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
 * Récupère toutes les places en une seule requête.
 */
const fetchAllPlacesAPI = async (languageId: number, slug: string): Promise<Places> => {
    try {
        const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
            params: {
                languageId,
                limit: 1000, // Supposons que 1000 est suffisant pour toutes les places
                offset: 0,
            },
        });

        return {
            restaurantsBars: data.places?.restaurantsBars || [],
            hotels: data.places?.hotels || [],
            touristAttractions: data.places?.touristAttractions || [],
        };
    } catch (error) {
        console.error('Error fetching all places:', error);
        return {
            restaurantsBars: [],
            hotels: [],
            touristAttractions: [],
        };
    }
};

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language, isLanguageLoaded } = useLanguage();
    const [city, setCity] = useState<City | CityPreview | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string | null>(null);
    const [places, setPlaces] = useState<Places>({
        restaurantsBars: [],
        hotels: [],
        touristAttractions: [],
    });
    const [isPreview, setIsPreview] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // State pour suivre s'il reste des lieux à charger par catégorie
    const [hasMorePlaces, setHasMorePlaces] = useState<HasMorePlaces>({
        restaurant_bar: true,
        hotel: true,
        tourist_attraction: true,
    });

    // Référence pour suivre la valeur actuelle de isFetching
    const isFetchingRef = useRef(isFetching);

    useEffect(() => {
        isFetchingRef.current = isFetching;
    }, [isFetching]);

    // Référence pour suivre la dernière valeur de places
    const placesRef = useRef<Places>(places);

    useEffect(() => {
        placesRef.current = places;
    }, [places]);

    const [pendingLoad, setPendingLoad] = useState<{
        originalSlug: string;
        preview: CityPreview;
    } | null>(null);

    const resetCity = useCallback(() => {
        setCity(null);
        setOriginalSlug(null);
        setPlaces({
            restaurantsBars: [],
            hotels: [],
            touristAttractions: [],
        });
        setIsPreview(false);
        setHasMorePlaces({
            restaurant_bar: true,
            hotel: true,
            tourist_attraction: true,
        });
    }, []);

    const setCityPreviewAndFetchData = useCallback(
        (slug: string) => {
            if (!isLanguageLoaded) {
                console.warn("Language not loaded yet, cannot fetch city preview.");
                return;
            }
            if (isFetchingRef.current) return; // Utiliser la référence
            resetCity();
            setIsFetching(true);

            const result = getPreview(language.id, slug);
            if (!result || !result.preview) {
                console.error('[CityContext] No preview available for slug:', slug);
                setIsFetching(false);
                return;
            }

            setTimeout(() => {
                setCity(result.preview);
                setOriginalSlug(result.originalSlug);
                setIsPreview(true);
                setPendingLoad({ originalSlug: result.originalSlug, preview: result.preview });
            }, 50);
        },
        [language.id, isLanguageLoaded, resetCity]
    );

    /**
     * Effet pour gérer `pendingLoad` et récupérer toutes les places.
     */
    useEffect(() => {
        if (!pendingLoad || !isLanguageLoaded) return;

        const { originalSlug, preview } = pendingLoad;
        let canceled = false;

        const initializePlaces = async () => {
            const fetchedPlaces = await fetchAllPlacesAPI(language.id, originalSlug);
            if (canceled) return;

            setPlaces(fetchedPlaces);
            setHasMorePlaces({
                restaurant_bar: false,
                hotel: false,
                tourist_attraction: false,
            });
            setIsFetching(false);
            setIsPreview(false);
            setPendingLoad(null);
        };

        initializePlaces();

        return () => {
            canceled = true;
        };
    }, [pendingLoad, isLanguageLoaded, language.id]);

    const [isLoadingPlaces, setIsLoadingPlaces] = useState<HasMorePlaces>({
        restaurant_bar: false,
        hotel: false,
        tourist_attraction: false,
    });

    /**
     * Récupère plus de places pour une catégorie spécifique
     */
    const fetchMorePlaces = useCallback(async (category: Category) => {
        if (!originalSlug || !language.id) return; // Utiliser originalSlug
        if (!hasMorePlaces[category]) return; // Ne pas charger si aucun lieu restant

        // Définir l'état de chargement à true pour la catégorie
        setIsLoadingPlaces(prev => ({ ...prev, [category]: true }));

        // Déterminer le nombre actuel de places dans la catégorie
        let currentPlaces: Place[] = [];
        let newOffset = 0;

        switch (category) {
            case 'restaurant_bar':
                currentPlaces = placesRef.current.restaurantsBars;
                newOffset = currentPlaces.length;
                break;
            case 'hotel':
                currentPlaces = placesRef.current.hotels;
                newOffset = currentPlaces.length;
                break;
            case 'tourist_attraction':
                currentPlaces = placesRef.current.touristAttractions;
                newOffset = currentPlaces.length;
                break;
            default:
                console.error('Invalid category:', category);
                setIsLoadingPlaces(prev => ({ ...prev, [category]: false }));
                return;
        }

        try {
            const { data } = await apiClient.get(`/place/cities/${originalSlug}/all-places`, {
                params: {
                    languageId: language.id,
                    limit: 8,
                    offset: newOffset,
                    categories: category,
                },
            });

            let newPlaces: Place[] = [];
            switch (category) {
                case 'restaurant_bar':
                    newPlaces = data.places?.restaurantsBars || [];
                    setPlaces(prev => ({
                        ...prev,
                        restaurantsBars: [
                            ...prev.restaurantsBars,
                            ...newPlaces.filter(newPlace => !prev.restaurantsBars.some(existingPlace => existingPlace.id === newPlace.id)),
                        ],
                    }));
                    if (newPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, restaurant_bar: false }));
                    }
                    break;
                case 'hotel':
                    newPlaces = data.places?.hotels || [];
                    setPlaces(prev => ({
                        ...prev,
                        hotels: [
                            ...prev.hotels,
                            ...newPlaces.filter(newPlace => !prev.hotels.some(existingPlace => existingPlace.id === newPlace.id)),
                        ],
                    }));
                    if (newPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, hotel: false }));
                    }
                    break;
                case 'tourist_attraction':
                    newPlaces = data.places?.touristAttractions || [];
                    setPlaces(prev => ({
                        ...prev,
                        touristAttractions: [
                            ...prev.touristAttractions,
                            ...newPlaces.filter(newPlace => !prev.touristAttractions.some(existingPlace => existingPlace.id === newPlace.id)),
                        ],
                    }));
                    if (newPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, tourist_attraction: false }));
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error fetching more places for ${category}:`, error);
        } finally {
            setIsLoadingPlaces(prev => ({ ...prev, [category]: false }));
        }
    }, [originalSlug, language.id, hasMorePlaces]);

    /**
     * Récupère les places initiales pour une catégorie spécifique
     */
    const fetchInitialPlacesByCategoryCallback = useCallback(async (category: Category) => {
        if (!city || !language.id) return;

        // Définir l'état de chargement à true pour la catégorie
        setIsLoadingPlaces(prev => ({ ...prev, [category]: true }));

        try {
            const languageId = language.id;
            const { data } = await apiClient.get(`/place/cities/${originalSlug}/all-places`, {
                params: {
                    languageId,
                    limit: 8,
                    offset: 0,
                    categories: category,
                },
            });

            let initialPlaces: Place[] = [];
            switch (category) {
                case 'restaurant_bar':
                    initialPlaces = data.places?.restaurantsBars || [];
                    setPlaces(prev => ({
                        ...prev,
                        restaurantsBars: initialPlaces,
                    }));
                    if (initialPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, restaurant_bar: false }));
                    }
                    break;
                case 'hotel':
                    initialPlaces = data.places?.hotels || [];
                    setPlaces(prev => ({
                        ...prev,
                        hotels: initialPlaces,
                    }));
                    if (initialPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, hotel: false }));
                    }
                    break;
                case 'tourist_attraction':
                    initialPlaces = data.places?.touristAttractions || [];
                    setPlaces(prev => ({
                        ...prev,
                        touristAttractions: initialPlaces,
                    }));
                    if (initialPlaces.length < 8) {
                        setHasMorePlaces(prev => ({ ...prev, tourist_attraction: false }));
                    }
                    break;
                default:
                    console.error('Invalid category:', category);
            }
        } catch (error) {
            console.error(`Error fetching initial places for ${category}:`, error);
        } finally {
            setIsLoadingPlaces(prev => ({ ...prev, [category]: false }));
        }
    }, [city, language.id, originalSlug]);

    /**
     * Récupère toutes les places en une seule fois
     */
    const fetchAllPlaces = useCallback(async () => {
        if (!originalSlug || !language.id || !isLanguageLoaded) return;

        setIsLoadingPlaces({
            restaurant_bar: true,
            hotel: true,
            tourist_attraction: true,
        });

        try {
            const fetchedPlaces = await fetchAllPlacesAPI(language.id, originalSlug);

            setPlaces({
                restaurantsBars: fetchedPlaces.restaurantsBars,
                hotels: fetchedPlaces.hotels,
                touristAttractions: fetchedPlaces.touristAttractions,
            });

            setHasMorePlaces({
                restaurant_bar: false,
                hotel: false,
                tourist_attraction: false,
            });
        } catch (error) {
            console.error('Error fetching all places:', error);
        } finally {
            setIsLoadingPlaces({
                restaurant_bar: false,
                hotel: false,
                tourist_attraction: false,
            });
        }
    }, [originalSlug, language.id, isLanguageLoaded]);

    // Mémoïsation de la valeur du contexte pour éviter les re-renders inutiles
    const contextValue = useMemo(() => ({
        city,
        originalSlug,
        places,
        isPreview,
        hasMorePlaces,
        setCityPreviewAndFetchData,
        resetCity,
        fetchMorePlaces,
        fetchInitialPlacesByCategory: fetchInitialPlacesByCategoryCallback,
        isLoadingPlaces,
        fetchAllPlaces, // Ajout de fetchAllPlaces
    }), [
        city,
        originalSlug,
        places,
        isPreview,
        hasMorePlaces,
        setCityPreviewAndFetchData,
        resetCity,
        fetchMorePlaces,
        fetchInitialPlacesByCategoryCallback,
        isLoadingPlaces,
        fetchAllPlaces,
    ]);

    return (
        <CityContext.Provider value={contextValue}>
            {children}
        </CityContext.Provider>
    );
};

/**
 * Hook personnalisé pour accéder au contexte de la ville.
 */
export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};

/**
 * Hook pour récupérer les 8 premiers lieux de chaque catégorie.
 * Utilisez ce hook pour initialiser les données de la ville.
 * @param slug Le slug de la ville à charger.
 */
export const useFetchInitialPlaces = () => {
    const { setCityPreviewAndFetchData } = useCity();

    const fetch = useCallback(async (slug: string) => {
        setCityPreviewAndFetchData(slug);
        // Les places sont chargées via l'effet `useEffect` dans le provider
    }, [setCityPreviewAndFetchData]);

    return fetch;
};

/**
 * Hook pour récupérer 8 lieux supplémentaires pour une catégorie spécifique.
 * Utilisez ce hook lorsque l'utilisateur demande de charger plus de lieux.
 */
export const useFetchMorePlaces = () => {
    const { fetchMorePlaces } = useCity();

    const fetch = useCallback(async (category: Category) => {
        await fetchMorePlaces(category);
    }, [fetchMorePlaces]);

    return fetch;
};
