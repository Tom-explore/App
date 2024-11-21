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
let postId: number;
let postBlocId: number;
let postImgId: number;
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
  const city = cityResponse.body.city;

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
      type: 'hotel',
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

  // Création d'un post
  const blogResponse = await request(app).post('/post').send({
    userId,
    slug: 'test-post',
  });
  expect(blogResponse.status).toBe(201);
  postId = blogResponse.body.post.id;

  // Création d'un bloc de post
  const postBlocResponse = await request(app).post('/postbloc').send({
    post_id: postId,
    position: 1,
    titleType: 'h1',
    template: 't1',
    visible: true,
  });
  expect(postBlocResponse.status).toBe(201);
  postBlocId = postBlocResponse.body.postBloc.id;

  // Création d'une image pour un post
  const postImgResponse = await request(app).post('/postimg').send({
    slug: 'test-img',
    source: 'test-source',
    author: 'test-author',
  });
  expect(postImgResponse.status).toBe(201);
  postImgId = postImgResponse.body.postImg.id;
});

afterAll(async () => {
  // Suppression des blocs de post
  await request(app).delete(`/postbloc/${postBlocId}`);
  // Suppression des posts
  await request(app).delete(`/post/${postId}`);
  // Suppression des images de post
  await request(app).delete(`/postimg/${postImgId}`);
  // Suppression des lieux
  for (const placeId of placeIds) {
    await request(app).delete(`/place/${placeId}`);
  }
  // Suppression des attributs
  for (const attributeId of attributeIds) {
    await request(app).delete(`/attribute/${attributeId}`);
  }
  // Suppression de la catégorie
  await request(app).delete(`/category/${categoryId}`);
  // Suppression de l'utilisateur
  await request(app).delete(`/user/${userId}`);
  // Suppression de la ville
  await request(app).delete(`/city/${cityId}`);
  // Suppression du pays
  await request(app).delete(`/country/${countryId}`);

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Data Initialization Check', () => {
  it('should verify that all entities have been created successfully', async () => {
    const countryResponse = await request(app).get(`/country/${countryId}`);
    expect(countryResponse.status).toBe(200);

    const cityResponse = await request(app).get(`/city/${cityId}`);
    expect(cityResponse.status).toBe(200);

    const userResponse = await request(app).get(`/user/${userId}`);
    expect(userResponse.status).toBe(200);

    const categoryResponse = await request(app).get(`/category/${categoryId}`);
    expect(categoryResponse.status).toBe(200);

    for (const attributeId of attributeIds) {
      const attributeResponse = await request(app).get(`/attribute/${attributeId}`);
      expect(attributeResponse.status).toBe(200);
    }

    for (const placeId of placeIds) {
      const placeResponse = await request(app).get(`/place/${placeId}`);
      expect(placeResponse.status).toBe(200);
    }

    const postResponse = await request(app).get(`/post/${postId}`);
    expect(postResponse.status).toBe(200);

    const postBlocResponse = await request(app).get(`/postbloc/${postBlocId}`);
    expect(postBlocResponse.status).toBe(200);

    const postImgResponse = await request(app).get(`/postimg/${postImgId}`);
    expect(postImgResponse.status).toBe(200);
  });
});
describe('LanguageController Tests', () => {
    let languageId: number;
  
    it('should create a language successfully', async () => {
      const response = await request(app).post('/language').send({
        name: 'English',
      });
      expect(response.status).toBe(201);
      expect(response.body.language).toHaveProperty('id');
      expect(response.body.language).toHaveProperty('name', 'English');
      languageId = response.body.language.id;
    });
  
    it('should retrieve a language by ID', async () => {
      const response = await request(app).get(`/language/${languageId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', languageId);
      expect(response.body).toHaveProperty('name', 'English');
    });
  
    it('should retrieve all languages', async () => {
      const response = await request(app).get('/language');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((lang: any) => lang.id === languageId)).toBe(true);
    });
  
    it('should update a language successfully', async () => {
      const updatedData = { name: 'French' };
      const response = await request(app).put(`/language/${languageId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.language).toHaveProperty('name', 'French');
    });
  
    it('should delete a language successfully', async () => {
      const response = await request(app).delete(`/language/${languageId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Language deleted successfully');
  
      // Vérification que la langue a bien été supprimée
      const verifyResponse = await request(app).get(`/language/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'Language not found');
    });
  });
  describe('TxAttributeController Tests', () => {
    let attributeId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Créer une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Créer un attribut
      const attributeResponse = await request(app).post('/attribute').send({ name: 'Test Attribute', slug: 'test-attribute' });
      expect(attributeResponse.status).toBe(201);
      attributeId = attributeResponse.body.attribute.id;
    });
  
    afterAll(async () => {
      // Supprimer l'attribut
      await request(app).delete(`/attribute/${attributeId}`);
  
      // Supprimer la langue
      await request(app).delete(`/language/${languageId}`);
    });
  
    it('should create a TxAttribute successfully', async () => {
      const response = await request(app).post('/txattribute').send({
        attribute_id: attributeId,
        language_id: languageId,
        name: 'Test Attribute',
        slug: 'test-attribute',
        description: 'A test attribute description',
        meta_description: 'Meta description for test attribute',
        title: 'Test Attribute Title',
      });
      expect(response.status).toBe(201);
      expect(response.body.txAttribute).toHaveProperty('attribute_id', attributeId);
      expect(response.body.txAttribute).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxAttribute by attributeId and languageId', async () => {
      const response = await request(app).get(`/txattribute/${attributeId}/${languageId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('attribute_id', attributeId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxAttributes for a specific attribute', async () => {
      const response = await request(app).get(`/txattribute/attribute/${attributeId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.attribute_id === attributeId)).toBe(true);
    });
  
    it('should retrieve all TxAttributes for a specific language', async () => {
      const response = await request(app).get(`/txattribute/language/${languageId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxAttribute successfully', async () => {
      const updatedData = {
        name: 'Updated Attribute',
        description: 'Updated description for attribute',
        meta_description: 'Updated meta description',
        title: 'Updated Title',
      };
      const response = await request(app).put(`/txattribute/${attributeId}/${languageId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.txAttribute).toHaveProperty('name', updatedData.name);
      expect(response.body.txAttribute).toHaveProperty('description', updatedData.description);
    });
  
    it('should delete a TxAttribute successfully', async () => {
      const response = await request(app).delete(`/txattribute/${attributeId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxAttribute deleted successfully');
  
      // Vérifier que le TxAttribute a bien été supprimé
      const verifyResponse = await request(app).get(`/txattribute/${attributeId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxAttribute not found');
    });
  });
  describe('TxCategoryCityLangController Tests', () => {
    let categoryId: number;
    let cityId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Création d'une catégorie
      const categoryResponse = await request(app).post('/category').send({ name: 'Test Category', slug: 'test-category' });
      expect(categoryResponse.status).toBe(201);
      categoryId = categoryResponse.body.category.id;
  
      // Création d'une ville
      const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId: 1 });
      expect(cityResponse.status).toBe(201);
      cityId = cityResponse.body.city.id;
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/category/${categoryId}`);
      await request(app).delete(`/city/${cityId}`);
      await request(app).delete(`/language/${languageId}`);
    });
  
    it('should create a TxCategoryCityLang successfully', async () => {
      const response = await request(app).post('/txcategorycitylang').send({
        category_id: categoryId,
        city_id: cityId,
        language_id: languageId,
        name: 'Test Name',
        description: 'Test description',
        meta_description: 'Test meta description',
        title: 'Test Title',
      });

      expect(response.status).toBe(201);
      expect(response.body.txCategoryCityLang).toHaveProperty('category_id', categoryId);
      expect(response.body.txCategoryCityLang).toHaveProperty('city_id', cityId);
      expect(response.body.txCategoryCityLang).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxCategoryCityLang by categoryId, cityId, and languageId', async () => {
      const response = await request(app).get(`/txcategorycitylang/${categoryId}/${cityId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('category_id', categoryId);
      expect(response.body).toHaveProperty('city_id', cityId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxCategoryCityLang for a specific category', async () => {
      const response = await request(app).get(`/txcategorycitylang/category/${categoryId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.category_id === categoryId)).toBe(true);
    });
  
    it('should retrieve all TxCategoryCityLang for a specific city', async () => {
      const response = await request(app).get(`/txcategorycitylang/city/${cityId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.city_id === cityId)).toBe(true);
    });
  
    it('should retrieve all TxCategoryCityLang for a specific language', async () => {
      const response = await request(app).get(`/txcategorycitylang/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxCategoryCityLang successfully', async () => {
      const updatedData = {
        name: 'Updated Name',
        description: 'Updated description',
        meta_description: 'Updated meta description',
        title: 'Updated Title',
      };
      const response = await request(app)
        .put(`/txcategorycitylang/${categoryId}/${cityId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txCategoryCityLang).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a TxCategoryCityLang successfully', async () => {
      const response = await request(app).delete(`/txcategorycitylang/${categoryId}/${cityId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxCategoryCityLang deleted successfully');
  
      // Vérifier que le TxCategoryCityLang a bien été supprimé
      const verifyResponse = await request(app).get(`/txcategorycitylang/${categoryId}/${cityId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxCategoryCityLang not found');
    });
  });
  describe('TxCategoryController Tests', () => {
    let categoryId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'French' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Création d'une catégorie
      const categoryResponse = await request(app).post('/category').send({ name: 'Test Category', slug: 'test-category' });
      expect(categoryResponse.status).toBe(201);
      categoryId = categoryResponse.body.category.id;
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/category/${categoryId}`);
    });
  
    it('should create a TxCategory successfully', async () => {
      const response = await request(app).post('/txcategory').send({
        category_id: categoryId,
        language_id: languageId,
        name: 'Test Name',
        slug: 'test-name',
        description: 'Test description',
        meta_description: 'Test meta description',
        title: 'Test Title',
      });

      expect(response.status).toBe(201);
      expect(response.body.txCategory).toHaveProperty('category_id', categoryId);
      expect(response.body.txCategory).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxCategory by categoryId and languageId', async () => {
      const response = await request(app).get(`/txcategory/${categoryId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('category_id', categoryId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxCategories for a specific category', async () => {
      const response = await request(app).get(`/txcategory/category/${categoryId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.category_id === categoryId)).toBe(true);
    });
  
    it('should retrieve all TxCategories for a specific language', async () => {
      const response = await request(app).get(`/txcategory/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxCategory successfully', async () => {
      const updatedData = {
        name: 'Updated Name',
        description: 'Updated description',
        meta_description: 'Updated meta description',
        title: 'Updated Title',
      };
      const response = await request(app)
        .put(`/txcategory/${categoryId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txCategory).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a TxCategory successfully', async () => {
      const response = await request(app).delete(`/txcategory/${categoryId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxCategory deleted successfully');
  
      // Vérifier que le TxCategory a bien été supprimé
      const verifyResponse = await request(app).get(`/txcategory/${categoryId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxCategory not found');
    });
  });
  describe('TxCityController Tests', () => {
    let cityId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Création d'une ville
      const cityResponse = await request(app).post('/city').send({
        slug: 'test-city',
        countryId: 1, // Assurez-vous d'avoir une configuration de pays préalable
      });
      expect(cityResponse.status).toBe(201);
      cityId = cityResponse.body.city.id;
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/city/${cityId}`);
    });
  
    it('should create a TxCity successfully', async () => {
      const response = await request(app).post('/txcity').send({
        city_id: cityId,
        language_id: languageId,
        slug: 'test-city-slug',
        name: 'Test City Name',
        description: 'Test description',
        meta_description: 'Test meta description',
      });

      expect(response.status).toBe(201);
      expect(response.body.txCity).toHaveProperty('city_id', cityId);
      expect(response.body.txCity).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxCity by cityId and languageId', async () => {
      const response = await request(app).get(`/txcity/${cityId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('city_id', cityId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxCities for a specific city', async () => {
      const response = await request(app).get(`/txcity/city/${cityId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.city_id === cityId)).toBe(true);
    });
  
    it('should retrieve all TxCities for a specific language', async () => {
      const response = await request(app).get(`/txcity/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxCity successfully', async () => {
      const updatedData = {
        slug: 'updated-city-slug',
        name: 'Updated City Name',
        description: 'Updated description',
        meta_description: 'Updated meta description',
      };
      const response = await request(app)
        .put(`/txcity/${cityId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txCity).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a TxCity successfully', async () => {
      const response = await request(app).delete(`/txcity/${cityId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxCity deleted successfully');
  
      // Vérifier que le TxCity a bien été supprimé
      const verifyResponse = await request(app).get(`/txcity/${cityId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxCity not found');
    });
  });
  describe('TxCountryController Tests', () => {
    let countryId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'French' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Création d'un pays
      const countryResponse = await request(app).post('/country').send({
        slug: 'test-country',
        code: 'TC',
      });
      expect(countryResponse.status).toBe(201);
      countryId = countryResponse.body.country.id;
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/country/${countryId}`);
    });
  
    it('should create a TxCountry successfully', async () => {
      const response = await request(app).post('/txcountry').send({
        country_id: countryId,
        language_id: languageId,
        slug: 'test-country-slug',
        name: 'Test Country Name',
        description: 'Test description',
        meta_description: 'Test meta description',
        title: 'Test title',
      });

      expect(response.status).toBe(201);
      expect(response.body.txCountry).toHaveProperty('country_id', countryId);
      expect(response.body.txCountry).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxCountry by countryId and languageId', async () => {
      const response = await request(app).get(`/txcountry/${countryId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('country_id', countryId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxCountries for a specific country', async () => {
      const response = await request(app).get(`/txcountry/country/${countryId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.country_id === countryId)).toBe(true);
    });
  
    it('should retrieve all TxCountries for a specific language', async () => {
      const response = await request(app).get(`/txcountry/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxCountry successfully', async () => {
      const updatedData = {
        slug: 'updated-country-slug',
        name: 'Updated Country Name',
        description: 'Updated description',
        meta_description: 'Updated meta description',
        title: 'Updated title',
      };
      const response = await request(app)
        .put(`/txcountry/${countryId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txCountry).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a TxCountry successfully', async () => {
      const response = await request(app).delete(`/txcountry/${countryId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxCountry deleted successfully');
  
      // Vérifier que le TxCountry a bien été supprimé
      const verifyResponse = await request(app).get(`/txcountry/${countryId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxCountry not found');
    });
  });
  describe('TxPlaceController Tests', () => {
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/place/${placeIds[0]}`);
    });
  
    it('should create a TxPlace successfully', async () => {
      const response = await request(app).post('/txplace').send({
        place_id: placeIds[0],
        language_id: languageId,
        slug: 'test-place-translation',
        name: 'Test Place Translation',
        title: 'Translated Title',
        description: 'Translated Description',
        meta_description: 'Translated Meta Description',
      });

      expect(response.status).toBe(201);
      expect(response.body.txPlace).toHaveProperty('place_id', placeIds[0]);
      expect(response.body.txPlace).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxPlace by placeId and languageId', async () => {
      const response = await request(app).get(`/txplace/${placeIds[0]}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('place_id', placeIds[0]);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxPlaces for a specific place', async () => {
      const response = await request(app).get(`/txplace/place/${placeIds[0]}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.place_id === placeIds[0])).toBe(true);
    });
  
    it('should retrieve all TxPlaces for a specific language', async () => {
      const response = await request(app).get(`/txplace/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxPlace successfully', async () => {
      const updatedData = {
        name: 'Updated Place Translation',
        description: 'Updated Description',
        meta_description: 'Updated Meta Description',
      };
      const response = await request(app)
        .put(`/txplace/${placeIds[0]}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txPlace).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a TxPlace successfully', async () => {
      const response = await request(app).delete(`/txplace/${placeIds[0]}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxPlace deleted successfully');
  
      // Vérifier que le TxPlace a bien été supprimé
      const verifyResponse = await request(app).get(`/txplace/${placeIds[0]}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxPlace not found');
    });
  });
  describe('TxPostBlocController Tests', () => {
    let languageId: number;

    beforeAll(async () => {
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/postbloc/${postBlocId}`);
    });
  
    it('should create a TxPostBloc successfully', async () => {
      const response = await request(app).post('/txpostbloc').send({
        post_bloc_id: postBlocId,
        language_id: languageId,
        title: 'Translated Title',
        content: 'Translated Content',
      });

      expect(response.status).toBe(201);
      expect(response.body.txPostBloc).toHaveProperty('post_bloc_id', postBlocId);
      expect(response.body.txPostBloc).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxPostBloc by postBlocId and languageId', async () => {
      const response = await request(app).get(`/txpostbloc/${postBlocId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('post_bloc_id', postBlocId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxPostBlocs for a specific postBloc', async () => {
      const response = await request(app).get(`/txpostbloc/postbloc/${postBlocId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.post_bloc_id === postBlocId)).toBe(true);
    });
  
    it('should retrieve all TxPostBlocs for a specific language', async () => {
      const response = await request(app).get(`/txpostbloc/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxPostBloc successfully', async () => {
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const response = await request(app)
        .put(`/txpostbloc/${postBlocId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txPostBloc).toHaveProperty('title', updatedData.title);
    });
  
    it('should delete a TxPostBloc successfully', async () => {
      const response = await request(app).delete(`/txpostbloc/${postBlocId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxPostBloc deleted successfully');
  
      // Vérifier que le TxPostBloc a bien été supprimé
      const verifyResponse = await request(app).get(`/txpostbloc/${postBlocId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxPostBloc not found');
    });
  });
  describe('TxPostImgController Tests', () => {
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;

    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/postimg/${postImgId}`);
    });
  
    it('should create a TxPostImg successfully', async () => {
      const response = await request(app).post('/txpostimg').send({
        post_img_id: postImgId,
        language_id: languageId,
        alt: 'Example alt text',
      });

      expect(response.status).toBe(201);
      expect(response.body.txPostImg).toHaveProperty('post_img_id', postImgId);
      expect(response.body.txPostImg).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve a TxPostImg by postImgId and languageId', async () => {
      const response = await request(app).get(`/txpostimg/${postImgId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('post_img_id', postImgId);
      expect(response.body).toHaveProperty('language_id', languageId);
    });
  
    it('should retrieve all TxPostImgs for a specific post image', async () => {
      const response = await request(app).get(`/txpostimg/postimg/${postImgId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.post_img_id === postImgId)).toBe(true);
    });
  
    it('should retrieve all TxPostImgs for a specific language', async () => {
      const response = await request(app).get(`/txpostimg/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.language_id === languageId)).toBe(true);
    });
  
    it('should update a TxPostImg successfully', async () => {
      const updatedData = {
        alt: 'Updated alt text',
      };
      const response = await request(app)
        .put(`/txpostimg/${postImgId}/${languageId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txPostImg).toHaveProperty('alt', updatedData.alt);
    });
  
    it('should delete a TxPostImg successfully', async () => {
      const response = await request(app).delete(`/txpostimg/${postImgId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxPostImg deleted successfully');
  
      // Vérifier que le TxPostImg a bien été supprimé
      const verifyResponse = await request(app).get(`/txpostimg/${postImgId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxPostImg not found');
    });
  });
  describe('TxPostController Tests', () => {
    let postId: number;
    let languageId: number;
  
    beforeAll(async () => {
      // Création d'une langue
      const languageResponse = await request(app).post('/language').send({ name: 'English' });
      expect(languageResponse.status).toBe(201);
      languageId = languageResponse.body.language.id;
  
      // Création d'un post
      const postResponse = await request(app).post('/post').send({
        userId: 1, // Assurez-vous d'avoir un utilisateur valide
        slug: 'test-post',
      });
      expect(postResponse.status).toBe(201);
      postId = postResponse.body.post.id;
    });
  
    afterAll(async () => {
      // Suppression des entités créées
      await request(app).delete(`/language/${languageId}`);
      await request(app).delete(`/post/${postId}`);
    });
  
    it('should create a TxPost successfully', async () => {
      const response = await request(app).post('/txpost').send({
        postId,
        languageId,
        name: 'Test Post Translation',
        description: 'Description of test post',
        metaDescription: 'Meta description of test post',
        title: 'Test Post Title',
        visible: true,
        slug: 'test-post-translation',
      });

      expect(response.status).toBe(201);
      expect(response.body.txPost).toHaveProperty('postId', postId);
      expect(response.body.txPost).toHaveProperty('languageId', languageId);
    });
  
    it('should retrieve a TxPost by postId and languageId', async () => {
      const response = await request(app).get(`/txpost/${postId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('postId', postId);
      expect(response.body).toHaveProperty('languageId', languageId);
    });
  
    it('should retrieve all TxPosts for a specific post', async () => {
      const response = await request(app).get(`/txpost/post/${postId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.postId === postId)).toBe(true);
    });
  
    it('should retrieve all TxPosts for a specific language', async () => {
      const response = await request(app).get(`/txpost/language/${languageId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((tx: any) => tx.languageId === languageId)).toBe(true);
    });
  
    it('should update a TxPost successfully', async () => {
      const updatedData = {
        name: 'Updated Test Post Translation',
        visible: false,
      };
      const response = await request(app).put(`/txpost/${postId}/${languageId}`).send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.txPost).toHaveProperty('name', updatedData.name);
      expect(response.body.txPost).toHaveProperty('visible', updatedData.visible);
    });
  
    it('should delete a TxPost successfully', async () => {
      const response = await request(app).delete(`/txpost/${postId}/${languageId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'TxPost deleted successfully');
  
      // Vérifier que le TxPost a bien été supprimé
      const verifyResponse = await request(app).get(`/txpost/${postId}/${languageId}`);
      expect(verifyResponse.status).toBe(404);
      expect(verifyResponse.body).toHaveProperty('message', 'TxPost not found');
    });
  });
  