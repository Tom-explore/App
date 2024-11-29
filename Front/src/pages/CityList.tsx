import {
  IonContent,
  IonPage,
} from '@ionic/react';
import CityCard from '../components/CityCard';
import './CityList.css';
import citiesData from '../data/cities.json';
import SearchBar from '../components/SearchBar';
import { useState, useRef } from 'react';

const CityList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const cityRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Références pour chaque ville

  const cities = citiesData.map((city: any) => {
    const translation = city.translations.find((t: any) => t.language === 2);
    const countryTranslation = city.country.translations.find(
      (t: any) => t.language === 2
    );

    return {
      id: city.id,
      name: translation?.name || 'Unknown',
      country: countryTranslation?.name || 'Unknown',
      description: translation?.description || 'No description available',
      img: `../assets/img/${city.country.code}/${city.slug}/main/${city.slug}-500.jpg`,
    };
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const match = cities.find((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      const targetRef = cityRefs.current[match.id];
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <IonPage>

      <SearchBar onSearch={handleSearch} />
      <IonContent fullscreen>
        <div className="city-list-grid">
          <div className="city-list-row">
            {cities.map((city) => (
              <div
                className="city-list-col"
                key={city.id}
                ref={(el) => (cityRefs.current[city.id] = el)} // Associe une référence à chaque ville
              >
                <CityCard
                  id={city.id}
                  name={city.name}
                  country={city.country}
                  description={city.description}
                  img={city.img}
                />
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CityList;
