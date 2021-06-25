import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';  
 
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getPersonById(id) {
    let entity; 
    try {
      const result = await dynamodb.get({
        TableName: process.env.PEOPLE_TABLE_NAME,
        Key: { id },
      }).promise();
  
      entity = result.Item;
    } catch (error) {
      //console.error(error);
      throw new createError.InternalServerError(error);
    }
  
    if (!entity) {
      throw new createError.NotFound(`Person with ID "${id}" not found!`);
    }
  
    return entity;
  }

async function getPerson(event, context) {
    const { id } = event.pathParameters;
    const person = await getPersonById(id);

    return {
        statusCode: 200,
        body: JSON.stringify(person),
    };
}

export const handler = commonMiddleware(getPerson); 