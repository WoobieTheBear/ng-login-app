import { DBService } from "../services/db-service.mjs";

/*
    Controller for endpoints: 
    /login
    /signin
    /signup

*/

export class UserController {
    constructor(authService, environment = 'prod'){
        this.environment = environment;
        this.userDataService = new DBService('users.db');
        this.authDataService = new DBService('auth.db');
        this.authService = authService;
    }
    async signUp(req, res, next){
        console.log('UserController.signUp()');
        const { body: { firstName, lastName, email, password, confirmPassword } } = req;

        if(!password || !confirmPassword){
            res.status(400);
            res.send({message: 'your passwords do not match'});
            return;
        }

        if( password === confirmPassword ){
            const existing = await this.userDataService.findByQuery({'email': email});
            if( existing.length > 0){
                res.status(400);
                res.send({message: 'User is already registered.'});
                return;
            }
            const authDetails = this.authService.getAuthDetails(password);
    
            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
            }
            const registeredUser = await this.userDataService.insertDocument(user);
            authDetails._userId = registeredUser._id;
            await this.authDataService.insertDocument(authDetails);
    
            res.send({message: `User ${firstName} ${lastName} is now registered.`})
        }
    }
    async logIn(req, res, next){
        console.log('UserController.logIn() started');
        const { body: { email, password } } = req;

        if(!password || !email){
            res.status(400);
            return res.send({message: 'recieved no credentials'});
        }
        const userResults = await this.userDataService.findByQuery({'email': email});
        if( userResults.length < 1){
            res.status(400);
            return res.send({message: 'wrong credentials'});
        }

        const user = userResults[0];
        const authDetailResults = await this.authDataService.findByQuery({_userId: user._id});
        if( authDetailResults.length < 1){
            res.status(400);
            return res.send({message: 'wrong credentials'});
        }
        const authDetails = authDetailResults[0];

        const checkHash = this.authService.getHash(password, authDetails);
        if( checkHash === authDetails.hash ){
            const token = await this.authService.getToken(user._id);
            return res.send({
                user: user,
                token: token,
            });
        } else {
            res.status(400);
            return res.send({message: 'wrong credentials'});
        }

    }
}