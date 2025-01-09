// src/components/Feed.tsx

import React, {
    useEffect,
    useState,
    useMemo,
    useRef,
    useCallback,
    useLayoutEffect,
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
import { FixedSizeGrid as Grid } from 'react-window';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { chevronBackOutline, close as closeIcon } from 'ionicons/icons';
import { useCity } from '../context/cityContext';
import SearchBar from '../components/SearchBar';
import FeedCard from '../components/FeedCard';
import '../styles/pages/Feed.css';
import { Place } from '../types/PlacesInterfaces';
import { useLanguage } from '../context/languageContext';
import FilterPlaces from '../components/FilterPlaces';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
import useFilterPlaces from '../util/useFilterPlaces';
import { GeolocationContext } from '../context/geolocationContext';

const Feed: React.FC = () => {
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

    const allPlaces = useMemo(() => {
        return [
            ...places.restaurantsBars,
            // ...places.hotels,
            ...places.touristAttractions
        ];
    }, [
        places.restaurantsBars,
        places.touristAttractions
        // places.hotels, // if managing hotels
    ]);

    useEffect(() => {
        setFilteredPlaces(allPlaces);
    }, [allPlaces]);

    // Handle city selection based on URL slug or geolocation
    useEffect(() => {
        if (slug && !city) {
            console.log("[Feed] Setting city based on URL slug:", slug);
            setCityPreviewAndFetchData(slug);
        }
    }, [slug, city, setCityPreviewAndFetchData]);

    // Définir la ville basée sur la géolocalisation si activée
    useEffect(() => {
        if (!slug && isGeolocationEnabled && geolocation && !city) {
            console.log("[Feed] Setting city based on geolocation:", nearestCitySlug);
            if (nearestCitySlug) {
                setCityPreviewAndFetchData(nearestCitySlug);
            }
        }
    }, [slug, isGeolocationEnabled, geolocation, nearestCitySlug, city, setCityPreviewAndFetchData]);

    // Une fois la ville définie, fetch les lieux si ce n'est pas déjà fait
    useEffect(() => {
        if (city && !isAllPlacesLoaded) {
            console.log("[Feed] Fetching all places for city:", city.slug);
            fetchAllPlaces();
        }
    }, [city, isAllPlacesLoaded, fetchAllPlaces]);

    const sortedFilteredPlaces = useMemo(() => {
        let filtered = filteredPlaces.length > 0 ? filteredPlaces : allPlaces;
        if (searchQuery.trim() !== '') {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(place =>
                place.translation?.name.toLowerCase().includes(query) ||
                place.address.toLowerCase().includes(query)
            );
        }

        filtered = filtered.filter(place => (place.reviews_google_count || 0) >= 100);

        filtered.sort((a, b) => {
            if (b.reviews_google_rating !== a.reviews_google_rating) {
                return b.reviews_google_rating - a.reviews_google_rating;
            }
            return (b.reviews_google_count || 0) - (a.reviews_google_count || 0);
        });

        return filtered;
    }, [filteredPlaces, searchQuery, allPlaces]);

    // ----- Extraction des catégories & attributs -----
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

    // ----- Utilisation du hook personnalisé useFilterPlaces -----
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

    // ----- Détection du dispositif mobile -----
    const isMobile = useMemo(() => {
        if (typeof navigator === 'undefined') return false;
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        return /android|iPad|iPhone|iPod/i.test(userAgent);
    }, []);

    // ----- Layout avec react-window -----
    const COLUMN_COUNT = isMobile ? 1 : 2;
    const ITEM_HEIGHT = 450;
    const HORIZONTAL_GAP_PERCENT = 2;
    const VERTICAL_GAP_PERCENT = 120;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(300);
    const [containerHeight, setContainerHeight] = useState<number>(500);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0].contentRect) {
                const { width, height, top } = entries[0].contentRect;
                const newHeight = window.innerHeight - top - 20;
                setContainerHeight(newHeight > 0 ? newHeight : 500);
                setContainerWidth(width);
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const horizontalGap = useMemo(() => containerWidth * (HORIZONTAL_GAP_PERCENT / 100), [containerWidth]);
    const verticalGap = useMemo(() => containerWidth * (VERTICAL_GAP_PERCENT / 100), [containerWidth]);

    const ITEM_WIDTH = useMemo(() => (containerWidth - (COLUMN_COUNT - 1) * horizontalGap) / COLUMN_COUNT, [containerWidth, COLUMN_COUNT, horizontalGap]);
    const rowHeight = useMemo(() => ITEM_HEIGHT + verticalGap, [ITEM_HEIGHT, verticalGap]);
    const rowCount = useMemo(() => Math.ceil(sortedFilteredPlaces.length / COLUMN_COUNT), [sortedFilteredPlaces.length, COLUMN_COUNT]);
    const LIST_HEIGHT = useMemo(() => containerHeight, [containerHeight]);

    // Mémoïsation des fonctions de changement de filtre
    const memoizedHandleCategoryChange = useCallback((categoryId: number) => {
        handleCategoryChange(categoryId);
    }, [handleCategoryChange]);

    const memoizedHandleAttributeChange = useCallback((attributeId: number) => {
        handleAttributeChange(attributeId);
    }, [handleAttributeChange]);

    const memoizedGetTranslation = useCallback((slug: string, type: 'attributes' | 'categories') => {
        return getTranslation(slug, type);
    }, [getTranslation]);

    // Mémoïsation des filtres sélectionnés pour les passer en props
    const memoizedSelectedCategories = useMemo(() => selectedCategories, [selectedCategories]);
    const memoizedSelectedAttributes = useMemo(() => selectedAttributes, [selectedAttributes]);

    // Mémoïsation de la fonction Cell pour react-window
    const Cell = useCallback(({
        columnIndex,
        rowIndex,
        style
    }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
    }) => {
        const index = rowIndex * COLUMN_COUNT + columnIndex;
        if (index >= sortedFilteredPlaces.length) {
            return null;
        }
        const place = sortedFilteredPlaces[index];

        // Calculer la distance
        const distance = useMemo(() => (
            geolocation
                ? calculateDistanceFromPlace(geolocation, { lat: place.lat, lng: place.lng })
                : undefined
        ), [geolocation, place.lat, place.lng, calculateDistanceFromPlace]);

        return (
            <div
                style={{
                    ...style,
                    paddingRight: columnIndex < COLUMN_COUNT - 1 ? `${horizontalGap}px` : '0px',
                    paddingBottom: `${verticalGap}px`,
                    boxSizing: 'border-box'
                }}
            >
                <FeedCard
                    place={place}
                    selectedCategories={memoizedSelectedCategories}
                    selectedAttributes={memoizedSelectedAttributes}
                    handleCategoryChange={memoizedHandleCategoryChange}
                    handleAttributeChange={memoizedHandleAttributeChange}
                    getTranslation={memoizedGetTranslation}
                    distance={distance}
                />
            </div>
        );
    }, [
        COLUMN_COUNT,
        sortedFilteredPlaces,
        geolocation,
        calculateDistanceFromPlace,
        memoizedSelectedCategories,
        memoizedSelectedAttributes,
        memoizedHandleCategoryChange,
        memoizedHandleAttributeChange,
        memoizedGetTranslation,
        horizontalGap,
        verticalGap
    ]);

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
                    {!isMobile && (
                        <div className="filter-panel">
                            <FilterPlaces
                                categories={uniqueCategories}
                                attributes={uniqueAttributes}
                                selectedCategories={selectedCategories}
                                selectedAttributes={selectedAttributes}
                                handleCategoryChange={memoizedHandleCategoryChange}
                                handleAttributeChange={memoizedHandleAttributeChange}
                                getTranslation={memoizedGetTranslation}
                                onUserInteractionChange={setIsInteracting}
                            />
                        </div>
                    )}

                    <div className="main-content" ref={containerRef}>
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

                        <div className="grid-container">
                            {sortedFilteredPlaces.length > 0 ? (
                                <Grid
                                    className="no-scrollbar"
                                    columnCount={COLUMN_COUNT}
                                    columnWidth={ITEM_WIDTH}
                                    height={LIST_HEIGHT}
                                    rowCount={rowCount}
                                    rowHeight={rowHeight}
                                    width={containerWidth}
                                >
                                    {Cell}
                                </Grid>
                            ) : (
                                <div className="no-results">
                                    <p>Oops, aucun résultat ne correspond ! 😕</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );

};

export default Feed;
