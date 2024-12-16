import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { listOutline, mapOutline } from 'ionicons/icons';
import './SwitchCityMapList.css';

interface SwitchMapListCityProps {
    currentMode: 'list' | 'map';
    onSwitch: (mode: 'list' | 'map') => void;
}

const SwitchMapListCity: React.FC<SwitchMapListCityProps> = ({ currentMode, onSwitch }) => {
    const isMapMode = currentMode === 'map';

    const handleClick = () => {
        onSwitch(isMapMode ? 'list' : 'map'); // Alterne entre 'list' et 'map'
    };

    return (
        <div className="switch-map-list-city">
            <IonButton
                onClick={handleClick}
                className={`switch-button ${isMapMode ? 'map-mode' : 'list-mode'}`}
                fill="clear"
            >
                <IonIcon icon={isMapMode ? listOutline : mapOutline} className="switch-icon" />
            </IonButton>
        </div>
    );
};

export default SwitchMapListCity;
