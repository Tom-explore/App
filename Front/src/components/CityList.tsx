import React from 'react';
import { IonContent, IonPage, IonRouterLink } from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import CityCard from './CityCard';
import CityCardMobile from './CityCardMobile';
import '../styles/pages/CityList.css'
import { useLanguage } from '../context/languageContext';

interface CityListProps {
  cities: any[];
}

const CityList: React.FC<CityListProps> = ({ cities }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { language } = useLanguage();


  return (
    <IonContent fullscreen>
      <div className={isMobile ? 'city-list-mobile' : 'city-list-grid'}>
        <div className={isMobile ? 'city-list-row-mobile' : 'city-list-row'}>
          <AnimatePresence>
            {cities.length > 0 ? (
              cities.map((city) => {
                return isMobile ? (
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
                );
              })
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
  );
};

export default CityList;
