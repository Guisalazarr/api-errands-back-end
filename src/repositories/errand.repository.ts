import { Errand, ErrandStatus } from '../models/errand.models';
import { User } from '../models/user.models';

interface ListErrandsParams {
    user: User;
    title?: string;
    status?: ErrandStatus;
}

export class ErrandRepository {
    public list(params: ListErrandsParams) {
        return params.user.errand.filter(
            (errand) =>
                (!params.title || errand.title === params.title) &&
                (!params.status || errand.status === params.status)
        );
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
