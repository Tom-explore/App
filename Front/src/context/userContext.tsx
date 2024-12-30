// context/UserContext.js
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types/UsersInterfaces';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import apiClient from '../config/apiClient';
import { auth } from '../config/firebaseconfig';
import Cookies from 'js-cookie';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                try {
                    // Récupérer l'utilisateur depuis la BD via l'API backend
                    const response = await apiClient.get('/user', {
                        params: { email: firebaseUser.email },
                    });

                    if (response.status === 200 && response.data) {
                        // Stocker le jeton dans un cookie sécurisé
                        const token = await firebaseUser.getIdToken();
                        Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict' });

                        // Utilisateur trouvé, le stocker dans le contexte
                        setUser(response.data);
                    }
                } catch (error: any) {
                    if (error.response && error.response.status === 404) {
                        // Créer un nouvel utilisateur dans la BD
                        const userData: User = {
                            id: 0,
                            email: firebaseUser.email || '',
                            name: firebaseUser.displayName || 'Utilisateur inconnu',
                            pw: '',
                            google_id: firebaseUser.uid,
                            profile_img: firebaseUser.photoURL || '',
                            confirmed_account: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                            admin: false,
                            author: false,
                        };

                        try {
                            const createResponse = await apiClient.post('/user', userData);
                            if (createResponse.status === 201) {
                                setUser(createResponse.data.user);
                            }
                        } catch (createError: any) {
                            console.error('Erreur lors de la création de l\'utilisateur:', createError);
                            alert('Erreur lors de la création de votre compte. Veuillez réessayer.');
                        }
                    } else {
                        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
                        // alert('Erreur lors de la connexion. Veuillez réessayer.');
                    }
                }
            } else {
                setUser(null);
                Cookies.remove('authToken');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
