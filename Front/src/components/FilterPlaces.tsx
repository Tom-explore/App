// src/components/FilterPlaces.tsx

import React from "react";
import { Attribute, Category } from "../types/CategoriesAttributesInterfaces";
import { Place } from "../types/PlacesInterfaces";
import {
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonMenu,
  IonHeader,
  IonTitle,
  IonContent,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonButtons,
  IonButton,
  IonMenuToggle,
} from "@ionic/react";
import "../styles/components/FilterPlaces.css";
import { close, filter, filterCircle } from "ionicons/icons";

interface FilterPlacesProps {
  categories: Category[];
  attributes: Attribute[];
  selectedCategories: number[];
  selectedAttributes: number[];
  handleCategoryChange: (categoryId: number) => void;
  handleAttributeChange: (attributeId: number) => void;
  getTranslation: (slug: string, type: "attributes" | "categories") => string;
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

  const sayHello = () => {
    console.log("Hello");
  };

  return (
    <>
      <IonHeader>
        <IonToolbar className="filter-title">
          <IonButtons slot="start">
            <IonIcon icon={filter} size="large" />
          </IonButtons>
          <IonTitle>Filtres</IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle>
              <IonButton size="large" shape="round">
                <IonIcon icon={close} />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAccordionGroup multiple value={["attributes", "categories"]}>
          <IonAccordion value="attributes">
            <IonItem slot="header" color="light">
              <IonLabel>Attributs</IonLabel>
            </IonItem>
            <IonList slot="content">
              {attributes.map((attribute) => (
                <IonItem key={attribute.id}>
                  <IonToggle
                    checked={selectedAttributes.includes(attribute.id)}
                    onIonChange={() => handleAttributeChange(attribute.id)}
                    // onIonChange={() => sayHello()}
                  >
                    {getTranslation(attribute.slug, "attributes")}
                  </IonToggle>
                </IonItem>
              ))}
            </IonList>
          </IonAccordion>
          <IonAccordion value="categories">
            <IonItem slot="header" color="light">
              <IonLabel>Catégories</IonLabel>
            </IonItem>
            <IonList slot="content">
              {categories.map((category) => (
                <IonItem key={category.id}>
                  <IonToggle
                    checked={selectedCategories.includes(category.id)}
                    onIonChange={() => handleCategoryChange(category.id)}
                    // onIonChange={() => sayHello()}
                  >
                    {getTranslation(category.slug, "categories")}
                  </IonToggle>
                </IonItem>
              ))}
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </>
  );
};

export default FilterPlaces;
