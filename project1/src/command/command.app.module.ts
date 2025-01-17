import { Module } from "@nestjs/common";
import { CommandAppService } from "./command.app.service";
import { CommandModule } from "nestjs-command";
import { DatabaseModule } from "src/database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports:[ 
        CommandModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
          }),
        DatabaseModule,

    ],
    providers:[CommandAppService]
})

export class CommandAppModule {}