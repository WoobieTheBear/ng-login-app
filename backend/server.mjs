import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { headers } from './utilities.mjs';
import { backendPort, environment } from './config.mjs';
import { privateRoutes, publicRoutes } from './router.mjs';
import { AuthService } from './services/auth-service.mjs';
import { DataController } from './controllers/data-controller.mjs';
import { RecipeController } from './controllers/recipe-controller.mjs';
import { UserController } from './controllers/user-controller.mjs';

export const processDirectory = dirname( fileURLToPath( import.meta.url ) );

const app = express();
// can be 'dev' or 'prod'

const authService = new AuthService(environment);
const authCheck = authService.isAuthenticated.bind(authService);

const recipeController = new RecipeController();
const dataController = new DataController(authService);
const userController = new UserController(authService);

// [middleware] for all requests
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(headers);

// routes
app.use('/', publicRoutes(userController));
app.use(authCheck);
app.use('/', privateRoutes(authService, dataController, recipeController));

// the port you want to use
app.listen(backendPort);

console.log(`App is running on port ${backendPort} for environment ${environment}`);
