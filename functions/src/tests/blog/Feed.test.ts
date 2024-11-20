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



  expect(userResponse.status).toBe(201);
  userId = userResponse.body.user?.id;

  if (!userId) throw new Error(`User creation failed: ${JSON.stringify(userResponse.body)}`);

  // Créer une catégorie
  const categoryResponse = await request(app).post('/category').send({
    slug: 'test-category55',
    main: true,
    for_posts: true,
  });



  expect(categoryResponse.status).toBe(201);
  categoryId = categoryResponse.body.category?.id;

  if (!categoryId) throw new Error(`Category creation failed: ${JSON.stringify(categoryResponse.body)}`);
});

afterAll(async () => {


  // Supprimer la catégorie
  if (categoryId) {
    const deleteCategoryResponse = await request(app).delete(`/category/${categoryId}`);

    expect(deleteCategoryResponse.status).toBe(200);
  }

  // Supprimer l'utilisateur
  if (userId) {
    const deleteUserResponse = await request(app).delete(`/user/${userId}`);

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



      expect(response.status).toBe(201);
      postId = response.body.post?.id;

      expect(postId).toBeDefined();
    });

    it('devrait récupérer tous les posts', async () => {
      const response = await request(app).get('/post');


      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('devrait mettre à jour un post', async () => {
      const response = await request(app).put(`/post/${postId}`).send({
        slug: 'updated-test-post',
      });



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
      

      
        const response = await request(app).post('/postbloc').send(payload);
      


      
        expect(response.status).toBe(201);
        postBlocId = response.body.postBloc?.id;

        expect(postBlocId).toBeDefined();
      });
      

    it('devrait supprimer un bloc de post', async () => {
      const response = await request(app).delete(`/postbloc/${postBlocId}`);


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



      expect(response.status).toBe(201);
      postImgId = response.body.postImg?.id;

      expect(postImgId).toBeDefined();
    });

    it('devrait supprimer une image de post', async () => {
      const response = await request(app).delete(`/postimg/${postImgId}`);


      expect(response.status).toBe(200);
    });
  });

  describe('PostCategorizationController', () => {
    it('devrait créer une catégorisation de post', async () => {
      const response = await request(app).post('/postcategorization').send({
        postId,
        categoryId,
      });



      expect(response.status).toBe(201);
      expect(response.body.categorization).toBeDefined();
    });

    it('devrait supprimer une catégorisation de post', async () => {
      const response = await request(app).delete(`/postcategorization/${postId}/${categoryId}`);


      expect(response.status).toBe(200);
    });
  });

  // Supprimer le post en dernier
  describe('Cleanup - PostController', () => {
    it('devrait supprimer un post', async () => {
      const response = await request(app).delete(`/post/${postId}`);


      expect(response.status).toBe(200);
    });
  });
});
