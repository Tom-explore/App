import React, { useState, useEffect, useCallback } from 'react';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
import { Place } from '../types/PlacesInterfaces';
import { useHistory, useLocation } from 'react-router-dom';

import {
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonToggle,
} from '@ionic/react';
import { close as closeIcon } from 'ionicons/icons';
import { motion } from 'framer-motion';
import './FilterPlaces.css';

// Import des données
import data from '../data/categoriesAttributes.json';

interface FilterPlacesProps {
    categories: Category[];
    attributes: Attribute[];
    onFilterChange: (filteredPlaces: Place[]) => void;
    languageID: number;
    allPlaces: Place[];
    onClose: () => void;
}

const panelVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
    exit: { x: '-100%' },
};

const useGetTranslation = (languageID: number) => {
    return useCallback((slug: string, type: 'attributes' | 'categories'): string => {
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
    }, [languageID]);
};

const FilterPlaces: React.FC<FilterPlacesProps> = ({
    categories,
    attributes,
    onFilterChange,
    allPlaces,
    languageID,
    onClose,
}) => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
    const history = useHistory();
    const location = useLocation();
    const [isInitialized, setIsInitialized] = useState(false);
    const getTranslation = useGetTranslation(languageID);
    const [isUserInteraction, setIsUserInteraction] = useState(false);

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
                    .filter((id): id is number => id !== null)
            );
        }

        if (attributeSlugs) {
            setSelectedAttributes(
                attributeSlugs
                    .split(',')
                    .map(slug => attributes.find(attr => attr.slug === slug)?.id)
                    .filter((id): id is number => id !== null)
            );
        }

        setIsInitialized(true);
    }, [location.search, categories, attributes]);

    const updateURL = useCallback(() => {
        if (!isInitialized || !isUserInteraction) return;

        const params = new URLSearchParams(location.search);

        const categorySlugs = selectedCategories
            .map(categoryId => categories.find(category => category.id === categoryId)?.slug)
            .filter(Boolean);

        if (categorySlugs.length > 0) {
            params.set('categories', categorySlugs.join(','));
        } else {
            params.delete('categories');
        }

        const attributeSlugs = selectedAttributes
            .map(attributeId => attributes.find(attribute => attribute.id === attributeId)?.slug)
            .filter(Boolean);

        if (attributeSlugs.length > 0) {
            params.set('attributes', attributeSlugs.join(','));
        } else {
            params.delete('attributes');
        }

        const newSearch = params.toString();
        if (location.search !== `?${newSearch}`) {
            history.replace({ pathname: location.pathname, search: newSearch });
        }
    }, [isInitialized, isUserInteraction, selectedCategories, selectedAttributes, categories, attributes, location.pathname, location.search]);

    useEffect(() => {
        updateURL();
    }, [selectedCategories, selectedAttributes, updateURL]);

    useEffect(() => {
        let filtered = allPlaces;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(place =>
                place.categories.some(category => selectedCategories.includes(category.id))
            );
        }

        if (selectedAttributes.length > 0) {
            filtered = filtered.filter(place =>
                place.attributes.some(attribute => selectedAttributes.includes(attribute.id))
            );
        }

        onFilterChange(filtered);
    }, [selectedCategories, selectedAttributes, allPlaces, onFilterChange]);

    const handleCategoryChange = useCallback((categoryId: number) => {
        setIsUserInteraction(true);
        setSelectedCategories(prev => {
            const isSelected = prev.includes(categoryId);
            return isSelected ? prev.filter(id => id !== categoryId) : [...prev, categoryId];
        });
    }, []);

    const handleAttributeChange = useCallback((attributeId: number) => {
        setIsUserInteraction(true);
        setSelectedAttributes(prev => {
            const isSelected = prev.includes(attributeId);
            return isSelected ? prev.filter(id => id !== attributeId) : [...prev, attributeId];
        });
    }, []);


    return (
        <motion.div
            className="filter-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ type: 'tween', duration: 0.3 }}
        >
            <IonGrid>
                <IonRow>
                    <IonCol size="12" className="filter-header">
                        <IonLabel>
                            <strong>Filtrer les Lieux</strong>
                        </IonLabel>
                        <IonButton fill="clear" onClick={onClose}>
                            <IonIcon icon={closeIcon} />
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonList>
                            <IonLabel>
                                <strong>Attributs</strong>
                            </IonLabel>
                            {attributes.map(attribute => (
                                <IonItem key={attribute.id}>
                                    <IonLabel>
                                        {getTranslation(attribute.slug, 'attributes')}
                                    </IonLabel>
                                    <IonToggle
                                        slot="end"
                                        checked={selectedAttributes.includes(attribute.id)}
                                        onIonChange={() => handleAttributeChange(attribute.id)}
                                    />
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonList>
                            <IonLabel>
                                <strong>Catégories</strong>
                            </IonLabel>
                            {categories.map(category => (
                                <IonItem key={category.id}>
                                    <IonLabel>
                                        {getTranslation(category.slug, 'categories')}
                                    </IonLabel>
                                    <IonToggle
                                        slot="end"
                                        checked={selectedCategories.includes(category.id)}
                                        onIonChange={() => handleCategoryChange(category.id)}
                                    />
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="ion-text-center ion-margin-top">
                        <IonButton expand="block" onClick={onClose}>
                            Appliquer les filtres
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </motion.div>
    );
};

export default FilterPlaces;
