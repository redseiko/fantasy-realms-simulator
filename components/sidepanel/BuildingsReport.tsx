
import React, { useMemo, useState } from 'react';
import { Nation, Building } from '../../types';
import Icon from '../ui/Icon';
import { getSectorForBuilding } from '../../services/economyService';
import { BUILDING_CATALOG } from '../../services/buildingService';
import { SECTOR_COLORS } from '../../config';

interface BuildingsReportProps {
    nation: Nation;
    goodIconMap: Record<string, string>;
}

interface AggregatedBuildingData {
  type: string;
  category: string;
  icon: string;
  buildingCount: number;
  totalEmployees: number;
  totalLevel: number;
  totalProduction: Record<string, number>;
  totalConsumption: Record<string, number>;
}

const BuildingsReport: React.FC<BuildingsReportProps> = ({ nation, goodIconMap }) => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const aggregatedBuildingsBySector = useMemo(() => {
        if (!nation.buildings || nation.buildings.length === 0) {
            return [];
        }

        const buildingsByType: Record<string, Building[]> = {};
        for (const building of nation.buildings) {
            if (!buildingsByType[building.type]) {
                buildingsByType[building.type] = [];
            }
            buildingsByType[building.type].push(building);
        }

        const aggregatedList: AggregatedBuildingData[] = Object.values(buildingsByType).map(buildings => {
            const buildingType = buildings[0].type;
            const buildingInfo = BUILDING_CATALOG[buildingType as keyof typeof BUILDING_CATALOG];
            const buildingCount = buildings.length;
            const totalEmployees = buildings.reduce((sum, b) => sum + b.employees, 0);
            const totalLevel = buildings.reduce((sum, b) => sum + b.level, 0);
            const totalProduction: Record<string, number> = {};
            const totalConsumption: Record<string, number> = {};
            
            for (const building of buildings) {
                for (const [good, amount] of Object.entries(buildingInfo.prod)) {
                    totalProduction[good] = (totalProduction[good] || 0) + amount * building.level;
                }
                for (const [good, amount] of Object.entries(buildingInfo.cons)) {
                    totalConsumption[good] = (totalConsumption[good] || 0) + amount * building.level;
                }
            }
            
            return {
                type: buildingType,
                category: buildingInfo.category,
                icon: buildingInfo.icon,
                buildingCount,
                totalEmployees,
                totalLevel,
                totalProduction,
                totalConsumption,
            };
        });

        const groupedBySector: Record<string, AggregatedBuildingData[]> = {};
        for (const aggBuilding of aggregatedList) {
            const buildingInfo = BUILDING_CATALOG[aggBuilding.type as keyof typeof BUILDING_CATALOG];
            const sector = getSectorForBuilding(buildingInfo);
            if (!groupedBySector[sector]) {
                groupedBySector[sector] = [];
            }
            groupedBySector[sector].push(aggBuilding);
        }

        for (const sector in groupedBySector) {
            groupedBySector[sector].sort((a, b) => b.totalEmployees - a.totalEmployees);
        }

        const sortedEntries = Object.entries(groupedBySector).sort(([keyA], [keyB]) => {
            const order = ['Primary', 'Secondary', 'Military', 'State', 'Cultural', 'Arcane', 'Tertiary'];
            const aIndex = order.findIndex(s => keyA.startsWith(s));
            const bIndex = order.findIndex(s => keyB.startsWith(s));
            return aIndex - bIndex;
        });

        return sortedEntries;

    }, [nation.buildings]);

    const totalEmployees = (nation.buildings ?? []).reduce((sum, building) => sum + building.employees, 0);
    const employeeFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
    
    if (!nation.buildings || nation.buildings.length === 0) {
        return <p className="text-gray-400 text-center">No workforce data available.</p>;
    }

    const GoodSubTile = ({ goodName, iconName, quantity }: { goodName: string; iconName: string; quantity: number; }) => {
        const isProduction = quantity > 0;
        const quantityColor = isProduction ? 'text-green-300' : 'text-red-400';
        const quantityPrefix = isProduction ? '+' : '';
        const nameWords = goodName.split(' ');
    
        return (
            <div
                className="flex flex-col items-center justify-start p-2 rounded-md bg-gray-800/60 w-20 text-center gap-y-1"
                title={`${goodName}\nQuantity: ${quantityPrefix}${quantity.toLocaleString()}`}
            >
                <div className={`font-bold text-sm ${quantityColor}`}>{`${quantityPrefix}${quantity.toLocaleString()}`}</div>
                <Icon name={iconName} className="w-8 h-8 text-gray-300" />
                <div className="text-xs text-gray-400 leading-tight h-8 flex flex-col items-center justify-center w-full">
                    {nameWords.map((word, i) => (
                        <span key={i} className="block w-full truncate">{word}</span>
                    ))}
                </div>
            </div>
        );
    };

    const BuildingCard = ({ aggregatedBuilding }: { aggregatedBuilding: AggregatedBuildingData }) => {
        const { type, icon, buildingCount, totalEmployees, totalLevel, totalProduction, totalConsumption } = aggregatedBuilding;
        const allGoods = [
            ...Object.entries(totalConsumption).map(([good, amount]) => ({ name: good, amount: -amount })),
            ...Object.entries(totalProduction).map(([good, amount]) => ({ name: good, amount: amount })),
        ];
        
        return (
            <div className="bg-gray-900/40 rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-gray-900/80 border border-transparent hover:border-yellow-600/50">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Icon name={icon} className="w-10 h-10 text-yellow-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <h4 className="font-bold text-lg text-white truncate">{type}</h4>
                            <p className="text-sm text-gray-400">{buildingCount} Building{buildingCount > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-yellow-400" title={`Total Combined Levels: ${totalLevel.toLocaleString()}`}>
                            Lvl {totalLevel.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-300">{totalEmployees.toLocaleString()} Workers</div>
                    </div>
                </div>
                <div className="my-3 h-px bg-gray-700/50" />
                {allGoods.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {allGoods.map(good => (
                            <GoodSubTile
                                key={good.name}
                                goodName={good.name}
                                iconName={goodIconMap[good.name] || 'box'}
                                quantity={good.amount}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    };
    
    const viewButtonClass = (mode: 'list' | 'grid') => `
        p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500
        ${viewMode === mode ? 'bg-gray-600 text-yellow-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
    `;

    return (
        <div className="flex-grow flex flex-col w-full">
            <div className="text-center mb-6 border-b border-gray-600 pb-4 w-full">
                <div className="flex justify-between items-center">
                    <div/>
                    <div className="flex flex-col items-center">
                         <p className="text-gray-400 text-md uppercase tracking-wider">Workforce Allocation</p>
                         <p className="text-5xl font-bold text-white mt-1">{employeeFormatter.format(totalEmployees)}</p>
                         <p className="text-gray-400 text-sm mt-1">({(totalEmployees/nation.population * 100).toFixed(1)}% of total population)</p>
                    </div>
                    <div className="flex items-center p-1 bg-gray-800 rounded-lg border border-gray-600">
                        <button onClick={() => setViewMode('list')} className={viewButtonClass('list')} aria-label="List view">
                            <Icon name="view-list" className="w-5 h-5"/>
                        </button>
                        <button onClick={() => setViewMode('grid')} className={viewButtonClass('grid')} aria-label="Grid view">
                            <Icon name="view-grid" className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full space-y-4 text-left">
                {aggregatedBuildingsBySector.map(([sectorName, buildings]) => {
                    const colorInfo = SECTOR_COLORS[sectorName] || SECTOR_COLORS['Unspecified Sector'];
                    return (
                        <div key={sectorName}>
                             <h4 className={`font-semibold ${colorInfo.text} text-lg uppercase tracking-wider truncate mb-3 pl-1`}>{sectorName}</h4>
                             <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-3' : 'space-y-3'}>
                                {buildings.map((aggBuilding) => (
                                     <BuildingCard key={aggBuilding.type} aggregatedBuilding={aggBuilding} />
                                ))}
                             </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default BuildingsReport;
