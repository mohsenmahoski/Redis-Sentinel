import express from 'express';
import { createClient } from 'redis';

const app = express();

export let redisClient = null;

let retries = 0;

const checkRedis = async () => {
  if (redisClient && redisClient.isReady) {
    await redisClient.set("ping", "pong");
    const value = await redisClient.get("ping");
    console.log("value is", value);
  } else {
    console.log("Redis client is not ready");
  }
};

const checkRedisJSON = async () => {
  try {
    if (redisClient.isReady) {
      // Use JSON.SET to store a JSON object
      await redisClient.json.set('mykey', '.', { foo: 'bar' });

      // Use JSON.GET to retrieve the JSON object
      const value = await redisClient.json.get('mykey');

      console.log("value is", value);
    } else {
      console.log("Redis client is not ready");
    }
  } catch (error) {
    console.log("REDIS JSON ERROR", error);
  }
};

const initRedisClient = async () => {
  if (redisClient) return;
  try {
    redisClient = createClient({
      // @ts-ignore
      sentinels: [
        {
          host: '192.168.16.1',
          port: 26379
        },
        {
          host: '192.168.16.1',
          port: 26380
        },
        {
          host: '192.168.16.1',
          port: 26381
        }
      ],
      name: 'mymaster' // the name of your master group
    });
    // redisClient = createClient({
    //   url: 'redis://192.168.16.1:6379'
    // });

    redisClient.on('connect', () => {
      console.log("Redis connected");
    });

    redisClient.on('ready', async () => {
      try {
        console.log("Redis is ready");
        checkRedis();
        checkRedisJSON();
      } catch (error) {
        console.log(error);
      }
    });

    redisClient.on('reconnecting', () => {
      ++retries;
      console.log('Redis reconnecting')
    });

    redisClient.on('error', (err) => {
      console.log(err)
    });

    await redisClient.connect();

  } catch (error) {
    console.log(error)
    redisClient = null;
  }
};

const start = () => {
  app.listen(5000, '0.0.0.0', async function () {
    console.log("APP STARTED ON PORT 5000");
    await initRedisClient();
  });
};

process.on('exit', (code) => {
  const log = {
    type: "EXIT",
    error: JSON.stringify(code)
  };
  console.log(log);
});

process.on('uncaughtException', (error) => {
  const log = {
    type: "UNCAUGHT-EXCEPTION",
    error: JSON.stringify(error)
  };
  console.log(log);
  // It's recommended to exit the process after logging the uncaught exception
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  // It's recommended to exit the process after logging the unhandled rejection
  const log = {
    type: "UNHANDLE-REJECTION",
    error: JSON.stringify(reason)
  };
  console.log(log);
  process.exit(1);
});

start();
