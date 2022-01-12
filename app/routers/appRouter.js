
const express = require('express');

const controllers = require('../controllers/appController');

const routes = express.Router();

routes.get('/node/projeto/getGeomData', controllers.getGeomData);

module.exports = routes;
