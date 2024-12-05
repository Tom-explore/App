import React, { useState } from 'react';
import SwitchMapListCity from '../components/SwitchCityMapList';
import CityList from './CityList';
import MapCityDisplay from './MapCityDisplay';
import './CitiesDisplay.css';

const CitiesDisplay: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const handleSwitch = (mode: 'list' | 'map') => {
        setViewMode(mode);
    };

    return (
        <div>
            <div className="switch-container">
                <SwitchMapListCity currentMode={viewMode} onSwitch={handleSwitch} />
            </div>
            {viewMode === 'list' ? <CityList /> : <MapCityDisplay />}

        </div>
    );
};

export default CitiesDisplay;
