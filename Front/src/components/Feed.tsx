// src/components/Feed.tsx

import React, { useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Place } from '../types/PlacesInterfaces';
import FeedCard from './FeedCard';
import '../styles/components/Feed.css';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
interface Coordinates {
    lat: number;
    lng: number;
}
interface FeedProps {
    places: Place[];
    selectedCategories: number[];
    selectedAttributes: number[];
    handleCategoryChange: (id: number) => void;
    handleAttributeChange: (id: number) => void;
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;
    calculateDistanceFromPlace: (coord1: Coordinates, coord2: Coordinates) => number;
    geolocation: Coordinates | null;
    uniqueCategories: Category[];
    uniqueAttributes: Attribute[];
    isMobile: boolean;
}

const Feed: React.FC<FeedProps> = ({
    places,
    selectedCategories,
    selectedAttributes,
    handleCategoryChange,
    handleAttributeChange,
    getTranslation,
    calculateDistanceFromPlace,
    geolocation,
    isMobile
}) => {
    // Layout avec react-window
    const COLUMN_COUNT = isMobile ? 1 : 2;
    const ITEM_HEIGHT = 450;
    const HORIZONTAL_GAP_PERCENT = 2;
    const VERTICAL_GAP_PERCENT = 120;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState<number>(300);
    const [containerHeight, setContainerHeight] = React.useState<number>(500);

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
    const rowCount = useMemo(() => Math.ceil(places.length / COLUMN_COUNT), [places.length, COLUMN_COUNT]);
    const LIST_HEIGHT = useMemo(() => containerHeight, [containerHeight]);
    const sortedPlaces = useMemo(() => {
        return [...places].sort((a, b) => {
            const aCategoryMatches = a.categories.filter(cat => selectedCategories.includes(cat.id)).length;
            const bCategoryMatches = b.categories.filter(cat => selectedCategories.includes(cat.id)).length;
            const aAttributeMatches = a.attributes.filter(attr => selectedAttributes.includes(attr.id)).length;
            const bAttributeMatches = b.attributes.filter(attr => selectedAttributes.includes(attr.id)).length;

            // Prioriser par correspondance (catégories et attributs)
            const aTotalMatches = aCategoryMatches + aAttributeMatches;
            const bTotalMatches = bCategoryMatches + bAttributeMatches;

            return bTotalMatches - aTotalMatches; // Plus de correspondances en premier
        });
    }, [places, selectedCategories, selectedAttributes]);
    // Mémoïsation des fonctions de changement de filtre
    const memoizedHandleCategoryChange = useCallback((categoryId: number) => {
        handleCategoryChange(categoryId);
    }, [handleCategoryChange]);

    const memoizedHandleAttributeChange = useCallback((attributeId: number) => {
        handleAttributeChange(attributeId);
    }, [handleAttributeChange]);

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
        if (index >= places.length) {
            return null;
        }
        const place = places[index];

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
                    getTranslation={getTranslation}
                    distance={distance}
                />
            </div>
        );
    }, [
        COLUMN_COUNT,
        places,
        geolocation,
        calculateDistanceFromPlace,
        memoizedSelectedCategories,
        memoizedSelectedAttributes,
        memoizedHandleCategoryChange,
        memoizedHandleAttributeChange,
        getTranslation,
        horizontalGap,
        verticalGap
    ]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {places.length > 0 ? (
                <Grid
                    className="no-scrollbar"
                    columnCount={COLUMN_COUNT}
                    columnWidth={ITEM_WIDTH}
                    height={LIST_HEIGHT}
                    rowCount={rowCount}
                    rowHeight={rowHeight}
                    width={containerWidth}
                >
                    {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * COLUMN_COUNT + columnIndex;
                        if (index >= sortedPlaces.length) return null;

                        const place = sortedPlaces[index];
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
                                    distance={
                                        geolocation
                                            ? calculateDistanceFromPlace(geolocation, { lat: place.lat, lng: place.lng })
                                            : undefined
                                    }
                                />
                            </div>
                        );
                    }}
                </Grid>
            ) : (
                <div className="no-results">
                    <p>Oops, aucun résultat ne correspond ! 😕</p>
                </div>
            )}
        </div>
    );
};

export default React.memo(Feed);
