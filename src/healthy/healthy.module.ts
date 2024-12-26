import { Module } from '@nestjs/common';
import { HealthyController } from './healthy.controller';
import { HealthyService } from './healthy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportingProcess, ImportingProcessSchema } from 'src/importing/schemas/importing-process.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImportingProcess.name, schema: ImportingProcessSchema },
    ]),
  ],
  controllers: [HealthyController],
  providers: [HealthyService]
})
export class HealthyModule {}
