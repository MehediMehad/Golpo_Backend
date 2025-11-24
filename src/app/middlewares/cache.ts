import type { Request, Response, NextFunction } from 'express';

import redis from '../libs/redis';

// Extend Response type to include sendResponse
interface CachedResponse extends Response {
  sendResponse?: Response['json'];
}

export const cache =
  (keyBuilder: (req: Request) => string, ttl: number) =>
  async (req: Request, res: CachedResponse, next: NextFunction) => {
    const key = keyBuilder(req);
    const cached = await redis.get(key);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Override res.json
    res.sendResponse = res.json;
    res.json = (body: any) => {
      // Set cache asynchronously, but don't block the response
      redis.set(key, JSON.stringify(body), 'EX', ttl).catch(console.error);
      return res.sendResponse!(body); // '!' because we know sendResponse exists
    };

    next();
  };
