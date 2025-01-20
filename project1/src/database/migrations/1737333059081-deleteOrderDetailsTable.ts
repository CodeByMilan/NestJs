import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteOrderDetailsTable1737333059081 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orderDetails"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "orderDetails" (
        "id" SERIAL NOT NULL,
        "quantity" integer NOT NULL,
        "orderId" integer NOT NULL,
        "productId" integer NOT NULL,
        "price" integer NOT NULL,
        CONSTRAINT "PK_orderDetails_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_orderDetail" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_product_orderDetail" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
  }
}
