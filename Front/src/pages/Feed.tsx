// src/pages/Feed.tsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
} from '@ionic/react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { chevronBackOutline } from 'ionicons/icons';
import { useCity } from '../context/cityContext';
import SearchBar from '../components/SearchBar';
import FeedCard from '../components/FeedCard';
import '../styles/pages/Feed.css';
import { Place } from '../types/PlacesInterfaces';
import { useLanguage } from '../context/languageContext';

const Feed: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const router = useIonRouter();

    const {
        places,
        fetchAllPlaces,
        setCityPreviewAndFetchData,
        city,
    } = useCity();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);

    const calculateScore = (rating: number, reviewCount: number): number => {
        return rating * Math.log10(reviewCount + 1);
    };

    const allPlaces = useMemo(() => {
        return [
            ...places.restaurantsBars,
            ...places.hotels,
            ...places.touristAttractions
        ];
    }, [places.restaurantsBars, places.hotels, places.touristAttractions]);

    const ensureDiversity = (sortedPlaces: Place[], maxConsecutive: number = 3): Place[] => {
        const result: Place[] = [];
        const typeCounters: { [key: string]: number } = {};
        const typeQueues: { [key: string]: Place[] } = {};

        sortedPlaces.forEach(place => {
            if (!typeQueues[place.placeType]) {
                typeQueues[place.placeType] = [];
            }
            typeQueues[place.placeType].push(place);
        });

        const placeTypes = Object.keys(typeQueues);

        while (result.length < sortedPlaces.length) {
            let added = false;

            for (const type of placeTypes) {
                if ((typeCounters[type] || 0) < maxConsecutive && typeQueues[type].length > 0) {
                    result.push(typeQueues[type].shift()!);
                    typeCounters[type] = (typeCounters[type] || 0) + 1;

                    for (const otherType of placeTypes) {
                        if (otherType !== type) {
                            typeCounters[otherType] = 0;
                        }
                    }
                    added = true;
                    break;
                }
            }

            if (!added) {
                for (const type of placeTypes) {
                    if (typeQueues[type].length > 0) {
                        result.push(typeQueues[type].shift()!);
                        typeCounters[type] = (typeCounters[type] || 0) + 1;

                        for (const otherType of placeTypes) {
                            if (otherType !== type) {
                                typeCounters[otherType] = 0;
                            }
                        }
                        added = true;
                        break;
                    }
                }

                if (!added) {
                    break;
                }
            }
        }

        return result;
    };

    const sortedFilteredPlaces = useMemo(() => {
        let filtered = allPlaces;

        if (searchQuery.trim() !== '') {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(place =>
                place.translation?.name.toLowerCase().includes(query) ||
                place.address.toLowerCase().includes(query)
            );
        }

        const scoredPlaces = filtered.map(place => ({
            ...place,
            score: calculateScore(place.reviews_google_rating, place.reviews_google_count)
        }));

        scoredPlaces.sort((a, b) => b.score - a.score);

        const diversePlaces = ensureDiversity(scoredPlaces);

        return diversePlaces;
    }, [allPlaces, searchQuery]);

    useEffect(() => {
        setDisplayedPlaces(sortedFilteredPlaces);
    }, [sortedFilteredPlaces]);

    useEffect(() => {
        if (slug) {
            setCityPreviewAndFetchData(slug);
        }
    }, [setCityPreviewAndFetchData, slug]);

    useEffect(() => {
        if (city) {
            fetchAllPlaces();
        }
    }, [fetchAllPlaces, city]);

    const COLUMN_COUNT = 2;
    const ITEM_HEIGHT = 320; // Ajusté pour correspondre à la hauteur maximale de la carte
    const HORIZONTAL_GAP_PERCENT = 2;
    const VERTICAL_GAP_PERCENT = 2;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(window.innerWidth);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const newHeight = window.innerHeight - rect.top - 20; // Ajustez 20 selon vos marges
                setContainerHeight(newHeight > 0 ? newHeight : 500); // Valeur par défaut si négatif
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculer la largeur de chaque colonne
    const horizontalGap = containerWidth * (HORIZONTAL_GAP_PERCENT / 100);
    const verticalGap = containerWidth * (VERTICAL_GAP_PERCENT / 100);

    // Calculer la largeur de chaque colonne
    const ITEM_WIDTH = (containerWidth - (COLUMN_COUNT - 1) * horizontalGap) / COLUMN_COUNT;

    // Calculer la hauteur totale de chaque rangée incluant l'espacement vertical
    const rowHeight = ITEM_HEIGHT + verticalGap;

    // Calculer le nombre de rangées
    const rowCount = Math.ceil(displayedPlaces.length / COLUMN_COUNT);

    // Hauteur du Grid
    const LIST_HEIGHT = containerHeight;

    const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
        const index = rowIndex * COLUMN_COUNT + columnIndex;
        if (index >= displayedPlaces.length) {
            return null;
        }
        const place = displayedPlaces[index];
        return (
            <div
                style={{
                    ...style,
                    paddingRight: columnIndex < COLUMN_COUNT - 1 ? `${horizontalGap}px` : '0px',
                    paddingBottom: `${verticalGap}px`,
                    boxSizing: 'border-box'
                }}
            >
                <FeedCard place={place} />
            </div>
        );
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
                <div className="feed-container" ref={containerRef}>
                    <div className="search-bar-container">
                        <SearchBar onSearch={setSearchQuery} placeholder="Rechercher un lieu" />
                    </div>

                    <div className="grid-container">
                        {displayedPlaces.length > 0 ? (
                            <Grid
                                className="no-scrollbar" // Ajoutez cette classe pour masquer la scrollbar
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
            </IonContent>
        </IonPage>
    );
};

export default Feed;
