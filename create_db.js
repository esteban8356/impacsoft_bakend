const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URL 
    ? process.env.DB_URL.substring(0, process.env.DB_URL.lastIndexOf('/')) + '/postgres'
    : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`;

const client = new Client({
    connectionString
});

async function createDatabase() {
    try {
        await client.connect();
        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'impacsoft'");
        if (res.rowCount === 0) {
            console.log('Database impacsoft does not exist. Creating...');
            await client.query('CREATE DATABASE impacsoft');
            console.log('Database impacsoft created successfully.');
        } else {
            console.log('Database impacsoft already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
