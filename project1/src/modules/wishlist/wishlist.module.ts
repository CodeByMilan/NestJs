
import { Module } from "@nestjs/common";
import { wishListRepositoryModule } from "./repository/repositories/wishList.repository.module";
import { WishListService } from "./services/wishList.service";
import { WishListController } from "./controller/wishList.controller";
@Module({
    imports: [wishListRepositoryModule],
    controllers: [WishListController],
    providers:[WishListService],
    exports:[WishListService]
})
export class WishListModule {};