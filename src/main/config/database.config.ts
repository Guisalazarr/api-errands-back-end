import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

let entities = ['src/app/shared/database/entities/**/*.ts'];
let migrations = ['src/app/shared/database/migrations/**/*.ts'];

if (process.env.DB_ENV === 'production') {
    entities = ['build/app/shared/database/entities/**/*.js'];
    migrations = ['build/app/shared/database/migrations/**/*.js'];
}

let config = new DataSource({
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

if (process.env.DB_ENV === 'test') {
    config = new DataSource({
        type: 'sqlite',
        database: 'db.sqlite3',
        synchronize: false,
        entities: entities,
        migrations: ['tests/app/shared/database/migrations/**/*.ts'],
    });
}

export default config;
