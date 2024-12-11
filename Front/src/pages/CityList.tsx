import { IonContent, IonPage, IonRouterLink } from '@ionic/react';
import CityCard from '../components/CityCard';
import './CityList.css';
import citiesData from '../data/cities.json';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CityCardMobile from '../components/CityCardMobile';
import { useLanguage } from '../context/languageContext';

const CityList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { language } = useLanguage();

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
        <div className={isMobile ? 'city-list-mobile' : 'city-list-grid'}>
          <div className={isMobile ? 'city-list-row-mobile' : 'city-list-row'}>
            <AnimatePresence>
              {filteredCities.length > 0 ? (
                filteredCities.map((city) =>
                  isMobile ? (
                    <motion.div
                      className="city-list-item-mobile"
                      key={city.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{
                        duration: 0.1,
                        ease: 'easeInOut',
                      }}
                    >
                      <IonRouterLink
                        href={`/${language.code}/city/${city.slugURL}`}
                        className="city-link"
                      >
                        <CityCardMobile
                          id={city.id}
                          name={city.name}
                          country={city.country}
                          img={city.img}
                        />
                      </IonRouterLink>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="city-list-col"
                      key={city.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{
                        duration: 0.1,
                        ease: 'easeInOut',
                      }}
                      layout
                    >
                      <IonRouterLink
                        href={`/${language.code}/city/${city.slugURL}`}
                        className="city-link"
                      >
                        <CityCard
                          id={city.id}
                          slug={city.slug}
                          name={city.name}
                          country={city.country}
                          description={city.description}
                          img={city.img}
                        />
                      </IonRouterLink>
                    </motion.div>
                  )
                )
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
