const config = require('./config.json');

const environment = process.env.NODE_ENV || 'development';
const envConfig = config[environment];

global.gConfig = envConfig;