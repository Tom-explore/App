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
    IonSpinner,
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
        loading: geoLoading,
        error: geoError,
        requestIPGeolocation,
        requestBrowserGeolocation,
        disableBrowserGeolocation,
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

    // 1. Handle city selection based on URL slug or geolocation
    useEffect(() => {
        if (slug && !city) {
            console.log("[Feed] Setting city based on URL slug:", slug);
            setCityPreviewAndFetchData(slug);
        }
    }, [slug, city, setCityPreviewAndFetchData]);

    // 2. If no slug is provided, use geolocation to determine the city
    useEffect(() => {
        if (!slug) {
            console.log("[Feed] No slug provided, determining city based on geolocation.");
            if (geoLoading) {
                console.log("[Feed] Geolocation is still loading.");
                return;
            }
            if (geoError) {
                console.error('[Feed] Geolocation error:', geoError);
                return;
            }
            if (nearestCitySlug && !city) {
                console.log("[Feed] Setting city based on geolocation:", nearestCitySlug);
                setCityPreviewAndFetchData(nearestCitySlug);
            } else if (!nearestCitySlug && !geoLoading && !geoError) {
                console.warn('[Feed] Nearest city slug is not available.');
            }
        }
    }, [slug, geoLoading, geoError, nearestCitySlug, setCityPreviewAndFetchData, city]);

    // 3. Once the city is defined, fetch all places if not already loaded
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

    // ----- Extract categories & attributes -----
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

    // ----- Use the custom useFilterPlaces hook -----
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

    // ----- Layout with react-window -----
    const COLUMN_COUNT = 2;
    const ITEM_HEIGHT = 450;
    const HORIZONTAL_GAP_PERCENT = 2;
    const VERTICAL_GAP_PERCENT = 2;

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

    const horizontalGap = containerWidth * (HORIZONTAL_GAP_PERCENT / 100);
    const verticalGap = containerWidth * (VERTICAL_GAP_PERCENT / 100);

    const ITEM_WIDTH = (containerWidth - (COLUMN_COUNT - 1) * horizontalGap) / COLUMN_COUNT;
    const rowHeight = ITEM_HEIGHT + verticalGap;
    const rowCount = Math.ceil(sortedFilteredPlaces.length / COLUMN_COUNT);
    const LIST_HEIGHT = containerHeight;

    const Cell = ({
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
                    selectedCategories={selectedCategories}
                    selectedAttributes={selectedAttributes}
                    handleCategoryChange={handleCategoryChange}
                    handleAttributeChange={handleAttributeChange}
                    getTranslation={getTranslation}
                />
            </div>
        );
    };

    // Helper to get city name with translation if available
    const getCityName = (): string => {
        if (city && 'translation' in city && city.translation?.name) {
            console.log("récup city name");
            return city.translation.name;
        } else if (city && 'name' in city) {
            return city.name;
        }
        return '';
    };

    // Using useMemo instead of useEffect and state for cityName
    const cityName = useMemo(() => {
        const name = getCityName();
        console.log('Computed cityName:', name);
        return name;
    }, [city]);

    // Handlers for Geolocation Buttons
    const handleEnableGeolocation = () => {
        requestBrowserGeolocation();
    };

    const handleDisableGeolocation = () => {
        disableBrowserGeolocation();
    };

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
                {/* Display loading indicator if determining location */}
                {(geoLoading) && (
                    <div className="loading-geolocation">
                        <IonSpinner name="crescent" />
                        <p>Détermination de votre localisation...</p>
                    </div>
                )}

                {/* Handle geolocation error */}
                {(geoError) && (
                    <div className="geolocation-error">
                        <p>Impossible de déterminer votre localisation. Veuillez réessayer.</p>
                        <IonButton onClick={requestIPGeolocation} disabled={geoLoading}>
                            Réessayer la géolocalisation par IP
                        </IonButton>
                    </div>
                )}

                {/* Informational Text and Geolocation Buttons */}
                {(!slug && city) && (
                    <div className="info-geolocation">
                        <p>Découvertes à {cityName}</p>
                        {!isGeolocationEnabled ? (
                            <IonButton
                                onClick={handleEnableGeolocation}
                                disabled={geoLoading}
                                className="geolocation-button"
                            >
                                {geoLoading ? <IonSpinner name="crescent" /> : "Pour vous aiguiller plus précisément, pensez à activer la géolocalisation !"}
                            </IonButton>
                        ) : (
                            <IonButton
                                onClick={handleDisableGeolocation}
                                disabled={geoLoading}
                                className="geolocation-button"
                                color="danger"
                            >
                                {geoLoading ? <IonSpinner name="crescent" /> : "Désactiver la géolocalisation"}
                            </IonButton>
                        )}
                    </div>
                )}

                <div className="feed-layout">
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
                {isInteracting && (
                    <div className="loading-overlay">
                        <IonSpinner name="crescent" />
                    </div>
                )}
            </IonContent>
        </IonPage>
    );

};

export default Feed;
