import { IonContent, IonPage } from '@ionic/react';
import CityCard from '../components/CityCard';
import './CityList.css';
import citiesData from '../data/cities.json';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CityList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredCities = cities
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


  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  return (
    <IonPage>
      <div className="search-bar-container-cityList">
        <SearchBar onSearch={handleSearch} />
      </div>
      <IonContent fullscreen>
        <div className="city-list-grid">
          <div className="city-list-row">
            <AnimatePresence>
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <motion.div
                    className="city-list-col"
                    key={city.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    layout
                  >
                    <CityCard
                      id={city.id}
                      name={city.name}
                      country={city.country}
                      description={city.description}
                      img={city.img}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span>🤭</span> Oups, on dirait que cette ville n'est pas encore disponible !
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </IonContent>
    </IonPage>

  );
};

export default CityList;
