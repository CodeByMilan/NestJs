import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteaddColumn1737021852354 implements MigrationInterface {
    name = 'DeleteaddColumn1737021852354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderDetails" ADD "hello" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orderDetails" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderDetails" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orderDetails" DROP COLUMN "hello"`);
    }

}
