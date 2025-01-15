// src/pages/FeedMapDisplay.tsx

import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useContext
} from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel
} from '@ionic/react';
import { chevronBackOutline, close as closeIcon } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { useCity } from '../context/cityContext';
import SearchBar from '../components/SearchBar';
import Feed from '../components/Feed';
import { Place } from '../types/PlacesInterfaces';
import { useLanguage } from '../context/languageContext';
import FilterPlaces from '../components/FilterPlaces';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
import useFilterPlaces from '../util/useFilterPlaces';
import { GeolocationContext } from '../context/geolocationContext';
import SwitchMapList from '../components/SwitchMapList';
import MapPlacesDisplay from '../components/MapPlaceDisplay';

const FeedMapDisplay: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const router = useIonRouter();

    const {
        nearestCitySlug,
        geolocation,
        isGeolocationEnabled,
        error: geoError,
        requestBrowserGeolocation,
        disableBrowserGeolocation,
        calculateDistanceFromPlace,
    } = useContext(GeolocationContext);

    const {
        places,
        fetchAllPlaces,
        setCityPreviewAndFetchData,
        city,
        isAllPlacesLoaded
    } = useCity();

    const { language } = useLanguage();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
    const [isInteracting, setIsInteracting] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // État pour le mode de vue

    const allPlaces = useMemo(() => {
        const combinedPlaces = [
            ...places.restaurantsBars,
            // ...places.hotels, // Décommentez si vous gérez les hôtels
            ...places.touristAttractions
        ].filter(place =>
            place != null &&
            place.reviews_google_count !== undefined &&
            place.reviews_google_count !== null &&
            place.lat !== undefined &&
            place.lng !== undefined
        ); // Filtrage renforcé

        console.log("[FeedMapDisplay] allPlaces after filtering:", combinedPlaces.length);
        return combinedPlaces;
    }, [
        places.restaurantsBars,
        places.touristAttractions
        // places.hotels, // Décommentez si vous gérez les hôtels
    ]);

    // Initialiser les places filtrées avec toutes les places
    useEffect(() => {
        console.log("[FeedMapDisplay] Setting filteredPlaces with allPlaces:", allPlaces.length);
        setFilteredPlaces(allPlaces);
    }, [allPlaces]);

    // Gestion de la sélection de la ville basée sur le slug ou la géolocalisation
    useEffect(() => {
        if (slug && !city) {
            console.log("[FeedMapDisplay] Setting city based on URL slug:", slug);
            setCityPreviewAndFetchData(slug);
        }
    }, [slug, city, setCityPreviewAndFetchData]);

    // Définir la ville basée sur la géolocalisation si activée
    useEffect(() => {
        if (!slug && isGeolocationEnabled && geolocation && !city) {
            console.log("[FeedMapDisplay] Setting city based on geolocation:", nearestCitySlug);
            if (nearestCitySlug) {
                setCityPreviewAndFetchData(nearestCitySlug);
            }
        }
    }, [slug, isGeolocationEnabled, geolocation, nearestCitySlug, city, setCityPreviewAndFetchData]);

    // Fetch les lieux une fois la ville définie
    useEffect(() => {
        if (city && !isAllPlacesLoaded) {
            console.log("[FeedMapDisplay] Fetching all places for city:", city.slug);
            fetchAllPlaces();
        }
    }, [city, isAllPlacesLoaded, fetchAllPlaces]);

    // Extraction des catégories & attributs uniques
    const uniqueCategories = useMemo(() => {
        const categoriesMap = new Map<number, Category>();
        allPlaces.forEach(place => {
            place.categories.forEach(category => {
                if (!categoriesMap.has(category.id)) {
                    categoriesMap.set(category.id, category);
                }
            });
        });
        return Array.from(categoriesMap.values());
    }, [allPlaces]);

    const uniqueAttributes = useMemo(() => {
        const attributesMap = new Map<number, Attribute>();
        allPlaces.forEach(place => {
            place.attributes.forEach(attribute => {
                if (!attributesMap.has(attribute.id)) {
                    attributesMap.set(attribute.id, attribute);
                }
            });
        });
        return Array.from(attributesMap.values());
    }, [allPlaces]);

    // Utilisation du hook personnalisé useFilterPlaces pour gérer les filtres
    const {
        selectedCategories,
        selectedAttributes,
        handleCategoryChange,
        handleAttributeChange,
        getTranslation,
        isUserInteraction
    } = useFilterPlaces({
        categories: uniqueCategories,
        attributes: uniqueAttributes,
        onFilterChange: setFilteredPlaces,
        languageID: language.id,
        allPlaces: allPlaces
    });

    // Détection du dispositif mobile
    const isMobile = useMemo(() => {
        if (typeof navigator === 'undefined') return false;
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        return /android|iPad|iPhone|iPod/i.test(userAgent);
    }, []);

    // Logique de recherche et de tri
    const sortedFilteredPlaces = useMemo(() => {
        let filtered = filteredPlaces.length > 0 ? filteredPlaces : allPlaces;

        // Filtrage par requête de recherche
        if (searchQuery.trim() !== '') {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(place =>
                place.translation?.name.toLowerCase().includes(query) ||
                place.address.toLowerCase().includes(query)
            );
        }

        // Filtrage par nombre minimum de reviews
        filtered = filtered.filter(place => (place.reviews_google_count || 0) >= 100);

        // Tri par nombre de reviews_count en ordre décroissant
        filtered.sort((a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0));

        console.log("[FeedMapDisplay] sortedFilteredPlaces:", filtered.length);
        return filtered;
    }, [filteredPlaces, searchQuery, allPlaces]);

    // Helper pour obtenir le nom de la ville avec traduction si disponible
    const getCityName = useCallback((): string => {
        if (city && 'translation' in city && city.translation?.name) {
            console.log("récup city name");
            return city.translation.name;
        } else if (city && 'name' in city) {
            return city.name;
        }
        return '';
    }, [city]);

    // Utilisation de useMemo au lieu de useEffect et state pour cityName
    const cityName = useMemo(() => {
        const name = getCityName();
        console.log('Computed cityName:', name);
        return name;
    }, [getCityName]);

    // Handlers pour les boutons de géolocalisation
    const handleEnableGeolocation = useCallback(() => {
        requestBrowserGeolocation();
    }, [requestBrowserGeolocation]);

    const handleDisableGeolocation = useCallback(() => {
        disableBrowserGeolocation();
        // Optionnel : réinitialiser les filtres ou la ville si nécessaire
    }, [disableBrowserGeolocation]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => router.goBack()}>
                            <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Feed</IonTitle>
                    <IonButtons slot="end">
                        <SwitchMapList currentMode={viewMode} onSwitch={setViewMode} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-no-padding">
                {/* Texte informatif et bouton de géolocalisation */}
                {!slug && city && (
                    <div className="info-geolocation">
                        <p>Découvertes à {cityName}</p>
                        {!isGeolocationEnabled ? (
                            <IonButton
                                onClick={handleEnableGeolocation}
                                className="geolocation-button"
                            >
                                Activer la géolocalisation
                            </IonButton>
                        ) : (
                            <IonButton
                                onClick={handleDisableGeolocation}
                                className="geolocation-button"
                                color="danger"
                            >
                                Désactiver la géolocalisation
                            </IonButton>
                        )}
                        {geoError && (
                            <div className="geolocation-error">
                                <p>{geoError}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Afficher un bouton pour activer la géolocalisation si aucune ville n'est définie */}
                {!slug && !city && (
                    <div className="info-geolocation">
                        <p>Découvrez des lieux près de vous.</p>
                        <IonButton
                            onClick={handleEnableGeolocation}
                            className="geolocation-button"
                        >
                            Activer la géolocalisation
                        </IonButton>
                        {geoError && (
                            <div className="geolocation-error">
                                <p>{geoError}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="feed-layout">
                    {/* Panneau de filtres centralisé */}
                    {!isMobile && (
                        <div className="filter-panel">
                            <FilterPlaces
                                categories={uniqueCategories}
                                attributes={uniqueAttributes}
                                selectedCategories={selectedCategories}
                                selectedAttributes={selectedAttributes}
                                handleCategoryChange={handleCategoryChange}
                                handleAttributeChange={handleAttributeChange}
                                getTranslation={getTranslation}
                                onUserInteractionChange={setIsInteracting}
                            />
                        </div>
                    )}

                    <div className="main-content">
                        <div className="search-bar-container">
                            <SearchBar
                                onSearch={setSearchQuery}
                                placeholder="Rechercher un lieu"
                            />
                        </div>

                        {/* Section des filtres sélectionnés */}
                        {(selectedCategories.length > 0 || selectedAttributes.length > 0) && (
                            <div className="selected-filters">
                                {selectedCategories.map((categoryId: number) => {
                                    const category = uniqueCategories.find(cat => cat.id === categoryId);
                                    return category ? (
                                        <IonChip
                                            key={`category-${category.id}`}
                                            color="secondary"
                                            onClick={() => handleCategoryChange(category.id)}
                                            className="selected-chip"
                                        >
                                            <IonLabel>{getTranslation(category.slug, 'categories')}</IonLabel>
                                            <IonIcon icon={closeIcon} />
                                        </IonChip>
                                    ) : null;
                                })}
                                {selectedAttributes.map((attributeId: number) => {
                                    const attribute = uniqueAttributes.find(attr => attr.id === attributeId);
                                    return attribute ? (
                                        <IonChip
                                            key={`attribute-${attribute.id}`}
                                            color="primary"
                                            onClick={() => handleAttributeChange(attribute.id)}
                                            className="selected-chip"
                                        >
                                            <IonLabel>{getTranslation(attribute.slug, 'attributes')}</IonLabel>
                                            <IonIcon icon={closeIcon} />
                                        </IonChip>
                                    ) : null;
                                })}
                            </div>
                        )}

                        <div className="view-mode-container">
                            {viewMode === 'list' ? (
                                <Feed
                                    places={sortedFilteredPlaces}
                                    selectedCategories={selectedCategories}
                                    selectedAttributes={selectedAttributes}
                                    handleCategoryChange={handleCategoryChange}
                                    handleAttributeChange={handleAttributeChange}
                                    getTranslation={getTranslation}
                                    calculateDistanceFromPlace={calculateDistanceFromPlace}
                                    geolocation={geolocation}
                                    uniqueCategories={uniqueCategories}
                                    uniqueAttributes={uniqueAttributes}
                                    isMobile={isMobile}
                                />
                            ) : (
                                <MapPlacesDisplay
                                    places={sortedFilteredPlaces}
                                    categories={uniqueCategories}
                                    attributes={uniqueAttributes}
                                    // Passer les mêmes props de filtre si nécessaire
                                    selectedCategories={selectedCategories}
                                    selectedAttributes={selectedAttributes}
                                    handleCategoryChange={handleCategoryChange}
                                    handleAttributeChange={handleAttributeChange}
                                    getTranslation={getTranslation}
                                />
                            )}
                        </div>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );

};

export default React.memo(FeedMapDisplay);
