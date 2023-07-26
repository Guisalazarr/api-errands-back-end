import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: '50' })
    name: string;

    @Column({ type: 'varchar', length: '30' })
    email: string;

    @Column({ type: 'varchar', length: '12' })
    password: string;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;
}
