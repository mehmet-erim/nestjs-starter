import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileDestination1569260660869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "files" ADD "destination" character varying NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP COLUMN "destination"`,
      undefined,
    );
  }
}
