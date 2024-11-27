import { Redirect, Route } from 'react-router-dom';
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
import { newspaper, location, briefcase, person, airplane, airplaneSharp, personSharp, locationSharp, homeSharp } from 'ionicons/icons'; // Import des icônes appropriées
import Tab1 from './pages/Tab1';
import MapDisplay from './pages/MapDisplay';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
/* Theme variables */
import Test from './pages/Test';
import CityList from './pages/CityList';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/feed">
            <Tab1 />
          </Route>
          <Route exact path="/destinations">
            <MapDisplay />
          </Route>
          <Route path="/trips">
            <CityList />
          </Route>
          <Route exact path="/account">
            <Test />
          </Route>
          <Route exact path="/">
            <Redirect to="/feed" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="feed" href="/feed">
            <IonIcon aria-hidden="true" icon={homeSharp} />
            <IonLabel>Feed</IonLabel>
          </IonTabButton>
          <IonTabButton tab="destinations" href="/destinations">
            <IonIcon aria-hidden="true" icon={locationSharp} />
            <IonLabel>Destinations</IonLabel>
          </IonTabButton>
          <IonTabButton tab="trips" href="/trips">
            <IonIcon aria-hidden="true" icon={airplaneSharp} />
            <IonLabel>Trips</IonLabel>
          </IonTabButton>
          <IonTabButton tab="account" href="/account">
            <IonIcon aria-hidden="true" icon={personSharp} />
            <IonLabel>Account</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
