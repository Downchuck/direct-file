import request from 'supertest';
import express from 'express';
import { StateApiController } from '../controller/StateApiController';
import { StateApiService } from '../service/StateApiService';
import { AuthCodeRequest } from '../model/AuthCodeRequest';

// Mock the service, not the implementation
jest.mock('../service/StateApiService');

const app = express();
app.use(express.json());

// Create a mock instance of the service
const stateApiService = new (StateApiService as any)();

const stateApiController = new StateApiController(stateApiService);

app.use('/state-api', stateApiController.router);

describe('StateApiController', () => {
  describe('POST /authorization-code', () => {
    it('should return a 201 status and an authorization code on success', async () => {
      const authCodeRequest: AuthCodeRequest = {
        taxYear: 2022,
        taxReturnUuid: 'c2f6f3b4-1f3c-4b6c-8a0a-3d2b8b9b4a1b',
        submissionId: 'submissionId',
        stateCode: 'FS',
      };

      const mockAuthCode = 'a2f6f3c4-1f3c-4b6c-8a0a-3d2b8b9b4a1b';
      // Set up the mock implementation for the service method
      (stateApiService.createAuthorizationCode as jest.Mock).mockResolvedValue(mockAuthCode);

      const response = await request(app)
        .post('/state-api/authorization-code')
        .send(authCodeRequest);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ authCode: mockAuthCode });
    });

    it('should return a 500 status on failure', async () => {
      const authCodeRequest: AuthCodeRequest = {
        taxYear: 2022,
        taxReturnUuid: 'c2f6f3b4-1f3c-4b6c-8a0a-3d2b8b9b4a1b',
        submissionId: 'submissionId',
        stateCode: 'FS',
      };

      const errorMessage = 'Internal server error';
      // Set up the mock implementation for the service method
      (stateApiService.createAuthorizationCode as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/state-api/authorization-code')
        .send(authCodeRequest);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('GET /state-profile', () => {
    it('should return a 200 status and a state profile on success', async () => {
      const stateCode = 'CA';
      const mockStateProfile = {
        id: 1,
        stateCode: 'CA',
        taxSystemName: 'California Franchise Tax Board',
        landingUrl: 'https://www.ftb.ca.gov/',
        acceptedOnly: false,
        archived: false,
      };

      (stateApiService.getStateProfile as jest.Mock).mockResolvedValue(mockStateProfile);

      const response = await request(app)
        .get('/state-api/state-profile')
        .query({ stateCode });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStateProfile);
    });

    it('should return a 400 status if stateCode is missing', async () => {
      const response = await request(app)
        .get('/state-api/state-profile');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'stateCode is required' });
    });

    it('should return a 500 status on failure', async () => {
      const stateCode = 'CA';
      const errorMessage = 'Internal server error';

      (stateApiService.getStateProfile as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/state-api/state-profile')
        .query({ stateCode });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });
});
