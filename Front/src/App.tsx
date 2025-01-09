import React, { useEffect } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useLanguage } from './context/languageContext';
import { airplaneSharp, personSharp, locationSharp, homeSharp } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import CitiesDisplay from './pages/CitiesDisplay';
import languages from './data/languages.json';
import City from './pages/City';
import Tab3 from './pages/Tab3';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';
import Trip from './pages/Trip';
import Feed from './pages/Feed';

setupIonicReact();

const App: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const lang = pathSegments[1];

    console.log('Initial pathname:', location.pathname);
    console.log('Extracted lang:', lang);

    const matchedLanguage = languages.find((langData) => langData.code === lang);

    if (matchedLanguage) {
      console.log('Setting initial context language:', matchedLanguage);
      setLanguage(matchedLanguage);
    } else {
      console.log('No valid lang in URL. Redirecting to default.');
      history.replace(`/en/feed`);
    }
  }, [location, history, setLanguage]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/trip" component={Trip} exact />
            <Route path="/:lang/city/:slug" component={City} exact />
            <Route path="/:lang/feed" component={Feed} exact />
            <Route path="/:lang/feed/city/:slug" component={Feed} exact />

            <Route path="/:lang/destinations" component={Tab3} exact />
            <Route path="/:lang/city" component={CitiesDisplay} exact />
            <Route path="/:lang/account" component={Tab1} exact />


            <Route exact path="/">
              <Redirect to="/en/feed" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="feed" href={`/${language.code}/feed`}>
              <IonIcon aria-hidden="true" icon={homeSharp} />
              <IonLabel>Feed</IonLabel>
            </IonTabButton>
            <IonTabButton tab="destinations" href={`/${language.code}/destinations`}>
              <IonIcon aria-hidden="true" icon={locationSharp} />
              <IonLabel>Destinations</IonLabel>
            </IonTabButton>
            <IonTabButton tab="trips" href={`/${language.code}/city`}>
              <IonIcon aria-hidden="true" icon={airplaneSharp} />
              <IonLabel>Trips</IonLabel>
            </IonTabButton>
            <IonTabButton tab="account" href={`/${language.code}/account`}>
              <IonIcon aria-hidden="true" icon={personSharp} />
              <IonLabel>Account</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
