import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

let entities = ['src/database/entities/**/*.ts'];
let migrations = ['src/database/migrations/**/*.ts'];

if (process.env.DB_ENV === 'production') {
    entities = ['build/database/entities/**/*.js'];
    migrations = ['build/database/migrations/**/*.js'];
}

const config = new DataSource({
    type: 'postgres',
    port: 5432,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: false,
    schema: 'errands',
    entities: entities,
    migrations: migrations,
});

export default config;
