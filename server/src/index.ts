import express from 'express';
import Redis from 'ioredis';

const app = express();

let redisClient = null;
let retries = 0;

const checkRedis = async () => {
  try {
    if (redisClient.status === 'ready') {
      await redisClient.set('ping', 'pong');
      const value = await redisClient.get('ping');
      console.log('value is', value);
    } else {
      console.log('Redis client is not ready');
    }
  } catch (error) {
    console.log('REDIS ERROR', error);
  }
};

const checkRedisJSON = async () => {
  try {
    if (redisClient.status === 'ready') {
      // Use JSON.SET to store a JSON object
      await redisClient.call('JSON.SET', 'mykey', '.', JSON.stringify({ foo: 'bar' }));

      // Use JSON.GET to retrieve the JSON object
      const value = await redisClient.call('JSON.GET', 'mykey');
      console.log('value is', JSON.parse(value));
    } else {
      console.log('Redis client is not ready');
    }
  } catch (error) {
    console.log('REDIS JSON ERROR', error);
  }
};

const initRedisClient = async () => {
  if (redisClient) return;
  try {
    redisClient = new Redis({
      sentinels: [
        { host: '172.29.48.1', port: 26379 },
        { host: '172.29.48.1', port: 26380 },
        { host: '172.29.48.1', port: 26381 }
      ],
      name: 'mymaster',
      sentinelRetryStrategy: (times) => Math.min(times * 1000, 60000),
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true;
        }
      },
    });

    redisClient.on('connect', () => {
      console.log('Redis connected');
    });

    redisClient.on('ready', async () => {
      try {
        console.log('Redis is ready');
        await checkRedis();
        await checkRedisJSON();
      } catch (error) {
        console.log(error);
      }
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });

    redisClient.on('error', (err) => {
      console.log(err);
    });

  } catch (error) {
    console.log(error);
    redisClient = null;
  }
};

const start = () => {
  app.listen(5000, '0.0.0.0', async function () {
    console.log('APP STARTED ON PORT 5000');
    await initRedisClient();
  });
};

process.on('exit', (code) => {
  const log = {
    type: 'EXIT',
    error: JSON.stringify(code)
  };
  console.log(log);
});

process.on('uncaughtException', (error) => {
  const log = {
    type: 'UNCAUGHT-EXCEPTION',
    error: JSON.stringify(error)
  };
  console.log(log);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const log = {
    type: 'UNHANDLE-REJECTION',
    error: JSON.stringify(reason)
  };
  console.log(log);
  process.exit(1);
});

start();
