
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Nation, Era, SortKey, SortOrder, ActiveView, TradeGood, WorldData, MapData } from './types';
import { generateWorld } from './services/worldGenerationService';
import { getCachedWorldData, setCachedWorldData, clearCachedWorldDataBySeed } from './services/cacheService';
import SettingsPanel from './components/ui/SettingsPanel';
import MainDisplay from './components/layout/MainDisplay';
import { useTime } from './hooks/useTime';
import AppHeader from './components/header/AppHeader';

const App: React.FC = () => {
  const [nations, setNations] = useState<Nation[]>([]);
  const [mapData, setMapData] = useState<MapData>([]);
  const [selectedNation, setSelectedNation] = useState<Nation | null>(null);
  const [eras, setEras] = useState<Era[]>([]);
  const [tradeGoods, setTradeGoods] = useState<TradeGood[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const [currencyName, setCurrencyName] = useState<string>('');
  
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const [activeView, setActiveView] = useState<ActiveView>('economy');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  
  const [isNationListCollapsed, setIsNationListCollapsed] = useState(true);

  const {
      currentYear,
      currentMonthIndex,
      currentDay,
      dayOfWeekIndex,
      advanceTime,
      setCurrentYear,
      setDate,
      randomizeDate,
  } = useTime(isPaused, isLoading, error);

  const setWorldState = (worldData: WorldData) => {
      setNations(worldData.nations);
      setMapData(worldData.mapData);
      setEras(worldData.eras);
      setTradeGoods(worldData.tradeGoods);
      setCurrentYear(worldData.currentYear);
      setCurrencySymbol(worldData.currencySymbol);
      setCurrencyName(worldData.currencyName);

      if (!(worldData as any).monthIndex) { // Only randomize time if it's not from cache
        randomizeDate();
      } else {
        const cached = worldData as any;
        setDate({
            year: worldData.currentYear,
            monthIndex: cached.monthIndex,
            day: cached.day,
            dayOfWeekIndex: cached.dayOfWeekIndex,
        });
      }
  };

  const fetchWorldData = useCallback(async (currentSeed: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedNation(null);

    const cachedData = getCachedWorldData(currentSeed);
    if (cachedData) {
      setWorldState(cachedData);
      setIsLoading(false);
      return;
    }

    try {
      const worldData = await generateWorld(currentSeed);
      setWorldState(worldData);
      setCachedWorldData(currentSeed, worldData);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to generate world: ${e.message}. Please ensure your API key is configured if the issue persists.`);
        console.error(e);
      } else {
        setError('An unknown error occurred during world generation.');
      }
      setNations([]);
      setMapData([]);
      setEras([]);
      setTradeGoods([]);
      setCurrentYear(null);
      setCurrencySymbol('');
      setCurrencyName('');
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentYear, setDate, randomizeDate]);
  
  const handleRegenerateWorld = useCallback(() => {
    clearCachedWorldDataBySeed(seed);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    fetchWorldData(newSeed);
  }, [seed, fetchWorldData]);

  useEffect(() => {
    fetchWorldData(seed);
  }, [fetchWorldData, seed]);

  const handleSelectNation = useCallback((nation: Nation | string) => {
    if (typeof nation === 'string') {
      const foundNation = nations.find(n => n.name === nation);
      setSelectedNation(foundNation || null);
    } else {
      setSelectedNation(nation);
    }
    if(!selectedNation) { // Only reset view if we're opening panels
        setActiveView('economy');
    }
  }, [nations, selectedNation]);

  const handleDeselectNation = () => {
    setSelectedNation(null);
  };

  const handleTogglePlayPause = () => {
    setIsPaused(prev => !prev);
  };

  const handleAdvanceDay = () => {
    if (!isPaused) {
        setIsPaused(true);
    }
    advanceTime();
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(currentOrder => (currentOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder(key === 'name' ? 'asc' : 'desc');
    }
  };

  const sortedNations = useMemo(() => {
    const sorted = [...nations];
    sorted.sort((a, b) => {
        if (sortKey === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        const valA = a[sortKey];
        const valB = b[sortKey];
        return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return sorted;
  }, [nations, sortKey, sortOrder]);


  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <AppHeader
        currentYear={currentYear}
        currentMonthIndex={currentMonthIndex}
        currentDay={currentDay}
        dayOfWeekIndex={dayOfWeekIndex}
        eras={eras}
        isTimeReady={!isLoading && !error}
        isPaused={isPaused}
        onTogglePlayPause={handleTogglePlayPause}
        onAdvanceDay={handleAdvanceDay}
        isTimeControlsDisabled={isLoading || !!error}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="container mx-auto max-w-7xl flex-grow p-4 sm:p-6 lg:p-8 flex-1 min-h-0">
         <MainDisplay
            isLoading={isLoading}
            error={error}
            mapData={mapData}
            nations={nations}
            sortedNations={sortedNations}
            onSelectNation={handleSelectNation}
            seed={seed}
            selectedNation={selectedNation}
            onDeselectNation={handleDeselectNation}
            isNationListCollapsed={isNationListCollapsed}
            onToggleNationListCollapse={() => setIsNationListCollapsed(p => !p)}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            eras={eras}
            tradeGoods={tradeGoods}
            currencyName={currencyName}
            currencySymbol={currencySymbol}
            activeView={activeView}
            onActiveViewChange={setActiveView}
          />
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        seed={seed}
        onSeedChange={setSeed}
        onRegenerate={handleRegenerateWorld}
      />
    </div>
  );
};

export default App;
