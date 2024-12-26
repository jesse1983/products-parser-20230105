import { Module } from '@nestjs/common';
import { ImportingOpenFoodsFacts } from './providers/open-foods-facts/importing-open-foods-facts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Importing, ImportingSchema } from './schemas/importing.schema';
import { ImportingRepository } from './importing.repository';
import { ProductModule } from 'src/product/product.module';
import { ImportingService } from './importing.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ImportingProcess, ImportingProcessSchema } from './schemas/importing-process.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Importing.name, schema: ImportingSchema },
      { name: ImportingProcess.name, schema: ImportingProcessSchema },
    ]),
    ProductModule,
  ],
  providers: [
    ImportingRepository,
    ImportingOpenFoodsFacts,
    ImportingService,
  ]
})
export class ImportingModule {}
