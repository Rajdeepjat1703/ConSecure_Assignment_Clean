import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.middleware';
import { prisma } from './setup';

const app = express();
app.use(express.json());

// Test route that uses the middleware
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: (req as any).user });
});

describe('Authentication Middleware', () => {
  let validToken: string;
  let testUser: any;

  beforeEach(async () => {
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedpassword'
      }
    });

    // Generate a valid token
    validToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );
  });

  describe('authenticateToken middleware', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Protected route accessed');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('userId', testUser.id);
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/protected')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided.');
    });

    it('should return 401 when Authorization header is missing', async () => {
      const response = await request(app)
        .get('/protected')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided.');
    });

    it('should return 401 when Authorization header format is incorrect', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'JustSomeText')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided.');
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });

    it('should return 403 when token is expired', async () => {
      const expiredToken = jwt.sign(
        { userId: testUser.id, email: testUser.email },
        process.env.JWT_SECRET || 'supersecret',
        { expiresIn: '0s' } // Expired immediately
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });

    it('should return 403 when token is signed with wrong secret', async () => {
      const wrongSecretToken = jwt.sign(
        { userId: testUser.id, email: testUser.email },
        'wrong-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });

    it('should handle malformed tokens gracefully', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer not.a.valid.jwt.token')
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Invalid token.');
    });

    it('should attach user data to request object', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('userId');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.userId).toBe(testUser.id);
      expect(response.body.user.email).toBe(testUser.email);
    });
  });
}); 