import { DBService } from "./db-service.mjs";
import { authTokenName, authTokenConfig, serverSecret } from "../config.mjs";
import { randomBytes, pbkdf2Sync } from 'crypto';
import jwt from "jsonwebtoken";

export class AuthService {
    constructor(environment){
        this.environment = environment;
        this.tokenService = new DBService('token.db');
    }
    getHash(password, authDetails){
        const { salt, iterations, keyLength } = authDetails;
        return pbkdf2Sync( password, salt, iterations, keyLength, 'sha512' ).toString('hex');
    }
    getAuthDetails(password){
        const salt = randomBytes( 128 ).toString('base64');
        const iterations = 100000;
        const keyLength = 64;
        const hash = pbkdf2Sync(password, salt, iterations, keyLength, 'sha512').toString('hex');

        return {
            _userId: null,
            keyLength: keyLength,
            iterations: iterations,
            salt: salt,
            hash: hash,
        };
    }
    getAuthToken(userId, maxAge = 900000){
        const tokenValue = randomBytes(30).toString('hex');
        const expires = Date.now() + maxAge;
        return {
            _userId: userId,
            name: authTokenName,
            value: tokenValue,
            expires: expires,
        }
    }
    tokenFromRequest(req){
        const headerAuth = req.headers.authorization;
        const encryptedToken = headerAuth.split(' ')[1];
        return encryptedToken;
    }
    async getToken(userId){
        const maxAge = (authTokenConfig.maxAge) ? authTokenConfig.maxAge : 900000;
        const token = this.getAuthToken(userId, maxAge);
        await this.tokenService.writeSingle(token);
        // encrypt
        const encryptedToken = jwt.sign(token, serverSecret, { expiresIn: maxAge });
        return encryptedToken;
    }
    async isAuthenticated(req, res, next){
        console.log( 'AuthService.isAuthenticated() started' );
        // TADA this should access session in prod environment
        let tokenValue = '';
        // decrypt
        try {
            const encryptedToken = this.tokenFromRequest(req);
            const decryptedToken = jwt.verify(encryptedToken, serverSecret);
            tokenValue = decryptedToken.value;
        } catch ( err ){
            console.log( 'AuthService.isAuthenticated() failed', err );
            res.status(403);
            return res.send({message: 'please authenticate first'});
        }

        const dbTokenResults = await this.tokenService.findByQuery({name: authTokenName, value: tokenValue});
        if(dbTokenResults.length > 0){
            const dbToken = dbTokenResults[0];
            const stillValid = dbToken.expires > Date.now(); 
            if( stillValid ){
                req._userId = dbToken._userId;
                next();
            } else {
                res.status(403);
                return res.send({message: 'please authenticate first'});
            }
        } else {
            res.status(403);
            return res.send({message: 'please authenticate first'});
        }
    }
    async logOut(req, res, next){
        // TADA this should access session in prod environment
        console.log( 'AuthService.logOut() started' );
        let tokenValue = '';
        // decrypt
        try {
            const encryptedToken = this.tokenFromRequest(req);
            const decryptedToken = jwt.verify(encryptedToken, serverSecret);
            tokenValue = decryptedToken.value;
        } catch ( err ){
            console.log( 'AuthService.isAuthenticated() failed', err );
            res.status(403);
            return res.send({message: 'please authenticate first'});
        }

        const dbTokenResults = await this.tokenService.findByQuery({name: authTokenName, value: tokenValue});
        for( const token of dbTokenResults ){
            await this.tokenService.removeDocument( token );
        }
        res.send({message: 'you are logged out'});
    }
}