import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishListRepository } from "./wishlist.repository";
import { WishListEntity } from "../entities/wishlist.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature(
            [WishListEntity]
        )
    ],
    controllers: [],
    providers:[WishListRepository],
    exports:[WishListRepository]
})
export class wishListRepositoryModule{};