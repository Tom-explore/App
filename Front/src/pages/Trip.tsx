import React from 'react';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPage,
} from '@ionic/react';
import { useLocation } from 'react-router';
import { TripData } from '../types/TripsInterfaces';




const Trip: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tripDataString = queryParams.get('data');
    const tripData: TripData | null = tripDataString ? JSON.parse(decodeURIComponent(tripDataString)) : null;

    if (!tripData) {
        return <p>Pas de données disponibles pour ce voyage</p>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Résumé du Voyage</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h2>{tripData.tripName}</h2>
                <p>Description: {tripData.description}</p>
                <p>Ville: {tripData.city.translation.name}</p>
                <p>Invités: {tripData.guests.adults} adultes, {tripData.guests.children} enfants</p>
                <p>
                    Dates: {tripData.dates.arrival} - {tripData.dates.departure}
                </p>
                <p>Budget: {tripData.budget}</p>
                <h3>Préférences Alimentaires</h3>
                <ul>
                    {tripData.foodPreferences.map((pref, index) => (
                        <li key={index}>{pref}</li>
                    ))}
                </ul>
                <h3>Types d'Activités</h3>
                <ul>
                    {tripData.activityTypes.map((activity, index) => (
                        <li key={index}>{activity}</li>
                    ))}
                </ul>
            </IonContent>
        </IonPage>
    );
};

export default Trip;