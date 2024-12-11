import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonHeader, IonBackButton, IonButtons } from '@ionic/react';
import { useCity } from '../context/cityContext';
import CityHeader from '../components/CityHeader';
import PlaceCarousel from '../components/PlaceCarousel';
import { useIonViewWillLeave } from '@ionic/react';
import { useLanguage } from '../context/languageContext';

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { city, places, setCityPreviewAndFetchData, resetCity } = useCity();
    const [didFetch, setDidFetch] = useState(false);
    const { isLanguageLoaded, language } = useLanguage();

    useEffect(() => {
        console.log("City component rendu");
        if (slug && !didFetch && isLanguageLoaded) {
            console.log(`[City Component] Fetching city data for slug: ${slug}`);
            setCityPreviewAndFetchData(slug);
            setDidFetch(true);
        }
        else {
            console.log('[City Component] Waiting for language to load before fetching city data');
        }
    }, [slug, language.id, didFetch, isLanguageLoaded, setCityPreviewAndFetchData]);

    useEffect(() => {
        return () => {
            console.log('[City Component] Cleanup executed');
            resetCity();
        };
    }, [resetCity]);

    useIonViewWillLeave(() => {
        console.log('[City Component] IonViewWillLeave triggered');
        resetCity();
    });

    const haveInitialPlaces =
        places.restaurantsBars.length > 0 ||
        places.hotels.length > 0 ||
        places.touristAttractions.length > 0;

    return (
        <IonPage className="city-page">
            <IonHeader>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={`/${language.code}/city`} />
                </IonButtons>
            </IonHeader>
            <IonContent>
                {city ? (
                    <>
                        <CityHeader
                            name={'translation' in city ? city.translation.name : city.name}
                            description={'translation' in city ? city.translation.description : city.description}
                            lat={city.lat}
                            lng={city.lng}
                            countryName={'translation' in city.country ? city.country.translation.name : city.country.name}
                            countryCode={city.country.code}
                            slug={city.slug || ''}
                        />
                        <div className="city-content">
                            {!haveInitialPlaces ? (
                                <p>Chargement des lieux...</p>
                            ) : (
                                Object.keys(places).map((key) => (
                                    <PlaceCarousel
                                        key={key}
                                        title={key.replace('_', ' ')}
                                        places={places[key as keyof typeof places]}
                                        loading={false}
                                    />
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="loading">
                        <p>Chargement de la ville...</p>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default City;
