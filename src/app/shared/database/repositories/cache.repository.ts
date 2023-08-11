import { json } from 'stream/consumers';
import { CacheDatabase } from '../../../../main/database/redis.connection';
import { Errand } from '../../../models/errand.models';

export class CacheRepository {
    private repository = CacheDatabase.connection;

    public async get(key: string): Promise<Errand[] | null> {
        const result = await this.repository.get(key);

        if (!result) {
            return null;
        }

        return JSON.parse(result);
    }

    public async set(key: string, value: any) {
        await this.repository.set(key, JSON.stringify(value));
    }

    public async delete(key: string) {
        await this.repository.del(key);
    }
}
