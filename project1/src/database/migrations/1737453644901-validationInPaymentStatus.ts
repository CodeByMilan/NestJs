import { MigrationInterface, QueryRunner } from "typeorm";

export class ValidationInPaymentStatus1737453644901 implements MigrationInterface {
    name = 'ValidationInPaymentStatus1737453644901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentstatus_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentStatus" "public"."payment_paymentstatus_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentStatus" character varying NOT NULL DEFAULT 'pending'`);
    }

}
