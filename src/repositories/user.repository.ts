import { users } from '../database/users';
import { User } from '../models/user.models';

export class UserRepository {
    public get(id: string) {
        return users.find((user) => user.id === id);
    }

    public getByEmail(email: string) {
        return users.find((user) => user.email === email);
    }

    public create(user: User) {
        return users.push(user);
    }

    public validateAlreadyExist(email: string) {
        return users.some((user) => user.email === email);
    }
}
