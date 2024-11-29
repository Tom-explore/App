import React from 'react';
import { IonIcon } from '@ionic/react';
import { listOutline, mapOutline } from 'ionicons/icons';
import './SwitchCityMapList.css';

interface SwitchMapListCityProps {
    currentMode: 'list' | 'map';
    onSwitch: (mode: 'list' | 'map') => void;
}

const SwitchMapListCity: React.FC<SwitchMapListCityProps> = ({ currentMode, onSwitch }) => {
    return (
        <div className="switch-map-list-city">
            <button
                className={`switch-button ${currentMode === 'list' ? 'active' : ''}`}
                onClick={() => onSwitch('list')}
            >
                <IonIcon icon={listOutline} className="switch-icon" />
            </button>
            <button
                className={`switch-button ${currentMode === 'map' ? 'active' : ''}`}
                onClick={() => onSwitch('map')}
            >
                <IonIcon icon={mapOutline} className="switch-icon" />
            </button>
        </div>
    );
};

export default SwitchMapListCity;
