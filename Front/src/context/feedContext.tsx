import React, { createContext, useState, ReactNode } from 'react';
import { Place } from '../types/PlacesInterfaces';

interface FeedContextProps {
    filteredPlaces: Place[];
    setFilteredPlaces: (places: Place[]) => void;
}

export const FeedContext = createContext<FeedContextProps | undefined>(undefined);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

    return (
        <FeedContext.Provider value={{ filteredPlaces, setFilteredPlaces }}>
            {children}
        </FeedContext.Provider>
    );
};
