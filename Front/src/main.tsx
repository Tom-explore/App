import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/languageContext';
import { IonReactRouter } from '@ionic/react-router';
import { CityProvider } from './context/cityContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <IonReactRouter>

    <LanguageProvider>
      <CityProvider>
        <App />
      </CityProvider>
    </LanguageProvider>

  </IonReactRouter>,
);
