import React, { useState, useEffect } from 'react';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
import { Place } from '../types/PlacesInterfaces';
import {
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonGrid,
    IonRow,
    IonCol
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
    languageID: number; // Langue sélectionnée
    allPlaces: Place[];
    onClose: () => void; // Fonction pour fermer le panneau
}

const panelVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
    exit: { x: '-100%' }
};

// Fonction utilitaire pour trouver une traduction
const getTranslation = (slug: string, languageID: number, type: 'attributes' | 'categories'): string => {
    const items = data[type]; // Récupère soit "attributes" soit "categories" depuis le JSON
    const item = items.find((el: any) => el.slug === slug); // Recherche par slug

    if (!item || !item.translations) return `No ${type.slice(0, -1)} found for slug "${slug}"`;

    // Recherche par languageID
    const translation = item.translations.find((t: any) => t.language_id === languageID);
    return translation ? translation.name : `No translation for "${slug}" in language ${languageID}`;
};

const FilterPlaces: React.FC<FilterPlacesProps> = ({ categories, attributes, onFilterChange, allPlaces, languageID, onClose }) => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleAttributeChange = (attributeId: number) => {
        setSelectedAttributes(prev =>
            prev.includes(attributeId) ? prev.filter(id => id !== attributeId) : [...prev, attributeId]
        );
    };

    useEffect(() => {
        console.log('Filtering places with:', {
            selectedCategories,
            selectedAttributes,
            allPlaces,
        });

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

        console.log('Filtered places:', filtered);
        onFilterChange(filtered);
    }, [selectedCategories, selectedAttributes, allPlaces, onFilterChange]);

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
                        <IonLabel><strong>Filtrer les Lieux</strong></IonLabel>
                        <IonButton fill="clear" onClick={onClose}>
                            <IonIcon icon={closeIcon} />
                        </IonButton>
                    </IonCol>
                </IonRow>

                {/* Filtrage des Catégories */}
                <IonRow>
                    <IonCol>
                        <IonList>
                            {categories.map(category => (
                                <IonItem key={category.id}>
                                    <IonCheckbox
                                        slot="start"
                                        checked={selectedCategories.includes(category.id)}
                                        onIonChange={() => handleCategoryChange(category.id)}
                                    />
                                    <IonLabel>
                                        {getTranslation(category.slug, languageID, 'categories')}
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>

                {/* Filtrage des Attributs */}
                <IonRow>
                    <IonCol>
                        <IonList>
                            {attributes.map(attribute => (
                                <IonItem key={attribute.id}>
                                    <IonCheckbox
                                        slot="start"
                                        checked={selectedAttributes.includes(attribute.id)}
                                        onIonChange={() => handleAttributeChange(attribute.id)}
                                    />
                                    <IonLabel>
                                        {getTranslation(attribute.slug, languageID, 'attributes')}
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>

                {/* Bouton pour Appliquer les Filtres */}
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
