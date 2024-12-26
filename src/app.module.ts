import { Module } from '@nestjs/common';
import { ImportingModule } from './importing/importing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthyModule } from './healthy/healthy.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:12345678@localhost:27017'),
    ScheduleModule.forRoot(),
    ImportingModule,
    ProductModule,
    HealthyModule,
    NotifyModule,
  ],
})
export class AppModule {}
