import { Errand } from '../models/errand.models';
import { User } from '../models/user.models';

export class ErrandRepository {
    public list(user: User, title?: string) {
        return user.errand.filter((errand) => !title || errand.title === title);
    }

    public get(user: User, errandId: string) {
        return user.errand.find((errand) => errand.id === errandId);
    }

    public create(user: User, errand: Errand) {
        user.errand.push(errand);
    }

    public delete(user: User, errandId: string) {
        const findIndex = user.errand.findIndex(
            (errand) => errand.id === errandId
        );

        if (findIndex < 0) {
            return false;
        }
        return user.errand.splice(findIndex, 1);
    }
}
