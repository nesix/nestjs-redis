import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';

const createRedisClient = (
  provide: string,
  injectOptions: string,
): Provider => ({
  provide,
  useFactory: async (options: RedisClientOptions): Promise<any> => {
    const client = createClient(options);
    await client.connect();
    return client;
  },
  inject: [injectOptions],
});

export interface RedisModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  provide: string;
  useFactory: (...args: any[]) => RedisClientOptions;
  inject?: any[];
}

const createClientOptions = (
  options: RedisModuleOptions,
  provide: string,
): Provider => ({
  provide,
  useFactory: options.useFactory,
  inject: options.inject,
});

const optionsProvide = (() => {
  let index = 0;
  return () => `REDIS_CLIENT_OPTIONS_${index++}`;
})();

@Global()
@Module({})
export class RedisModule {
  static register(options: RedisModuleOptions): DynamicModule {
    const optionsProvider = optionsProvide();
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        createRedisClient(options.provide, optionsProvider),
        createClientOptions(options, optionsProvider),
      ],
      exports: [options.provide],
    };
  }
}
