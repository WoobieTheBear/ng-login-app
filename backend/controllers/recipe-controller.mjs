import { DBService } from "../services/db-service.mjs";

export class RecipeController {
    constructor(){
        this.dbService = new DBService('recipes.db');
    }
    async readAll(req, res, next){
        console.debug('RecipeController.readAll()');

        const data = await this.dbService.readAllEntries();
        res.send(data)
    }
    async writeMany(req, res, next){
        console.debug('RecipeController.writeMany()');

        const { body, headers } = req;
        console.log('POST /recipes request:', headers);
        try {
            for( const recipe of body ){
                const written = await this.dbService.writeSingle(recipe);
                console.debug('wrote:', written);
            }
            const read = await this.dbService.readAllEntries();
            res.send(read);
    
        } catch ( error ) {
            res.status(400);
            res.send({message: error.message});
        }
    }
    async deleteById(req, res, next){
        const { params: { id } } = req
        console.debug('RecipeController.deleteById()', id);
        try {
            const deleted = await this.dbService.deleteById(id);
            console.log('deleted:', id, deleted)
            const read = await this.dbService.readAllEntries();
            res.send(read);
        } catch ( error ) {
            res.status(400);
            res.send({message: error.message});
        }
    }
}