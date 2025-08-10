
export const BUILDING_CATALOG = {
    'Farm': { category: 'Economic', icon: 'grain', employees: 100, prod: { 'Grain': 200, 'Raw Hides': 20 }, cons: {} },
    'Lumber Mill': { category: 'Economic', icon: 'tree', employees: 50, prod: { 'Lumber': 100 }, cons: {} },
    'Mine': { category: 'Economic', icon: 'pickaxe', employees: 150, prod: { 'Ore': 50, 'Stone': 100 }, cons: {} },
    'Mage Tower': { category: 'Magical', icon: 'crystal', employees: 20, prod: { 'Magical Crystals': 5, 'Enchantment Services': 10 }, cons: {'Ore': 5} },
    'Forge': { category: 'Economic', icon: 'hammer', employees: 80, prod: { 'Tools': 50, 'Weapons': 20 }, cons: { 'Ore': 60, 'Lumber': 20 } },
    'Armory': { category: 'Military', icon: 'shield', employees: 60, prod: { 'Armor': 20 }, cons: { 'Ore': 40, 'Luxury Textiles': 10 } },
    'Weaver': { category: 'Economic', icon: 'fabric', employees: 40, prod: { 'Luxury Textiles': 50 }, cons: { } },
    'Alchemist Lab': { category: 'Magical', icon: 'potion', employees: 25, prod: { 'Alchemical Potions': 10, 'Exotic Herbs': 30 }, cons: { 'Magical Crystals': 5, 'Grain': 20 } },
    'Barracks': { category: 'Military', icon: 'sword', employees: 200, prod: { 'Mercenary Contracts': 10 }, cons: { 'Grain': 100, 'Weapons': 10 } },
    'Library': { category: 'Cultural', icon: 'book', employees: 30, prod: { 'Scholarly Subscriptions': 20 }, cons: { } },
    'Guild Hall': { category: 'Cultural', icon: 'building', employees: 100, prod: { 'Guild Dues': 100 }, cons: { 'Lumber': 10, 'Tools': 5 } },
    'Marketplace': { category: 'Infrastructure', icon: 'coin', employees: 150, prod: { 'Toll & Tariff Fees': 200 }, cons: {} },
    'Fishing Wharf': { category: 'Economic', icon: 'ship', employees: 70, prod: { 'Fish': 250 }, cons: { 'Lumber': 5 } },
    'Brewery': { category: 'Economic', icon: 'potion', employees: 35, prod: { 'Craft Ale': 150 }, cons: { 'Grain': 50 } },
    'Jeweler': { category: 'Economic', icon: 'crystal', employees: 15, prod: { 'Fine Jewelry': 5 }, cons: { 'Ore': 2, 'Magical Crystals': 2 } },
    'Carpenter': { category: 'Economic', icon: 'hammer', employees: 45, prod: { 'Ornate Furniture': 15 }, cons: { 'Lumber': 40, 'Luxury Textiles': 5 } },
    'Healers House': { category: 'Cultural', icon: 'potion', employees: 30, prod: { 'Medical Treatment': 25 }, cons: { 'Exotic Herbs': 10, 'Luxury Textiles': 5 } },
    'Courthouse': { category: 'Infrastructure', icon: 'scroll', employees: 50, prod: { 'Legal Representation': 10 }, cons: { 'Scholarly Subscriptions': 5 } },
    'Surveyors Office': { category: 'Infrastructure', icon: 'scroll', employees: 20, prod: { 'Cartography Services': 15 }, cons: {} },
};

export type BuildingInfo = typeof BUILDING_CATALOG[keyof typeof BUILDING_CATALOG];
