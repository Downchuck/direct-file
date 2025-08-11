import express from 'express';
import { UserController } from './controllers/UserController';

const app = express();
const port = 3001; // Or get from config

const userController = new UserController();

app.get('/users/:id', (req, res) => userController.getUser(req, res));

app.listen(port, () => {
  console.log(`User API listening at http://localhost:${port}`);
});
