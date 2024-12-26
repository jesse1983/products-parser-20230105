import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ImportingOpenFoodsFacts } from './providers/open-foods-facts/importing-open-foods-facts.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImportingProcess } from './schemas/importing-process.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class ImportingService implements OnModuleInit {
  private readonly logger = new Logger(ImportingService.name);

  constructor(
    private readonly importingOpenFoodsFacts: ImportingOpenFoodsFacts,
    private readonly notifyService: NotifyService,
    @InjectModel(ImportingProcess.name) private importingProcessModel: Model<ImportingProcess>
  ) {}

  onModuleInit() {
    this.importAll();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async importAll() {
    this.logger.log('Starting ImportingService::importAll');    
    const created = await this.importingProcessModel.create({ status: 'WIP' });

    try {
      await Promise.all([
        this.importingOpenFoodsFacts.execute()
      ]);
      created.status = 'DONE';
      this.notifyService.publish('Data imported successfully 💚');
    } catch(e) {
      created.errorMessage = e.message;
      created.status = 'FAILED';
      this.logger.error(`Error to import data ${e.message}`);
      this.notifyService.publish('Error to importing data ❌');
    } finally {
      created.endDate = new Date();
      await created.save();
      this.logger.log('End ImportingService::importAll');
    }
  }
}
