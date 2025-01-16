// src/pages/City.tsx

import React, {
    useEffect,
    useState,
    useCallback,
    useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonSpinner,
} from '@ionic/react';
import { useCity, useFetchInitialPlaces } from '../context/cityContext';
import { useLanguage } from '../context/languageContext';

import CityHeader from '../components/CityHeader';
import PlaceCarousel from '../components/PlaceCarousel';
import SearchBar from '../components/SearchBar';
import placeCarouselConfig from '../util/PlacesCarouselConfig';
import useFilterPlaces from '../util/useFilterPlaces';
import '../styles/pages/City.css';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const {
        city,
        places,
        fetchAllPlaces,
        fillUpCityFirestore,
        originalSlug
    } = useCity();

    const fetchInitialPlaces = useFetchInitialPlaces();
    const { isLanguageLoaded, language } = useLanguage();

    const [isTripModalOpen, setIsTripModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    /**
     * 1. Détection d'appareil mobile (pour PlaceCarousel, etc.)
     *    On ne veut pas recalculer 100x, donc on le fait une seule fois.
     */
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const mobileRegex = /iPhone|iPad|iPod|Android/i;
        setIsMobile(mobileRegex.test(userAgent));
    }, []);

    /**
     * 2. Fetch initial si la langue est prête et qu'on a un slug.
     *    => On récupère un premier set de places (ex. 8 par catégorie)
     */
    useEffect(() => {
        if (slug && isLanguageLoaded && !city) {
            // Si city est déjà définie, on évite un fetch redondant
            fetchInitialPlaces(slug);
        }
    }, [slug, isLanguageLoaded, city, fetchInitialPlaces]);

    /**
     * 3. Dès que city est définie, on appelle fetchAllPlaces pour avoir
     *    toutes les places (uniquement si pas déjà tout chargé).
     */
    useEffect(() => {
        if (city) {
            fetchAllPlaces();
            // ou bien: if (!isAllPlacesLoaded) fetchAllPlaces();
        }
    }, [city, fetchAllPlaces]);

    /**
     * 4. Combinaison de toutes les places en une seule liste
     *    => useMemo pour éviter de recalculer en boucle
     */
    const allPlaces = useMemo(() => {
        return [
            ...places.restaurantsBars,
            // ...places.hotels,
            ...places.touristAttractions,
        ];
    }, [places]);

    /**
     * 5. Extraction catégories & attributs (pour PlaceCarousel ou Filter)
     *    => useMemo + flatMap
     */
    const uniqueCategories: Category[] = useMemo(() => {
        const combinedCats = [
            ...places.restaurantsBars.flatMap(p => p.categories),
            ...places.touristAttractions.flatMap(p => p.categories),
        ];
        const resCat = Array.from(new Map(combinedCats.map(cat => [cat.id, cat])).values());
        return resCat;
    }, [places]);

    const uniqueAttributes: Attribute[] = useMemo(() => {
        const combinedAttrs = [
            ...places.restaurantsBars.flatMap(p => p.attributes),
            ...places.touristAttractions.flatMap(p => p.attributes),
        ];
        const resAttr = Array.from(new Map(combinedAttrs.map(a => [a.id, a])).values());
        return resAttr;
    }, [places]);

    /**
     * 6. Déterminer la config de carrousels
     */
    const carouselConfigurations = useMemo(() => {
        if (!slug) return placeCarouselConfig['default'];
        return placeCarouselConfig[slug] || placeCarouselConfig['default'];
    }, [slug]);

    /**
     * 7. Hook de filtrage (si vous avez besoin d'interactions "FilterPlaces")
     */
    const { getTranslation, isUserInteraction } = useFilterPlaces({
        categories: uniqueCategories,
        attributes: uniqueAttributes,
        onFilterChange: () => { },   // pas utilisé ici
        languageID: language.id,
        allPlaces,
    });

    /**
     * 8. Handler pour ajouter des données "fillUpCityFirestore"
     */
    const handleAddDataToFirestore = useCallback(async () => {
        if (!language.id || !slug) {
            console.error('Language ID or city slug is missing.');
            alert('Unable to add data. Language ID or city slug is missing.');
            return;
        }

        try {
            if (originalSlug) {
                await fillUpCityFirestore(language.id, originalSlug);
            }
            await fetchAllPlaces();
            alert('Data successfully added to Firestore.');
        } catch (error) {
            console.error('Error adding data to Firestore:', error);
            alert('Error adding data to Firestore.');
        }
    }, [fillUpCityFirestore, language.id, slug, fetchAllPlaces]);

    /**
     * 9. Rendu conditionnel : 
     *    - Si la langue n'est pas chargée, on montre un loader
     *    - Si la city n'est pas encore définie (et qu'on a pas encore
     *      finalisé le fetch), on montre un spinner de chargement.
     */
    if (!isLanguageLoaded) {
        return (
            <IonPage>
                <IonContent>
                    <div className="loading">
                        <IonSpinner name="crescent" />
                        <p>Chargement de la langue…</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!city) {
        return (
            <IonPage>
                <IonContent>
                    <div className="loading">
                        <IonSpinner name="crescent" />
                        <p>Chargement de la ville…</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    /**
     * 10. Rendu principal : la city est prête (et la langue est prête)
     */
    return (
        <IonPage className={`city-page ${isUserInteraction ? 'content-shift' : ''}`}>
            <IonContent fullscreen>
                <CityHeader
                    name={'translation' in city ? city.translation.name : city.name}
                    description={'translation' in city ? city.translation.description : city.description}
                    lat={city.lat}
                    lng={city.lng}
                    countryName={
                        'translation' in city.country
                            ? city.country.translation.name
                            : city.country.name
                    }
                    countryCode={city.country.code}
                    slug={city.slug || ''}
                />

                <div className="city-buttons">

                    <IonButton onClick={() => setIsTripModalOpen(true)}>
                        ✈️ Je crée mon voyage !
                    </IonButton>

                    <IonButton color="secondary" onClick={handleAddDataToFirestore}>
                        Ajouter des données à Firestore
                    </IonButton>
                </div>

                <div className="city-content">
                    {carouselConfigurations.map((config, index) => {
                        const category = uniqueCategories.find(
                            cat => cat.slug === config.categorySlug
                        );

                        if (!category) {
                            console.warn(
                                `Category with slug "${config.categorySlug}" not found.`
                            );
                            return null;
                        }

                        const translatedCategoryName = getTranslation(
                            category.slug,
                            'categories'
                        );

                        if (city.slug) {
                            const title = config.title(
                                city.slug,
                                translatedCategoryName,
                                language.code
                            );
                            return (
                                <div key={index}>
                                    <PlaceCarousel
                                        title={title}
                                        allPlaces={allPlaces}
                                        isPreview={true}
                                        isMobile={isMobile}
                                        categories={[category]}
                                        attributes={[]}
                                        activePlace={null}
                                        setActivePlace={() => { }}
                                        selectedAttributes={[]}
                                        selectedCategories={[]}
                                        getTranslation={getTranslation}

                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* 
          // Exemple de modal (commenté)
          // <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
          //     <TripForm onClose={() => setIsTripModalOpen(false)} />
          // </IonModal> 
          */}
            </IonContent>
        </IonPage>
    );
};

export default City;
