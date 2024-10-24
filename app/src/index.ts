import 'dotenv/config';

import Redis from 'ioredis';
import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();

let redisClient = null;

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
      // Redis#call() can be used to call arbitrary Redis commands.
      // The first parameter is the command name, the rest are arguments.
      await redisClient.call("JSON.SET", "doc", "$", '{"f1": {"a":1}, "f2":{"a":2}}');
      const json = await redisClient.call("JSON.GET", "doc", "$..f1");
      console.log(json); // [{"a":1}]
    } else {
      console.log('Redis client is not ready');
    }
  } catch (error) {
    console.log('REDIS JSON ERROR', error);
  }
};

const checkRedisModules = async () => {
  try {
    const modules = await redisClient.call('MODULE', 'LIST');
    console.log('Loaded modules:', modules);
  } catch (error) {
    console.log('Error checking modules:', error);
  }
};

const initRedisClient = async () => {
  if (redisClient) return;
  try {
    redisClient = new Redis({
      sentinels: [
        { host: process.env.HOST_IP, port: 26379 },
        { host: process.env.HOST_IP, port: 26380 },
        { host: process.env.HOST_IP, port: 26381 }
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
        await checkRedisModules(); // Check loaded modules
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
app.use("/", (req, res) => {
   const user = {
     username : faker.person.fullName(),
     job: faker.person.jobTitle(),
     bio: faker.person.bio(),
   }
   return res.status(200).json({
    ...user
   });
});

const start = () => {
  app.listen(5000, '0.0.0.0', async function () {
    console.log('APP STARTED ON PORT 5000');
    await initRedisClient();
  });
};

start();
