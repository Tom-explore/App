import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/languageContext';
import { IonReactRouter } from '@ionic/react-router';
import { CityProvider } from './context/cityContext';
import { TripProvider } from './context/tripContext';
import { UserProvider } from './context/userContext';
import { FeedProvider } from './context/feedContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <IonReactRouter>
    <UserProvider>
      <LanguageProvider>
        <CityProvider>
          <TripProvider>
            <FeedProvider>

              <App />

            </FeedProvider>
          </TripProvider>
        </CityProvider>
      </LanguageProvider>
    </UserProvider>
  </IonReactRouter>,
);
