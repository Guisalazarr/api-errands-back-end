import { CacheRepository } from '../../../shared/database/repositories/cache.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrandController } from '../controllers/errand.controller';
import { ErrandRepository } from '../repositories/errand.repository';
import { CreateErrandUsecase } from '../usecases/create-errand.usecase';
import { DeleteErrandUsecase } from '../usecases/delete-errands.usecase';
import { GetErrandUseCase } from '../usecases/get-errand.usecase';
import { ListErrandsUseCase } from '../usecases/list-errands.usecase';
import { UpdateErrandsUseCase } from '../usecases/update-errand.usecase';

export function CreateErrandController() {
    const userRepoSigleton = new UserRepository();
    const errandRepoSigleton = new ErrandRepository();
    const cacheRepoSigleton = new CacheRepository();

    const createUsecase = new CreateErrandUsecase(
        userRepoSigleton,
        errandRepoSigleton,
        cacheRepoSigleton
    );
    const listUsecase = new ListErrandsUseCase(
        userRepoSigleton,
        errandRepoSigleton,
        cacheRepoSigleton
    );
    const getUsecase = new GetErrandUseCase(
        userRepoSigleton,
        errandRepoSigleton,
        cacheRepoSigleton
    );
    const deleteUsecase = new DeleteErrandUsecase(
        userRepoSigleton,
        errandRepoSigleton,
        cacheRepoSigleton
    );
    const updateUsecase = new UpdateErrandsUseCase(
        userRepoSigleton,
        errandRepoSigleton,
        cacheRepoSigleton
    );

    return new ErrandController(
        createUsecase,
        listUsecase,
        getUsecase,
        deleteUsecase,
        updateUsecase
    );
}
