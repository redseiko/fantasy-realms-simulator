
import React, { useMemo, useState, useEffect } from 'react';
import { Nation } from '../../types';
import Icon from '../ui/Icon';
import { getSectorForGood } from '../../services/economyService';
import { SECTOR_COLORS } from '../../config';

interface MarketReportProps {
    nation: Nation;
    goodIconMap: Record<string, string>;
    currencyName: string;
}

const MarketReport: React.FC<MarketReportProps> = ({ nation, goodIconMap, currencyName }) => {
    const formatNumberK = (num: number) => {
        if (Math.abs(num) >= 10000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toLocaleString();
    };

    const goodsBySector = useMemo(() => {
        const validMarket = (nation.market || []).filter(good => good && good.name);
        const grouped: Record<string, typeof validMarket> = {};

        for (const good of validMarket) {
            const sector = getSectorForGood(good.name);
            if (!grouped[sector]) {
                grouped[sector] = [];
            }
            grouped[sector].push(good);
        }

        const sortedEntries = Object.entries(grouped).sort(([keyA], [keyB]) => {
            const order = ['Primary', 'Secondary', 'Military', 'State', 'Cultural', 'Arcane', 'Tertiary'];
            const aIndex = order.findIndex(s => keyA.startsWith(s));
            const bIndex = order.findIndex(s => keyB.startsWith(s));
            return aIndex - bIndex;
        });

        return sortedEntries;
    }, [nation.market]);

    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Expand all categories by default when data changes
        setExpandedCategories(new Set(goodsBySector.map(([sectorName]) => sectorName)));
    }, [goodsBySector]);

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryName)) {
                newSet.delete(categoryName);
            } else {
                newSet.add(categoryName);
            }
            return newSet;
        });
    };

    if (goodsBySector.length === 0) {
        return <p className="text-gray-400 text-center">No market data available.</p>;
    }

    return (
        <div className="flex-grow flex flex-col w-full">
            <div className="text-center mb-6 border-b border-gray-600 pb-4 w-full">
                <p className="text-gray-400 text-md uppercase tracking-wider">Daily Goods Market</p>
                <p className="text-3xl font-bold text-white mt-1">Production & Consumption</p>
            </div>
            <div className="w-full space-y-2 text-left">
                {goodsBySector.map(([sectorName, goods]) => {
                    const colorInfo = SECTOR_COLORS[sectorName] || SECTOR_COLORS['Unspecified Sector'];
                    const isExpanded = expandedCategories.has(sectorName);

                    return (
                        <div key={sectorName} className="bg-gray-900/40 rounded-lg overflow-hidden transition-all">
                            <button
                                onClick={() => toggleCategory(sectorName)}
                                className="w-full flex justify-between items-center p-3 text-left transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
                                aria-expanded={isExpanded}
                                aria-controls={`market-category-${sectorName}`}
                            >
                                <h4 className={`font-semibold ${colorInfo.text} text-lg uppercase tracking-wider truncate`}>{sectorName}</h4>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isExpanded && (
                                <div id={`market-category-${sectorName}`} className={`p-4 border-t ${colorInfo.border}`}>
                                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-sm text-gray-400 border-b border-gray-600 items-center">
                                        <div className="col-span-5 font-semibold uppercase tracking-wider">Good</div>
                                        <div className="flex justify-end" title="Daily Production"><Icon name="production" className="w-5 h-5"/></div>
                                        <div className="flex justify-end" title="Daily Consumption"><Icon name="consumption" className="w-5 h-5"/></div>
                                        <div className="flex justify-end" title="Daily Surplus/Deficit"><Icon name="balance" className="w-5 h-5"/></div>
                                        <div className="col-span-2 flex justify-end" title={`Price in ${currencyName}`}>Price</div>
                                        <div className="col-span-2 flex justify-end font-semibold uppercase tracking-wider">Net Value</div>
                                    </div>
                                    <div className="w-full space-y-2 text-left mt-2">
                                        {goods.map((good) => {
                                            const surplus = good.production - good.consumption;
                                            const surplusColor = surplus > 0 ? 'text-green-400' : surplus < 0 ? 'text-red-400' : 'text-gray-400';
                                            const iconName = goodIconMap[good.name] || '?';
                                            const netValue = surplus * good.marketPrice;
                                            const netValueColor = netValue > 0 ? 'text-green-400' : netValue < 0 ? 'text-red-400' : 'text-gray-400';

                                            return (
                                                <div key={good.name} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                                                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                                                        <Icon name={iconName} className="w-8 h-8 text-yellow-300 flex-shrink-0"/>
                                                        <p className="font-semibold text-md text-white truncate">{good.name}</p>
                                                    </div>
                                                    <div className="text-right text-md text-gray-200">{formatNumberK(good.production)}</div>
                                                    <div className="text-right text-md text-gray-200">{formatNumberK(good.consumption)}</div>
                                                    <div className={`text-right text-md font-bold ${surplusColor}`}>
                                                        {formatNumberK(surplus)}
                                                    </div>
                                                    <div className="col-span-2 text-right text-md font-semibold text-yellow-300">
                                                        {good.marketPrice.toFixed(2)}
                                                    </div>
                                                    <div className={`col-span-2 text-right text-md font-bold ${netValueColor}`}>
                                                        {(netValue / 1_000_000).toFixed(2)}M
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MarketReport;
