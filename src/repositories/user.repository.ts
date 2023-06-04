import { users } from '../database/users';
import { User } from '../models/user.models';

export class UserRepository {
    public list() {
        return users;
    }

    public get(id: string) {
        return users.find((user) => user.id === id);
    }

    public create(user: User) {
        return users.push(user);
    }

    public delete(id: string) {
        const findIndex = users.findIndex((user) => user.id === id);
        if (findIndex < 0) {
            return false;
        }
        return users.splice(findIndex, 1);
    }

    public validateAlreadyExist(email: string) {
        return users.some((user) => user.email === email);
    }
}
