import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1692832109766 implements MigrationInterface {
    name = 'TestMigration1692832109766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(50) NOT NULL, "email" varchar(30) NOT NULL, "password" varchar(12) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "errand" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('U','A') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_errand" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('U','A') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL, CONSTRAINT "FK_29f8c61a7525387f8a05204a4ac" FOREIGN KEY ("id_user") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_errand"("id", "title", "description", "status", "created_at", "updated_at", "id_user") SELECT "id", "title", "description", "status", "created_at", "updated_at", "id_user" FROM "errand"`);
        await queryRunner.query(`DROP TABLE "errand"`);
        await queryRunner.query(`ALTER TABLE "temporary_errand" RENAME TO "errand"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errand" RENAME TO "temporary_errand"`);
        await queryRunner.query(`CREATE TABLE "errand" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "status" varchar CHECK( "status" IN ('U','A') ) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "errand"("id", "title", "description", "status", "created_at", "updated_at", "id_user") SELECT "id", "title", "description", "status", "created_at", "updated_at", "id_user" FROM "temporary_errand"`);
        await queryRunner.query(`DROP TABLE "temporary_errand"`);
        await queryRunner.query(`DROP TABLE "errand"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
