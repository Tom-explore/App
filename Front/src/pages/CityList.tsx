import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  } from '@ionic/react';
  import CityCard from '../components/CityCard';
  import './CityList.css';
  import citiesData from '../data/cities.json';
  
  const CityList: React.FC = () => {
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
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Liste des Villes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="city-list-grid">
            <div className="city-list-row">
              {cities.map((city) => (
                <div className="city-list-col" key={city.id}>
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
  