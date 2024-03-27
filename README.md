# Модуль `redis` для `nestjs` проектов

Пример подключения:
```typescript
import { RedisModule } from '@giru/nestjs-redis';

@Module({
  imports: [
    RedisModule.register({
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => ({
        url: config.get('REDIS_URL', 'redis://127.0.0.1:6379/0'),
      }),
      inject: [ConfigService],
    })
  ],
})
export class AppModule {}

```

Подключить в контроллерах/сервисах:

```typescript
import { Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class Service {
  constructor (@Inject('REDIS_CLIENT') private redis: RedisClientType) {}
}
```

После чего, в методах обращаемся к `this.redis`:
```typescript
await this.redis.set('KEY', 'VALUE', { EX: 3600 });
```
