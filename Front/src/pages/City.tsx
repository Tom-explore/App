// City.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonBackButton,
    IonButtons,
    IonToolbar,
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
import { AnimatePresence, motion } from 'framer-motion';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { city, places, setCityPreviewAndFetchData, resetCity } = useCity();
    const [didFetch, setDidFetch] = useState(false);
    const { isLanguageLoaded, language } = useLanguage();
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);

    // États pour le filtrage
    const [filteredRestaurantsBars, setFilteredRestaurantsBars] = useState<Place[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Place[]>([]);
    const [filteredTouristAttractions, setFilteredTouristAttractions] = useState<Place[]>([]);

    // État pour le panneau de filtrage
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    useEffect(() => {
        if (slug && !didFetch && isLanguageLoaded) {
            setCityPreviewAndFetchData(slug);
            setDidFetch(true);
        }
    }, [slug, language.id, didFetch, isLanguageLoaded, setCityPreviewAndFetchData]);

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

    // Initialiser les lieux filtrés avec toutes les places
    useEffect(() => {
        if (city) {
            setFilteredRestaurantsBars(places.restaurantsBars);
            setFilteredHotels(places.hotels);
            setFilteredTouristAttractions(places.touristAttractions);
        }
    }, [city, places]);

    // Mémoriser handleFilterChange avec useCallback
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

    // Mémoriser allPlaces avec useMemo
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Mémoriser uniqueCategories avec useMemo
    const uniqueCategories = useMemo(() => {
        const allCategories = [
            ...places.restaurantsBars.flatMap(place => place.categories),
            ...places.hotels.flatMap(place => place.categories),
            ...places.touristAttractions.flatMap(place => place.categories),
        ];
        return Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    // Mémoriser uniqueAttributes avec useMemo
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

                        {/* Boutons sous le CityHeader */}
                        <div className="city-buttons">
                            <IonButton onClick={() => setIsFilterPanelOpen(true)}>
                                🔍 Filtrer
                            </IonButton>
                            <IonButton onClick={() => setIsTripModalOpen(true)}>
                                ✈️ Je crée mon voyage !
                            </IonButton>
                        </div>

                        {/* Panneau de Filtrage Coulissant */}
                        <AnimatePresence>
                            <motion.div
                                className={`filter-panel-container ${isFilterPanelOpen ? 'open' : 'hidden'}`}
                                initial={false} // Évite l'animation initiale si inutile
                                animate={isFilterPanelOpen ? { x: 0 } : { x: '-100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                            >
                                <FilterPlaces
                                    categories={uniqueCategories}
                                    attributes={uniqueAttributes}
                                    allPlaces={allPlaces}
                                    languageID={language.id}
                                    onFilterChange={handleFilterChange}
                                    onClose={() => setIsFilterPanelOpen(false)}
                                />
                            </motion.div>
                        </AnimatePresence>



                        <div className="city-content">
                            <PlaceCarousel
                                title="Restaurants & Bars"
                                places={filteredRestaurantsBars}
                                loading={!haveInitialPlaces}
                            />
                            <PlaceCarousel
                                title="Hôtels"
                                places={filteredHotels}
                                loading={!haveInitialPlaces}
                            />
                            <PlaceCarousel
                                title="Attractions Touristiques"
                                places={filteredTouristAttractions}
                                loading={!haveInitialPlaces}
                            />
                        </div>
                    </>
                ) : (
                    <div className="loading">
                        <PlaceCarousel title="Chargement des lieux" places={[]} loading={true} />
                    </div>
                )}

                {/* Modal pour le formulaire de voyage */}
                {/* <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    {isLanguageLoaded && city && 'lat' in city && (
                        <TripForm
                            languageCode={language.code}
                            city={city}
                            onClose={() => setIsTripModalOpen(false)}
                        />
                    )}
                </IonModal> */}
            </IonContent>
        </IonPage>
    );
};

export default City;
