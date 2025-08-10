
export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 1200;

export interface GdpLineItem {
  name: string;
  value: number;
}

export interface GdpCategory {
  categoryName: string;
  lineItems: GdpLineItem[];
}

export interface Building {
  type: string;
  category: string;
  level: number;
  employees: number;
}

export interface TradeGood {
  name:string;
  icon: string; // Icon keyword
}

export interface NationGood {
  name: string;
  production: number; // per day
  consumption: number; // per day
  marketPrice: number;
}

export interface NationColor {
  fill: string; // Hex color for SVG fill
  stroke: string; // Hex color for SVG stroke/UI borders
  fillOpacity: number;
  tailwind: {
    bg: string; // Tailwind bg class
    border: string; // Tailwind border class
  };
}

export interface Nation {
  name:string;
  dominantRace: string;
  population: number;
  icon: string;
  foundingYear: number;
  foundingStory: string;
  gdp: number;
  color: NationColor;
  gdpBreakdown: GdpCategory[];
  buildings: Building[];
  market: NationGood[];
}

export interface Era {
  name:string;
  startYear: number;
}

export interface NationMapData {
  ownerNationName: string; // The nation this state belongs to
  center: { x: number; y: number }; // The generator point for this polygon
  territory: [number, number][];
  isKnown: boolean;
  isCapitalState: boolean;
  icon: string; // Will only be used if isCapitalState is true
}

export type MapData = NationMapData[];

export interface WorldData {
    nations: Nation[];
    mapData: MapData;
    currentYear: number;
    eras: Era[];
    currencyName: string;
    currencySymbol: string;
    tradeGoods: TradeGood[];
}

export type SortKey = 'name' | 'population' | 'gdp';
export type SortOrder = 'asc' | 'desc';
export type ActiveView = 'economy' | 'history' | 'buildings' | 'market';