// FilterPlaces.tsx
import React from 'react';
import { Attribute, Category } from '../types/CategoriesAttributesInterfaces';
import { Place } from '../types/PlacesInterfaces';
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
import '../styles/components/FilterPlaces.css'
import useFilterPlaces from '../util/useFilterPlaces';

interface FilterPlacesProps {
    categories: Category[];
    attributes: Attribute[];
    onFilterChange: (filteredPlaces: Place[]) => void;
    languageID: number;
    allPlaces: Place[];
    onClose: () => void;
    onUserInteractionChange: (isInteracting: boolean) => void;
}

const panelVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
    exit: { x: '-100%' },
};

const FilterPlaces: React.FC<FilterPlacesProps> = ({
    categories,
    attributes,
    onFilterChange,
    allPlaces,
    languageID,
    onClose,
    onUserInteractionChange,
}) => {
    const {
        selectedCategories,
        selectedAttributes,
        handleCategoryChange,
        handleAttributeChange,
        getTranslation,
        isUserInteraction, // Utiliser l'état exposé
    } = useFilterPlaces({
        categories,
        attributes,
        onFilterChange,
        languageID,
        allPlaces,
    });

    React.useEffect(() => {
        onUserInteractionChange(isUserInteraction);
    }, [isUserInteraction, onUserInteractionChange]);

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
