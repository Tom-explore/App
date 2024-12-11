import request from 'supertest';
import { app } from '../../index';
import AppDataSource from '../../config/AppDataSource';

let cityId: number;
let countryId: number;
let partnerId: number;
let languageId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Créer un Language
  const languageResponse = await request(app).post('/language').send({ code: 'EN', name: 'English' });
  expect(languageResponse.status).toBe(201);
  languageId = languageResponse.body.language.id;

  // Créer un Country
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });
  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Créer une City
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });
  expect(cityResponse.status).toBe(201);
  cityId = cityResponse.body.city.id;

  // Créer un Partner
  const partnerResponse = await request(app).post('/partner').send({
    name: 'Test Partner',
    countryId,
    languageId,
  });
  expect(partnerResponse.status).toBe(201);
  partnerId = partnerResponse.body.partner.id;
});

afterAll(async () => {







  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();

  }
});

describe('Integration Tests', () => {
  describe('CountryController', () => {
    it('should retrieve, update, and delete a country', async () => {
      const getResponse = await request(app).get(`/country/${countryId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.slug).toBe('test-country');

      const updateResponse = await request(app).put(`/country/${countryId}`).send({ slug: 'updated-country' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.country.slug).toBe('updated-country');
    });
  });

  describe('CityController', () => {
    it('should retrieve, update, and delete a city', async () => {
      const getResponse = await request(app).get(`/city/${cityId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.slug).toBe('test-city');

      const updateResponse = await request(app).put(`/city/${cityId}`).send({ slug: 'updated-city' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.city.slug).toBe('updated-city');
    });
  });

  describe('PartnerController', () => {
    it('should retrieve, update, and delete a partner', async () => {
      const getResponse = await request(app).get(`/partner/${partnerId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe('Test Partner');

      const updateResponse = await request(app).put(`/partner/${partnerId}`).send({ name: 'Updated Partner' });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.partner.name).toBe('Updated Partner');
    });
  });
});
