import request from 'supertest';
import { app } from '../../index';
import AppDataSource from '../../config/AppDataSource';
import { City } from '../../model/common/City';

let countryId: number;
let city: City;
let placeId: number;
let hotelId: number;
let restaurantBarId: number;
let touristAttractionId: number;
let placeImgId: number;
let openingHourId: number;
let crowdLevelId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Créer un pays
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });

  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Créer une ville
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });

  expect(cityResponse.status).toBe(201);
  city = cityResponse.body.city; // Récupérer l'entité complète de City
});

afterAll(async () => {

  if (crowdLevelId) await request(app).delete(`/crowdlevel/${crowdLevelId}`);
  if (openingHourId) await request(app).delete(`/openinghours/${openingHourId}`);
  if (placeImgId) await request(app).delete(`/placeimg/${placeImgId}`);
  if (touristAttractionId) await request(app).delete(`/touristattraction/${touristAttractionId}`);
  if (restaurantBarId) await request(app).delete(`/restaurantbar/${restaurantBarId}`);
  if (hotelId) await request(app).delete(`/hotel/${hotelId}`);
  if (placeId) await request(app).delete(`/place/${placeId}`);
  await request(app).delete(`/city/${city.id}`);
  await request(app).delete(`/country/${countryId}`);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();

  }
});

