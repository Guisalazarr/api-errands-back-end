import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1689896127882 implements MigrationInterface {
    name = 'UserEntity1689896127882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "errands"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(12) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "errands"."errand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id_user" uuid NOT NULL, CONSTRAINT "PK_9f3c23786d9cb9bed972cf6a36c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "errands"."errand" ADD CONSTRAINT "FK_29f8c61a7525387f8a05204a4ac" FOREIGN KEY ("id_user") REFERENCES "errands"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errands"."errand" DROP CONSTRAINT "FK_29f8c61a7525387f8a05204a4ac"`);
        await queryRunner.query(`DROP TABLE "errands"."errand"`);
        await queryRunner.query(`DROP TABLE "errands"."user"`);
    }

}
