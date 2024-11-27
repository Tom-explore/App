import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
} from '@ionic/react';
import apiClient from '../config/apiClient';
import { TouristAttraction } from '../types/PlacesInterfaces';

const Tab3: React.FC = () => {
  const [id, setId] = useState<number | null>(null); // ID saisi par l'utilisateur
  const [attraction, setAttraction] = useState<TouristAttraction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttraction = async () => {
    console.log('fetchAttraction called with id:', id); // Log de l'ID saisi

    if (!id) {
      setError('Please enter a valid ID');
      console.error('No valid ID provided');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Sending request to API...');
      const response = await apiClient.get(`/touristattraction/${id}`);
      console.log('API response:', response.data); // Log de la réponse API complète
      setAttraction(response.data); // Utiliser la réponse directement
    } catch (err: any) {
      console.error('Error fetching attraction:', err.message || err); // Log de l'erreur
      setError('Failed to fetch attraction details');
    } finally {
      console.log('Finished fetching attraction');
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Search Tourist Attraction</IonCardTitle>
            <IonCardSubtitle>Enter an ID to fetch attraction details</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Attraction ID</IonLabel>
              <IonInput
                type="number"
                placeholder="Enter ID"
                value={id || ''}
                onIonChange={(e) => {
                  const value = parseInt(e.detail.value!, 10);
                  console.log('User entered ID:', value); // Log de la valeur entrée
                  setId(value);
                }}
              />
            </IonItem>
            <IonButton expand="block" onClick={fetchAttraction}>
              Fetch Attraction
            </IonButton>
          </IonCardContent>
        </IonCard>

        {loading && <IonLoading isOpen={loading} message="Loading..." />}

        {error && (
          <IonCard color="danger">
            <IonCardContent>{error}</IonCardContent>
          </IonCard>
        )}

        {attraction && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{attraction.name_original}</IonCardTitle>
              <IonCardSubtitle>
                <a href={attraction.wiki_link} target="_blank" rel="noopener noreferrer">
                  Wiki Link
                </a>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p><strong>Price (Regular):</strong> ${attraction.price_regular}</p>
              <p><strong>Price (Children):</strong> ${attraction.price_children}</p>
              <p><strong>Tickets (GYG):</strong> {attraction.tickets_gyg ? 'Yes' : 'No'}</p>
              <p><strong>Tickets (Civitatis):</strong> {attraction.tickets_civitatis ? 'Yes' : 'No'}</p>
              <p>
                <strong>Direct Tickets Link:</strong>{' '}
                <a href={attraction.tickets_direct_site} target="_blank" rel="noopener noreferrer">
                  {attraction.tickets_direct_site}
                </a>
              </p>
              <IonCardSubtitle>Place Details</IonCardSubtitle>
              {attraction.place && (
                <>
                  <p><strong>Description:</strong> {attraction.place.description_scrapio}</p>
                  <p><strong>Google ID:</strong> {attraction.place.google_id}</p>
                  <p>
                    <strong>Google Maps:</strong>{' '}
                    <a href={attraction.place.link_maps} target="_blank" rel="noopener noreferrer">
                      {attraction.place.link_maps}
                    </a>
                  </p>
                  <p><strong>Latitude:</strong> {attraction.place.lat}</p>
                  <p><strong>Longitude:</strong> {attraction.place.lng}</p>
                  <p><strong>Address:</strong> {attraction.place.address}</p>
                  <p><strong>Zip Code:</strong> {attraction.place.zip_code}</p>
                  <p>
                    <strong>Google Rating:</strong> {attraction.place.reviews_google_rating} (
                    {attraction.place.reviews_google_count} reviews)
                  </p>
                </>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
