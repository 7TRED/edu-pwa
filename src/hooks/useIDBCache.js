import { useEffect, useState } from "react";
import { set, get, update } from "idb-keyval";

const useIDBCache = (cacheName, defaultValue) => {
  useEffect(() => {
    async function syncCache() {
      const cache = await getCache();
      if (!cache) {
        await createCache();
        return;
      }
    }

    syncCache();
  }, []);

  async function createCache() {
    return await set(cacheName, defaultValue);
  }

  async function getCache() {
    return await get(cacheName);
  }

  async function updateCache(updaterCallback) {
    await update(cacheName, updaterCallback);
  }

  async function clearCache() {
    await update(cacheName, (oldValue) => defaultValue);
  }

  return {
    createCache,
    getCache,
    updateCache,
    clearCache,
  };
};

export default useIDBCache;
