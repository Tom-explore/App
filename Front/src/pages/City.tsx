// City.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonButton,
    IonModal,
} from '@ionic/react';
import { useCity } from '../context/cityContext';
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
    const { city, places, setCityPreviewAndFetchData, resetCity, isPreview } = useCity();
    const [didFetch, setDidFetch] = useState(false);
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    // States for filtering
    const [filteredRestaurantsBars, setFilteredRestaurantsBars] = useState<Place[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Place[]>([]);
    const [filteredTouristAttractions, setFilteredTouristAttractions] = useState<Place[]>([]);

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

        return () => {
            // Cleanup if necessary
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (slug && !didFetch && isLanguageLoaded) {
                await setCityPreviewAndFetchData(slug); // Assure que l'appel est terminé
                setDidFetch(true);
            }
        };

        fetchData();
    }, [slug, isLanguageLoaded, setCityPreviewAndFetchData]);
    const [isLoadingFinished, setIsLoadingFinished] = useState(false);

    useEffect(() => {
        if (didFetch) {
            setIsLoadingFinished(true); // Met à jour l'état local
        }
    }, [didFetch]);



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

    useEffect(() => {
        if (city && didFetch) {
            setFilteredRestaurantsBars(places.restaurantsBars);
            setFilteredHotels(places.hotels);
            setFilteredTouristAttractions(places.touristAttractions);
        }
    }, [city, places, didFetch]);


    // Memoize handleFilterChange with useCallback
    const handleFilterChange = useCallback((filteredPlaces: Place[]) => {
        const filteredRB: Place[] = [];
        const filteredH: Place[] = [];
        const filteredTA: Place[] = [];

        filteredPlaces.forEach(place => {
            if (places.restaurantsBars.some(rb => rb.id === place.id)) {
                filteredRB.push(place);
            }
            if (places.hotels.some(h => h.id === place.id)) {
                filteredH.push(place);
            }
            if (places.touristAttractions.some(ta => ta.id === place.id)) {
                filteredTA.push(place);
            }
        });

        setFilteredRestaurantsBars(filteredRB);
        setFilteredHotels(filteredH);
        setFilteredTouristAttractions(filteredTA);
    }, [places]);

    const haveInitialPlaces =
        filteredRestaurantsBars.length > 0 ||
        filteredHotels.length > 0 ||
        filteredTouristAttractions.length > 0;

    // Memoize allPlaces with useMemo
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Memoize uniqueCategories with useMemo
    const uniqueCategories = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Memoize uniqueAttributes with useMemo
    const uniqueAttributes = useMemo(() => {
        const allAttributes = [
            ...places.restaurantsBars.flatMap(place => place.attributes),
            ...places.hotels.flatMap(place => place.attributes),
            ...places.touristAttractions.flatMap(place => place.attributes),
        ];
        return Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

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
                            {(
                                isMobile ? (
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
                                )
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
                                        />
                                    )}
                                    {(filteredHotels.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Hôtels"
                                            places={filteredHotels}
                                            isPreview={isPreview}
                                        />
                                    )}
                                    {(filteredTouristAttractions.length > 0 || isPreview) && (
                                        <PlaceCarousel
                                            title="Attractions Touristiques"
                                            places={filteredTouristAttractions}
                                            isPreview={isPreview}
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
                            isPreview={true} // On affiche les skeletons puisqu'aucune data
                        />
                    </div>
                )}

                {/* Modal for trip form */}
                <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    {/* Uncomment and adjust as needed
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
};

export default City;
