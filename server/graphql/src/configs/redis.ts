import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { REDIS_TLS } from './config';

const createRedisConfig = (isTLS: boolean) => {
  let options = {
    retryStrategy: (times: number) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  };
  if (isTLS) {
    return {
      ...options,
      // password: REDIS_PASSWORD,
      tls: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
      },
    };
  } else {
    return {
      ...options,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
    };
  }
};

export const configureRedis = (): {
  redis: Redis.Redis;
  pubsub: RedisPubSub;
} => {
  const options = createRedisConfig(REDIS_TLS === '1');

  const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });
  const redis = new Redis(options);

  return { redis, pubsub };
};
