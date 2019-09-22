import {MigrationInterface, QueryRunner} from "typeorm";

export class File1569182913515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" uuid, "originalName" character varying NOT NULL, "storageName" character varying NOT NULL, "size" numeric NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "fileId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5963070526d10e14038f83f1be7" UNIQUE ("fileId")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5963070526d10e14038f83f1be7" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5963070526d10e14038f83f1be7"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5963070526d10e14038f83f1be7"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fileId"`, undefined);
        await queryRunner.query(`DROP TABLE "files"`, undefined);
    }

}
