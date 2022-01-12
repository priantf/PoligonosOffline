const express = require('express');
// const auth = require('./config/auth').auth;

// const cors = require('cors');
const routes = require('./app/routers/appRouter');

const app = express();
const bodyParser = require('body-parser');

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use(routes);
// app.use(auth.initialize());
app.use(express.static('./public'));

// app.use(bodyParser.json({ limit: "50mb" }))
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

const PORT = 3001;
app.listen(PORT, () => {
	console.log('SERVIÇO:', 'RODANDO NA PORTA ' + PORT);
});

//app.listen(process.env.PORT);