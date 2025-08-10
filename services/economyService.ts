
import { Nation, GdpCategory, GdpLineItem } from '../types';
import { BuildingInfo } from './buildingService';

const SECTOR_KEYWORDS: Record<string, string[]> = {
    'Primary Sector (Raw Materials)': ['ore', 'wood', 'grain', 'stone', 'crystal', 'raw', 'hide', 'pelt', 'fish', 'crop', 'lumber', 'herb', 'farm', 'mine', 'quarry'],
    'Secondary Sector (Goods & Manufacturing)': ['tools', 'weapons', 'armor', 'pottery', 'jewelry', 'furniture', 'clothing', 'swords', 'ale', 'wine', 'goods', 'reagents', 'textiles'],
    'Military & Defense': ['military', 'defense', 'mercenary', 'levies', 'fortress', 'maintenance', 'soldiers', 'guards', 'contracts'],
    'State & Infrastructure': ['state', 'infrastructure', 'tax', 'toll', 'bureaucratic', 'administration', 'public works', 'fees'],
    'Cultural & Social Services': ['cultural', 'social', 'art', 'festival', 'religion', 'tithes', 'scholarly', 'guild dues', 'entertainment', 'subscriptions'],
    'Arcane & Magical Arts': ['arcane', 'magical', 'enchantment', 'scrying', 'alchemy', 'potion', 'ritual', 'services'],
};

export const getSectorForGood = (goodName: string): string => {
    if (!goodName || typeof goodName !== 'string') {
        return 'Tertiary Sector (General Services)';
    }
    const name = goodName.toLowerCase();

    for (const sector in SECTOR_KEYWORDS) {
        if (SECTOR_KEYWORDS[sector].some(keyword => name.includes(keyword))) {
            return sector;
        }
    }
    
    // Default to Tertiary if no other specific service-sector keyword matches
    const nonServiceKeywords = [
        ...SECTOR_KEYWORDS['Primary Sector (Raw Materials)'], 
        ...SECTOR_KEYWORDS['Secondary Sector (Goods & Manufacturing)']
    ];

    if (nonServiceKeywords.some(keyword => name.includes(keyword))) {
         return 'Secondary Sector (Goods & Manufacturing)';
    }

    return 'Tertiary Sector (General Services)';
};

const BUILDING_CATEGORY_TO_SECTOR: Record<string, string> = {
    'Military': 'Military & Defense',
    'Infrastructure': 'State & Infrastructure',
    'Cultural': 'Cultural & Social Services',
    'Magical': 'Arcane & Magical Arts',
};

export const getSectorForBuilding = (buildingInfo: BuildingInfo): string => {
    const producedGoods = Object.keys(buildingInfo.prod);
    if (producedGoods.length > 0) {
        // Use the sector of the first good produced as the building's sector
        return getSectorForGood(producedGoods[0]);
    }

    // Fallback to building category if it produces nothing
    return BUILDING_CATEGORY_TO_SECTOR[buildingInfo.category] || 'Unspecified Sector';
};


export const deriveGdpFromMarketAndServices = (nation: Nation): GdpCategory[] => {
    const gdpCategories: Record<string, { categoryName: string, lineItems: GdpLineItem[] }> = {};

    if (!nation.market) {
        return [];
    }

    // Calculate annualized value from ALL goods (tangible and intangible)
    for (const good of nation.market) {
        if (good && typeof good.name === 'string' && typeof good.production === 'number' && typeof good.marketPrice === 'number') {
            const value = good.production * good.marketPrice * 360; // Annualize daily production
            
            if (value > 0) {
                const sectorName = getSectorForGood(good.name);

                if (!gdpCategories[sectorName]) {
                    gdpCategories[sectorName] = { categoryName: sectorName, lineItems: [] };
                }

                gdpCategories[sectorName].lineItems.push({ name: good.name, value });
            }
        }
    }
    
    const finalBreakdown = Object.values(gdpCategories);
    
    // Sort categories for consistent display order
    finalBreakdown.sort((a,b) => {
        const order = ['Primary', 'Secondary', 'Military', 'State', 'Cultural', 'Arcane', 'Tertiary'];
        const aIndex = order.findIndex(s => a.categoryName.startsWith(s));
        const bIndex = order.findIndex(s => b.categoryName.startsWith(s));
        return aIndex - bIndex;
    });

    return finalBreakdown;
};
