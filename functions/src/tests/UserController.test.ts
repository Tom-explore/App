import { app } from '../index';
import request from 'supertest';
import { initializeDataSource } from '../config/AppDataSource';
import AppDataSource from "../config/AppDataSource"

beforeAll(async () => {
  await initializeDataSource();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('User API - Tests d\'intégration', () => {
  let userId: number;

  it('devrait créer un nouvel utilisateur', async () => {
    const response = await request(app).post('/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
    userId = response.body.id;
  });

  it('devrait récupérer un utilisateur par ID', async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('devrait mettre à jour les informations de l\'utilisateur', async () => {
    const response = await request(app).put(`/users/${userId}`).send({
      username: 'updateduser',
    });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('updateduser');
  });

  it('devrait supprimer l\'utilisateur', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.status).toBe(204);
  });
});
