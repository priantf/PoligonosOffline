const knex = require('knex');
const configuration = require('../../knexfile');

const config = configuration.development;
const knex_connection = knex(config);

module.exports = knex_connection;
