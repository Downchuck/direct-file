import 'reflect-metadata';
import * as http from 'http';
import { AppDataSource } from './data-source';
import { sqsListenerService } from './services';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    sqsListenerService.startListening();
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
