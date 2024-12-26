import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
