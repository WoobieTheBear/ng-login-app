import express from 'express';

const publicRouter = express.Router();
export const publicRoutes = (userController) => {
    // public routes
    publicRouter.post('/signup', userController.signUp.bind(userController));
    publicRouter.post('/login', userController.logIn.bind(userController));

    return publicRouter;
}

const privateRouter = express.Router();
export const privateRoutes = (authService, dataController, recipeController) => {
    // private routes
    privateRouter.get('/logout', authService.logOut.bind(authService));

    privateRouter.get('/data', dataController.readAll.bind(dataController));
    privateRouter.post('/data', dataController.writeOne.bind(dataController));
    
    privateRouter.get('/recipes', recipeController.readAll.bind(recipeController));
    privateRouter.post('/recipes', recipeController.writeMany.bind(recipeController));
    privateRouter.delete('/recipes/:id', recipeController.deleteById.bind(recipeController));

    return privateRouter;
}