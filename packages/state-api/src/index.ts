import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import { StateApiController } from './controller/StateApiController';
import { StateApiService } from './service/StateApiService';
import { AuthorizationCodeRepository } from './repository/AuthorizationCodeRepository';
import { AuthorizationTokenService } from './service/AuthorizationTokenService';
import { CachedDataService } from './service/CachedDataService';
import { DirectFileClient } from './client/DirectFileClient';
import { ExportedFactsClient } from './client/ExportedFactsClient';
import { StateApiS3Client } from './client/StateApiS3Client';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    const authorizationTokenService = new AuthorizationTokenService();
    const cachedDataService = new CachedDataService();
    const directFileClient = new DirectFileClient();
    const exportedFactsClient = new ExportedFactsClient();
    const stateApiS3Client = new StateApiS3Client();

    const stateApiService = new StateApiService(
      AuthorizationCodeRepository,
      authorizationTokenService,
      directFileClient,
      exportedFactsClient,
      cachedDataService,
      stateApiS3Client
    );

    const stateApiController = new StateApiController(stateApiService);

    app.use('/state-api', stateApiController.router);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
