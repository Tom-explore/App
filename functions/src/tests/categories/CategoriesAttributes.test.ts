import request from 'supertest';
import { app } from '../../index';
import { initializeDataSource } from '../../config/AppDataSource';
import AppDataSource from '../../config/AppDataSource';

let countryId: number;
let city: any; // Entité complète de City
let placeId: number;
let categoryId: number;
let attributeId: number;

beforeAll(async () => {
  await initializeDataSource();
  console.log('Database initialized.');

  // Créer un Country
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });
  console.log('Country creation response:', countryResponse.body);
  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Créer une City
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });
  console.log('City creation response:', cityResponse.body);
  expect(cityResponse.status).toBe(201);
  city = cityResponse.body.city; // Récupérer l'entité complète de City

  // Créer une Place avec l'entité `City`
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
  console.log('Place creation response:', placeResponse.body);
  expect(placeResponse.status).toBe(201);
  placeId = placeResponse.body.place.id;

  // Créer une Category
  const categoryResponse = await request(app).post('/category').send({ slug: 'test-category', main: true });
  console.log('Category creation response:', categoryResponse.body);
  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category.id;

  // Créer un Attribute
  const attributeResponse = await request(app).post('/attribute').send({ slug: 'Test Attribute' });
  console.log('Attribute creation response:', attributeResponse.body);
  expect(attributeResponse.status).toBe(201);
  attributeId = attributeResponse.body.attribute.id;
});

afterAll(async () => {
  console.log('Cleaning up created entities...');

  await request(app).delete(`/place/${placeId}`).then(res => console.log('Place deletion response:', res.body));
  await request(app).delete(`/city/${city.id}`).then(res => console.log('City deletion response:', res.body));
  await request(app).delete(`/country/${countryId}`).then(res => console.log('Country deletion response:', res.body));
  await request(app).delete(`/category/${categoryId}`).then(res => console.log('Category deletion response:', res.body));
  await request(app).delete(`/attribute/${attributeId}`).then(res => console.log('Attribute deletion response:', res.body));

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
});

describe('Blog API - Tests d\'intégration', () => {
  describe('AttributeController', () => {
    it('devrait créer, récupérer, mettre à jour et supprimer un attribute', async () => {
      console.log('Testing AttributeController...');
      
      // Get by ID
      const getResponse = await request(app).get(`/attribute/${attributeId}`);
      console.log('Get Attribute response:', getResponse.body);
      expect(getResponse.status).toBe(200);

      // Update
      const updateResponse = await request(app).put(`/attribute/${attributeId}`).send({ name: 'Updated Attribute' });
      console.log('Update Attribute response:', updateResponse.body);
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.attribute.name).toBe('Updated Attribute');
    });
  });

  describe('CategoryController', () => {
    it('devrait créer, récupérer, mettre à jour et supprimer une category', async () => {
      console.log('Testing CategoryController...');
      
      // Get by ID
      const getResponse = await request(app).get(`/category/${categoryId}`);
      console.log('Get Category response:', getResponse.body);
      expect(getResponse.status).toBe(200);

      // Update
      const updateResponse = await request(app).put(`/category/${categoryId}`).send({ slug: 'updated-category' });
      console.log('Update Category response:', updateResponse.body);
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.category.slug).toBe('updated-category');
    });
  });

  describe('PlaceAttributeController', () => {
    let placeAttributeId: number;

    it('devrait créer, récupérer et supprimer un place attribute', async () => {
      console.log('Testing PlaceAttributeController...');
      
      // Create
      const createResponse = await request(app).post('/placeattribute').send({
        placeId,
        attributeId,
        value: 3
      });
      console.log('Create PlaceAttribute response:', createResponse.body);
      expect(createResponse.status).toBe(201);
      placeAttributeId = createResponse.body.placeAttribute.id;

      // Get by Place and Attribute
      const getResponse = await request(app).get(`/placeattribute/${placeAttributeId}`);
      console.log('Get PlaceAttribute response:', getResponse.body);
      expect(getResponse.status).toBe(200);

      // Delete
      const deleteResponse = await request(app).delete(`/placeattribute/${placeAttributeId}`);
      console.log('Delete PlaceAttribute response:', deleteResponse.body);
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('PlaceCategoryController', () => {
    let placeCategoryId: number;

    it('devrait créer, récupérer et supprimer un place category', async () => {
      console.log('Testing PlaceCategoryController...');
      
      // Create
      const createResponse = await request(app).post('/placecategory').send({
        placeId,
        categoryId,
      });
      console.log('Create PlaceCategory response:', createResponse.body);
      expect(createResponse.status).toBe(201);
      placeCategoryId = createResponse.body.placeCategory.id;

      // Get by Place
      const getResponse = await request(app).get(`/placecategory/place/${placeId}`);
      console.log('Get PlaceCategory by Place response:', getResponse.body);
      expect(getResponse.status).toBe(200);

      // Delete
      const deleteResponse = await request(app).delete(`/placecategory/${placeCategoryId}`);
      console.log('Delete PlaceCategory response:', deleteResponse.body);
      expect(deleteResponse.status).toBe(200);
    });
  });
});