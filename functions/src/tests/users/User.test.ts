import request from 'supertest';
import { app } from '../../index';
import AppDataSource from '../../config/AppDataSource';

let userId: number;
let countryId: number;
let categoryId: number;
let placeIds: number[] = [];
let cityId: number;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // Création d'un pays
  const countryResponse = await request(app).post('/country').send({ slug: 'test-country', code: 'TC' });
  expect(countryResponse.status).toBe(201);
  countryId = countryResponse.body.country.id;

  // Création d'une ville
  const cityResponse = await request(app).post('/city').send({ slug: 'test-city', countryId });
  expect(cityResponse.status).toBe(201);
  const city = cityResponse.body.city;
  cityId = cityResponse.body.city.id;

  // Création d'une catégorie
  const categoryResponse = await request(app).post('/category').send({ name: 'Test Category', slug: 'test-category' });
  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category.id;

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
});

afterAll(async () => {

  for (const placeId of placeIds) {
    await request(app).delete(`/place/${placeId}`);
  }
  await request(app).delete(`/category/${categoryId}`);
  await request(app).delete(`/country/${countryId}`);
  await request(app).delete(`/city/${cityId}`);


  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();

  }
});

describe('UserController Tests', () => {
  it('should create a user successfully', async () => {
    const userResponse = await request(app).post('/user').send({
      email: 'test@test.com',
      name: 'Test User',
      pw: 'password123',
    });

    expect(userResponse.status).toBe(201);
    expect(userResponse.body.user).toHaveProperty('id');
    userId = userResponse.body.user.id;
  });

  it('should not allow creating a user with an existing email', async () => {
    const userResponse = await request(app).post('/user').send({
      email: 'test@test.com',
      name: 'Another User',
      pw: 'password1234',
    });

    expect(userResponse.status).toBe(400);
    expect(userResponse.body).toHaveProperty('message', 'User with this email already exists');
  });

  it('should retrieve a user by ID', async () => {
    const userResponse = await request(app).get(`/user/${userId}`);

    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toHaveProperty('id', userId);
    expect(userResponse.body).toHaveProperty('email', 'test@test.com');
  });

  it('should retrieve a user by email', async () => {
    const userResponse = await request(app).get(`/user`).query({ email: 'test@test.com' });

    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toHaveProperty('id', userId);
    expect(userResponse.body).toHaveProperty('email', 'test@test.com');
  });

  it('should update a user successfully', async () => {
    const updatedData = {
      name: 'Updated User',
      pw: 'newpassword123',
    };
    const updateResponse = await request(app).put(`/user/${userId}`).send(updatedData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.updatedUser).toHaveProperty('name', updatedData.name);
  });


});
describe('PlacesAddedByUserController Tests', () => {
  it('should create a place added by a user successfully', async () => {
    const response = await request(app).post('/placesaddedbyuser').send({
      user_id: userId,
      place_id: placeIds[0],
    });

    expect(response.status).toBe(201);
    expect(response.body.placeAdded).toHaveProperty('user_id', userId);
    expect(response.body.placeAdded).toHaveProperty('place_id', placeIds[0]);
  });

  it('should retrieve a place added by user by ID', async () => {
    const response = await request(app).get(`/placesaddedbyuser/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user_id', userId);
    expect(response.body).toHaveProperty('place_id', placeIds[0]);
  });

  it('should retrieve all places added by a user', async () => {
    const response = await request(app).get(`/placesaddedbyuser/user/${userId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((place: any) => place.place_id === placeIds[0])).toBe(true);
  });

  it('should update a place added by a user', async () => {
    const updateData = { added_at: new Date().toISOString() };
    const response = await request(app)
      .put(`/placesaddedbyuser/${userId}/${placeIds[0]}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.updatedPlaceAdded).toHaveProperty('added_at', updateData.added_at);
  });

  it('should delete a place added by a user', async () => {
    const response = await request(app).delete(`/placesaddedbyuser/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Place added by user successfully deleted');

    // Vérifier que l'entité a bien été supprimée
    const verifyResponse = await request(app).get(`/placesaddedbyuser/${userId}/${placeIds[0]}`);
    expect(verifyResponse.status).toBe(404);
  });
});
describe('UserPlacesLikeController Tests', () => {
  it('should create a like successfully', async () => {
    const response = await request(app).post('/userplaceslike').send({
      user_id: userId,
      place_id: placeIds[0],
      liked: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.like).toHaveProperty('user_id', userId);
    expect(response.body.like).toHaveProperty('place_id', placeIds[0]);
    expect(response.body.like).toHaveProperty('liked', true);
  });

  it('should not allow creating a duplicate like', async () => {
    const response = await request(app).post('/userplaceslike').send({
      user_id: userId,
      place_id: placeIds[0],
      liked: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Like already exists for this user and place');
  });

  it('should retrieve a like by user and place ID', async () => {
    const response = await request(app).get(`/userplaceslike/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user_id', userId);
    expect(response.body).toHaveProperty('place_id', placeIds[0]);
    expect(response.body).toHaveProperty('liked', true);
  });

  it('should retrieve all likes for a user', async () => {
    const response = await request(app).get(`/userplaceslike/user/${userId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((like: any) => like.place_id === placeIds[0])).toBe(true);
  });

  it('should update a like successfully', async () => {
    const updateData = { liked: false };
    const response = await request(app).put(`/userplaceslike/${userId}/${placeIds[0]}`).send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.updatedLike).toHaveProperty('liked', false);
  });

  it('should delete a like successfully', async () => {
    const response = await request(app).delete(`/userplaceslike/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Like successfully deleted');

    // Vérifier que le like a bien été supprimé
    const verifyResponse = await request(app).get(`/userplaceslike/${userId}/${placeIds[0]}`);
    expect(verifyResponse.status).toBe(404);
  });
});
describe('UserPlacesPreferenceController Tests', () => {
  it('should create a preference successfully', async () => {
    const response = await request(app).post('/userplacespreference').send({
      user_id: userId,
      place_id: placeIds[0], // Utilisation du premier placeId
      wants_to_visit: true,
      visited: false,
      not_interested: false,
    });

    expect(response.status).toBe(201);
    expect(response.body.preference).toHaveProperty('user_id', userId);
    expect(response.body.preference).toHaveProperty('place_id', placeIds[0]);
    expect(response.body.preference).toHaveProperty('wants_to_visit', true);
  });

  it('should not allow creating a duplicate preference', async () => {
    const response = await request(app).post('/userplacespreference').send({
      user_id: userId,
      place_id: placeIds[0],
      wants_to_visit: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Preference already exists for this user and place');
  });

  it('should retrieve a preference by user and place ID', async () => {
    const response = await request(app).get(`/userplacespreference/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user_id', userId);
    expect(response.body).toHaveProperty('place_id', placeIds[0]);
    expect(response.body).toHaveProperty('wants_to_visit', true);
  });

  it('should retrieve all preferences for a user', async () => {
    const response = await request(app).get(`/userplacespreference/user/${userId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((pref: any) => pref.place_id === placeIds[0])).toBe(true);
  });

  it('should update a preference successfully', async () => {
    const updateData = {
      wants_to_visit: false,
      visited: true,
    };
    const response = await request(app)
      .put(`/userplacespreference/${userId}/${placeIds[0]}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.updatedPreference).toHaveProperty('wants_to_visit', false);
    expect(response.body.updatedPreference).toHaveProperty('visited', true);
  });

  it('should delete a preference successfully', async () => {
    const response = await request(app).delete(`/userplacespreference/${userId}/${placeIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Preference successfully deleted');

    // Vérifier que la préférence a bien été supprimée
    const verifyResponse = await request(app).get(`/userplacespreference/${userId}/${placeIds[0]}`);
    expect(verifyResponse.status).toBe(404);
  });
});

it('should delete a user successfully', async () => {
  const deleteResponse = await request(app).delete(`/user/${userId}`);

  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body).toHaveProperty('message', 'User successfully deleted');

  // Vérifier que l'utilisateur a bien été supprimé
  const verifyResponse = await request(app).get(`/user/${userId}`);
  expect(verifyResponse.status).toBe(404);
});