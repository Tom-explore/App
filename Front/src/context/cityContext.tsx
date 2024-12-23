import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import { City, CityPreview } from '../types/CommonInterfaces';
import { Place } from '../types/PlacesInterfaces';
import apiClient from '../config/apiClient';
import { doc, collection, query, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebaseconfig';

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
    fetchAllPlaces: () => void;
    fillUpCityFirestore: (languageId: number, slug: string) => Promise<Places>; // Mise à jour du type
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
const fillUpCityFirestore = async (languageId: number, slug: string): Promise<Places> => {
    try {
        const { data } = await apiClient.get(`/place/cities/${slug}/all-places`, {
            params: {
                languageId,
                limit: 1000, // On suppose que 1000 est suffisant pour toutes les places
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

const fetchAllDataFirestore = async (languageId: number, slug: string): Promise<Places> => {
    console.log(`Début de la récupération des données pour la ville: "${slug}" avec languageId: ${languageId}`);

    try {
        const cityDocId = `${slug}-${languageId}`;
        console.log(`Identifiant du document de la ville: "${cityDocId}"`);

        const cityDocRef = doc(firestore, 'City', cityDocId);
        console.log(`Référence au document Firestore:`, cityDocRef);

        const fetchSubcollection = async (subcollectionName: string): Promise<Place[]> => {
            console.log(`Récupération de la sous-collection: "${subcollectionName}"`);

            const subcollectionRef = collection(cityDocRef, subcollectionName);
            const q = query(subcollectionRef);
            const querySnapshot = await getDocs(q);

            console.log(`Nombre de documents récupérés dans "${subcollectionName}": ${querySnapshot.size}`);

            const places: Place[] = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();

                if (typeof data.id === 'number') { // Vérifie que 'id' est bien un nombre
                    const place: Place = { id: data.id, ...(data as Omit<Place, 'id'>) };
                    places.push(place);
                    console.log(`Place ajoutée:`, place);
                } else {
                    console.warn(`Document "${docSnap.id}" dans "${subcollectionName}" n'a pas de champ 'id' numérique. Données:`, data);
                }
            });

            console.log(`Total de places dans "${subcollectionName}": ${places.length}`);
            return places;
        };

        // Récupération simultanée des trois sous-collections
        console.log(`Commence la récupération simultanée des sous-collections: "restaurantsBars", "hotels", "touristAttractions"`);
        const [restaurantsBars, hotels, touristAttractions] = await Promise.all([
            fetchSubcollection('restaurantsBars'),
            fetchSubcollection('hotels'),
            fetchSubcollection('touristAttractions'),
        ]);

        console.log(`Récupération terminée. Résumé des données:`);
        console.log(`- Restaurants & Bars: ${restaurantsBars.length} places`);
        console.log(`- Hôtels: ${hotels.length} places`);
        console.log(`- Attractions Touristiques: ${touristAttractions.length} places`);

        return {
            restaurantsBars,
            hotels,
            touristAttractions,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis Firestore:', error);
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

    /**
     * Effet pour gérer `pendingLoad` et récupérer les places initiales.
     */
    // useEffect(() => {
    //     if (!pendingLoad || !isLanguageLoaded) return;

    //     const { originalSlug, preview } = pendingLoad;
    //     let canceled = false;

    //     const initializePlaces = async () => {
    //         if (canceled) return;
    //         await fetchInitialPlacesByCategoryCallback('restaurant_bar');
    //         await fetchInitialPlacesByCategoryCallback('hotel');
    //         await fetchInitialPlacesByCategoryCallback('tourist_attraction');

    //         setIsFetching(false);
    //         setIsPreview(false);
    //         setPendingLoad(null);
    //     };

    //     initializePlaces();

    //     return () => {
    //         canceled = true;
    //     };
    // }, [pendingLoad, isLanguageLoaded, language.id]);

    const [isLoadingPlaces, setIsLoadingPlaces] = useState<HasMorePlaces>({
        restaurant_bar: false,
        hotel: false,
        tourist_attraction: false,
    });

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
            const fetchedPlaces = await fetchAllDataFirestore(language.id, originalSlug);

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

/**
 * Hook pour récupérer 8 lieux supplémentaires pour une catégorie spécifique.
 */
// export const useFetchMorePlaces = () => {
//     const { fetchMorePlaces } = useCity();

//     const fetch = useCallback(async (category: Category) => {
//         await fetchMorePlaces(category);
//     }, [fetchMorePlaces]);

//     return fetch;
// };
