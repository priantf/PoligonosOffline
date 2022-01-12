const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
	PORT: process.env.PORT,
	HOST: process.env.HOST,
	USER: process.env.USER,
	PASSWORD: process.env.PASSWORD,
	DATABASE: process.env.DATABASE,
	DRIVER: process.env.DRIVER
};
