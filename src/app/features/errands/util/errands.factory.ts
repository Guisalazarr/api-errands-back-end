import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateErrandController } from '../controllers/create-errand.controller';
import { DeleteErrandController } from '../controllers/delete-errand.controller';
import { GetErrandController } from '../controllers/get-errand.controller';
import { ListErrandController } from '../controllers/list-errands.controller';
import { UpdateErrandController } from '../controllers/update-errand.controller.ts';
import { ErrandRepository } from '../repositories/errand.repository';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
import { DeleteErrandUsecase } from '../usecases/delete-errands.usecase';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';
import { UpdateErrandsUseCase } from '../usecases/update-errand.usecase';

export class ErrandController {
    private get userRepository() {
        return new UserRepository();
    }

    private get errandRepository() {
        return new ErrandRepository();
    }

    private get cacheRepository() {
        return new CacheRepository();
    }

    public get createErrand() {
        const createUsecase = new CreateErrandUsecase(
            this.userRepository,
            this.errandRepository,
            this.cacheRepository
        );
        return new CreateErrandController(createUsecase);
    }

    public get listErrand() {
        const listUsecase = new ListErrandsUseCase(
            this.userRepository,
            this.errandRepository,
            this.cacheRepository
        );
        return new ListErrandController(listUsecase);
    }

    public get getErrand() {
        const getUsecase = new GetErrandUseCase(
            this.userRepository,
            this.errandRepository,
            this.cacheRepository
        );
        return new GetErrandController(getUsecase);
    }

    public get deleteErrand() {
        const deleteUsecase = new DeleteErrandUsecase(
            this.userRepository,
            this.errandRepository,
            this.cacheRepository
        );
        return new DeleteErrandController(deleteUsecase);
    }

    public get updateErrand() {
        const updateUsecase = new UpdateErrandsUseCase(
            this.userRepository,
            this.errandRepository,
            this.cacheRepository
        );
        return new UpdateErrandController(updateUsecase);
    }
}
