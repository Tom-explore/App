import { app } from '../../index';
import request from 'supertest';
import { initializeDataSource } from '../../config/AppDataSource';
import AppDataSource from '../../config/AppDataSource';

let userId: number;
let categoryId: number;
let postId: number;

beforeAll(async () => {
  await initializeDataSource();

  // Créer un utilisateur
  const userResponse = await request(app).post('/user').send({
    email: 'testuser55@example.com',
    name: 'Test User',
    pw: 'password123',
  });

  console.log('User creation response:', userResponse.body);

  expect(userResponse.status).toBe(201);
  userId = userResponse.body.user?.id;
  console.log('Created User ID:', userId);
  if (!userId) throw new Error(`User creation failed: ${JSON.stringify(userResponse.body)}`);

  // Créer une catégorie
  const categoryResponse = await request(app).post('/category').send({
    slug: 'test-category55',
    main: true,
    for_posts: true,
  });

  console.log('Category creation response:', categoryResponse.body);

  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category?.id;
  console.log('Created Category ID:', categoryId);
  if (!categoryId) throw new Error(`Category creation failed: ${JSON.stringify(categoryResponse.body)}`);
});

afterAll(async () => {
  console.log('Cleaning up created entities...');

  // Supprimer la catégorie
  if (categoryId) {
    const deleteCategoryResponse = await request(app).delete(`/category/${categoryId}`);
    console.log('Category deletion response:', deleteCategoryResponse.body);
    expect(deleteCategoryResponse.status).toBe(200);
  }

  // Supprimer l'utilisateur
  if (userId) {
    const deleteUserResponse = await request(app).delete(`/user/${userId}`);
    console.log('User deletion response:', deleteUserResponse.body);
    expect(deleteUserResponse.status).toBe(200);
  }

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Feed API - Tests d\'intégration', () => {
  describe('PostController', () => {
    it('devrait créer un post', async () => {
      const response = await request(app).post('/post').send({
        userId,
        slug: 'test-post',
      });

      console.log('Post creation response:', response.body);

      expect(response.status).toBe(201);
      postId = response.body.post?.id;
      console.log('Created Post ID:', postId);
      expect(postId).toBeDefined();
    });

    it('devrait récupérer tous les posts', async () => {
      const response = await request(app).get('/post');
      console.log('Get all posts response:', response.body);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('devrait mettre à jour un post', async () => {
      const response = await request(app).put(`/post/${postId}`).send({
        slug: 'updated-test-post',
      });

      console.log('Update post response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body.post.slug).toBe('updated-test-post');
    });
  });

  describe('PostBlocController', () => {
    let postBlocId: number;

    it('devrait créer un bloc de post', async () => {
        const payload = {
          post_id: postId, // clé envoyée
          position: 1,
          titleType: 'h1',
          template: 't1',
          visible: true,
        };
      
        console.log('Payload for PostBloc creation:', payload);
      
        const response = await request(app).post('/postbloc').send(payload);
      
        console.log('PostBloc creation response:', response.body);
        console.log('Post ID used:', postId);
      
        expect(response.status).toBe(201);
        postBlocId = response.body.postBloc?.id;
        console.log('Created PostBloc ID:', postBlocId);
        expect(postBlocId).toBeDefined();
      });
      

    it('devrait supprimer un bloc de post', async () => {
      const response = await request(app).delete(`/postbloc/${postBlocId}`);
      console.log('PostBloc deletion response:', response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('PostImgController', () => {
    let postImgId: number;

    it('devrait créer une image pour un post', async () => {
      const response = await request(app).post('/postimg').send({
        slug: 'test-img',
        source: 'test-source',
        author: 'test-author',
      });

      console.log('PostImg creation response:', response.body);

      expect(response.status).toBe(201);
      postImgId = response.body.postImg?.id;
      console.log('Created PostImg ID:', postImgId);
      expect(postImgId).toBeDefined();
    });

    it('devrait supprimer une image de post', async () => {
      const response = await request(app).delete(`/postimg/${postImgId}`);
      console.log('PostImg deletion response:', response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('PostCategorizationController', () => {
    it('devrait créer une catégorisation de post', async () => {
      const response = await request(app).post('/postcategorization').send({
        postId,
        categoryId,
      });

      console.log('PostCategorization creation response:', response.body);

      expect(response.status).toBe(201);
      expect(response.body.categorization).toBeDefined();
    });

    it('devrait supprimer une catégorisation de post', async () => {
      const response = await request(app).delete(`/postcategorization/${postId}/${categoryId}`);
      console.log('PostCategorization deletion response:', response.body);

      expect(response.status).toBe(200);
    });
  });

  // Supprimer le post en dernier
  describe('Cleanup - PostController', () => {
    it('devrait supprimer un post', async () => {
      const response = await request(app).delete(`/post/${postId}`);
      console.log('Post deletion response:', response.body);

      expect(response.status).toBe(200);
    });
  });
});
