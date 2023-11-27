import Redis from 'ioredis'

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: ''
  });
  redis.on("error", function (error) {
    console.error(error);
  });

export default async function redisCache( queryFunction, cacheKey, req, res){
    try{
      //check cache
      let catchedData = null;
      if (catchedData) {
        let catchedData = await redis.get(cacheKey);
        return catchedData;
      } else {
        /* cache dosen't exist, query from database */
        try{ 
          const result = await queryFunction();
          await redis.set(cacheKey, result, 'EX', 600);
          return result;
        } catch (error) {
          console.error('Query error:', error);
          res.status(500).json({ error: 'Query error' });
 
        }
      }
    } catch (error) {
      console.error("Redis error:", error);
      res.status(500).json({ error: "Redis error" });
    }
  }

