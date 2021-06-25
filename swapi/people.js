const axios = require('axios');

export async function getPeople() {
    const resp = await axios.get(`https://swapi.py4e.com/api/people/`);
    return resp.data.results;
}