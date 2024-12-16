import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonContent, IonPage } from '@ionic/react';
import SwitchMapListCity from '../components/SwitchCityMapList';
import SearchBar from '../components/SearchBar';
import CityList from './CityList';
import MapCityDisplay from './MapCityDisplay';
import citiesData from '../data/cities.json';
import { useLanguage } from '../context/languageContext';
import './CitiesDisplay.css';

const CitiesDisplay: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const { language } = useLanguage();

    useEffect(() => {
        const cities = citiesData.map((city: any) => {
            const translation = city.translations.find(
                (t: any) => t.language === language.id
            );
            const countryTranslation = city.country.translations.find(
                (t: any) => t.language === language.id
            );

            return {
                id: city.id,
                name: translation?.name || 'Unknown',
                country: countryTranslation?.name || 'Unknown',
                slug: city.slug,
                slugURL: translation?.slug || city.slug,
                img: `../assets/img/${city.country.code}/${city.slug}/main/${city.slug}-500.jpg`,
                description: translation?.description || 'No description available',
                lat: city.lat,
                lng: city.lng,
                markerIcon: `../assets/img/${city.country.code}/${city.slug}/marker/${city.slug}-marker.png`,
            };
        });

        const filtered = cities
            .filter((city) =>
                city.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .concat(
                cities.filter(
                    (city) =>
                        !city.name.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
                        city.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        setFilteredCities(filtered);
    }, [searchQuery, language]);

    const handleSwitch = (mode: 'list' | 'map') => {
        setViewMode(mode);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query.trim());
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="transparent-toolbar"> {/* Ajout de la classe */}
                    <div className="cities-display-header">
                        <div className="header-left">
                            <SwitchMapListCity currentMode={viewMode} onSwitch={handleSwitch} />
                        </div>
                        <div className="header-right">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {viewMode === 'list' ? (
                    <CityList cities={filteredCities} />
                ) : (
                    <MapCityDisplay cities={filteredCities} />
                )}
            </IonContent>
        </IonPage>
    );
};

export default CitiesDisplay;
