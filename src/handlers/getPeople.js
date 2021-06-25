import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';  
 
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getPeople(event, context) {
    let people;
    try {
        const result = await dynamodb.scan({
            TableName: process.env.PEOPLE_TABLE_NAME
        }).promise();
        people = result.Items; 
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify(people),
    };
}

export const handler = commonMiddleware(getPeople); 