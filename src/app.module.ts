import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProductModule } from "./product/product.module";
import { ScheduleModule } from "@nestjs/schedule";
import { HealthyModule } from "./healthy/healthy.module";
import { NotifyModule } from "./notify/notify.module";
import { DatabaseModule } from "./database/database.module";
import { ImportingModule } from "./importing/importing.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    ProductModule,
    HealthyModule,
    NotifyModule,
    ImportingModule,
  ],
})
export class AppModule {}
