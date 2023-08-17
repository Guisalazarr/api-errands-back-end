import { CreateUserController } from '../controllers/create-user.controller';
import { GetUserController } from '../controllers/get-user.controller';
import { ListUserController } from '../controllers/list-user.controller';
import { LoginUserController } from '../controllers/login-user.controller';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserUsecase } from '../usecases/create-user.usecase';
import { GetUserUsecase } from '../usecases/get-user.usecase';
import { ListUserUsecase } from '../usecases/list-user.usecase';
import { LoginUsecase } from '../usecases/login-user.usecase';

export class UserController {
    private get userReposigleton() {
        return new UserRepository();
    }

    public get createUser() {
        const createUsecase = new CreateUserUsecase(this.userReposigleton);
        return new CreateUserController(createUsecase);
    }

    public get listUser() {
        const listUsecase = new ListUserUsecase(this.userReposigleton);
        return new ListUserController(listUsecase);
    }

    public get getUser() {
        const getUsecase = new GetUserUsecase(this.userReposigleton);
        return new GetUserController(getUsecase);
    }

    public get loginUser() {
        const loginUsecase = new LoginUsecase(this.userReposigleton);
        return new LoginUserController(loginUsecase);
    }
}
