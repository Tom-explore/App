import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import './CityCard.css';

interface CityCardProps {
  id: number;
  name: string;
  country: string;
  description: string;
  img: string;
}

const CityCard: React.FC<CityCardProps> = ({ name, country, description, img }) => {
  return (
    <IonCard className="city-card">
      <div className="city-card-image-container">
        <img src={img} alt={name} className="city-card-image" />
      </div>
      <IonCardHeader className="city-card-header">
        <IonCardTitle className="city-card-title">{name}</IonCardTitle>
        <IonCardSubtitle className="city-card-subtitle">{country}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="city-card-content">
        <p>{description}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default CityCard;
