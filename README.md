This project is a Node.js application that connects to a Redis Sentinel cluster. It leverages Docker Compose to launch a Redis instance with Sentinel support.<br/>
<br/>
1_ To start project replace all YOUR_HOST_IP in docker-compose and ioredis config with your real host ip.<br/>
2_ docker-compose up -d // start redis sentienl with docker.<br/>
3_ in server directory run npm i.<br/>
4_ in server directory run npm start.<br/>
5_ in terminal you should see "Redis is ready" and "value is pong"
