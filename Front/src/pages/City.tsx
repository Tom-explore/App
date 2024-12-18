// src/pages/City.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonButton,
    IonModal,
} from '@ionic/react';
import { useCity, useFetchInitialPlaces, useFetchMorePlaces } from '../context/cityContext';
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
import { IonIcon } from '@ionic/react';
import { filterOutline } from 'ionicons/icons';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { city, places, resetCity, isPreview, hasMorePlaces, isLoadingPlaces } = useCity();
    const fetchInitialPlaces = useFetchInitialPlaces();
    const fetchMorePlaces = useFetchMorePlaces();
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    // State pour stocker les lieux filtrés sous forme d'IDs
    const [filteredPlacesIDs, setFilteredPlacesIDs] = useState<Set<number> | null>(null);

    // State for filter panel
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // New state to track user interaction
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // State to detect if the device is mobile
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Detect if the device is mobile on component mount
    useEffect(() => {
        const checkIsMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /iPhone|iPad|iPod|Android/i;
            setIsMobile(mobileRegex.test(userAgent));
        };
        checkIsMobile();
    }, []);

    // Fetch initial places when slug or language changes
    useEffect(() => {
        if (slug && isLanguageLoaded) {
            fetchInitialPlaces(slug);
        }
    }, [slug, isLanguageLoaded, fetchInitialPlaces]);

    // Reset city on component unmount
    useEffect(() => {
        return () => {
            resetCity();
        };
    }, [resetCity]);

    useIonViewWillLeave(() => {
        resetCity();
    });

    useEffect(() => {
        console.log(city);
    }, [city]);

    // Memoize allPlaces
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Memoize uniqueCategories
    const uniqueCategories = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Memoize uniqueAttributes
    const uniqueAttributes = useMemo(() => {
        const allAttributes = [
            ...places.restaurantsBars.flatMap(place => place.attributes),
            ...places.hotels.flatMap(place => place.attributes),
            ...places.touristAttractions.flatMap(place => place.attributes),
        ];
        return Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // handleFilterChange met à jour filteredPlacesIDs
    const handleFilterChange = useCallback((filteredPlaces: Place[]) => {
        const ids = new Set(filteredPlaces.map(p => p.id));
        setFilteredPlacesIDs(ids);
    }, []);

    // Si aucun filtre n'est appliqué (filteredPlacesIDs = null), on montre tout
    // Sinon, on filtre en fonction de filteredPlacesIDs
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

    // Définir les fonctions onLoadMore via useCallback
    const handleLoadMoreRestaurantsBars = useCallback(() => {
        fetchMorePlaces('restaurant_bar');
    }, [fetchMorePlaces]);

    const handleLoadMoreHotels = useCallback(() => {
        fetchMorePlaces('hotel');
    }, [fetchMorePlaces]);

    const handleLoadMoreTouristAttractions = useCallback(() => {
        fetchMorePlaces('tourist_attraction');
    }, [fetchMorePlaces]);

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

                        {/* Buttons below CityHeader */}
                        <div className="city-buttons">
                            <IonButton className="filter-button" onClick={() => setIsFilterPanelOpen(true)} fill="clear">
                                <IonIcon icon={filterOutline} />
                            </IonButton>
                            <IonButton onClick={() => setIsTripModalOpen(true)}>
                                ✈️ Je crée mon voyage !
                            </IonButton>
                        </div>

                        {/* Sliding Filter Panel */}
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
                                            onLoadMore={handleLoadMoreRestaurantsBars}
                                            hasMore={hasMorePlaces.restaurant_bar}
                                            isLoading={isLoadingPlaces.restaurant_bar}
                                        />
                                    )}
                                    {(filteredHotels.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Hôtels"
                                            places={filteredHotels}
                                            isPreview={isPreview}
                                            onLoadMore={handleLoadMoreHotels}
                                            hasMore={hasMorePlaces.hotel}
                                            isLoading={isLoadingPlaces.hotel}
                                        />
                                    )}
                                    {(filteredTouristAttractions.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Attractions Touristiques"
                                            places={filteredTouristAttractions}
                                            isPreview={isPreview}
                                            onLoadMore={handleLoadMoreTouristAttractions}
                                            hasMore={hasMorePlaces.tourist_attraction}
                                            isLoading={isLoadingPlaces.tourist_attraction}
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
                            onLoadMore={() => { }}
                            hasMore={false}
                            isLoading={false}
                        />
                    </div>
                )}

                {/* Modal for trip form */}
                <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    {/* 
                    {isLanguageLoaded && city && 'lat' in city && (
                        <TripForm
                            languageCode={language.code}
                            city={city}
                            onClose={() => setIsTripModalOpen(false)}
                        />
                    )} 
                    */}
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default City;
