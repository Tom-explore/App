import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import { City, CityPreview } from '../types/CommonInterfaces';
import { Place } from '../types/PlacesInterfaces';
import apiClient from '../config/apiClient';
import { doc, collection, query, getDocsFromCache, getDocsFromServer } from 'firebase/firestore';
import { firestore } from '../config/firebaseconfig';

// Définition des types de places
type Places = {
    restaurantsBars: Place[];
    // hotels: Place[];
    touristAttractions: Place[];
};

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
    isAllPlacesLoaded: boolean;
    setCityPreviewAndFetchData: (slug: string) => void;
    resetCity: () => void;
    fetchAllPlaces: () => void;
    setPlaces: React.Dispatch<React.SetStateAction<Places>>;
    fillUpCityFirestore: (languageId: number, slug: string) => Promise<Places>;
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
        translation = { slug: cityData.slug, name: cityData.name, description: cityData.description };
    }

    const countryTranslation = cityData.country.translations.find((t: any) => t.language === languageId);

    const preview: CityPreview = {
        id: cityData.id,
        lat: cityData.lat,
        lng: cityData.lng,
        slug: translation?.slug || cityData.slug,
        originalSlug: originalSlug,
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
const fillUpCityFirestore = async (languageId: number, slug: string): Promise<Places> => {
    try {
        const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
            params: {
                languageId,
                limit: 1000,
                offset: 0,
            },
        });

        return {
            restaurantsBars: data.places?.restaurantsBars || [],
            // hotels: data.places?.hotels || [],
            touristAttractions: data.places?.touristAttractions || [],
        };
    } catch (error) {
        console.error('Error fetching all places:', error);
        return {
            restaurantsBars: [],
            // hotels: [],
            touristAttractions: [],
        };
    }
};



export const fetchAllDataFirestore = async (
    languageId: number,
    slug: string
): Promise<Places> => {
    console.log(
        `Début de la récupération des données pour la ville: "${slug}" avec languageId: ${languageId}`
    );

    if (!slug.trim()) {
        throw new Error("Le slug ne peut pas être vide.");
    }

    // Clé unique pour identifier le document Firestore
    const cityDocId = `${slug}-${languageId}`;
    const cityDocRef = doc(firestore, 'City', cityDocId);

    const fetchSubcollection = async (subcollectionName: string): Promise<Place[]> => {
        const subcollectionRef = collection(cityDocRef, subcollectionName);
        const q = query(subcollectionRef);

        try {
            let querySnapshot;

            try {
                querySnapshot = await getDocsFromCache(q);
                if (!querySnapshot.empty) {
                    console.log(`Données récupérées depuis le cache pour la sous-collection: ${subcollectionName}`);
                } else {
                    throw new Error("Cache vide");
                }
            } catch {
                console.log(`Récup data Firestore : ${subcollectionName}`);

                querySnapshot = await getDocsFromServer(q);
                console.log(`Données récupérées depuis le serveur pour la sous-collection: ${subcollectionName}`);
            }

            return querySnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                if (typeof data.id === 'number') {
                    return { id: data.id, ...(data as Omit<Place, 'id'>) };
                } else {
                    console.warn(
                        `Document "${docSnap.id}" dans "${subcollectionName}" n'a pas de champ 'id' valide. Données:`,
                        data
                    );
                    return null;
                }
            }).filter(place => place !== null) as Place[];

        } catch (error) {
            console.error(`Erreur lors de la récupération de la sous-collection "${subcollectionName}":`, error);
            return [];
        }
    };
    try {
        // Récupérer les sous-collections
        const [restaurantsBars, touristAttractions] = await Promise.all([
            fetchSubcollection('restaurantsBars'),
            // fetchSubcollection('hotels'),
            fetchSubcollection('touristAttractions')
        ]);

        const fetchedData: Places = {
            restaurantsBars,
            // hotels,
            touristAttractions,
        };


        return fetchedData;
    } catch (error) {
        console.error("Erreur lors de la récupération des données depuis Firestore:", error);

        return {
            restaurantsBars: [],
            // hotels: [],
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
        // hotels: [],
        touristAttractions: [],
    });
    const [isPreview, setIsPreview] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isAllPlacesLoaded, setIsAllPlacesLoaded] = useState(false);

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
            // hotels: [],
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
            if (isFetchingRef.current) return;
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

    const [isLoadingPlaces, setIsLoadingPlaces] = useState<HasMorePlaces>({
        restaurant_bar: false,
        hotel: false,
        tourist_attraction: false,
    });

    /**
     * Récupère toutes les places en une seule fois
     */
    const fetchAllPlaces = useCallback(async (): Promise<Places> => {
        if (!originalSlug || !language.id || !isLanguageLoaded) {
            // Return an empty places object if conditions are not met
            return {
                restaurantsBars: [],
                // hotels: [],
                touristAttractions: []
            };
        }

        setIsLoadingPlaces({
            restaurant_bar: true,
            hotel: true,
            tourist_attraction: true,
        });

        try {
            const fetchedPlaces = await fetchAllDataFirestore(language.id, originalSlug);

            setPlaces({
                restaurantsBars: fetchedPlaces.restaurantsBars,
                // hotels: fetchedPlaces.hotels,
                touristAttractions: fetchedPlaces.touristAttractions,
            });
            setIsAllPlacesLoaded(true);

            setHasMorePlaces({
                restaurant_bar: false,
                hotel: false,
                tourist_attraction: false,
            });

            // Return the fetched places as a Promise
            return {
                restaurantsBars: fetchedPlaces.restaurantsBars,
                // hotels: fetchedPlaces.hotels,
                touristAttractions: fetchedPlaces.touristAttractions,
            };

        } catch (error) {
            console.error('Error fetching all places:', error);
            // Return a default empty structure on error as well
            return {
                restaurantsBars: [],
                // hotels: [],
                touristAttractions: []
            };
        } finally {
            setIsLoadingPlaces({
                restaurant_bar: false,
                hotel: false,
                tourist_attraction: false,
            });
        }
    }, [originalSlug, language.id, isLanguageLoaded]);



    const contextValue = useMemo(() => ({
        city,
        originalSlug,
        places,
        isPreview,
        hasMorePlaces,
        setCityPreviewAndFetchData,
        resetCity,
        isLoadingPlaces,
        fetchAllPlaces,
        fillUpCityFirestore, // Ajout de fillUpCityFirestore au contexte
        setPlaces,
        isAllPlacesLoaded,

    }), [
        city,
        originalSlug,
        places,
        isPreview,
        hasMorePlaces,
        setCityPreviewAndFetchData,
        resetCity,
        isLoadingPlaces,
        fetchAllPlaces,
        fillUpCityFirestore, // Ajout de fillUpCityFirestore aux dépendances
        setPlaces,
        isAllPlacesLoaded,

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
 * @param slug Le slug de la ville à charger.
 */
export const useFetchInitialPlaces = () => {
    const { setCityPreviewAndFetchData } = useCity();

    const fetch = useCallback(async (slug: string) => {
        setCityPreviewAndFetchData(slug);
    }, [setCityPreviewAndFetchData]);

    return fetch;
};

