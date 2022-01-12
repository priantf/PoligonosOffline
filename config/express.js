// APP PACKAGES
var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser');
    // GET AUTHENTICATION
    //auth = require('../config/auth').auth;

module.exports = () => {
    // EXPRESS
    let app = express();
    // CROSS-ORIGN
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    // APP USE
    app.set('PORT', process.env.PORT);
    app.use(bodyParser.json());
    app.use('/', express.static('./public'));
    //app.use(auth.initialize());
    // APP FOLDERS
    load('controllers', { cwd: 'app' })
        .then('routers')
        .into(app);

    return app;
};