import {
    collection,
    doc,
    getDoc,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore';
import { firestore } from '../firebaseconfig';
import { City } from '../../types/CommonInterfaces';
import { Place } from '../../types/PlacesInterfaces';

class CityController {
    /**
     * Obtient les détails d'une ville spécifique en fonction du slug et de l'ID de langue.
     * @param slug - Le slug de la ville.
     * @param languageId - L'ID de la langue.
     * @returns Les données de la ville.
     * @throws Erreur si la ville n'est pas trouvée.
     */
    public async getCity(slug: string, languageId: number): Promise<City> {
        const cityDocId = `${slug}-${languageId}`;
        const cityDocRef = doc(collection(firestore, 'City'), cityDocId);
        const citySnapshot = await getDoc(cityDocRef);

        if (!citySnapshot.exists()) {
            throw new Error('Ville non trouvée');
        }

        const cityData = citySnapshot.data() as City;
        return cityData;
    }

    /**
     * Obtient les lieux d'une catégorie spécifique pour une ville donnée.
     * @param slug - Le slug de la ville.
     * @param languageId - L'ID de la langue.
     * @param category - La catégorie des lieux (ex. 'restaurantsBars', 'hotels', 'touristAttractions').
     * @returns Une liste de lieux dans la catégorie spécifiée.
     */
    public async getPlacesByCategory(
        slug: string,
        languageId: number,
        category: string
    ): Promise<Place[]> {
        const cityDocId = `${slug}-${languageId}`;
        const placesCollectionRef = collection(firestore, 'City', cityDocId, category);

        const placesSnapshot: QuerySnapshot<DocumentData> = await getDocs(placesCollectionRef);
        const places: Place[] = [];

        placesSnapshot.forEach((docSnap) => {
            const placeData = docSnap.data() as Place;
            places.push(placeData); // No redefinition of `id`
        });

        return places;
    }


    /**
     * Obtient tous les lieux pour les catégories spécifiées d'une ville donnée.
     * @param slug - Le slug de la ville.
     * @param languageId - L'ID de la langue.
     * @param categories - Une liste de catégories à récupérer.
     * @returns Un objet contenant les lieux groupés par catégorie.
     */
    public async getAllPlaces(
        slug: string,
        languageId: number,
        categories: string[]
    ): Promise<Record<string, Place[]>> {
        const allPlaces: Record<string, Place[]> = {};

        for (const category of categories) {
            const places = await this.getPlacesByCategory(slug, languageId, category);
            allPlaces[category] = places;
        }

        return allPlaces;
    }
}

export default new CityController();
