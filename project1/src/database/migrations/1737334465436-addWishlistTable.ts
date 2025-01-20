import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWishlistTable1737334465436 implements MigrationInterface {
    name = 'AddWishlistTable1737334465436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orderDetails" ("id" SERIAL NOT NULL, "qunatity" integer NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "hello" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_11d407f307ebf19af9702464e22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlists" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orderDetails" ADD CONSTRAINT "FK_bb1ea956e38abca70b9a0d2c649" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderDetails" ADD CONSTRAINT "FK_9e18b4f98cc143fbe1865dc5162" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlists" ADD CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlists" ADD CONSTRAINT "FK_063c6f46d6cbebf35f3a5ec3d4e" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT "FK_063c6f46d6cbebf35f3a5ec3d4e"`);
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c"`);
        await queryRunner.query(`ALTER TABLE "orderDetails" DROP CONSTRAINT "FK_9e18b4f98cc143fbe1865dc5162"`);
        await queryRunner.query(`ALTER TABLE "orderDetails" DROP CONSTRAINT "FK_bb1ea956e38abca70b9a0d2c649"`);
        await queryRunner.query(`DROP TABLE "wishlists"`);
        await queryRunner.query(`DROP TABLE "orderDetails"`);
    }

}
