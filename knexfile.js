// Update with your config settings.
const { PORT, HOST, USER, PASSWORD, DATABASE, DRIVER } = require('./database_config');

module.exports = {
	development: {
		client: DRIVER,
		connection: {
			port: parseInt(PORT),
			host: HOST,
			user: USER,
			password: PASSWORD,
			database: DATABASE,
			multipleStatements: true,
			options: {
				enableArithAbort: true,
				encrypt: true,
			},
		},
		pool: {
			min: 2,
			max: 7,
		},
		// migrations: {
		// 	directory: './src/database/migrations',
		// },
	},

	staging: {},

	production: {},
};
