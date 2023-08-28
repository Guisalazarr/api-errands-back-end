import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ErrandStatus } from "../../../models/errand.models";
import { UserEntity } from "./user.entity";

@Entity("errand")
export class ErrandEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    enum: ErrandStatus,
  })
  status: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  @Column({
    name: "id_user",
  })
  idUser: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn({ name: "id_user" })
  user: UserEntity;
}
