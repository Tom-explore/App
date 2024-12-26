// src/pages/City.tsx

import React, { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Importez useLocation
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonItem,
} from '@ionic/react';
import { useCity, useFetchInitialPlaces } from '../context/cityContext';
import CityHeader from '../components/CityHeader';
import PlaceCarousel from '../components/PlaceCarousel';
import { useIonViewWillLeave } from '@ionic/react';
import { useLanguage } from '../context/languageContext';
import TripForm from '../components/TripForm';
import './City.css';
import { Place } from '../types/PlacesInterfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { filterOutline } from 'ionicons/icons';
import { useUser } from '../context/userContext';

const FilterPlaces = React.lazy(() => import('../components/FilterPlaces'));
const FilterPlacesMobile = React.lazy(() => import('../components/FilterPlacesMobile'));

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation(); // Utilisez useLocation pour accéder aux paramètres de requête
    const { user } = useUser();

    const { city, places, resetCity, isPreview, fetchAllPlaces, fillUpCityFirestore } = useCity();
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
    }, [fetchInitialPlaces, slug, isLanguageLoaded]);

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
    }, [fetchAllPlaces, city]);

    // Utilisation de useMemo pour calculer uniqueCategories et uniqueAttributes
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

    // Combinaison de toutes les places
    const allPlaces = useMemo(() => [
        ...places.restaurantsBars,
        ...places.hotels,
        ...places.touristAttractions
    ], [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const areSetsEqual = (setA: Set<number>, setB: Set<number>): boolean => {
        if (setA.size !== setB.size) return false;
        for (let item of setA) {
            if (!setB.has(item)) return false;
        }
        return true;
    };

    const handleFilterChange = useCallback((filteredPlaces: Place[]) => {
        console.log('Filtered Places:', filteredPlaces);
        const newIds = new Set(filteredPlaces.map(p => p.id));
        console.log('Filtered Place IDs:', newIds);

        setFilteredPlacesIDs(prevIds => {
            if (prevIds === null && newIds.size > 0) {
                return newIds;
            }
            if (prevIds && areSetsEqual(prevIds, newIds)) {
                return prevIds;
            }
            return newIds;
        });
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
    }, [fillUpCityFirestore, language.id, slug, fetchAllPlaces]);

    // Parsing des paramètres de l'URL et application des filtres si présents
    useEffect(() => {
        if (!city) return;

        const searchParams = new URLSearchParams(location.search);
        const attributeParams = searchParams.get('attributes');
        const categoryParams = searchParams.get('categories');

        // Si des attributs ou des catégories sont présents dans l'URL
        if (attributeParams && attributeParams.length > 0 ||
            categoryParams && categoryParams.length > 0
        ) {
            let filtered = allPlaces;

            // Filtrage par catégories
            if (categoryParams) {
                const categoryIds = categoryParams
                    .split(',')
                    .map(id => parseInt(id.trim(), 10))
                    .filter(id => !isNaN(id));
                if (categoryIds.length > 0) {
                    filtered = filtered.filter(place =>
                        place.categories.some(cat => categoryIds.includes(cat.id))
                    );
                }
            }

            // Filtrage par attributs
            if (attributeParams) {
                const attributeIds = attributeParams
                    .split(',')
                    .map(id => parseInt(id.trim(), 10))
                    .filter(id => !isNaN(id));
                if (attributeIds.length > 0) {
                    filtered = filtered.filter(place =>
                        place.attributes.some(attr => attributeIds.includes(attr.id))
                    );
                }
            }
            setFilteredPlacesIDs(new Set(filtered.map(place => place.id)));

            // Ouvrir le panneau de filtres
            setIsFilterPanelOpen(true);
        }
    }, [allPlaces]);

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
                            {isFilterPanelOpen && (
                                <Suspense fallback={<div>Chargement des filtres...</div>}>
                                    {isMobile ? (
                                        <motion.div
                                            className={`filter-panel-mobile-container open`}
                                            initial={{ opacity: 0, y: '-10%', visibility: 'hidden' }}
                                            animate={{ opacity: 1, y: '0%', visibility: 'visible' }}
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
                                            className={`filter-panel-container open`}
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
                                </Suspense>
                            )}
                        </AnimatePresence>

                        <div className="city-content">
                            {/* Affichage des carrousels filtrés */}
                            <>
                                {(isPreview) && (
                                    <PlaceCarousel
                                        title="Restaurants & Bars"
                                        places={filteredRestaurantsBars}
                                        isPreview={isPreview}
                                        isMobile={isMobile}
                                    />
                                )}
                                {(isPreview) && (
                                    <PlaceCarousel
                                        title="Hôtels"
                                        places={filteredHotels}
                                        isPreview={isPreview}
                                        isMobile={isMobile}
                                    />
                                )}
                                {(isPreview) && (
                                    <PlaceCarousel
                                        title="Attractions Touristiques"
                                        places={filteredTouristAttractions}
                                        isPreview={isPreview}
                                        isMobile={isMobile}
                                    />
                                )}
                            </>

                            {/* Affichage du message "no results" si aucun lieu ne correspond */}
                            {isFilterPanelOpen && haveInitialPlaces === false && (
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
                            isMobile={isMobile}
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
