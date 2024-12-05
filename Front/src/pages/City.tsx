import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonHeader, IonBackButton, IonButtons } from '@ionic/react';
import apiClient from '../config/apiClient';
import PlaceCarousel from '../components/PlaceCarousel';
import './City.css';
import { Place } from '../types/PlacesInterfaces';

const PLACE_CATEGORIES = {
    RESTAURANTS_BARS: 'restaurantsBars',
    HOTELS: 'hotels',
    TOURIST_ATTRACTIONS: 'touristAttractions',
};

const LIMIT = 8;

const City: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const [data, setData] = useState({
        [PLACE_CATEGORIES.RESTAURANTS_BARS]: [] as Place[],
        [PLACE_CATEGORIES.HOTELS]: [] as Place[],
        [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: [] as Place[],
    });
    console.log(data);
    const [offsets, setOffsets] = useState({
        [PLACE_CATEGORIES.RESTAURANTS_BARS]: LIMIT,
        [PLACE_CATEGORIES.HOTELS]: LIMIT,
        [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: LIMIT,
    });

    const [loadingCategories, setLoadingCategories] = useState({
        [PLACE_CATEGORIES.RESTAURANTS_BARS]: true,
        [PLACE_CATEGORIES.HOTELS]: true,
        [PLACE_CATEGORIES.TOURIST_ATTRACTIONS]: true,
    });

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


    const fetchCategory = async (category: string, offset: number, append = false) => {
        try {
            const response = await apiClient.get(
                `/place/cities/${slug}/all-places?languageId=2&limit${category}=${LIMIT}&offset${category}=${offset}`
            );

            if (!response.data || !response.data[category] || !Array.isArray(response.data[category])) {
                throw new Error(`Invalid data format for category: ${category}`);
            }

            const transformedPlaces = response.data[category].map(transformPlaceData);

            setData((prev) => ({
                ...prev,
                [category]: append ? [...prev[category], ...transformedPlaces] : transformedPlaces,
            }));

            setOffsets((prev) => ({
                ...prev,
                [category]: prev[category] + LIMIT,
            }));
        } catch (err) {
            console.error(`Error fetching data for ${category}:`, err);
        } finally {
            setLoadingCategories((prev) => ({
                ...prev,
                [category]: false,
            }));
        }
    };

    const fetchInitialData = async () => {
        await Promise.all(
            Object.keys(PLACE_CATEGORIES).map((key) =>
                fetchCategory(PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES], 0)
            )
        );

        Object.keys(PLACE_CATEGORIES).forEach((key) => {
            const category = PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES];
            fetchCategory(category, offsets[category], true);
        });
    };

    useEffect(() => {
        fetchInitialData();
    }, [slug]);

    return (
        <IonPage>
            <IonHeader>
                <IonButtons slot="start">
                    <IonBackButton />
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                <div className="city-header">
                    <h1>{slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
                    <p>{`Discover the best spots in ${slug.charAt(0).toUpperCase() + slug.slice(1)}!`}</p>
                </div>

                {Object.keys(PLACE_CATEGORIES).map((key) => {
                    const category = PLACE_CATEGORIES[key as keyof typeof PLACE_CATEGORIES];
                    return (
                        <PlaceCarousel
                            key={category}
                            title={key.replace('_', ' ')}
                            places={data[category]}
                            loading={loadingCategories[category]}
                        />
                    );
                })}
            </IonContent>
        </IonPage>
    );
};

export default City;
