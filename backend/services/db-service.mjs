import Datastore from 'nedb';
import { join } from 'path';
import { dataDirectory } from '../config.mjs';
import { processDirectory } from '../server.mjs';

export class DBService {
    constructor( dbname='data.db' ){
        const dbPath = join( processDirectory, dataDirectory, dbname );
        this.database = new Datastore( { filename: dbPath } );
        this.database.loadDatabase(
            ( err ) => {
                if( err ) console.error( `can not load db: ${dbname}`, err );
                if( !err ) console.log( `db loaded: ${dbname}` );
            }
        )
    }
    async findByQuery( query = {} ){
        return new Promise( (resolve, reject) => {
            this.database.find( query, 
                ( err, docs ) => {
                    if( err ) reject( new Error( 'no entries found' ) );
                    if( docs ) resolve( docs );
                }
            );
        } )
    }
    async insertDocument( insertDoc ) {
        if(!insertDoc){
            throw new Error( 'no document to insert' );
        }
        return new Promise( (resolve, reject) => {
            this.database.insert(
                insertDoc,
                ( err, doc ) => { 
                    if( err ) reject( err )
                    if( doc ) resolve( doc )
                }
            );
        } )
    }
    async updateDocument( updateDoc ) {
        if(!updateDoc){
            throw new Error( 'no document to update' );
        }
        return new Promise( (resolve, reject) => {
            this.database.update(
                {_id: updateDoc._id},
                updateDoc,
                ( err, numAffected ) => {
                    if( err ) reject( err )
                    if( numAffected ) resolve( numAffected )
                }
            );
        } )
    }
    async removeDocument( removeDoc ) {
        if(!removeDoc){
            throw new Error( 'no document to insert' );
        }
        return new Promise( (resolve, reject) => {
            this.database.remove(
                removeDoc,
                ( err, doc ) => { 
                    if( err ) reject( err )
                    if( doc ) resolve( doc )
                }
            );
        } )
    }
    async writeSingle( writeDoc ){
        let doc = {};
        if(writeDoc._id){
            const existing = await this.findByQuery( { _id: writeDoc._id } );
            if( existing.length > 0 ){
                doc = await this.updateDocument( writeDoc );
            } else {
                doc = await this.insertDocument( writeDoc );
            }
        } else {
            doc = await this.insertDocument( writeDoc );
        }
        return doc;
    }
    async readAllEntries(){
        const data = await this.findByQuery();
        return data;
    }
    async deleteById(id){
        const data = await this.removeDocument({_id: id});
        return data;
    }
}