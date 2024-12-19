// src/pages/City.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import { PlaceType } from '../types/EnumsInterfaces';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hasCategoriesParam = queryParams.has('categories');
    const hasAttributesParam = queryParams.has('attributes');

    const { city, places, resetCity, isPreview, hasMorePlaces, isLoadingPlaces, fetchAllPlaces } = useCity();
    const fetchInitialPlaces = useFetchInitialPlaces();
    const fetchMorePlaces = useFetchMorePlaces();
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    const [filteredPlacesIDs, setFilteredPlacesIDs] = useState<Set<number> | null>(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Counter for tracking fetch more places calls
    const [fetchCounter, setFetchCounter] = useState(0);

    useEffect(() => {
        const checkIsMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const mobileRegex = /iPhone|iPad|iPod|Android/i;
            setIsMobile(mobileRegex.test(userAgent));
        };
        checkIsMobile();
    }, []);

    useEffect(() => {
        if (slug && isLanguageLoaded) {
            fetchInitialPlaces(slug);
        }
    }, [slug, isLanguageLoaded, fetchInitialPlaces]);

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

    // Once initial places are loaded (isPreview = false) and city is available,
    // if there are 'categories' or 'attributes' parameters, load all remaining in one call.
    useEffect(() => {
        if (city && !isPreview && (hasCategoriesParam || hasAttributesParam)) {
            // Load all places at once
            fetchAllPlaces();
        }
    }, [city, isPreview, hasCategoriesParam, hasAttributesParam, fetchAllPlaces]);

    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const uniqueCategories = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const uniqueAttributes = useMemo(() => {
        const allAttributes = [
            ...places.restaurantsBars.flatMap(place => place.attributes),
            ...places.hotels.flatMap(place => place.attributes),
            ...places.touristAttractions.flatMap(place => place.attributes),
        ];
        return Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const handleFilterChange = useCallback((filteredPlaces: Place[]) => {
        const ids = new Set(filteredPlaces.map(p => p.id));
        setFilteredPlacesIDs(ids);
    }, []);

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

    const handleLoadMoreRestaurantsBars = useCallback(() => {
        setFetchCounter(prev => prev + 1);
        console.log(`Fetching more restaurants/bars... Call #${fetchCounter + 1}`);
        // If no categories/attributes params, continue loading by 8
        if (!hasCategoriesParam && !hasAttributesParam) {
            fetchMorePlaces('restaurant_bar');
        }
    }, [fetchMorePlaces, fetchCounter, hasCategoriesParam, hasAttributesParam]);

    const handleLoadMoreHotels = useCallback(() => {
        setFetchCounter(prev => prev + 1);
        console.log(`Fetching more hotels... Call #${fetchCounter + 1}`);
        if (!hasCategoriesParam && !hasAttributesParam) {
            fetchMorePlaces('hotel');
        }
    }, [fetchMorePlaces, fetchCounter, hasCategoriesParam, hasAttributesParam]);

    const handleLoadMoreTouristAttractions = useCallback(() => {
        setFetchCounter(prev => prev + 1);
        console.log(`Fetching more tourist attractions... Call #${fetchCounter + 1}`);
        if (!hasCategoriesParam && !hasAttributesParam) {
            fetchMorePlaces('tourist_attraction');
        }
    }, [fetchMorePlaces, fetchCounter, hasCategoriesParam, hasAttributesParam]);

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
                            <IonButton className="filter-button" onClick={() => setIsFilterPanelOpen(true)} fill="clear">
                                <IonIcon icon={filterOutline} />
                            </IonButton>
                            <IonButton onClick={() => setIsTripModalOpen(true)}>
                                ✈️ Je crée mon voyage !
                            </IonButton>
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
                                            onLoadMore={handleLoadMoreRestaurantsBars}
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
                                            onLoadMore={handleLoadMoreHotels}
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
                                            onLoadMore={handleLoadMoreTouristAttractions}
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
                            onLoadMore={() => { }}
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
