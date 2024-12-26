import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImportingModule } from './importing/importing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthyModule } from './healthy/healthy.module';
import { NotifyModule } from './notify/notify.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    ImportingModule,
    ProductModule,
    HealthyModule,
    NotifyModule,
  ],
})
export class AppModule {}
