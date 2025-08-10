import { Nation } from '../types';

// A simple pseudo-random number generator for deterministic results.
function mulberry32(a: number) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const selectRandom = <T>(arr: T[], random: () => number): T => {
    if (!arr || arr.length === 0) return '' as any;
    return arr[Math.floor(random() * arr.length)];
};

const LORE_PARTS = {
    // --- SHARED COMPONENTS ---
    adversaries: [
        "a great cataclysm", "a tyrannical empire", "a ravenous horde", "a creeping blight", 
        "a bitter civil war", "a forgotten curse", "the Iron Legion's conquest", 
        "the shadow of the Void Dragon", "a magical plague", "the collapsing Old Kingdom",
        "the endless armies of a Lich King", "a devastating famine"
    ],
    resources: [
        "veins of pure star-metal", "a hidden valley of unparalleled fertility", "a font of ancient magic", 
        "a strategic nexus of trade routes", "lost artifacts of a bygone age", "a grove of sentient Heartwood trees",
        "a deep deposit of flawless soul-gems", "the last unblemished dragon eggs", "a wellspring of pure elemental energy",
        "a chasm leading to the world's core"
    ],

    // --- RACE-SPECIFIC COMPONENTS ---
    leaders: {
        'High Elves': ["the wise Archon Elara", "Loremaster Valerius", "the Star-Singer Lyra", "Prince Kaelan"],
        'Mountain Dwarves': ["High King Thorgrim Stonehand", "Runesmith Balin Deepdelver", "the Shieldmaiden Helga Iron-gut", "Thane Borin the Adamant"],
        'Human Kingdom': ["the Unifier, King Anduin", "Queen Isabella the Bold", "Lord General Marcus", "Saint Elara the Pious"],
        'Orcish Clans': ["Warlord Grommash", "the shaman Zul'jin", "the legendary warrior Orgrim", "Matron Gorka of the Shattered Blade"],
        'Gnomish Artificers': ["Chief Engineer Fizzlebang", "Grand Tinkerer Minerva", "Master Alchemist Zook", "Professor Cogsworth"],
        'Coastal Merchants': ["the Merchant Prince Loric", "Admiral Helena", "the cartographer Silas", "Guildmaster Anya"],
        'Shadow Syndicate': ["the enigmatic Shadowmaster", "the spymaster Lady Vex", "the assassin Corvus", "the Faceless One"],
        'Frost Giants': ["Jarl Skardolf the White", "the Frost-speaker Ymir", "the Colossus Hrothgar", "Giga, Mother of the Peaks"],
        'general': ["the visionary leader", "the last great hero", "the chosen one", "a brave commander"]
    },
    locations: {
        'High Elves': ["the heart of the ancient Silverwood", "the secluded Starfall Vale", "the shimmering city of Aethelgard", "the crystal spires of Lunastre"],
        'Mountain Dwarves': ["the stone heart of Mount Grimfang", "the deep Iron-Root Caverns", "the Great Forge of Khaz'Modan", "the Mithril Halls"],
        'Human Kingdom': ["the fertile banks of the River Arden", "the strategic crossroads of King's Pass", "the White City of Silverhaven", "the fields of Greenfield"],
        'Orcish Clans': ["the sun-scorched Blade-Waste", "the jagged Shadow-Spire Peaks", "the fortress of Krag'mash", "the blood-soaked plains of Gorgoroth"],
        'Gnomish Artificers': ["the glittering Crystal-Vein Hills", "the geyser-filled fields of Tinkerton", "the Clockwork City of Automata", "the Alchemical Canyons"],
        'Coastal Merchants': ["the natural harbor of Storm's End", "the archipelago known as the Merchant's Isles", "the Free Port of Lys", "the Coral Citadel"],
        'Shadow Syndicate': ["the choking gloom of the Black-Tear Swamp", "the forgotten undercity of a sprawling metropolis", "the Twilight Grove", "the labyrinthine port of Cutthroat Harbor"],
        'Frost Giants': ["the colossal Glacier of the World-Serpent", "the windswept Northern Tundra", "the peaks known as the Titan's Teeth", "the frozen fortress of Jotunheim"],
        'general': ["the Sunken Valley", "the Dragon's Tooth mountains", "the Green Plains", "the Whisperwood"]
    },

    // --- NARRATIVE TEMPLATES ---

    // TEMPLATE 1: The Great Exodus
    exodus_origins: [
        "Fleeing [Adversary], the first settlers were refugees seeking a safe haven.",
        "After their homeland was lost to [Adversary], the survivors embarked on a perilous journey across the world.",
        "Driven from their ancestral lands by [Adversary], they wandered for generations as nomads.",
        "Escaping the shadow of the fallen Old Empire, the last of their people sought a new beginning in an unknown land."
    ],
    exodus_actions: [
        "Across treacherous seas and forgotten roads, they finally discovered the sanctuary of [Location].",
        "Guided only by ancient prophecies and the stars above, their long march ended at the shores of [Location].",
        "It was in the unlikely shelter of [Location] that they laid down their burdens and staked their claim."
    ],
    exodus_outcomes: [
        "Here, they vowed to build a bastion of strength, so that they would never be driven out again.",
        "From the ashes of their past, they founded [NationName], a testament to their people's unyielding resilience.",
        "And so, a new home was made, their sorrow giving way to fierce determination and a sliver of hope."
    ],

    // TEMPLATE 2: The Visionary Leader
    leader_origins: [
        "In a time of chaos and division, the visionary [Leader] emerged with a bold new purpose.",
        "The scattered clans were fractured and warring, until united by the iron will and charisma of [Leader].",
        "[Leader] saw a future for their people, a dream that could only be forged in the untamed wilds."
    ],
    leader_actions: [
        "Under a single banner, [Leader] led their followers to the promised land of [Location].",
        "It was [Leader]'s bold strategy that secured [Location] as the heart of their new realm.",
        "With inspiring words and an unyielding will, [Leader] laid the first stones of their capital in [Location]."
    ],
    leader_outcomes: [
        "Their name became legend, and the nation of [NationName] was built upon their enduring vision.",
        "The laws and customs they established would guide [NationName] for centuries to come.",
        "Thus, a dynasty was born, and the kingdom of [NationName] began its meteoric ascent."
    ],

    // TEMPLATE 3: The Great Discovery
    discovery_origins: [
        "In a desperate search for [Resource], a band of pioneers pushed past the known frontiers of the map.",
        "Whispers of untold riches and powerful [Resource] drew them into the uncharted and dangerous territories.",
        "The survival of their people depended on finding a new source of [Resource], a quest that led them to the very edge of the world."
    ],
    discovery_actions: [
        "Against all odds, they not only found the [Resource] but also a perfect place to settle: the pristine lands of [Location].",
        "Their quest culminated in the dramatic discovery of [Location], a land rich beyond their wildest dreams.",
        "Deep within [Location], they unearthed what they sought, and a settlement quickly grew around the newfound treasure."
    ],
    discovery_outcomes: [
        "This great discovery became the bedrock upon which the prosperous nation of [NationName] was built.",
        "Their mastery of this [Resource] would make [NationName] a power to be reckoned with for ages to come.",
        "The wealth from their findings fueled rapid expansion, and [NationName] soon became a beacon of innovation and prosperity."
    ],

    // TEMPLATE 4: The Rebellion
    rebellion_origins: [
        "Breaking free from the cruel shackles of [Adversary], a small band of rebels declared their independence.",
        "Tired of the oppressive yoke of [Adversary], a fire of rebellion was sparked that would engulf the region.",
        "The first blow for freedom was struck when a group of dissidents defied the might of [Adversary] and won."
    ],
    rebellion_actions: [
        "They established a fortified outpost in [Location], which became the symbol of their defiant struggle.",
        "After a series of daring victories against impossible odds, they secured the region of [Location] as their sovereign territory.",
        "They rallied the oppressed and carved out a free nation for themselves, centered in the defiant bastion of [Location]."
    ],
    rebellion_outcomes: [
        "And so [NationName] was born, a nation forged in the fires of rebellion and forever valuing its hard-won freedom.",
        "Their story serves as a timeless inspiration to all who yearn to break their chains and forge their own destiny.",
        "From this defiant stand, the free state of [NationName] rose, a symbol of liberty in a dark world."
    ]
};

