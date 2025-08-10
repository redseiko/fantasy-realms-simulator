
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Nation, MapData, MAP_WIDTH, MAP_HEIGHT, NationColor } from '../../types';
import { generateJaggedTerritories } from '../../utils/mapUtils';
import { useMapInteraction } from '../../hooks/useMapInteraction';
import MapControls from './MapControls';
import CapitalMarker from './CapitalMarker';

interface WorldMapProps {
  isLoading: boolean;
  mapData: MapData;
  nations: Nation[];
  onSelectNation: (nationName: string) => void;
  seed: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ isLoading, mapData, nations, onSelectNation, seed }) => {
  const [hoveredNation, setHoveredNation] = useState<string | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);

  const {
    svgRef,
    viewBox,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleWheel,
    handleZoom,
    resetView,
  } = useMapInteraction();

  const jaggedMapData = useMemo(() => {
    if (!mapData || mapData.length === 0 || isLoading) {
      return [];
    }
    return generateJaggedTerritories(mapData, seed);
  }, [mapData, seed, isLoading]);

  useEffect(() => {
    if (isLoading || !jaggedMapData || jaggedMapData.length === 0 || nations.length === 0) {
        setMapImageUrl(null);
        return;
    }

    const territoriesByNation = jaggedMapData.reduce((acc, data) => {
        if (!data.isKnown) return acc;
        const nationName = data.ownerNationName;
        if (!acc.has(nationName)) {
            acc.set(nationName, []);
        }
        acc.get(nationName)!.push(data);
        return acc;
    }, new Map<string, MapData>());

    const nationVisuals = Array.from(territoriesByNation.entries())
        .map(([nationName, territories]) => {
            const nation = nations.find(n => n.name === nationName);
            if (!nation) return null;
            return { nationName, territories, color: nation.color };
        })
        .filter(Boolean) as { nationName: string; territories: MapData; color: NationColor }[];
        
    const nationBorders: { path: string, nationName: string }[] = [];
    
    for (const [nationName, territories] of territoriesByNation.entries()) {
        const edgeCounts = new Map<string, {p1: [number, number], p2: [number, number], count: number}>();
        const vertexToString = (v: [number, number]): string => `${v[0].toFixed(3)},${v[1].toFixed(3)}`;

        for (const territory of territories) {
            for (let i = 0; i < territory.territory.length; i++) {
                const p1 = territory.territory[i];
                const p2 = territory.territory[(i + 1) % territory.territory.length];
                const key = [vertexToString(p1), vertexToString(p2)].sort().join('-');
                
                if (edgeCounts.has(key)) {
                    edgeCounts.get(key)!.count++;
                } else {
                    edgeCounts.set(key, { p1, p2, count: 1 });
                }
            }
        }

        const exteriorEdges = Array.from(edgeCounts.values()).filter(edge => edge.count === 1);
        const borderPathData = exteriorEdges.map(edge => `M ${edge.p1[0]} ${edge.p1[1]} L ${edge.p2[0]} ${edge.p2[1]}`).join(' ');

        if (borderPathData) {
            nationBorders.push({ path: borderPathData, nationName });
        }
    }

    const mapSvgString = ReactDOMServer.renderToStaticMarkup(
      <svg width={MAP_WIDTH} height={MAP_HEIGHT} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="oceanPattern" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
                <path d="M 0,3 Q 3,0 6,3 T 12,3" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5"/>
                <path d="M 0,9 Q 3,6 6,9 T 12,9" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.5"/>
            </pattern>
        </defs>
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#1d4ed8" />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanPattern)" />
        
        {nationVisuals.map(({ nationName, territories, color }) => (
            <g key={nationName}>
                {territories.map(stateMapData => {
                  const pathD = stateMapData.territory.map((p, i) => (i === 0 ? 'M' : 'L') + p.join(' ')).join(' ') + ' Z';
                  return (
                    <path
                        key={`${stateMapData.ownerNationName}-${stateMapData.center.x}-${stateMapData.center.y}`}
                        d={pathD}
                        fill={color.fill}
                        fillOpacity={color.fillOpacity}
                        stroke={color.fill}
                        strokeOpacity={color.fillOpacity}
                        strokeWidth="1.5"
                    />
                  );
                })}
            </g>
        ))}
        {/* Render nation borders on top */}
        {nationBorders.map(({ path, nationName }) => (
            <path
                key={`border-${nationName}`}
                d={path}
                fill="none"
                stroke="#1f2937" 
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        ))}
      </svg>
    );

    const base64Svg = btoa(unescape(encodeURIComponent(mapSvgString)));
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
    setMapImageUrl(dataUrl);

  }, [jaggedMapData, nations, isLoading]);

  useEffect(() => {
    resetView();
    setHoveredNation(null);
  }, [seed, resetView]);

  const handleHoverStart = useCallback((nationName: string) => {
      setHoveredNation(nationName);
  }, []);
  
  const handleHoverEnd = useCallback(() => {
      setHoveredNation(null);
  }, []);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full">
            <svg className="animate-spin h-12 w-12 text-yellow-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl">Plotting Map Coordinates...</p>
        </div>
      );
    }
    
    if (!mapImageUrl) {
      return (
        <div className="text-center text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5-2.121-7.121A10.003 10.003 0 002.5 10c0 5.523 4.477 10 10 10 3.523 0 6.57-1.83 8.364-4.524M12 12l8 8" />
          </svg>
          <p className="mt-4 text-lg">Map data unavailable or still processing.</p>
        </div>
      );
    }

    const capitalStates = mapData.filter(d => d.isKnown && d.isCapitalState);

    return (
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full object-contain"
      >
        {/* This rect acts as the static background, always filling the current view */}
        <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill={'#1d4ed8'} />
        
        {mapImageUrl && (
            <image href={mapImageUrl} x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} />
        )}
        
        <g>
           {capitalStates.map((capital) => (
              <CapitalMarker
                key={`capital-interaction-${capital.ownerNationName}`}
                capital={capital}
                isHovered={hoveredNation === capital.ownerNationName}
                onSelectNation={onSelectNation}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
              />
           ))}
        </g>
      </svg>
    );
  };

  return (
      <div 
        className="h-full flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-2 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
          {renderContent()}
          <MapControls 
            onZoom={handleZoom} 
            onReset={resetView} 
            zoomLevel={MAP_WIDTH / viewBox.width} 
          />
      </div>
  );
};

export default WorldMap;
