// src/pages/City.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
} from '@ionic/react';
import { useCity, useFetchInitialPlaces } from '../context/cityContext';
import CityHeader from '../components/CityHeader';
import PlaceCarousel from '../components/PlaceCarousel';
import { useIonViewWillLeave } from '@ionic/react';
import { useLanguage } from '../context/languageContext';
import '../styles/pages/City.css';
import { Place } from '../types/PlacesInterfaces';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
import SearchBar from '../components/SearchBar';
import placeCarouselConfig from '../util/PlacesCarouselConfig';
import useFilterPlaces from '../util/useFilterPlaces';
import { filterOutline } from 'ionicons/icons';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { city, places, resetCity, isPreview, fetchAllPlaces, fillUpCityFirestore } = useCity();
    const fetchInitialPlaces = useFetchInitialPlaces();
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Détection de l'appareil mobile
    useEffect(() => {
        const checkIsMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /iPhone|iPad|iPod|Android/i;
            setIsMobile(mobileRegex.test(userAgent));
        };
        checkIsMobile();
    }, []);

    // Récupération initiale des lieux
    useEffect(() => {
        if (slug && isLanguageLoaded) {
            fetchInitialPlaces(slug);
        }
    }, [fetchInitialPlaces, slug, isLanguageLoaded]);

    // Réinitialisation de la ville lors du démontage
    useEffect(() => {
        return () => {
            resetCity();
        };
    }, [resetCity]);

    // Réinitialisation lors du départ de la vue
    useIonViewWillLeave(() => {
        resetCity();
    });

    // Récupération de toutes les places une fois que la ville est définie
    useEffect(() => {
        if (city) {
            fetchAllPlaces();
        }
    }, [fetchAllPlaces, city]);

    // Combinaison de toutes les places en une seule liste
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Extraire les catégories et attributs uniques pour les passer au hook
    const uniqueCategories: Category[] = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const uniqueAttributes: Attribute[] = useMemo(() => {
        const allAttributes = [
            ...places.restaurantsBars.flatMap(place => place.attributes),
            ...places.hotels.flatMap(place => place.attributes),
            ...places.touristAttractions.flatMap(place => place.attributes),
        ];
        return Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Déterminer la configuration des carrousels en fonction de la ville
    const carouselConfigurations = useMemo(() => {
        if (!slug) return placeCarouselConfig['default'];
        return placeCarouselConfig[slug] || placeCarouselConfig['default'];
    }, [slug]);

    const {
        getTranslation,
        isUserInteraction,
    } = useFilterPlaces({
        categories: uniqueCategories,
        attributes: uniqueAttributes,
        onFilterChange: (filteredPlaces: Place[]) => {
        },
        languageID: language.id,
        allPlaces: allPlaces,
    });

    // Handler pour ajouter des données à Firestore
    const handleAddDataToFirestore = useCallback(async () => {
        if (!language.id || !slug) {
            console.error('Language ID or city slug is missing.');
            alert('Unable to add data. Language ID or city slug is missing.');
            return;
        }

        try {
            await fillUpCityFirestore(language.id, slug);
            await fetchAllPlaces();
            alert('Data successfully added to Firestore.');
        } catch (error) {
            console.error('Error adding data to Firestore:', error);
            alert('Error adding data to Firestore.');
        }
    }, [fillUpCityFirestore, language.id, slug, fetchAllPlaces]);

    return (
        <IonPage className={`city-page ${isUserInteraction ? 'content-shift' : ''}`}>
            <IonContent fullscreen>
                {city ? (
                    <>
                        <CityHeader
                            name={'translation' in city ? city.translation.name : city.name}
                            description={'translation' in city ? city.translation.description : city.description}
                            lat={city.lat}
                            lng={city.lng}
                            countryName={'translation' in city.country ? city.country.translation.name : city.country.name}
                            countryCode={city.country.code}
                            slug={city.slug || ''}
                        />

                        <div className="city-buttons">
                            <div className="search-bar-container">
                                <SearchBar onSearch={setSearchQuery} placeholder='Rechercher un lieu' />
                            </div>

                            {/* Bouton Filtrer */}
                            <IonButton className="filter-button" onClick={() => { /* Logic to open filter panel */ }} fill="clear">
                                <IonIcon icon={filterOutline} />
                            </IonButton>

                            {/* Bouton Créer Voyage */}
                            <IonButton onClick={() => setIsTripModalOpen(true)}>
                                ✈️ Je crée mon voyage !
                            </IonButton>

                            <IonButton color="secondary" onClick={handleAddDataToFirestore}>
                                Ajouter des données à Firestore
                            </IonButton>
                        </div>

                        {/* Carrousels Dynamiques */}
                        <div className="city-content">
                            {carouselConfigurations.map((config, index) => {
                                // Trouver l'objet Category correspondant au slug
                                const category = uniqueCategories.find(cat => cat.slug === config.categorySlug);
                                if (!category) {
                                    console.warn(`Category with slug "${config.categorySlug}" not found.`);
                                    return null;
                                }

                                const translatedCategoryName = getTranslation(category.slug, 'categories');

                                // Générer le titre traduit
                                if (city.slug) {
                                    const title = config.title(city.slug, translatedCategoryName, language.code);

                                    return (
                                        <div key={index}>
                                            <h2>{title}</h2>
                                            <PlaceCarousel
                                                allPlaces={allPlaces}
                                                isPreview={isPreview}
                                                isMobile={isMobile}
                                                category={category}
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </>
                ) : (
                    <div className="loading">
                        <PlaceCarousel
                            allPlaces={[]}
                            isPreview={true}
                            isMobile={isMobile}
                            category={null}
                        />
                    </div>
                )}
                {/* 
                <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    <TripForm onClose={() => setIsTripModalOpen(false)} />
                </IonModal> */}
            </IonContent>
        </IonPage>
    );

};

export default City;
