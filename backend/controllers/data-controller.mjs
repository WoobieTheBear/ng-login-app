import { DBService } from "../services/db-service.mjs";

export class DataController {
    constructor(authService){
        this.dbService = new DBService('data.db');
    }
    async readAll(req, res, next){
        console.log(`DataController.readAll() _userId: ${req._userId}`);

        const data = await this.dbService.readAllEntries();
        res.send(data);
    }
    async writeOne(req, res, next){
        console.log(`DataController.writeOne() _userId: ${req._userId}`);

        const { body, headers } = req;
        console.log('POST /data request:', headers);
        if ( !['PublicTransportConnection'].includes(body.type) ) {
            res.status(400);
            res.send({message: 'this type is not supported'})
        } else {
            try{
                const written = await this.dbService.writeSingle(body);
                console.log('wrote:', written);
    
                const read = await this.dbService.readAllEntries();
                res.send(read)
        
            } catch( error ){
                res.status(400);
                res.send({message: error.message})
            }
        }    
    }
}