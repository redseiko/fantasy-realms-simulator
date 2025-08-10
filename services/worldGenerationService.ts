
import { WorldData, Nation, TradeGood, Era, MapData, Building } from '../types';
import { deriveGdpFromMarketAndServices } from './economyService';
import { generateMapLayout } from './mapGenerationService';
import { getColorForSeed } from '../utils/colorUtils';
import { generateFoundingStory } from './loreGenerationService';
import { BUILDING_CATALOG } from './buildingService';
import { ARCHETYPES, NAME_PARTS, TRADE_GOODS_CATALOG } from './generationData';


// Pseudo-random number generator for deterministic results
function mulberry32(a: number) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// --- Generation Logic ---

export const generateWorld = async (seed: number): Promise<WorldData> => {
    const random = mulberry32(seed);
    const archetypes = Object.values(ARCHETYPES);
    const usedArchetypes = new Set<string>();
    const usedNames = new Set<string>();

    type NationWithArchetype = Nation & { archetype: typeof archetypes[0] };
    const tempNations: NationWithArchetype[] = [];
    const numNations = 15 + Math.floor(random() * 6);
    
    for (let i = 0; i < numNations; i++) {
        // 1. Select an archetype and generate a unique name
        let archetype;
        // Try to pick a unique archetype first
        if (usedArchetypes.size < archetypes.length) {
            do {
                archetype = archetypes[Math.floor(random() * archetypes.length)];
            } while (usedArchetypes.has(archetype.race));
        } else {
            // If all archetypes have been used at least once, allow reuse
            archetype = archetypes[Math.floor(random() * archetypes.length)];
        }
        usedArchetypes.add(archetype.race);

        let nationName;
        do {
            const r = random();
            const p = NAME_PARTS.prefixes[Math.floor(random() * NAME_PARTS.prefixes.length)];
            const s = NAME_PARTS.suffixes[Math.floor(random() * NAME_PARTS.suffixes.length)];

            if (r < 0.5) { 
                // One-word name: Prefix + Suffix (e.g. "Glimmerwood", "Ashfell")
                nationName = p + s.toLowerCase();
            } else if (r < 0.9) {
                // Two-word name: Prefix + Suffix (e.g. "Dragon's Rest", "Sunken Vale")
                const suffix = s.charAt(0).toUpperCase() + s.slice(1);
                nationName = `${p} ${suffix}`;
            } else { 
                // One-word name: Prefix + Middle + Suffix (e.g. "Stonefist-holm" -> "Stonefistholm")
                const m = NAME_PARTS.middles[Math.floor(random() * NAME_PARTS.middles.length)];
                nationName = p + m.toLowerCase() + s.toLowerCase();
            }

        } while (usedNames.has(nationName) || nationName.length > 20); // Add a length check to prevent absurdly long names
        usedNames.add(nationName);

        // 2. Basic Nation Stats
        const population = Math.floor(1_000_000 + random() * 14_000_000);
        const foundingYear = Math.floor(100 + random() * 500);
        
        // 3. Generate Buildings based on Archetype
        const buildings: Building[] = [];
        const workforce = population * (0.40 + random() * 0.2); // 40-60% of pop is workforce
        let workforceLeft = workforce;
        
        const buildingTypes = Object.keys(BUILDING_CATALOG);
        let attempts = 0;
        const maxAttempts = 5000; // Increased to ensure workforce is mostly allocated

        while (workforceLeft > 50 && attempts < maxAttempts) {
            const buildingType = buildingTypes[Math.floor(random() * buildingTypes.length)];
            const buildingInfo = BUILDING_CATALOG[buildingType as keyof typeof BUILDING_CATALOG];
            const bias = archetype.buildingBias[buildingType as keyof typeof archetype.buildingBias] || 1.0;
            
            // Heavily biased check to see if we should even consider this building
            if (random() > bias * 0.6) { 
                attempts++;
                continue;
            }

            // Assign a random level, biased towards lower levels
            const level = Math.ceil(Math.pow(random(), 2.5) * 15) + 1; // Skewed distribution for levels 1-16
            
            const employeesNeeded = buildingInfo.employees * level;
            
            if (employeesNeeded <= workforceLeft) {
                buildings.push({ 
                    type: buildingType, 
                    category: buildingInfo.category, 
                    level: level,
                    employees: employeesNeeded
                });
                workforceLeft -= employeesNeeded;
            }
            attempts++;
        }
        
        // 4. Generate Market Data
        const productionMap = new Map<string, number>();
        const consumptionMap = new Map<string, number>();

        for (const building of buildings) {
            const buildingInfo = BUILDING_CATALOG[building.type as keyof typeof BUILDING_CATALOG];
            for (const [good, amount] of Object.entries(buildingInfo.prod)) {
                productionMap.set(good, (productionMap.get(good) || 0) + amount * building.level);
            }
            for (const [good, amount] of Object.entries(buildingInfo.cons)) {
                consumptionMap.set(good, (consumptionMap.get(good) || 0) + amount * building.level);
            }
        }
        
        const market = TRADE_GOODS_CATALOG.map(good => {
            let production = Math.floor(productionMap.get(good.name) || 0);
            let consumption = Math.floor(consumptionMap.get(good.name) || 0);

            // Base consumption by population (e.g., food)
            if (good.name === 'Grain') consumption += population / 500;
            if (good.name === 'Fish') consumption += population / 800;
            if (good.name === 'Craft Ale') consumption += population / 1000;
            if (good.name === 'Tools') consumption += population / 2000;
            if (good.name === 'Luxury Textiles') consumption += population / 3000;
            consumption = Math.floor(consumption);


            // Calculate Price based on surplus/deficit
            const surplus = production - consumption;
            const priceFactor = 1 - (surplus / (production + consumption + 1)) * 0.5; // Price adjusts by up to 50%
            let marketPrice = good.basePrice * priceFactor * (0.8 + random() * 0.4); // Add noise
            marketPrice = Math.max(marketPrice, good.basePrice * 0.2); // Price floor

            return {
                name: good.name,
                production: production,
                consumption: consumption,
                marketPrice: parseFloat(marketPrice.toFixed(2))
            };
        });

        // 5. Final Assembly (GDP will be derived)
        const nation: NationWithArchetype = {
            name: nationName,
            dominantRace: archetype.race,
            population,
            icon: archetype.icon,
            foundingYear,
            foundingStory: '', // Placeholder, will be generated procedurally
            gdp: 0, // placeholder
            color: getColorForSeed(nationName),
            gdpBreakdown: [], // placeholder
            buildings,
            market,
            archetype: archetype,
        };
        
        // 6. Derive GDP from generated market
        nation.gdpBreakdown = deriveGdpFromMarketAndServices(nation);
        nation.gdp = (nation.gdpBreakdown || []).reduce((total, category) => 
            total + (category.lineItems || []).reduce((catTotal, item) => catTotal + item.value, 0), 0);

        tempNations.push(nation);
    }
    
    // World-level data
    const currentYear = Math.floor(900 + random() * 300);
    const eras: Era[] = [
        { name: 'Age of Myth', startYear: 1 },
        { name: 'Age of Kings', startYear: 450 },
        { name: 'Age of Ascension', startYear: 875 },
    ];

    // Procedural Lore Generation
    tempNations.forEach((nation, i) => {
        // Use a unique seed for each nation's lore to ensure variety but maintain determinism
        const loreSeed = seed + i; 
        nation.foundingStory = generateFoundingStory(nation, loreSeed);
    });
    
    const nations: Nation[] = tempNations.map(({ archetype, ...rest }) => rest);

    // Generate map layout
    const nationsWithArchetypeHints = tempNations.map(n => {
        return { name: n.name, hint: n.archetype.hint, icon: n.icon };
    });
    
    const mapData: MapData = await generateMapLayout(nationsWithArchetypeHints, seed);

    return {
        nations,
        mapData,
        currentYear,
        eras,
        currencyName: 'Gold Sovereigns',
        currencySymbol: '¤',
        tradeGoods: TRADE_GOODS_CATALOG.map(({ name, icon }) => ({ name, icon }))
    };
};
