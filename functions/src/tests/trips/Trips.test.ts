import request from 'supertest';
import { app } from '../../index';
import { initializeDataSource } from '../../config/AppDataSource';
import AppDataSource from '../../config/AppDataSource';

let countryId: number;
let cityId: number;
let userId: number;
let categoryId: number;
let attributeIds: number[] = [];
let placeIds: number[] = [];
let tripId: number;
let peopleId: number;
const generateRandomEmail = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10); // Génère une chaîne aléatoire
  return `testuser_${randomString}@example.com`;
};
beforeAll(async () => {
  await initializeDataSource();

  // Création d'un pays
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });
  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Création d'une ville
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });
  expect(cityResponse.status).toBe(201);
  cityId = cityResponse.body.city.id;
  let city = cityResponse.body.city;

  // Création d'un utilisateur
  const email = generateRandomEmail();
  const userResponse = await request(app).post('/user').send({
    email,
    name: 'Test User',
    pw: 'password123',
  });

  expect(userResponse.status).toBe(201);
  userId = userResponse.body.user.id;

  // Création d'une catégorie
  const categoryResponse = await request(app).post('/category').send({ name: 'Test Category', slug: 'test-category' });
  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category.id;

  // Création de plusieurs attributs
  for (let i = 1; i <= 3; i++) {
    const attributeResponse = await request(app).post('/attribute').send({ name: `Attribute ${i}`, slug: `attribute-${i}` });
    expect(attributeResponse.status).toBe(201);
    attributeIds.push(attributeResponse.body.attribute.id);
  }

  // Création de plusieurs lieux (Place)
  for (let i = 1; i <= 5; i++) {
    const placeResponse = await request(app).post('/place').send({
      name: `Place ${i}`,
      slug: `place-${i}`,
      city,
      type: 'hotel', // Exemple de type
      address: `123 Place ${i} Street`,
      zip_code: `1234${i}`,
      lat: 48.8566,
      lng: 2.3522,
      public: true,
      categoryId,
      last_api_scraped: new Date().toISOString(),
    });
    expect(placeResponse.status).toBe(201);
    placeIds.push(placeResponse.body.place.id);
  }
});

afterAll(async () => {

  for (const placeId of placeIds) {
    await request(app).delete(`/place/${placeId}`);
  }
  for (const attributeId of attributeIds) {
    await request(app).delete(`/attribute/${attributeId}`);
  }
  await request(app).delete(`/category/${categoryId}`);
  await request(app).delete(`/user/${userId}`);
  await request(app).delete(`/city/${cityId}`);
  await request(app).delete(`/country/${countryId}`);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();

  }
});

describe('Data Initialization Check', () => {
  it('should verify that all entities have been created successfully', async () => {
    // Vérification du pays
    const countryResponse = await request(app).get(`/country/${countryId}`);
    expect(countryResponse.status).toBe(200);
    expect(countryResponse.body.slug).toBe('test-country');

    // Vérification de la ville
    const cityResponse = await request(app).get(`/city/${cityId}`);
    expect(cityResponse.status).toBe(200);
    expect(cityResponse.body.slug).toBe('test-city');

    // Vérification de l'utilisateur
    const userResponse = await request(app).get(`/user/${userId}`);
    expect(userResponse.status).toBe(200);

    // Vérification de la catégorie
    const categoryResponse = await request(app).get(`/category/${categoryId}`);
    expect(categoryResponse.status).toBe(200);

    // Vérification des attributs
    for (const attributeId of attributeIds) {
      const attributeResponse = await request(app).get(`/attribute/${attributeId}`);
      expect(attributeResponse.status).toBe(200);
    }

    // Vérification des lieux (Place)
    for (const placeId of placeIds) {
      const placeResponse = await request(app).get(`/place/${placeId}`);
      expect(placeResponse.status).toBe(200);
    }
  });
});


describe('TripController Tests', () => {
  it('should create a trip successfully', async () => {
    const tripResponse = await request(app).post('/trip').send({
      user: userId,
      city: cityId,
      datetime_start: new Date().toISOString(),
      datetime_end: new Date(new Date().getTime() + 86400000).toISOString(), // +1 jour
      public: true,
      price_range: 2,
    });


    expect(tripResponse.status).toBe(201);
    expect(tripResponse.body.trip).toHaveProperty('id');
    tripId = tripResponse.body.trip.id;
  });

  it('should retrieve a trip by id', async () => {
    const tripResponse = await request(app).get(`/trip/${tripId}`);

    expect(tripResponse.status).toBe(200);
    expect(tripResponse.body).toHaveProperty('id', tripId);
  });

  it('should retrieve trips by user', async () => {
    const tripsResponse = await request(app).get(`/trip/user/${userId}`);

    expect(tripsResponse.status).toBe(200);
    expect(Array.isArray(tripsResponse.body)).toBe(true);
    expect(tripsResponse.body.some((trip: any) => trip.id === tripId)).toBe(true);
  });

  it('should update a trip', async () => {
    const updatedData = {
      public: false,
      price_range: 3,
    };
    const updateResponse = await request(app).put(`/trip/${tripId}`).send(updatedData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.trip).toMatchObject(updatedData);
  });
});


describe('PeopleController Tests', () => {
  it('should create a person linked to a trip', async () => {
    const personResponse = await request(app).post('/people').send({
      trip: tripId, // Associe au trip créé précédemment
      age: 30,
    });


    expect(personResponse.status).toBe(201);
    expect(personResponse.body.person).toHaveProperty('id');
    peopleId = personResponse.body.person.id;
  });

  it('should retrieve a person by id', async () => {
    const personResponse = await request(app).get(`/people/${peopleId}`);

    expect(personResponse.status).toBe(200);
    expect(personResponse.body).toHaveProperty('id', peopleId);
    expect(personResponse.body).toHaveProperty('age', 30);
  });

  it('should retrieve all people linked to a trip', async () => {
    const peopleResponse = await request(app).get(`/people/trip/${tripId}`);

    expect(peopleResponse.status).toBe(200);
    expect(Array.isArray(peopleResponse.body)).toBe(true);
    expect(peopleResponse.body.some((person: any) => person.id === peopleId)).toBe(true);
  });

  it('should update a person', async () => {
    const updatedData = { age: 35 };
    const updateResponse = await request(app).put(`/people/${peopleId}`).send(updatedData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.person).toHaveProperty('age', 35);
  });

  it('should delete a person', async () => {
    const deleteResponse = await request(app).delete(`/people/${peopleId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Person deleted successfully');

    // Vérifier que la personne a bien été supprimée
    const verifyResponse = await request(app).get(`/people/${peopleId}`);
    expect(verifyResponse.status).toBe(404);
  });
});

let tripAttributeId: { tripId: number; attributeId: number };

describe('TripAttributeController Tests', () => {
  beforeAll(async () => {
    // Utilisation des entités `tripId` et `attributeId` déjà créées
    const tripAttributeResponse = await request(app).post('/tripattribute').send({
      trip_id: tripId, // Utilisation du trip existant
      attribute_id: attributeIds[0], // Utilisation du premier attribut créé
    });

    expect(tripAttributeResponse.status).toBe(201);
    tripAttributeId = {
      tripId: tripAttributeResponse.body.tripAttribute.trip_id,
      attributeId: tripAttributeResponse.body.tripAttribute.attribute_id,
    };
  });

  it('should retrieve an attribute by ID', async () => {
    const response = await request(app).get(
      `/tripattribute/${tripAttributeId.tripId}/${tripAttributeId.attributeId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trip_id', tripAttributeId.tripId);
    expect(response.body).toHaveProperty('attribute_id', tripAttributeId.attributeId);
  });

  it('should retrieve all attributes linked to a trip', async () => {

    const response = await request(app).get(`/tripattribute/attributesbytrip/${tripId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((attr: any) => attr.attribute_id === attributeIds[0])).toBe(true);
  });
  

  it('should update an attribute linked to a trip', async () => {
    const updateResponse = await request(app)
      .put(`/tripattribute/${tripAttributeId.tripId}/${tripAttributeId.attributeId}`)
      .send({ trip_id: tripId, attribute_id: attributeIds[1] }); // Change vers un autre attribut

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.updatedAttribute).toHaveProperty('trip_id', tripId);
    expect(updateResponse.body.updatedAttribute).toHaveProperty('attribute_id', attributeIds[1]);
  });

  it('should delete an attribute linked to a trip', async () => {
    const deleteResponse = await request(app).delete(
      `/tripattribute/${tripAttributeId.tripId}/${tripAttributeId.attributeId}`
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Trip attribute deleted successfully');

    // Vérifier que l'attribut a bien été supprimé
    const verifyResponse = await request(app).get(
      `/tripattribute/${tripAttributeId.tripId}/${tripAttributeId.attributeId}`
    );
    expect(verifyResponse.status).toBe(404);
  });
});
describe('TripCategoryFilterController Tests', () => {
  let tripCategoryId: { tripId: number; categoryId: number };

  beforeAll(async () => {
    // Créer une relation entre un trip et une catégorie existante
    const tripCategoryFilterResponse = await request(app).post('/tripcategoryfilter').send({
      trip_id: tripId, // Utilise le trip existant
      category_id: categoryId, // Utilise la catégorie existante créée au début
    });

    expect(tripCategoryFilterResponse.status).toBe(201);
    tripCategoryId = {
      tripId: tripCategoryFilterResponse.body.tripCategoryFilter.trip_id,
      categoryId: tripCategoryFilterResponse.body.tripCategoryFilter.category_id,
    };
  });

  it('should retrieve a trip category filter by tripId and categoryId', async () => {
    const response = await request(app).get(
      `/tripcategoryfilter/${tripCategoryId.tripId}/${tripCategoryId.categoryId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trip_id', tripCategoryId.tripId);
    expect(response.body).toHaveProperty('category_id', tripCategoryId.categoryId);
  });

  it('should retrieve all trip category filters', async () => {
    const response = await request(app).get('/tripcategoryfilter');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(
      response.body.some(
        (filter: any) =>
          filter.trip_id === tripCategoryId.tripId && filter.category_id === tripCategoryId.categoryId
      )
    ).toBe(true);
  });

  it('should delete a trip category filter by tripId and categoryId', async () => {
    const deleteResponse = await request(app).delete(
      `/tripcategoryfilter/${tripCategoryId.tripId}/${tripCategoryId.categoryId}`
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Trip category filter deleted successfully');

    // Vérifier que la relation est bien supprimée
    const verifyResponse = await request(app).get(
      `/tripcategoryfilter/${tripCategoryId.tripId}/${tripCategoryId.categoryId}`
    );
    expect(verifyResponse.status).toBe(404);
  });
});
describe('TripCompositionController Tests', () => {
  let tripCompositionData: { tripId: number; day: number; position: number; placeId: number };

  beforeAll(async () => {
    // Créer une composition de voyage avec un trip existant et un place existant
    const tripCompositionResponse = await request(app).post('/tripcomposition').send({
      trip_id: tripId, // Utilise le trip existant
      day: 1, // Premier jour
      position: 1, // Première position
      place_id: placeIds[0], // Utilise le premier place existant
      datetime: new Date().toISOString(),
      deleted: false,
    });

    expect(tripCompositionResponse.status).toBe(201);
    tripCompositionData = {
      tripId: tripCompositionResponse.body.composition.trip_id,
      day: tripCompositionResponse.body.composition.day,
      position: tripCompositionResponse.body.composition.position,
      placeId: tripCompositionResponse.body.composition.place_id,
    };
  });

  it('should retrieve a composition by tripId, day, and position', async () => {
    const response = await request(app).get(
      `/tripcomposition/${tripCompositionData.tripId}/${tripCompositionData.day}/${tripCompositionData.position}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('trip_id', tripCompositionData.tripId);
    expect(response.body).toHaveProperty('day', tripCompositionData.day);
    expect(response.body).toHaveProperty('position', tripCompositionData.position);
    expect(response.body).toHaveProperty('place_id', tripCompositionData.placeId);
  });

  it('should retrieve all compositions linked to a trip', async () => {
    const response = await request(app).get(`/tripcomposition/trip/${tripCompositionData.tripId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(
      response.body.some(
        (composition: any) =>
          composition.trip_id === tripCompositionData.tripId &&
          composition.day === tripCompositionData.day &&
          composition.position === tripCompositionData.position
      )
    ).toBe(true);
  });

  it('should update a trip composition', async () => {
    const updatedData = {
      datetime: new Date(new Date().getTime() + 3600000).toISOString(), // +1 heure
      deleted: true,
    };
    const updateResponse = await request(app)
      .put(
        `/tripcomposition/${tripCompositionData.tripId}/${tripCompositionData.day}/${tripCompositionData.position}`
      )
      .send(updatedData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.updatedComposition).toHaveProperty('datetime', updatedData.datetime);
    expect(updateResponse.body.updatedComposition).toHaveProperty('deleted', updatedData.deleted);
  });

  it('should delete a trip composition', async () => {
    const deleteResponse = await request(app).delete(
      `/tripcomposition/${tripCompositionData.tripId}/${tripCompositionData.day}/${tripCompositionData.position}`
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Trip composition deleted successfully');

    // Vérifier que la composition a bien été supprimée
    const verifyResponse = await request(app).get(
      `/tripcomposition/${tripCompositionData.tripId}/${tripCompositionData.day}/${tripCompositionData.position}`
    );
    expect(verifyResponse.status).toBe(404);
  });
});

it('should delete a trip', async () => {
  const deleteResponse = await request(app).delete(`/trip/${tripId}`);

  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body).toHaveProperty('message', 'Trip deleted successfully');

  // Vérifier que le voyage est supprimé
  const verifyResponse = await request(app).get(`/trip/${tripId}`);
  expect(verifyResponse.status).toBe(404);
});