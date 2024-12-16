// src/context/TripContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Trip, TripData } from '../types/TripsInterfaces';
import { User } from '../types/UsersInterfaces';

// Simple incremental ID generator
let currentId = 0;
const generateUniqueId = (): number => {
    currentId += 1;
    return currentId;
};

interface TripContextProps {
    trip: Trip | null;
    tripData: TripData | null;
    setTrip: (trip: Trip | null) => void;
    setTripData: (data: TripData | null) => void;
    createTrip: (data: TripData, user: User) => void; // Modified to accept a User
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [tripData, setTripData] = useState<TripData | null>(null);

    /**
     * Creates a new Trip from TripData and assigns default values to required Trip properties.
     * @param data - The TripData containing trip details.
     * @param user - The User who is creating the trip.
     */
    const createTrip = (data: TripData, user: User) => {
        const now = new Date();

        const newTrip: Trip = {
            id: generateUniqueId(),
            user: user, // Assign the user creating the trip
            city: data.city,
            public: false, // Default value; adjust as needed
            datetime_start: new Date(data.dates.arrival),
            datetime_end: new Date(data.dates.departure),
            created: now,
            modified: now,
            tripCompositions: [], // Initialize as empty; populate as needed
            // Optional properties
            partner_id: undefined,
            price_range: data.budget, // Assuming budget maps to price_range; adjust as needed
        };

        setTrip(newTrip);
        setTripData(data);
    };

    return (
        <TripContext.Provider value={{ trip, tripData, setTrip, setTripData, createTrip }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrip = (): TripContextProps => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
};
