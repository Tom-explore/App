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

beforeAll(async () => {
  await initializeDataSource();
  console.log('Database initialized.');

  // Création d'un pays
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });
  console.log('Country creation response:', countryResponse.body);
  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Création d'une ville
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });
  console.log('City creation response:', cityResponse.body);
  expect(cityResponse.status).toBe(201);
  cityId = cityResponse.body.city.id;
  let city = cityResponse.body.city;

  // Création d'un utilisateur
  const userResponse = await request(app).post('/user').send({
    name: 'testuegegser',
    email: 'testuseergerr@examerple.com',
    pw: 'passworergrd123',
  });
  console.log('User creation response:', userResponse.body);
  expect(userResponse.status).toBe(201);
  userId = userResponse.body.user.id;

  // Création d'une catégorie
  const categoryResponse = await request(app).post('/category').send({ name: 'Test Category', slug: 'test-category' });
  console.log('Category creation response:', categoryResponse.body);
  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category.id;

  // Création de plusieurs attributs
  for (let i = 1; i <= 3; i++) {
    const attributeResponse = await request(app).post('/attribute').send({ name: `Attribute ${i}`, slug: `attribute-${i}` });
    console.log(`Attribute ${i} creation response:`, attributeResponse.body);
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
    console.log(`Place ${i} creation response:`, placeResponse.body);
    expect(placeResponse.status).toBe(201);
    placeIds.push(placeResponse.body.place.id);
  }
});

afterAll(async () => {
  console.log('Cleaning up created entities...');
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
    console.log('Database connection closed.');
  }
});

describe('Data Initialization Check', () => {
  it('should verify that all entities have been created successfully', async () => {
    // Vérification du pays
    const countryResponse = await request(app).get(`/country/${countryId}`);
    console.log('Country retrieval response:', countryResponse.body);
    expect(countryResponse.status).toBe(200);
    expect(countryResponse.body.slug).toBe('test-country');

    // Vérification de la ville
    const cityResponse = await request(app).get(`/city/${cityId}`);
    console.log('City retrieval response:', cityResponse.body);
    expect(cityResponse.status).toBe(200);
    expect(cityResponse.body.slug).toBe('test-city');

    // Vérification de l'utilisateur
    const userResponse = await request(app).get(`/user/${userId}`);
    console.log('User retrieval response:', userResponse.body);
    expect(userResponse.status).toBe(200);

    // Vérification de la catégorie
    const categoryResponse = await request(app).get(`/category/${categoryId}`);
    console.log('Category retrieval response:', categoryResponse.body);
    expect(categoryResponse.status).toBe(200);

    // Vérification des attributs
    for (const attributeId of attributeIds) {
      const attributeResponse = await request(app).get(`/attribute/${attributeId}`);
      console.log(`Attribute retrieval response:`, attributeResponse.body);
      expect(attributeResponse.status).toBe(200);
    }

    // Vérification des lieux (Place)
    for (const placeId of placeIds) {
      const placeResponse = await request(app).get(`/place/${placeId}`);
      console.log(`Place retrieval response:`, placeResponse.body);
      expect(placeResponse.status).toBe(200);
    }
  });
});
