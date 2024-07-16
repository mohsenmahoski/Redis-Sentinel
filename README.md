This project is a Node.js application that connects to a Redis Sentinel cluster. It leverages Docker Compose to launch a Redis instance with Sentinel support.<br/>
<br/>
1* To start project replace all YOUR_HOST_IP in docker-compose and ioredis config with your real host ip.<br/>
2* docker-compose up -d // start redis sentienl with docker.<br/>
3* in server directory run npm i.<br/>
4* in server directory run npm start.<br/>
5\_ in terminal you should see "Redis is ready" and "value is pong"

# Commands

docker-compose --env-file .env up
docker exec -it sentinel-1 redis-cli -p 26379 sentinel slaves mymaster
docker exec -it sentinel-1 redis-cli -p 26379 sentinel masters
docker exec -it redis-master redis-cli INFO replication
docker-compose stop redis-master
docker exec -it sentinel-2 redis-cli -p 26379 sentinel get-master-addr-by-name mymaster

# Redis Insight

https://hub.docker.com/r/redis/redisinsight
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest
