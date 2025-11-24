import Redis from 'ioredis';

import config from '../configs';

const redis = new Redis({
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  tls: config.app.node_env === 'production' ? {} : undefined,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});
redis.on('connect', () => console.log('🟢 Redis connected'));
redis.on('error', (err) => console.error('Redis error ❌', err));

export default redis;
