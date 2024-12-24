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
import TripForm from '../components/TripForm';
import './City.css';
import { Place } from '../types/PlacesInterfaces';
import FilterPlaces from '../components/FilterPlaces';
import FilterPlacesMobile from '../components/FilterPlacesMobile';
import { AnimatePresence, motion } from 'framer-motion';
import { filterOutline } from 'ionicons/icons';
import { PlaceType } from '../types/EnumsInterfaces';
import { useUser } from '../context/userContext';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useUser();

    const { city, places, resetCity, isPreview, hasMorePlaces, isLoadingPlaces, fetchAllPlaces, fillUpCityFirestore } = useCity();
    const fetchInitialPlaces = useFetchInitialPlaces();
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    const [filteredPlacesIDs, setFilteredPlacesIDs] = useState<Set<number> | null>(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

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
    }, [slug, isLanguageLoaded, fetchInitialPlaces]);

    // Réinitialisation de la ville lors du démontage
    useEffect(() => {
        return () => {
            resetCity();
        };
    }, [resetCity]);

    useIonViewWillLeave(() => {
        resetCity();
    });

    // Récupération de toutes les places une fois que la ville est définie
    useEffect(() => {
        if (city) {
            fetchAllPlaces();
        }
    }, [city, fetchAllPlaces]);

    // Combinaison de toutes les places
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Extraction des catégories uniques
    const uniqueCategories = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Extraction des attributs uniques
    const uniqueAttributes = useMemo(() => {
        const allAttributes = [
            ...places.restaurantsBars.flatMap(place => place.attributes),
            ...places.hotels.flatMap(place => place.attributes),
            ...places.touristAttractions.flatMap(place => place.attributes),
        ];
        return Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Gestion des filtres
    const handleFilterChange = useCallback((filteredPlaces: Place[]) => {
        const ids = new Set(filteredPlaces.map(p => p.id));
        setFilteredPlacesIDs(ids);
    }, []);

    // Filtres appliqués
    const filteredRestaurantsBars = useMemo(() => {
        if (!city) return [];
        if (!filteredPlacesIDs) return places.restaurantsBars;
        return places.restaurantsBars.filter(p => filteredPlacesIDs.has(p.id));
    }, [city, places.restaurantsBars, filteredPlacesIDs]);

    const filteredHotels = useMemo(() => {
        if (!city) return [];
        if (!filteredPlacesIDs) return places.hotels;
        return places.hotels.filter(p => filteredPlacesIDs.has(p.id));
    }, [city, places.hotels, filteredPlacesIDs]);

    const filteredTouristAttractions = useMemo(() => {
        if (!city) return [];
        if (!filteredPlacesIDs) return places.touristAttractions;
        return places.touristAttractions.filter(p => filteredPlacesIDs.has(p.id));
    }, [city, places.touristAttractions, filteredPlacesIDs]);

    const haveInitialPlaces =
        filteredRestaurantsBars.length > 0 ||
        filteredHotels.length > 0 ||
        filteredTouristAttractions.length > 0;

    // Gestion de l'ajout des données à Firestore (pour les admins)
    const handleAddDataToFirestore = useCallback(async () => {
        if (!language.id || !slug) {
            console.error('ID de langue ou slug de ville manquant.');
            alert('Impossible d\'ajouter les données. ID de langue ou slug de ville manquant.');
            return;
        }

        try {
            await fillUpCityFirestore(language.id, slug);
            // Après avoir ajouté les données à Firestore, vous pouvez recharger les places
            await fetchAllPlaces();
            alert('Données ajoutées avec succès à Firestore.');
        } catch (error) {
            console.error('Erreur lors de l\'ajout des données à Firestore:', error);
            alert('Erreur lors de l\'ajout des données à Firestore.');
        }
    }, [fillUpCityFirestore, language.id, slug, fetchAllPlaces, user]);

    return (
        <IonPage className={`city-page ${isFilterPanelOpen ? 'content-shift' : ''}`}>
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
                            {/* Bouton Filtrer */}
                            <IonButton className="filter-button" onClick={() => setIsFilterPanelOpen(true)} fill="clear">
                                <IonIcon icon={filterOutline} />
                            </IonButton>

                            {/* Bouton Créer Voyage */}
                            <IonButton onClick={() => setIsTripModalOpen(true)}>
                                ✈️ Je crée mon voyage !
                            </IonButton>

                            {user && user.admin === true ? (
                                <IonButton color="secondary" onClick={handleAddDataToFirestore}>
                                    Ajouter des données à Firestore
                                </IonButton>
                            ) : (
                                <p>Vous n'avez pas les droits nécessaires pour ajouter des données.</p>
                            )}
                        </div>


                        <AnimatePresence>
                            {isMobile ? (
                                <motion.div
                                    className={`filter-panel-mobile-container ${isFilterPanelOpen ? 'open' : 'hidden'}`}
                                    initial={{ opacity: 0, y: '-10%', visibility: 'hidden' }}
                                    animate={isFilterPanelOpen ? { opacity: 1, y: '0%', visibility: 'visible' } : {}}
                                    exit={{ opacity: 0, y: '-10%', visibility: 'hidden' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                >
                                    <FilterPlacesMobile
                                        categories={uniqueCategories}
                                        attributes={uniqueAttributes}
                                        allPlaces={allPlaces}
                                        languageID={language.id}
                                        onFilterChange={handleFilterChange}
                                        onClose={() => setIsFilterPanelOpen(false)}
                                        onUserInteractionChange={setIsUserInteracting}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    className={`filter-panel-container ${isFilterPanelOpen ? 'open' : 'hidden'}`}
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                >
                                    <FilterPlaces
                                        categories={uniqueCategories}
                                        attributes={uniqueAttributes}
                                        allPlaces={allPlaces}
                                        languageID={language.id}
                                        onFilterChange={handleFilterChange}
                                        onClose={() => setIsFilterPanelOpen(false)}
                                        onUserInteractionChange={setIsUserInteracting}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="city-content">
                            {haveInitialPlaces || !isUserInteracting ? (
                                <>
                                    {(filteredRestaurantsBars.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Restaurants & Bars"
                                            places={filteredRestaurantsBars}
                                            isPreview={isPreview}
                                            hasMore={hasMorePlaces.restaurant_bar}
                                            isLoading={isLoadingPlaces.restaurant_bar}
                                            isMobile={isMobile}
                                            placeType={PlaceType.RESTAURANT_BAR}
                                        />
                                    )}
                                    {(filteredHotels.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Hôtels"
                                            places={filteredHotels}
                                            isPreview={isPreview}
                                            hasMore={hasMorePlaces.hotel}
                                            isLoading={isLoadingPlaces.hotel}
                                            isMobile={isMobile}
                                            placeType={PlaceType.HOTEL}
                                        />
                                    )}
                                    {(filteredTouristAttractions.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Attractions Touristiques"
                                            places={filteredTouristAttractions}
                                            isPreview={isPreview}
                                            hasMore={hasMorePlaces.tourist_attraction}
                                            isLoading={isLoadingPlaces.tourist_attraction}
                                            isMobile={isMobile}
                                            placeType={PlaceType.TOURIST_ATTRACTION}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="no-results">
                                    <p>Oops, aucun résultat ne correspond ! 😕</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="loading">
                        <PlaceCarousel
                            title="Chargement des lieux"
                            places={[]}
                            isPreview={true}
                            hasMore={false}
                            isLoading={false}
                            isMobile={isMobile}
                            placeType={PlaceType.RESTAURANT_BAR}
                        />
                    </div>
                )}
                {/* 
                <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    <TripForm onClose={() => setIsTripModalOpen(false)} />
                </IonModal> */}
            </IonContent>
        </IonPage>
    )
}

export default City;
