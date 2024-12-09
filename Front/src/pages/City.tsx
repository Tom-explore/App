import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonHeader, IonBackButton, IonButtons } from '@ionic/react';
import apiClient from '../config/apiClient';
import PlaceCarousel from '../components/PlaceCarousel';
import CityHeader from '../components/CityHeader';
import './City.css';
import { Place } from '../types/PlacesInterfaces';
import type { City } from '../types/CommonInterfaces';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';

const PLACE_CATEGORIES = {
    RESTAURANTS_BARS: 'restaurantsBars',
    HOTELS: 'hotels',
    TOURIST_ATTRACTIONS: 'touristAttractions',
};

const LIMIT = 8;

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [city, setCity] = useState<City | null>(null);
    const { language } = useLanguage();
    const [data, setData] = useState({
        [PLACE_CATEGORIES.RESTAURANTS_BARS]: [] as Place[],
        [PLACE_CATEGORIES.HOTELS]: [] as Place[],
        [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: [] as Place[],
    });
    const [loadingCategories, setLoadingCategories] = useState({
        [PLACE_CATEGORIES.RESTAURANTS_BARS]: true,
        [PLACE_CATEGORIES.HOTELS]: true,
        [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: true,
    });
    const [cityData, setCityData] = useState<any | null>(null);

    useEffect(() => {
        console.log('Fetching city data for slug:', slug);
        const city = citiesData.find((c: any) => c.slug === slug);

        if (city) {
            const translation: Record<string, any> = city.translations.find((t: any) => t.language === language.id) || {};
            const countryTranslation: Record<string, any> = city.country.translations.find((t: any) => t.language === language.id) || {};
            setCityData({
                lat: city.lat,
                lng: city.lng,
                slugOriginal: city.slug,
                name: translation.name,
                description: translation.description || '',
                countryName: countryTranslation.name || '',
                countryCode: city.country.code,
                placeholderUrl: `/assets/img/${city.country.code}/${slug}/main/${slug}-1.jpg`,
                videoUrl: `/assets/img/${city.country.code}/${slug}/main/${slug}-video.mp4`,
            });
        }
    }, [slug, language]);

    const transformPlaceData = (place: any): Place => ({
        id: place.id,
        lat: place.lat || 0,
        lng: place.lng || 0,
        slug: place.slug,
        translation: {
            slug: place.translation.slug,
            name: place.translation.name,
            title: place.translation.title,
            description: place.translation.description,
            meta_description: place.translation.meta_description,
        },
        description: place.description_scrapio,
        address: place.address,
        link_website: place.link_website || null,
        link_insta: place.link_insta || null,
        link_fb: place.link_fb || null,
        link_maps: place.link_maps || null,
        reviews_google_rating: place.reviews_google_rating || 0,
        reviews_google_count: place.reviews_google_count || 0,
        images: (place.images || []).map((img: any) => ({
            id: img.id,
            slug: img.slug,
            author: img.author || null,
            license: img.license || null,
            top: img.top || 0,
            source: img.source || null,
        })),
    });

    const fetchInitialData = async () => {
        try {
            const url = `/place/cities/${cityData.slugOriginal}/all-places?languageId=${language.id}&limit=${LIMIT}&offset=0`;
            const response = await apiClient.get(url);

            if (response.data.city && !city) {
                setCity(response.data.city);
            }

            if (!response.data || !response.data.places) {
                throw new Error('Invalid data format in API response');
            }

            const updatedData: Record<string, Place[]> = {};
            Object.keys(PLACE_CATEGORIES).forEach((key) => {
                const category = PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES];
                const places = response.data.places[category] || [];
                updatedData[category] = places.map(transformPlaceData);
            });

            setData(updatedData);
        } catch (err) {
            console.error('Error fetching initial data:', err);
        } finally {
            setLoadingCategories((prev) => ({
                ...prev,
                [PLACE_CATEGORIES.RESTAURANTS_BARS]: false,
                [PLACE_CATEGORIES.HOTELS]: false,
                [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: false,
            }));
        }
    };

    const fetchRemainingData = async () => {
        try {
            const url = `/place/cities/${cityData.slugOriginal}/all-places?languageId=${language.id}&limit=999&offset=${LIMIT}`;
            const response = await apiClient.get(url);

            if (!response.data || !response.data.places) {
                throw new Error('Invalid data format in API response');
            }

            const updatedData: Record<string, Place[]> = {};
            Object.keys(PLACE_CATEGORIES).forEach((key) => {
                const category = PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES];
                const places = response.data.places[category] || [];
                updatedData[category] = [...data[category], ...places.map(transformPlaceData)];
            });

            setData(updatedData);
        } catch (err) {
            console.error('Error fetching remaining data:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (cityData) {
                await fetchInitialData();
                await fetchRemainingData();
            }
        };
        fetchData();
    }, [cityData]);

    return (
        <IonPage>
            <IonHeader>
                <IonButtons slot="start">
                    <IonBackButton />
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                {cityData && (
                    <CityHeader
                        name={cityData.name}
                        description={cityData.description}
                        lat={cityData.lat}
                        lng={cityData.lng}
                        countryName={cityData.countryName}
                        countryCode={cityData.countryCode}
                        slug={cityData.slugOriginal}
                    />
                )}

                <div className="city-content">
                    {Object.keys(PLACE_CATEGORIES).map((key) => {
                        const category = PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES];
                        return (
                            <div key={category}>
                                <PlaceCarousel
                                    title={key.replace('_', ' ')}
                                    places={data[category]}
                                    loading={loadingCategories[category]}
                                />
                            </div>
                        );
                    })}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default City;
