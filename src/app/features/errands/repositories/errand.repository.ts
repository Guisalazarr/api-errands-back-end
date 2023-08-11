import { ErrandEntity } from '../../../shared/database/entities/errand.entity';
import { Errand, ErrandStatus } from '../../../models/errand.models';
import { UserRepository } from '../../user/repositories/user.repository';
import { Database } from '../../../../main/database/database.connection';
import { ListErrandsParams } from '../usecases/list-errands.usecase';

export class ErrandRepository {
    private repository = Database.connection.getRepository(ErrandEntity);

    public async list(params: ListErrandsParams) {
        const result = await this.repository.find({
            where: {
                idUser: params.userId,
                title: params.title,
                status: params.status,
            },
            relations: {
                user: true,
            },
        });
        return result.map((row) => this.mapRowToModel(row));
    }

    public async get(errandId: string) {
        const result = await this.repository.findOneBy({
            id: errandId,
        });

        if (!result) {
            return undefined;
        }
        return this.mapRowToModel(result);
    }

    public async create(errand: Errand) {
        const errandEntity = this.repository.create({
            id: errand.id,
            title: errand.title,
            status: errand.status,
            description: errand.description,
            idUser: errand.user.id,
        });

        await this.repository.save(errandEntity);
    }

    public async delete(errandId: string) {
        const result = await this.repository.delete(errandId);

        return result.affected ?? 0;
    }

    public async update(errand: Errand) {
        await this.repository.update(
            {
                id: errand.id,
            },
            {
                title: errand.title,
                description: errand.description,
                status: errand.status,
            }
        );
    }

    private mapRowToModel(row: ErrandEntity) {
        const user = UserRepository.mapRowToModel(row.user);

        return Errand.create(row, user);
    }
}
