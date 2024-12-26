import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifyService {
    publish(message: string) {
        fetch('https://ntfy.sh/jesse1983', {
            method: 'POST',
            body: message,
          });
    }
}
