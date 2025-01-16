import { MigrationInterface, QueryRunner } from "typeorm";

export class Hello1737019070168 implements MigrationInterface {
    name = 'Hello1737019070168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "world" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "world"`);
    }

}
