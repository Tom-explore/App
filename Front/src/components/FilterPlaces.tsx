// src/components/FilterPlaces.tsx

import React from 'react';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
import { Place } from '../types/PlacesInterfaces';
import {
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import '../styles/components/FilterPlaces.css'

interface FilterPlacesProps {
    categories: Category[];
    attributes: Attribute[];
    selectedCategories: number[];
    selectedAttributes: number[];
    handleCategoryChange: (categoryId: number) => void;
    handleAttributeChange: (attributeId: number) => void;
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;
    onUserInteractionChange: (isInteracting: boolean) => void;
}

const FilterPlaces: React.FC<FilterPlacesProps> = ({
    categories,
    attributes,
    selectedCategories,
    selectedAttributes,
    handleCategoryChange,
    handleAttributeChange,
    getTranslation,
    onUserInteractionChange,
}) => {

    // Ici, on n'utilise plus useFilterPlaces, car tout est géré via les props

    return (
        <div className="filter-panel">
            <IonGrid>
                <IonRow>
                    <IonCol size="12" className="filter-header">
                        <IonLabel>
                            <strong>Filtrer les Lieux</strong>
                        </IonLabel>
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
                                    <IonLabel>{getTranslation(attribute.slug, 'attributes')}</IonLabel>
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
                                    <IonLabel>{getTranslation(category.slug, 'categories')}</IonLabel>
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
            </IonGrid>
        </div>
    );
};

export default FilterPlaces;
