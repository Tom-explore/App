import { useState, useCallback, useEffect } from 'react';

const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 heure

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

export const useCache = () => {
    const [cache, setCache] = useState<Map<string, CacheEntry<any>>>(new Map());

    // Sauvegarder une donnée dans le cache
    const setItem = useCallback(
        <T>(key: string, data: T) => {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
            };

            // Mettre à jour le cache en mémoire
            setCache((prev) => {
                const newCache = new Map(prev);
                newCache.set(key, entry);
                return newCache;
            });

            // Sauvegarder dans localStorage
            localStorage.setItem(key, JSON.stringify(entry));
        },
        []
    );

    // Récupérer une donnée depuis le cache
    const getItem = useCallback(
        <T>(key: string): T | null => {
            const entry = cache.get(key);

            // Si l'entrée existe dans la mémoire et n'est pas expirée
            if (entry && Date.now() - entry.timestamp < CACHE_EXPIRATION_MS) {
                return entry.data;
            }

            // Vérifier dans localStorage
            const localStorageEntry = localStorage.getItem(key);
            if (localStorageEntry) {
                const parsedEntry: CacheEntry<T> = JSON.parse(localStorageEntry);
                if (Date.now() - parsedEntry.timestamp < CACHE_EXPIRATION_MS) {
                    // Met à jour le cache en mémoire
                    setCache((prev) => {
                        const newCache = new Map(prev);
                        newCache.set(key, parsedEntry);
                        return newCache;
                    });
                    return parsedEntry.data;
                } else {
                    // Supprime les données expirées
                    localStorage.removeItem(key);
                }
            }

            return null;
        },
        [cache]
    );

    // Supprimer une donnée du cache
    const removeItem = useCallback((key: string) => {
        setCache((prev) => {
            const newCache = new Map(prev);
            newCache.delete(key);
            return newCache;
        });
        localStorage.removeItem(key);
    }, []);

    // Vider complètement le cache
    const clearCache = useCallback(() => {
        setCache(new Map());
        localStorage.clear();
    }, []);

    // Fonction pour ajouter ou mettre à jour plusieurs places dans le cache
    const setAllPlaces = useCallback(
        (places: any[], cityId: string) => {
            const key = `places_${cityId}`;
            setItem(key, places);
        },
        [setItem]
    );

    // Récupérer toutes les places pour une ville
    const getAllPlaces = useCallback(
        (cityId: string) => {
            const key = `places_${cityId}`;
            return getItem<any[]>(key);
        },
        [getItem]
    );

    return {
        setItem,
        getItem,
        removeItem,
        clearCache,
        setAllPlaces,
        getAllPlaces,
    };
};
