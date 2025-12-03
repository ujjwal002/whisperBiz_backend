type CacheStore = { [key: string]: any };

const memoryCache: CacheStore = {};

export const Cache = {
  set(key: string, value: any, ttlMs?: number) {
    memoryCache[key] = value;

    if (ttlMs) {
      setTimeout(() => delete memoryCache[key], ttlMs);
    }
  },

  get(key: string) {
    return memoryCache[key];
  },

  delete(key: string) {
    delete memoryCache[key];
  },
};
