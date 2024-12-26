import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotifyService {
    constructor(
        private readonly configService: ConfigService,
    ){}

    publish(message: string) {
        fetch(this.configService.get<string>('NOTIFY_PUBLISH_URL'), {
            method: 'POST',
            body: message,
          });
    }
}
