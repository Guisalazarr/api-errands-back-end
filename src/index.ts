import { Server } from './main/config/express.config';
import { Database } from './main/database/database.connection';
import { CacheDatabase } from './main/database/redis.connection';
import 'reflect-metadata';

Promise.all([Database.connect(), CacheDatabase.connect()]).then(() => {
    const app = Server.create();
    Server.listen(app);
});
