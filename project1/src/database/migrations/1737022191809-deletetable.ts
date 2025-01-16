import { MigrationInterface, QueryRunner } from 'typeorm';

export class Deletetable1737022191809 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orderDetails"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`
            CREATE TABLE "orderDetails" (
                "id" SERIAL NOT NULL,
                "qunatity" integer NOT NULL,
                "orderId" integer NOT NULL,
                "productId" integer NOT NULL,
                "hello" integer NOT NULL,
                "price" integer NOT NULL,
                "orderId" integer,
                "productId" integer,
                CONSTRAINT "PK_orderDetails_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_orderDetail" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_product_orderDetail" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);
    }
}
