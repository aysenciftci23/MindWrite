require('dotenv').config();
const { DataSource } = require('typeorm');

const url = process.env.DATABASE_URL;
const config = {
    type: 'postgres',
    url: url,
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'mindWrite',
    ssl: url ? { rejectUnauthorized: false } : false,
};

console.log('--- Debugging DB Connection ---');
console.log('DATABASE_URL is:', url ? 'Defined (length: ' + url.length + ')' : 'Undefined');
console.log('Using Config:', {
    host: config.host,
    port: config.port,
    username: config.username,
    database: config.database,
    ssl: config.ssl,
    // Mask sensitive data
    password: config.password ? '******' : 'undefined',
    url: config.url ? '******' : 'undefined'
});

const dataSource = new DataSource(config);

console.log('Attempting to connect...');
dataSource.initialize()
    .then(() => {
        console.log('Connection SUCCESS!');
        return dataSource.destroy();
    })
    .catch((err) => {
        console.error('Connection FAILED:', err);
        process.exit(1);
    });