describe('Integration Tests for Place Controllers', () => {
  describe('PlaceController', () => {
    it('should create, retrieve, update, and delete a place', async () => {
      const placeData = {
        name: 'Test Place',
        slug: 'test-place',
        city, // Passer l'entité City complète
        type: 'hotel', // Type correspondant à l'énum PlaceType
        address: '123 Test Street',
        zip_code: '12345',
        lat: 48.8566,
        lng: 2.3522,
        public: true,
        price_range: 2,
        duration: 60,
        last_api_scraped: new Date().toISOString(), // Date pour respecter la contrainte NOT NULL
      };

      const placeResponse = await request(app).post('/place').send(placeData);

      expect(placeResponse.status).toBe(201);
      placeId = placeResponse.body.place.id;

      const getResponse = await request(app).get(`/place/${placeId}`);

      expect(getResponse.status).toBe(200);

      const updateResponse = await request(app).put(`/place/${placeId}`).send({ name: 'Updated Place' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.place.name).toBe('Updated Place');
    });
  });

  describe('HotelController', () => {
    it('should create, retrieve, update, and delete a hotel, and associate it with the "hotel" category', async () => {
      const hotelData = {
        place: {
          city: { id: city.id }, // Lien avec la ville existante
          slug: 'test-hotel',
          address: 'Hotel Address',
          zip_code: '12345',
          lat: 48.8566,
          lng: 2.3522,
          last_api_scraped: new Date().toISOString(),
          public: true,
        },
        booking_link: 'https://example.com/booking',
        avg_price_per_night: 150,
        pets_authorized: true,
      };

      const createResponse = await request(app).post('/hotel').send(hotelData);
      expect(createResponse.status).toBe(201);
      hotelId = createResponse.body.hotel.id;
      // Récupération
      const getResponse = await request(app).get(`/hotel/${hotelId}`);
      expect(getResponse.status).toBe(200);

      // Mise à jour
      const updateResponse = await request(app).put(`/hotel/${hotelId}`).send({ avg_price_per_night: 200 });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.hotel.avg_price_per_night).toBe(200);

      // Suppression
      const deleteResponse = await request(app).delete(`/hotel/${hotelId}`);
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('RestaurantBarController', () => {
    it('should create, retrieve, update, and delete a restaurant/bar, and associate it with the "bar_restaurant" category', async () => {
      const restaurantBarData = {
        place: {
          city: { id: city.id },
          slug: 'test-restaurant',
          address: 'Restaurant Address',
          zip_code: '54321',
          lat: 48.8566,
          lng: 2.3522,
          last_api_scraped: new Date().toISOString(),
          public: true,
        },
        menu: 'Sample Menu',
        price_min: 10,
        price_max: 50,
      };

      const createResponse = await request(app).post('/restaurantbar').send(restaurantBarData);
      expect(createResponse.status).toBe(201);
      restaurantBarId = createResponse.body.restaurantBar.id;

      // Récupération
      const getResponse = await request(app).get(`/restaurantbar/${restaurantBarId}`);
      expect(getResponse.status).toBe(200);

      // Mise à jour
      const updateResponse = await request(app).put(`/restaurantbar/${restaurantBarId}`).send({ price_max: 60 });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.restaurantBar.price_max).toBe(60);

      // Suppression
      const deleteResponse = await request(app).delete(`/restaurantbar/${restaurantBarId}`);
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('TouristAttractionController', () => {
    it('should create, retrieve, update, and delete a tourist attraction, and associate it with the "tourist_attraction" category', async () => {
      const attractionData = {
        place: {
          city: { id: city.id },
          slug: 'test-attraction',
          address: 'Attraction Address',
          zip_code: '67890',
          lat: 48.8566,
          lng: 2.3522,
          last_api_scraped: new Date().toISOString(),
          public: true,
        },
        name_original: 'Attraction Original',
        wiki_link: 'https://wikipedia.org/example',
        price_regular: 20,
        price_children: 10,
        tickets_gyg: true,
        tickets_civitatis: false,
        tickets_direct_site: 'https://example.com/tickets',
      };

      const createResponse = await request(app).post('/touristattraction').send(attractionData);
      expect(createResponse.status).toBe(201);
      touristAttractionId = createResponse.body.attraction.id;


      // Récupération
      const getResponse = await request(app).get(`/touristattraction/${touristAttractionId}`);
      expect(getResponse.status).toBe(200);

      // Mise à jour
      const updateResponse = await request(app).put(`/touristattraction/${touristAttractionId}`).send({ tickets_gyg: false });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.attraction.tickets_gyg).toBe(false);

      // Suppression
      const deleteResponse = await request(app).delete(`/touristattraction/${touristAttractionId}`);
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('PlaceImgController', () => {
    it('should create, retrieve, update, and delete a place image', async () => {
      const placeImgData = {
        slug: 'test-image',
        placeId, // Lien avec le `placeId` déjà créé
        author: 'Test Author',
        license: 'CC BY-SA',
        top: 1,
        source: 'http://example.com/source.jpg',
      };

      // Création de l'image
      const createResponse = await request(app).post('/placeimg').send(placeImgData);

      expect(createResponse.status).toBe(201);
      placeImgId = createResponse.body.placeImg.id;

      // Récupération de l'image
      const getResponse = await request(app).get(`/placeimg/${placeImgId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.slug).toBe('test-image');
      expect(getResponse.body.author).toBe('Test Author');

      // Mise à jour de l'image
      const updateResponse = await request(app).put(`/placeimg/${placeImgId}`).send({ author: 'Updated Author', top: 2 });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.placeImg.author).toBe('Updated Author');
      expect(updateResponse.body.placeImg.top).toBe(2);

      // Suppression de l'image
      const deleteResponse = await request(app).delete(`/placeimg/${placeImgId}`);

      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('OpeningHoursController', () => {
    it('should create, retrieve, update, and delete opening hours', async () => {
      const openingHoursData = {
        place: { id: placeId }, // Passer l'objet Place avec un ID
        day_of_week: 1, // Lundi
        start_time_1: '09:00:00',
        stop_time_1: '12:00:00',
        start_time_2: '13:00:00',
        stop_time_2: '17:00:00',
      };

      // Création des horaires
      const createResponse = await request(app).post('/openinghours').send(openingHoursData);

      expect(createResponse.status).toBe(201);
      openingHourId = createResponse.body.openingHour.id;

      // Récupération des horaires par lieu
      const getResponse = await request(app).get(`/openinghours/place/${placeId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1); // Une seule plage horaire pour le lieu
      expect(getResponse.body[0].day_of_week).toBe(1);

      // Mise à jour des horaires
      const updateData = { start_time_1: '10:00:00', stop_time_1: '13:00:00' };
      const updateResponse = await request(app).put(`/openinghours/${openingHourId}`).send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.openingHour.start_time_1).toBe('10:00:00');
      expect(updateResponse.body.openingHour.stop_time_1).toBe('13:00:00');

      // Suppression des horaires
      const deleteResponse = await request(app).delete(`/openinghours/${openingHourId}`);

      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('CrowdLevelController', () => {
    it('should create, retrieve, update, and delete crowd levels', async () => {
      const crowdLevelData = {
        place: { id: placeId }, // Passer l'objet Place avec un ID
        day_of_week: 2, // Mardi
        hour: '14:00:00',
        status: 'usually_not_busy', // Exemple de statut (doit correspondre à l'énumération CrowdStatus)
      };

      // Création du niveau de foule
      const createResponse = await request(app).post('/crowdlevel').send(crowdLevelData);

      expect(createResponse.status).toBe(201);
      crowdLevelId = createResponse.body.crowdLevel.id;

      // Récupération du niveau de foule par lieu
      const getResponse = await request(app).get(`/crowdlevel/place/${placeId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1); // Une seule entrée pour le lieu
      expect(getResponse.body[0].day_of_week).toBe(2);
      expect(getResponse.body[0].status).toBe('usually_not_busy');

      // Mise à jour du niveau de foule
      const updateData = { hour: '15:00:00', status: 'usually_a_little_busy' };
      const updateResponse = await request(app).put(`/crowdlevel/${crowdLevelId}`).send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.crowdLevel.hour).toBe('15:00:00');
      expect(updateResponse.body.crowdLevel.status).toBe('usually_a_little_busy');

      // Suppression du niveau de foule
      const deleteResponse = await request(app).delete(`/crowdlevel/${crowdLevelId}`);

      expect(deleteResponse.status).toBe(200);
    });
  });

});
