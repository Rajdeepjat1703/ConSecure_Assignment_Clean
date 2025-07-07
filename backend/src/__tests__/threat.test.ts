import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { getAllThreats, getThreatById, getThreatStats, getAllCategories } from '../controllers/threat.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { prisma } from './setup';

const app = express();
app.use(express.json());

// Mount threat routes with authentication middleware
app.get('/threats', authenticateToken, getAllThreats);
app.get('/threats/stats', authenticateToken, getThreatStats);
app.get('/threats/categories', authenticateToken, getAllCategories);
app.get('/threats/:id', authenticateToken, getThreatById);

describe('Threat Endpoints', () => {
  let authToken: string;

  beforeEach(async () => {
    // Clean up before each test
    await prisma.user.deleteMany();
    await prisma.threat.deleteMany();
    
    // Create a test user and generate token
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`, // robust unique email
        password: 'hashedpassword'
      }
    });

    authToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    // Create test threats
    await prisma.threat.createMany({
      data: [
        {
          Threat_Category: 'Malware',
          IOCs: ['hash1', 'hash2'],
          Threat_Actor: 'Actor1',
          Attack_Vector: 'Email',
          Geography: 'US',
          Sentiment: 0.8,
          Severity_Score: 8,
          Predicted_Threat: 'High',
          Suggested_Action: 'Block',
          Risk_Level: 7,
          Cleaned_Threat_Description: 'Test threat 1',
          Keywords: ['malware', 'email'],
          Named_Entities: ['Actor1'],
          Topic_Model: 'Malware',
          Word_Count: 10
        },
        {
          Threat_Category: 'Phishing',
          IOCs: ['hash3'],
          Threat_Actor: 'Actor2',
          Attack_Vector: 'Web',
          Geography: 'EU',
          Sentiment: 0.6,
          Severity_Score: 6,
          Predicted_Threat: 'Medium',
          Suggested_Action: 'Monitor',
          Risk_Level: 5,
          Cleaned_Threat_Description: 'Test threat 2',
          Keywords: ['phishing', 'web'],
          Named_Entities: ['Actor2'],
          Topic_Model: 'Phishing',
          Word_Count: 8
        }
      ]
    });
  });

  describe('GET /threats', () => {
    it('should filter threats by category', async () => {
      const response = await request(app)
        .get('/threats?category=Malware&page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.threats).toHaveLength(1);
      expect(response.body.threats[0].Threat_Category).toBe('Malware');
    });

    it('should search threats by description', async () => {
      const allThreats = await prisma.threat.findMany();
      console.log('All threats before search:', allThreats.map(t => ({ id: t.id, desc: t.Cleaned_Threat_Description })));

      const response = await request(app)
        .get('/threats?search=Test threat 1&page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      console.log('Search result:', response.body.threats);

      expect(response.body.threats).toHaveLength(1);
      expect(response.body.threats[0].Cleaned_Threat_Description).toBe('Test threat 1');
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get('/threats?page=1&limit=10')
        .expect(401);
    });

    it('should return 403 with invalid token', async () => {
      await request(app)
        .get('/threats?page=1&limit=10')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });
  });

  describe('GET /threats/:id', () => {
    it('should return a specific threat by ID', async () => {
      const threat = await prisma.threat.findFirst();

      const response = await request(app)
        .get(`/threats/${threat?.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', threat?.id);
      expect(response.body).toHaveProperty('Threat_Category', threat?.Threat_Category);
    });

    it('should return 404 for non-existent threat', async () => {
      const response = await request(app)
        .get('/threats/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Threat not found');
    });

    it('should return 401 without authentication token', async () => {
      const threat = await prisma.threat.findFirst();

      await request(app)
        .get(`/threats/${threat?.id}`)
        .expect(401);
    });
  });

  describe('GET /threats/stats', () => {
    it('should return threat statistics', async () => {
      const response = await request(app)
        .get('/threats/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total', 2);
      expect(response.body).toHaveProperty('byCategory');
      expect(response.body).toHaveProperty('bySeverity');
      expect(response.body.byCategory).toHaveLength(2);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get('/threats/stats')
        .expect(401);
    });
  });

  describe('GET /threats/categories', () => {
    it('should return all unique categories', async () => {
      const response = await request(app)
        .get('/threats/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toContain('Malware');
      expect(response.body).toContain('Phishing');
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get('/threats/categories')
        .expect(401);
    });
  });
});
