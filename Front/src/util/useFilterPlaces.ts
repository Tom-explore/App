// src/hooks/useFilterPlaces.ts

import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
import { Place } from '../types/PlacesInterfaces';
import data from '../data/categoriesAttributes.json';

interface UseFilterPlacesProps {
    categories: Category[];
    attributes: Attribute[];
    onFilterChange: (filteredPlaces: Place[]) => void;
    languageID: number;
    allPlaces: Place[];
}

const useFilterPlaces = ({
    categories,
    attributes,
    onFilterChange,
    languageID,
    allPlaces,
}: UseFilterPlacesProps) => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
    const history = useHistory();
    const location = useLocation();
    const [isInitialized, setIsInitialized] = useState(false);
    const [isUserInteraction, setIsUserInteraction] = useState(false);

    const getTranslation = useCallback(
        (slug: string, type: 'attributes' | 'categories'): string => {
            const items = data[type];
            const item = items.find((el: any) => el.slug === slug);

            if (!item || !item.translations) {
                console.warn(`No ${type.slice(0, -1)} found for slug "${slug}"`);
                return `No ${type.slice(0, -1)} found for slug "${slug}"`;
            }

            const translation = item.translations.find((t: any) => t.language_id === languageID);
            if (!translation) {
                console.warn(`No translation for "${slug}" in language ${languageID}`);
                return `No translation for "${slug}" in language ${languageID}`;
            }

            return translation.name;
        },
        [languageID]
    );

    // Charger les filtres depuis l'URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const categorySlugs = params.get('categories');
        const attributeSlugs = params.get('attributes');

        if (categorySlugs) {
            setSelectedCategories(
                categorySlugs
                    .split(',')
                    .map(slug => categories.find(cat => cat.slug === slug)?.id)
                    .filter((id): id is number => id !== null && id !== undefined)
            );
        }

        if (attributeSlugs) {
            setSelectedAttributes(
                attributeSlugs
                    .split(',')
                    .map(slug => attributes.find(attr => attr.slug === slug)?.id)
                    .filter((id): id is number => id !== null && id !== undefined)
            );
        }

        setIsInitialized(true);
    }, [location.search, categories, attributes]);

    const updateURL = useCallback(() => {
        if (!isInitialized || !isUserInteraction) return;

        const params = new URLSearchParams(location.search);

        const categorySlugs = selectedCategories
            .map(categoryId => categories.find(category => category.id === categoryId)?.slug)
            .filter(Boolean) as string[];

        if (categorySlugs.length > 0) {
            params.set('categories', categorySlugs.join(','));
        } else {
            params.delete('categories');
        }

        const attributeSlugs = selectedAttributes
            .map(attributeId => attributes.find(attribute => attribute.id === attributeId)?.slug)
            .filter(Boolean) as string[];

        if (attributeSlugs.length > 0) {
            params.set('attributes', attributeSlugs.join(','));
        } else {
            params.delete('attributes');
        }

        const newSearch = params.toString();
        if (location.search !== `?${newSearch}`) {
            history.replace({ pathname: location.pathname, search: newSearch });
        }
    }, [
        isInitialized,
        isUserInteraction,
        selectedCategories,
        selectedAttributes,
        categories,
        attributes,
        location.pathname,
        location.search,
        history,
    ]);

    useEffect(() => {
        updateURL();
    }, [selectedCategories, selectedAttributes, updateURL]);

    // Filtrage des places
    useEffect(() => {
        let filtered = allPlaces;

        if (selectedCategories.length > 0) {
            // Combiner les catégories avec "ET"
            filtered = filtered.filter(place =>
                selectedCategories.every(catId => place.categories.some(category => category.id === catId))
            );
        }

        if (selectedAttributes.length > 0) {
            // Combiner les attributs avec "OU"
            filtered = filtered.filter(place =>
                place.attributes.some(attribute => selectedAttributes.includes(attribute.id))
            );
        }

        onFilterChange(filtered);
    }, [selectedCategories, selectedAttributes, allPlaces, onFilterChange]);

    const handleCategoryChange = useCallback(
        (categoryId: number) => {
            setIsUserInteraction(true); // Utilisateur interagit
            setSelectedCategories(prev => {
                const isSelected = prev.includes(categoryId);
                return isSelected ? prev.filter(id => id !== categoryId) : [...prev, categoryId];
            });
        },
        []
    );

    const handleAttributeChange = useCallback(
        (attributeId: number) => {
            setIsUserInteraction(true); // Utilisateur interagit
            setSelectedAttributes(prev => {
                const isSelected = prev.includes(attributeId);
                return isSelected ? prev.filter(id => id !== attributeId) : [...prev, attributeId];
            });
        },
        []
    );

    return {
        selectedCategories,
        selectedAttributes,
        handleCategoryChange,
        handleAttributeChange,
        getTranslation,
        isUserInteraction, // Exposez l'état si nécessaire
    };
};

export default useFilterPlaces;
