import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
    IonCheckbox,
    IonList,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonProgressBar,
    IonDatetime,
} from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import { City, CityPreview } from '../types/CommonInterfaces';
import LangToLocale from '../util/LangToLocale';
import './TripForm.css'; // Importer le fichier CSS personnalisé
import { useIonRouter } from '@ionic/react';
import { useTrip } from '../context/tripContext';
import { TripData } from '../types/TripsInterfaces';

const getDatesInRange = (start: string, end: string): string[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];

    // Assurer que startDate <= endDate
    if (startDate > endDate) {
        return dates;
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

interface HighlightedDate {
    date: string;
    textColor?: string;
    backgroundColor: string; // Rendue obligatoire
}



interface TripFormProps {
    languageCode: string; // Ajout de languageCode
    city: City | CityPreview;
    onClose: () => void;
    onSubmit: (tripData: TripData) => void; // Nouvelle prop
}

const TripForm: React.FC<TripFormProps> = ({ languageCode, city, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const router = useIonRouter();

    const [tripName, setTripName] = useState('');
    const [description, setDescription] = useState('');

    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);

    const [arrivalDate, setArrivalDate] = useState<string>('');
    const [arrivalTime, setArrivalTime] = useState<string>('');
    const [departureDate, setDepartureDate] = useState<string>('');
    const [departureTime, setDepartureTime] = useState<string>('');

    const [budget, setBudget] = useState<number>(5); // Valeur par défaut à 5

    const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
    const [activityTypes, setActivityTypes] = useState<string[]>([]);

    const [highlightedDates, setHighlightedDates] = useState<HighlightedDate[]>([]);
    const { createTrip } = useTrip(); // Utilisation du contexte

    // Nouvel état pour suivre la sélection des dates
    const [selectingArrival, setSelectingArrival] = useState<boolean>(true);

    // Options pour les préférences alimentaires
    const foodOptions = [
        { label: '🥖 Gluten Free', value: 'glutenFree' },
        { label: 'حلال Halal', value: 'halal' },
        { label: '🌾 Organic', value: 'organic' },
        { label: '🥦 Vegan', value: 'vegan' },
        { label: '🥚 Vegetarian', value: 'vegetarian' },
    ];

    // Options pour les types d'activités
    const activityOptions = [
        { label: '🤩 Must See', value: 'mustSee' },
        { label: '🖼 Museums', value: 'museums' },
        { label: '🌳 Parks', value: 'parks' },
        { label: '🛍 Shopping', value: 'shopping' },
    ];

    // Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = getTodayDate();

    // Initialiser foodPreferences et activityTypes avec toutes les options cochées par défaut
    useEffect(() => {
        const allFoodValues = foodOptions.map(option => option.value);
        setFoodPreferences(allFoodValues);

        const allActivityValues = activityOptions.map(option => option.value);
        setActivityTypes(allActivityValues);
    }, []);

    // Fonctions pour adultes
    const incrementAdults = () => setAdults(prev => Math.min(prev + 1, 10)); // Limite à 10 adultes
    const decrementAdults = () => setAdults(prev => Math.max(prev - 1, 1)); // Minimum 1 adulte

    // Fonctions pour enfants
    const incrementChildren = () => setChildren(prev => Math.min(prev + 1, 10)); // Limite à 10 enfants
    const decrementChildren = () => setChildren(prev => Math.max(prev - 1, 0)); // Minimum 0 enfant

    const handleFoodPreferenceChange = (value: string) => {
        if (foodPreferences.includes(value)) {
            setFoodPreferences(foodPreferences.filter(item => item !== value));
        } else {
            setFoodPreferences([...foodPreferences, value]);
        }
    };

    const handleActivityTypeChange = (value: string) => {
        if (activityTypes.includes(value)) {
            setActivityTypes(activityTypes.filter(item => item !== value));
        } else {
            setActivityTypes([...activityTypes, value]);
        }
    };

    // Remplacer IonDatetime pour la sélection des heures par IonSelect avec des heures rondes
    const hourOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const handleTimeChange = (selectedTime: string, isArrival: boolean) => {
        // selectedTime est une chaîne comme '08:00', '09:00', etc.
        if (isArrival) {
            setArrivalTime(selectedTime);
        } else {
            setDepartureTime(selectedTime);
        }
    };

    const handleDateChange = (selectedDate: string) => {
        if (selectingArrival) {
            setArrivalDate(selectedDate);
            setDepartureDate('');
            setSelectingArrival(false);
        } else {
            if (selectedDate >= arrivalDate) {
                setDepartureDate(selectedDate);
                setSelectingArrival(true);
            } else {
                setArrivalDate(selectedDate);
                setDepartureDate('');
                setSelectingArrival(false);
            }
        }
    };

    const handleSubmit = () => {
        // const tripData: TripData = {
        //     tripName,
        //     description,
        //     // city, // Ensured to be City
        //     guests: { adults, children },
        //     dates: {
        //         arrival: `${arrivalDate}T${arrivalTime}`,
        //         departure: `${departureDate}T${departureTime}`,
        //     },
        //     budget,
        //     foodPreferences,
        //     activityTypes,
        // };

        // createTrip(tripData, null); // Pass the user to createTrip
        router.push(`/${languageCode}/trip`, 'forward');
    };


    const handleViewTrip = () => {
        const tripSummary = {
            tripName,
            description,
            guests: { adults, children },
            dates: {
                arrival: `${arrivalDate} ${arrivalTime}`,
                departure: `${departureDate} ${departureTime}`,
            },
            budget,
            foodPreferences,
            activityTypes,
        };
        console.log('Résumé du Voyage:', tripSummary);

    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const variants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
    };

    const locale = LangToLocale(languageCode);

    useEffect(() => {
        if (arrivalDate && departureDate) {
            const datesInRange = getDatesInRange(arrivalDate, departureDate);
            const highlights: HighlightedDate[] = datesInRange.map(date => ({
                date,
                textColor: '#ffffff',
                backgroundColor: '#3880ff',
            }));
            setHighlightedDates(highlights);
        } else if (arrivalDate && !departureDate) {
            setHighlightedDates([{ date: arrivalDate, textColor: '#ffffff', backgroundColor: '#3880ff' }]);
        } else {
            setHighlightedDates([]);
        }
    }, [arrivalDate, departureDate]);

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Créer un Voyage</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Fermer</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="form-container">

                    <IonProgressBar value={currentStep / 6} color="secondary" />
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 1: Nombre de Personnes */}
                                <IonItem>
                                    <IonLabel position="stacked">Nombre d'Adultes</IonLabel>
                                    <div className="counter-container">
                                        <IonButton
                                            onClick={decrementAdults}
                                            disabled={adults <= 1}
                                            size="small"
                                            className="counter-button"
                                        >
                                            -
                                        </IonButton>
                                        <span className="counter-value">{adults}</span>
                                        <IonButton
                                            onClick={incrementAdults}
                                            disabled={adults >= 10}
                                            size="small"
                                            className="counter-button"
                                        >
                                            +
                                        </IonButton>
                                    </div>
                                </IonItem>

                                <IonItem>
                                    <IonLabel position="stacked">Nombre d'Enfants</IonLabel>
                                    <div className="counter-container">
                                        <IonButton
                                            onClick={decrementChildren}
                                            disabled={children <= 0}
                                            size="small"
                                            className="counter-button"
                                        >
                                            -
                                        </IonButton>
                                        <span className="counter-value">{children}</span>
                                        <IonButton
                                            onClick={incrementChildren}
                                            disabled={children >= 10}
                                            size="small"
                                            className="counter-button"
                                        >
                                            +
                                        </IonButton>
                                    </div>
                                </IonItem>

                                <div className="ion-margin-top">
                                    <IonButton onClick={nextStep} expand="block">
                                        Suivant
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 2: Dates et Heures */}
                                <IonItem>
                                    <IonLabel position="stacked">
                                        {selectingArrival ? 'Sélectionnez la Date d\'Arrivée' : 'Sélectionnez la Date de Départ'}
                                    </IonLabel>
                                    <IonDatetime
                                        presentation="date"
                                        locale={locale} // Utilisation de la locale
                                        value={selectingArrival ? arrivalDate : departureDate}
                                        onIonChange={(e) => handleDateChange(e.detail.value as string)}
                                        min={today} // Définir la date minimale à aujourd'hui
                                        max="2030-12-31"
                                        highlightedDates={highlightedDates}
                                    />
                                </IonItem>

                                {!selectingArrival && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IonItem>
                                            <IonLabel position="stacked">Heure d'Arrivée</IonLabel>
                                            <IonSelect
                                                placeholder="Sélectionnez une heure"
                                                value={arrivalTime}
                                                onIonChange={(e) => handleTimeChange(e.detail.value as string, true)}
                                            >
                                                {hourOptions.map((hour) => (
                                                    <IonSelectOption key={hour} value={hour}>
                                                        {hour}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel position="stacked">Heure de Départ</IonLabel>
                                            <IonSelect
                                                placeholder="Sélectionnez une heure"
                                                value={departureTime}
                                                onIonChange={(e) => handleTimeChange(e.detail.value as string, false)}
                                            >
                                                {hourOptions.map((hour) => (
                                                    <IonSelectOption key={hour} value={hour}>
                                                        {hour}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>
                                    </motion.div>
                                )}

                                <div className="ion-margin-top">
                                    <IonButton onClick={prevStep} fill="outline" expand="block">
                                        Précédent
                                    </IonButton>
                                    <IonButton
                                        onClick={nextStep}
                                        expand="block"
                                        disabled={!arrivalDate || (!selectingArrival && !departureDate)}
                                    >
                                        Suivant
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 3: Budget / Luxueux */}
                                <IonItem>
                                    <IonLabel>Budget / Luxueux</IonLabel>
                                    <IonRange
                                        min={1}
                                        max={10}
                                        step={1}
                                        snaps={true}
                                        value={budget}
                                        onIonChange={(e) => setBudget(e.detail.value as number)}
                                        color="secondary"
                                    >
                                        <IonLabel slot="start">Budget</IonLabel>
                                        <IonLabel slot="end">Luxueux</IonLabel>
                                    </IonRange>
                                </IonItem>

                                <div className="ion-margin-top">
                                    <IonButton onClick={prevStep} fill="outline" expand="block">
                                        Précédent
                                    </IonButton>
                                    <IonButton onClick={nextStep} expand="block">
                                        Suivant
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 4: Préférences Alimentaires */}
                                <IonItem>
                                    <IonLabel>Préférences Alimentaires</IonLabel>
                                </IonItem>
                                <IonList>
                                    {foodOptions.map(option => (
                                        <IonItem key={option.value}>
                                            <IonLabel>{option.label}</IonLabel>
                                            <IonCheckbox
                                                slot="end"
                                                checked={foodPreferences.includes(option.value)}
                                                onIonChange={() => handleFoodPreferenceChange(option.value)}
                                            />
                                        </IonItem>
                                    ))}
                                </IonList>

                                <div className="ion-margin-top">
                                    <IonButton onClick={prevStep} fill="outline" expand="block">
                                        Précédent
                                    </IonButton>
                                    <IonButton onClick={nextStep} expand="block">
                                        Suivant
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 5: Types d'Activités */}
                                <IonItem>
                                    <IonLabel>Types d'Activités</IonLabel>
                                </IonItem>
                                <IonList>
                                    {activityOptions.map(option => (
                                        <IonItem key={option.value}>
                                            <IonLabel>{option.label}</IonLabel>
                                            <IonCheckbox
                                                slot="end"
                                                checked={activityTypes.includes(option.value)}
                                                onIonChange={() => handleActivityTypeChange(option.value)}
                                            />
                                        </IonItem>
                                    ))}
                                </IonList>

                                <div className="ion-margin-top">
                                    <IonButton onClick={prevStep} fill="outline" expand="block">
                                        Précédent
                                    </IonButton>
                                    <IonButton onClick={nextStep} expand="block">
                                        Suivant
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 6 && (
                            <motion.div
                                key="step6"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Étape 6: Confirmation */}
                                <IonItem>
                                    <IonLabel>Votre voyage est prêt</IonLabel>
                                </IonItem>

                                <div className="ion-margin-top">
                                    <IonButton onClick={prevStep} fill="outline" expand="block">
                                        Précédent
                                    </IonButton>
                                    <IonButton onClick={handleSubmit} color="primary" expand="block">
                                        Confirmer et Créer
                                    </IonButton>
                                    <IonButton onClick={handleViewTrip} color="success" expand="block">
                                        Voir mon voyage
                                    </IonButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </IonContent>
        </>
    );

};

export default TripForm;
