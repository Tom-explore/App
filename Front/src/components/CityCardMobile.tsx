import React from 'react';
import { IonItem, IonLabel, IonThumbnail } from '@ionic/react';
import './CityCardMobile.css';

interface CityCardMobileProps {
    id: number;
    name: string;
    country: string;
    img: string;
}

const CityCardMobile: React.FC<CityCardMobileProps> = ({ name, country, img }) => {
    return (
        <IonItem className="city-card-mobile" button lines="none">
            <IonThumbnail slot="start" className="city-card-mobile-thumbnail">
                <img src={img} alt={name} />
            </IonThumbnail>
            <IonLabel className="city-card-mobile-label">
                <h2 className="city-card-mobile-name">{name}</h2>
                <p className="city-card-mobile-country">{country}</p>
            </IonLabel>
        </IonItem>
    );
};

export default CityCardMobile;
