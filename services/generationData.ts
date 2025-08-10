
import { TradeGood } from '../types';

export const NAME_PARTS = {
    prefixes: [
        "Aegis", "Amber", "Argent", "Ash", "Azure", "Black", "Blood", "Bronze", "Cinder",
        "Crimson", "Crystal", "Dragon", "Dusk", "Eagle", "Ebony", "Elder", "Ember", "Emerald",
        "Fell", "Fire", "Frost", "Ghost", "Glimmer", "Golden", "Granite", "Green", "Grey",
        "Grim", "Hallow", "High", "Ice", "Iron", "Ivory", "Jade", "Lion", "Mist", "Moon",
        "Moss", "Night", "North", "Oak", "Obsidian", "Onyx", "Pearl", "Pyre", "Raven",
        "Red", "River", "Rose", "Ruby", "Rune", "Sable", "Sea", "Serpent", "Shadow",
        "Silver", "Snow", "Sol", "South", "Star", "Steel", "Still", "Stone", "Storm",
        "Sun", "Thorn", "Thunder", "Twilight", "West", "Whisper", "White", "Wild", "Wind",
        "Winter", "Wolf", "Wyrm",
    ],
    middles: [
        "arrow", "banner", "beam", "blood", "borne", "brook", "claw", "crest", "crown", "dew",
        "down", "drain", "fall", "fang", "fire", "flow", "ford", "fury", "garde", "glen",
        "grasp", "grasp", "grave", "grove", "guard", "hail", "hammer", "hand", "heart",
        "helm", "hollow", "horn", "light", "mane", "maw", "more", "mourn", "peak", "pine",
        "rage", "ridge", "rift", "rock", "root", "run", "scar", "shade", "shield", "shore",
        "song", "spell", "spike", "spire", "stone", "stream", "strike", "talon", "tide",
        "tooth", "vale", "vine", "wall", "watch", "water", "wind", "wing", "wood", "wound",
    ],
    suffixes: [
        "a", "ae", "ah", "ia", "ios", "os", "us", "gard", "fell", "wood", "reach", "hold",
        "spire", "vale", "mark", "gate", "burg", "burn", "bury", "cliff", "coast", "croft",
        "crag", "dale", "den", "don", "dun", "eath", "end", "er", "est", "fall", "feld",
        "field", "ford", "fort", "front", "garde", "gate", "grad", "garth", "grave", "green",
        "grove", "guard", "gulch", "hall", "hand", "harbor", "haven", "helm", "hill", "heim",
        "hold", "holde", "holm", "holt", "ia", "land", "light", "lock", "march", "mark",
        "marsh", "mead", "mere", "mire", "mond", "moor", "mount", "mouth", "pass", "point",
        "port", "post", "rath", "reach", "rest", "rock", "run", "scar", "set", "shade",
        "shaw", "shield", "shire", "side", "stead", "stein", "stone", "strand", "strong",
        "thorp", "thorpe", "ton", "town", "vale", "view", "ville", "wall", "ward", "watch",
        "water", "way", "weald", "well", "wich", "wick", "wind", "wold", "wood", "worth",
        "wyke",
    ],
};

export const TRADE_GOODS_CATALOG: (TradeGood & { basePrice: number, weight: number, isService?: boolean })[] = [
    // Primary
    { name: 'Grain', icon: 'grain', basePrice: 2, weight: 1.0 },
    { name: 'Lumber', icon: 'tree', basePrice: 5, weight: 1.0 },
    { name: 'Ore', icon: 'pickaxe', basePrice: 10, weight: 1.0 },
    { name: 'Stone', icon: 'mountain', basePrice: 3, weight: 1.0 },
    { name: 'Magical Crystals', icon: 'crystal', basePrice: 50, weight: 0.2 },
    { name: 'Raw Hides', icon: 'shield', basePrice: 4, weight: 0.8 },
    { name: 'Exotic Herbs', icon: 'potion', basePrice: 15, weight: 0.4 },
    { name: 'Fish', icon: 'ship', basePrice: 3, weight: 0.9 },

    // Secondary
    { name: 'Tools', icon: 'hammer', basePrice: 25, weight: 1.0 },
    { name: 'Weapons', icon: 'sword', basePrice: 60, weight: 0.8 },
    { name: 'Armor', icon: 'shield', basePrice: 80, weight: 0.6 },
    { name: 'Luxury Textiles', icon: 'fabric', basePrice: 40, weight: 0.5 },
    { name: 'Alchemical Potions', icon: 'potion', basePrice: 100, weight: 0.3 },
    { name: 'Fine Jewelry', icon: 'crystal', basePrice: 250, weight: 0.1 },
    { name: 'Ornate Furniture', icon: 'hammer', basePrice: 120, weight: 0.4 },
    { name: 'Craft Ale', icon: 'potion', basePrice: 8, weight: 0.7 },
    
    // Services (Intangible)
    { name: 'Mercenary Contracts', icon: 'shield', basePrice: 200, weight: 0.2, isService: true },
    { name: 'Enchantment Services', icon: 'gear', basePrice: 300, weight: 0.1, isService: true },
    { name: 'Scholarly Subscriptions', icon: 'book', basePrice: 150, weight: 0.15, isService: true },
    { name: 'Guild Dues', icon: 'building', basePrice: 50, weight: 0.4, isService: true },
    { name: 'Toll & Tariff Fees', icon: 'coin', basePrice: 20, weight: 0.9, isService: true },
    { name: 'Cartography Services', icon: 'scroll', basePrice: 90, weight: 0.2, isService: true },
    { name: 'Medical Treatment', icon: 'potion', basePrice: 75, weight: 0.3, isService: true },
    { name: 'Legal Representation', icon: 'scroll', basePrice: 180, weight: 0.15, isService: true },
];

