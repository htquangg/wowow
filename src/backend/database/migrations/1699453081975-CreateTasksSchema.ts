import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksSchema1699453081975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tasks
      (
          id     VARCHAR(36) PRIMARY KEY,
          name   VARCHAR(128) NOT NULL,
          status VARCHAR(64)  NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tasks`);
  }
}
