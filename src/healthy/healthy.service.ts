import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportingProcess } from 'src/importing/schemas/importing-process.schema';

const NOW = new Date();

@Injectable()
export class HealthyService {
    constructor(@InjectModel(ImportingProcess.name) private importingProcessModel: Model<ImportingProcess>) {}
  
    async health() {
        return {
            lastImportingProcess: (await this.lastImportingProcess()),
            databaseConnection: 'OK',
            memoryUsage: this.memoryUsage(),
        }
    }

    private async lastImportingProcess() {
      const [last] = await this.importingProcessModel.find().sort({ endDate: -1 }).limit(1);
      if (last) return last.endDate;
    }

    private memoryUsage() {
        const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
        const memoryData = process.memoryUsage();

        return {
            rss: formatMemoryUsage(memoryData.rss),
            heapTotal: formatMemoryUsage(memoryData.heapTotal),
            heapUsed: formatMemoryUsage(memoryData.heapUsed),
            external: formatMemoryUsage(memoryData.external),
        };
        
    }
}
