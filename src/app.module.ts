import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganModule, MorganInterceptor } from "nest-morgan";
import { UsersModule } from "./users/users.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { ChannelsModule } from "./channels/channels.module";
import { DMsModule } from "./dms/dms.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelChats } from "./entities/ChannelChats";
import { ChannelMembers } from "./entities/ChannelMembers";
import { Channels } from "./entities/Channels";
import { DMs } from "./entities/DMs";
import { Mentions } from "./entities/Mentions";
import { Users } from "./entities/Users";
import { WorkspaceMembers } from "./entities/WorkspaceMembers";
import { Workspaces } from "./entities/Workspaces";
import dotenv from "dotenv";
import { AuthModule } from "./auth/auth.module";
import { EventsGateway } from "./events/events.gateway";
dotenv.config();

@Module({
  imports: [ConfigModule.forRoot( {isGlobal : true}),
     MorganModule, 
     UsersModule, 
     WorkspacesModule, 
     ChannelsModule, 
     DMsModule,
     AuthModule,
     EventsGateway,
     TypeOrmModule.forRoot({
      type : "mysql",
      host : "localhost",
      port : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities : [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Users,
        WorkspaceMembers,
        Workspaces,
      ],
      keepConnectionAlive : true,
      synchronize : false,
      logging : true,
      migrations: [__dirname + "/migrations/*.ts"],
    })
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_INTERCEPTOR, useClass: MorganInterceptor("combined")}],
})
export class AppModule {}