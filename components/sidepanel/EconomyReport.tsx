
import React, { useState } from 'react';
import { Nation } from '../../types';
import { SECTOR_COLORS } from '../../config';

interface EconomyReportProps {
    nation: Nation;
    currencySymbol: string;
    currencyName: string;
}

const EconomyReport: React.FC<EconomyReportProps> = ({ nation, currencySymbol, currencyName }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const gdpFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Dummy currency, we only use the formatting
        notation: 'compact',
        maximumFractionDigits: 2,
    });
    
    const formatGdpValue = (value: number) => {
        const formatted = gdpFormatter.format(value);
        return formatted.substring(1); // Remove '$'
    }

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

    return (
        <div className="flex-grow flex flex-col items-center justify-start w-full">
            <div className="text-center mb-6 border-b border-gray-600 pb-4 w-full">
                <p className="text-gray-400 text-md uppercase tracking-wider">Annual GDP ({currencyName})</p>
                <p className="text-5xl font-bold text-white mt-1">{currencySymbol}{formatGdpValue(nation.gdp)}</p>
            </div>
            <div className="w-full space-y-2 text-left">
                {(nation.gdpBreakdown || []).map((category, index) => {
                    const colorInfo = SECTOR_COLORS[category.categoryName] || SECTOR_COLORS['Unspecified Sector'];
                    
                    if (!category.lineItems || category.lineItems.length === 0) return null;

                    const categoryTotal = category.lineItems.reduce((sum, item) => sum + item.value, 0);
                    const categoryPercentage = nation.gdp > 0 ? (categoryTotal / nation.gdp) * 100 : 0;
                    const isExpanded = expandedCategories.has(category.categoryName);

                    return (
                        <div key={index} className="bg-gray-900/40 rounded-lg overflow-hidden transition-all">
                            <button
                                onClick={() => toggleCategory(category.categoryName)}
                                className="w-full flex justify-between items-center p-3 text-left transition-colors hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
                                aria-expanded={isExpanded}
                                aria-controls={`category-details-${index}`}
                            >
                                <div className="flex items-center flex-grow min-w-0">
                                    <h4 className={`font-semibold ${colorInfo.text} text-lg uppercase tracking-wider truncate`}>{category.categoryName}</h4>
                                </div>
                                <div className="flex items-center flex-shrink-0 ml-4">
                                     <span className={`w-20 text-right ${colorInfo.text}`} title={`${categoryPercentage.toFixed(1)}% of total GDP`}>
                                      ({categoryPercentage.toFixed(1)}%)
                                    </span>
                                    <span className="w-24 text-right font-semibold text-white text-xl">
                                        {formatGdpValue(categoryTotal)}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform ml-2 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                            {isExpanded && (
                                <ul id={`category-details-${index}`} className="w-full space-y-4 text-left p-4 border-t border-gray-700/70">
                                    {(category.lineItems || []).map((item, itemIndex) => {
                                        const percentage = nation.gdp > 0 ? (item.value / nation.gdp) * 100 : 0;
                                        return (
                                            <li key={itemIndex} className="text-lg">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-gray-200 truncate pr-2">{item.name}</span>
                                                    <div className="flex items-baseline flex-shrink-0">
                                                        <span className="text-gray-400 text-base mr-3">({percentage.toFixed(1)}%)</span>
                                                        <span className="font-semibold text-white text-xl">{formatGdpValue(item.value)}</span>
                                                    </div>
                                                </div>
                                                <div title={`${percentage.toFixed(1)}% of total GDP`} className="w-full bg-gray-600/50 rounded-full h-2.5">
                                                    <div className={`${colorInfo.bg} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default EconomyReport;