// This type assertion is needed because the Nation object in worldGenerationService has an archetype attached temporarily.
type NationWithArchetype = Nation & { archetype: { race: string } };

// Maps the race name from the Nation object to the key used in our LORE_PARTS object.
const RACE_TO_LORE_KEY = {
    'High Elves': 'High Elves',
    'Mountain Dwarves': 'Mountain Dwarves',
    'Humans': 'Human Kingdom',
    'Orcs': 'Orcish Clans',
    'Gnomes': 'Gnomish Artificers',
    'Sea Folk': 'Coastal Merchants',
    'Umbral Elves': 'Shadow Syndicate',
    'Giants': 'Frost Giants',
} as const;

type RaceKey = keyof typeof RACE_TO_LORE_KEY;
type LoreKey = typeof RACE_TO_LORE_KEY[RaceKey];

export const generateFoundingStory = (nation: NationWithArchetype, seed: number): string => {
    // Create a deterministic random function seeded by the nation's own properties for consistency.
    const random = mulberry32(seed + nation.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));

    // Get the correct key for accessing race-specific lore parts.
    const loreKey: LoreKey = RACE_TO_LORE_KEY[nation.dominantRace as RaceKey] || 'Human Kingdom';
    
    // Pre-select all possible placeholder fillers.
    const adversary = selectRandom(LORE_PARTS.adversaries, random);
    const resource = selectRandom(LORE_PARTS.resources, random);
    const leader = selectRandom(LORE_PARTS.leaders[loreKey] || LORE_PARTS.leaders.general, random);
    const location = selectRandom(LORE_PARTS.locations[loreKey] || LORE_PARTS.locations.general, random);

    // An array of functions, each of which generates a story from a different template.
    const storyTemplates = [
        () => {
            const origin = selectRandom(LORE_PARTS.exodus_origins, random);
            const action = selectRandom(LORE_PARTS.exodus_actions, random);
            const outcome = selectRandom(LORE_PARTS.exodus_outcomes, random);
            return `${origin} ${action} ${outcome}`;
        },
        () => {
            const origin = selectRandom(LORE_PARTS.leader_origins, random);
            const action = selectRandom(LORE_PARTS.leader_actions, random);
            const outcome = selectRandom(LORE_PARTS.leader_outcomes, random);
            return `${origin} ${action} ${outcome}`;
        },
        () => {
            const origin = selectRandom(LORE_PARTS.discovery_origins, random);
            const action = selectRandom(LORE_PARTS.discovery_actions, random);
            const outcome = selectRandom(LORE_PARTS.discovery_outcomes, random);
            return `${origin} ${action} ${outcome}`;
        },
        () => {
            const origin = selectRandom(LORE_PARTS.rebellion_origins, random);
            const action = selectRandom(LORE_PARTS.rebellion_actions, random);
            const outcome = selectRandom(LORE_PARTS.rebellion_outcomes, random);
            return `${origin} ${action} ${outcome}`;
        }
    ];

    // Randomly select one of the story templates and generate the raw story string.
    const storyGenerator = selectRandom(storyTemplates, random);
    let finalStory = storyGenerator();

    // Replace all placeholders in the generated string.
    finalStory = finalStory.replace(/\[Adversary\]/g, adversary);
    finalStory = finalStory.replace(/\[Resource\]/g, resource);
    finalStory = finalStory.replace(/\[Leader\]/g, leader);
    finalStory = finalStory.replace(/\[Location\]/g, location);
    finalStory = finalStory.replace(/\[NationName\]/g, nation.name);

    return finalStory;
}