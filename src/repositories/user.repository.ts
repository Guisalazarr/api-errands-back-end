import { Database } from '../database/config/database.connection';
import { UserEntity } from '../database/entities/user.entity';
import { User } from '../models/user.models';

export class UserRepository {
    private repository = Database.connection.getRepository(UserEntity);

    public async list() {
        const result = await this.repository.find();

        return result.map((entity) => UserRepository.mapRowToModel(entity));
    }

    public async get(id: string) {
        const result = await this.repository.findOneBy({
            id,
        });

        if (!result) {
            return undefined;
        }

        return UserRepository.mapRowToModel(result);
    }

    public async getLogin(email: string, password: string) {
        const result = await this.repository.findOneBy({
            email,
            password,
        });

        if (!result) {
            return undefined;
        }

        return UserRepository.mapRowToModel(result);
    }

    public async create(user: User) {
        const result = this.repository.create({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
        });

        await this.repository.save(result);
    }

    public async validateAlreadyExist(email: string) {
        const result = await this.repository.findOneBy({
            email,
        });

        if (!result) {
            return undefined;
        }

        return UserRepository.mapRowToModel(result);
    }
    public static mapRowToModel(row: UserEntity): User {
        return User.create(row);
    }
}
