// City.tsx
import React, { useEffect, useState } from 'react';
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
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
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
        console.log("City component rendu");
        if (slug && !didFetch && isLanguageLoaded) {
            console.log(`[City Component] Fetching city data for slug: ${slug}`);
            setCityPreviewAndFetchData(slug);
            setDidFetch(true);
        } else {
            console.log('[City Component] Waiting for language to load before fetching city data');
        }
    }, [slug, language.id, didFetch, isLanguageLoaded, setCityPreviewAndFetchData]);

    useEffect(() => {
        return () => {
            console.log('[City Component] Cleanup executed');
            resetCity();
        };
    }, [resetCity]);

    useIonViewWillLeave(() => {
        console.log('[City Component] IonViewWillLeave triggered');
        resetCity();
    });

    useEffect(() => {
        console.log(city)
    }, [city]);

    // Initialiser les lieux filtrés avec toutes les places
    useEffect(() => {
        if (city) {
            setFilteredRestaurantsBars(places.restaurantsBars);
            setFilteredHotels(places.hotels);
            setFilteredTouristAttractions(places.touristAttractions);
        }
    }, [city, places]);

    const handleFilterChange = (filteredPlaces: Place[]) => {
        // Séparer les lieux filtrés par type
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
    };

    const haveInitialPlaces =
        filteredRestaurantsBars.length > 0 ||
        filteredHotels.length > 0 ||
        filteredTouristAttractions.length > 0;

    // Extraire toutes les catégories et attributs disponibles
    const allCategories: Category[] = [
        ...places.restaurantsBars.flatMap(place => place.categories),
        ...places.hotels.flatMap(place => place.categories),
        ...places.touristAttractions.flatMap(place => place.categories),
    ];

    const allAttributes: Attribute[] = [
        ...places.restaurantsBars.flatMap(place => place.attributes),
        ...places.hotels.flatMap(place => place.attributes),
        ...places.touristAttractions.flatMap(place => place.attributes),
    ];

    // Éliminer les doublons
    const uniqueCategories = Array.from(new Map(allCategories.map(cat => [cat.id, cat])).values());
    const uniqueAttributes = Array.from(new Map(allAttributes.map(attr => [attr.id, attr])).values());

    return (
        <IonPage className={`city-page ${isFilterPanelOpen ? 'content-shift' : ''}`}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                        <IonButton onClick={() => setIsFilterPanelOpen(true)}>
                            🔍 Filtrer
                        </IonButton>
                        <IonButton onClick={() => setIsTripModalOpen(true)}>
                            ✈️ Je crée mon voyage !
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

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

                        {/* Panneau de Filtrage Coulissant */}
                        <AnimatePresence>
                            {isFilterPanelOpen && (
                                <motion.div
                                    className={`filter-panel-container ${isFilterPanelOpen ? 'open' : ''}`}
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                >
                                    <FilterPlaces
                                        categories={uniqueCategories}
                                        attributes={uniqueAttributes}
                                        allPlaces={[
                                            ...places.restaurantsBars,
                                            ...places.hotels,
                                            ...places.touristAttractions
                                        ]}
                                        languageID={language.id}
                                        onFilterChange={handleFilterChange}
                                        onClose={() => setIsFilterPanelOpen(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Overlay pour fermer le panneau en cliquant en dehors */}
                        <AnimatePresence>
                            {isFilterPanelOpen && (
                                <motion.div
                                    className={`overlay ${isFilterPanelOpen ? 'visible' : ''}`}
                                    onClick={() => setIsFilterPanelOpen(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Contenu Principal */}
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
                <IonModal isOpen={isTripModalOpen} onDidDismiss={() => setIsTripModalOpen(false)}>
                    {/* {isLanguageLoaded && city && 'lat' in city && (
                        <TripForm
                            languageCode={language.code}
                            city={city}
                            onClose={() => setIsTripModalOpen(false)}
                        />
                    )} */}
                </IonModal>
            </IonContent>
        </IonPage>
    );

};

export default City;
