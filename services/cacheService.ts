import { WorldData, Nation, MAP_WIDTH, MAP_HEIGHT, NationMapData } from '../types';
import { Delaunay } from 'd3-delaunay';
import { deriveGdpFromMarketAndServices } from './economyService';

const CACHE_KEY_PREFIX = 'world-data-';

const clearAllWorldCaches = (): void => {
    try {
        // Iterate backwards to safely remove items while iterating
        let i = sessionStorage.length;
        while (i--) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                sessionStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error("Failed to clear all world caches from session storage", error);
    }
};


/**
 * Retrieves cached WorldData from sessionStorage for a given seed.
 * @param seed The seed of the world to retrieve.
 * @returns The cached WorldData object or null if not found or on error.
 */
export const getCachedWorldData = (seed: number): WorldData | null => {
  try {
    const cachedItem = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${seed}`);
    if (cachedItem) {
      const slimWorldData = JSON.parse(cachedItem);

      // Re-hydrate the data if it's in the slim format
      // Check if territory is missing from the first map item, indicating a slim cache
      if (slimWorldData.mapData && slimWorldData.mapData.length > 0 && slimWorldData.mapData[0].territory === undefined) {
          // 1. Re-hydrate map territories
          const allPoints = slimWorldData.mapData.map((d: Omit<NationMapData, 'territory'>) => [d.center.x, d.center.y] as [number, number]);
          const delaunay = Delaunay.from(allPoints);
          const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);
          
          const hydratedMapData = slimWorldData.mapData.map((data: Omit<NationMapData, 'territory'>, i: number) => {
            const polygon = voronoi.cellPolygon(i);
            return {
              ...data,
              territory: (polygon || []) as [number, number][],
            };
          });
          slimWorldData.mapData = hydratedMapData;
      }
      
      // Check if gdp is missing from the first nation, indicating a slim cache
      if(slimWorldData.nations && slimWorldData.nations.length > 0 && slimWorldData.nations[0].gdp === undefined) {
        // 2. Re-hydrate nation GDP
        const hydratedNations = slimWorldData.nations.map((nation: Omit<Nation, 'gdp' | 'gdpBreakdown'>) => {
            const nationWithMarket = nation as Nation; // The slimmed nation still has the market data needed.
            const gdpBreakdown = deriveGdpFromMarketAndServices(nationWithMarket);
            const gdp = (gdpBreakdown || []).reduce((total, category) => 
                total + (category.lineItems || []).reduce((catTotal, item) => catTotal + item.value, 0), 0);
            return { ...nation, gdpBreakdown, gdp };
        });
        slimWorldData.nations = hydratedNations;
      }

      return slimWorldData as WorldData;
    }
    return null;
  } catch (error) {
    console.error("Failed to read or rehydrate from session storage", error);
    clearCachedWorldDataBySeed(seed);
    return null;
  }
};

/**
 * Saves WorldData to sessionStorage against a given seed.
 * @param seed The seed of the world to save.
 * @param data The WorldData object to cache.
 */
export const setCachedWorldData = (seed: number, data: WorldData): void => {
  // Create a "slim" version of the data for caching by removing derived/large fields.
  const slimMapData = data.mapData.map(({ territory, ...rest }) => rest);
  const slimNations = data.nations.map(({ gdp, gdpBreakdown, ...rest }) => rest as Omit<Nation, 'gdp'|'gdpBreakdown'>);
  
  const slimWorldData = {
      ...data,
      mapData: slimMapData,
      nations: slimNations,
  };
  const stringifiedData = JSON.stringify(slimWorldData);

  try {
    sessionStorage.setItem(`${CACHE_KEY_PREFIX}${seed}`, stringifiedData);
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        console.warn("Session storage quota exceeded. Clearing old world caches and retrying.");
        clearAllWorldCaches();
        try {
            sessionStorage.setItem(`${CACHE_KEY_PREFIX}${seed}`, stringifiedData);
        } catch (retryError) {
             console.error("Failed to write to session storage even after clearing cache. Data may be too large for a single entry.", retryError);
        }
    } else {
        console.error("Failed to write to session storage", error);
    }
  }
};

/**
 * Removes a specific world's data from the session cache.
 * @param seed The seed of the world to clear from the cache.
 */
export const clearCachedWorldDataBySeed = (seed: number): void => {
    try {
        sessionStorage.removeItem(`${CACHE_KEY_PREFIX}${seed}`);
    } catch (error) {
        console.error("Failed to remove from session storage", error);
    }
};
