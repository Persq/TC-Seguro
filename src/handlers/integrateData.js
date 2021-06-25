//import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware';
import integrateDataSchema from '../lib/schemas/integrateDataSchema'; 

const swpeople = require('../../swapi/people');
const swplanets = require('../../swapi/planets');
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function integrateData(event, context) {
    const { nameTable } = event.body ; 
    //const { nameTable } = JSON.parse(event.body) ; 
    
    switch (nameTable) {
        case "people":
            return await fillData_tblPeople(); 
        case "planets":
            return await fillData_tblPlanets();     
        default:
            return await fillData_tblPeople();
    }  
}

async function fillData_tblPeople(){
    let quantity = 0;
    try {
        const list = await swpeople.getPeople();
        quantity = list.length;

        for (let i = 0; i < list.length; i++) { 
            let films = [];let species = [];let vehicles = [];let starships = [];
            for (let j = 0; j < list[i].films.length; j++) { 
                films.push(breakCode(list[i].films[j]));
            }
            for (let j = 0; j < list[i].species.length; j++) { 
                species.push(breakCode(list[i].species[j]));
            }
            for (let j = 0; j < list[i].vehicles.length; j++) { 
                vehicles.push(breakCode(list[i].vehicles[j]));
            }
            for (let j = 0; j < list[i].starships.length; j++) { 
                starships.push(breakCode(list[i].starships[j]));
            }

            const person ={
                id: breakCode(list[i].url),
                nombre: list[i].name,
                tamano: list[i].height,
                masa: list[i].mass,
                color_cabello: list[i].hair_color,
                color_piel: list[i].skin_color,
                color_ojos: list[i].eye_color,
                anio_nacimiento: list[i].birth_year,
                genero: list[i].gender,
                mundoNatal: breakCode(list[i].homeworld),
                peliculas: JSON.stringify(films) ,
                especies: JSON.stringify(species) ,
                vehiculos: JSON.stringify(vehicles) ,
                naves: JSON.stringify(starships) ,
                creado: list[i].created,
                editado: list[i].edited,
            }; 

            await dynamodb.put({
                TableName: process.env.PEOPLE_TABLE_NAME,
                Item: person,
              }).promise();
        } 
    } catch(error) {
        //console.error(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify({ numberResults: quantity}),
    };
}

async function fillData_tblPlanets(){ 
    let quantity = 0;
    try {
        const list = await swplanets.getPlanets();
        quantity = list.length;

        for (let i = 0; i < list.length; i++) {
            let residents =[];let films = [];
            for (let j = 0; j < list[i].residents.length; j++) { 
                residents.push(breakCode(list[i].residents[j]));
            } 
            for (let j = 0; j < list[i].films.length; j++) { 
                films.push(breakCode(list[i].films[j]));
            }
 
            const planet ={
                id: breakCode(list[i].url),
                nombre: list[i].name,
                periodo_rotacion: list[i].rotation_period,
                periodo_orbital: list[i].orbital_period,
                diametro:list[i].diameter,
                gravedad: list[i].gravity,
                terreno: list[i].terrain,
                superficie_agua: list[i].surface_water, 
                poblacion: list[i].population,
                residentes: JSON.stringify(residents), 
                peliculas: JSON.stringify(films) ,
                creado: list[i].created,
                editado: list[i].edited,
            };

            await dynamodb.put({
                TableName: process.env.PLANETS_TABLE_NAME,
                Item: planet,
              }).promise();
        } 
    } catch(error) {
        //console.error(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify({ numberResults: quantity}),
    };
}

function breakCode(url){
    let tblock = url.substring(0, url.length - 1);
    return tblock.substring(tblock.lastIndexOf('/') + 1,tblock.length);
}

export const handler = commonMiddleware(integrateData)
.use(validator({inputSchema: integrateDataSchema}));  