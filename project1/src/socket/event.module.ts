import { Module } from "@nestjs/common";
import { EventGateWay } from "./event.gateway";
import { JwtModule } from "@nestjs/jwt";


@Module({

    imports:[JwtModule],
    controllers:[],
    providers:[EventGateWay],
    exports:[EventGateWay]

})
export class EventGateWayModule{}