export const ARCHETYPES = {
    'High Elves': { race: 'High Elves', icon: 'tree', buildingBias: { 'Mage Tower': 2, 'Library': 2, 'Weaver': 1.5, 'Mine': 0.1, 'Forge': 0.5, 'Healers House': 1.5, 'Carpenter': 1.2 }, story: "graceful and ancient people, masters of magic and art", hint: "prefers secluded, ancient forests" },
    'Mountain Dwarves': { race: 'Mountain Dwarves', icon: 'mountain', buildingBias: { 'Mine': 3, 'Forge': 2, 'Armory': 1.5, 'Farm': 0.2, 'Mage Tower': 0.1, 'Brewery': 1.5, 'Jeweler': 2.0 }, story: "stout and industrious folk, peerless miners and smiths", hint: "lives in rugged, high-altitude mountain ranges" },
    'Human Kingdom': { race: 'Humans', icon: 'castle', buildingBias: { 'Farm': 1.5, 'Barracks': 1.2, 'Marketplace': 1.5, 'Forge': 1.0, 'Guild Hall': 1.2, 'Carpenter': 1.2, 'Brewery': 1.1, 'Courthouse': 1.3 }, story: "ambitious and adaptable humans, builders of great kingdoms", hint: "thrives in fertile, central plains near rivers" },
    'Orcish Clans': { race: 'Orcs', icon: 'sword', buildingBias: { 'Barracks': 3, 'Lumber Mill': 1.5, 'Forge': 1.2, 'Library': 0.1, 'Farm': 0.5, 'Mine': 1.2 }, story: "fierce and resilient warriors, living in nomadic clans", hint: "occupies harsh badlands or dense, untamed woods" },
    'Gnomish Artificers': { race: 'Gnomes', icon: 'gear', buildingBias: { 'Alchemist Lab': 2, 'Mage Tower': 1.5, 'Mine': 1.2, 'Forge': 1.5, 'Weaver': 1.2, 'Jeweler': 1.5, 'Surveyors Office': 2.0 }, story: "clever and inventive gnomes, renowned for their intricate contraptions", hint: "builds cities in hillsides full of strange minerals" },
    'Coastal Merchants': { race: 'Sea Folk', icon: 'ship', buildingBias: { 'Marketplace': 3, 'Weaver': 1.5, 'Lumber Mill': 1.2, 'Farm': 1.2, 'Armory': 0.5, 'Fishing Wharf': 3.0, 'Surveyors Office': 1.5 }, story: "canny traders and seafarers, their culture built on commerce", hint: "is always located on the coast, with a major port city" },
    'Shadow Syndicate': { race: 'Umbral Elves', icon: 'crystal', buildingBias: { 'Alchemist Lab': 1.5, 'Barracks': 1.5, 'Mage Tower': 1.2, 'Guild Hall': 1.5, 'Farm': 0.3, 'Healers House': 1.2, 'Courthouse': 1.5 }, story: "secretive and pragmatic people who thrive in the shadows", hint: "operates from hidden enclaves in dense swamps or sprawling urban underbellies" },
    'Frost Giants': { race: 'Giants', icon: 'wolf', buildingBias: { 'Lumber Mill': 2, 'Mine': 1.5, 'Forge': 1.2, 'Farm': 0.1, 'Barracks': 1.5, 'Fishing Wharf': 1.2 }, story: "colossal and hardy people of the frozen north, bound by ancient traditions", hint: "dwells in the far northern, arctic tundras and glacial mountains" }
};
