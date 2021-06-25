const axios = require('axios');

export async function getPlanets() {
    const resp = await axios.get(`https://swapi.py4e.com/api/planets/`);
    return resp.data.results;
}