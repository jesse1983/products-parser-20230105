import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ImportingOpenFoodsFacts } from './providers/open-foods-facts/importing-open-foods-facts.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImportingService implements OnModuleInit {
  private readonly logger = new Logger(ImportingService.name);

  constructor(private readonly importingOpenFoodsFacts: ImportingOpenFoodsFacts) {}

  onModuleInit() {
    return this.importAll();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async importAll() {
    this.logger.log('Starting importing');
    await Promise.all([
      this.importingOpenFoodsFacts.execute()
    ]);
  }
}
