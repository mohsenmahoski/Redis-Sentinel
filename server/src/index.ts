import express from 'express';
import Redis from 'ioredis';


const app = express();

export let redisClient = null;

let retries = 0;

const checkRedis = async () => {
  if (redisClient && redisClient.status === 'ready') {
    await redisClient.set("ping", "pong");
    const value = await redisClient.get("ping");
    console.log("value is", value);
  } else {
    console.log("Redis client is not ready");
  }
};

const initRedisClient = async () => {
  if (redisClient) return;
  try {
    redisClient = new Redis({
      sentinels: [
        {
          host: 'YOUR_HOST_IP',
          port: 26379
        },
        {
          host: 'YOUR_HOST_IP',
          port: 26380
        },
        {
          host: 'YOUR_HOST_IP',
          port: 26381
        }
      ],
      name: 'mymaster',
      sentinelRetryStrategy: (times) => {
        const delay = Math.min(times * 1000, 30000); // retry with exponential backoff, up to a maximum of 30 seconds
        return delay;
      }
    });

    redisClient.on('connect', () => {
      console.log("Redis connected");
    });

    redisClient.on('ready', async () => {
      try {
        console.log("Redis is ready");
        checkRedis();
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
