
export const DEFAULT_PANEL_CONFIG = {
  leftPanel: {
    collapsedPx: 85,
    expandedPx: 240,
    collapsedIconSizePx: 32,
    collapsedItemHeightPx: 48, // was effectively 60, icon button is 44px tall. 48px gives a 4px gap.
  },
  rightPanel: {
    defaultPx: 700,
    minPx: 450,
    maxPx: 1200,
  }
};

export const UI_COLORS = {
  focusIndicator: {
    icon: 'text-white',
    background: 'bg-blue-500',
  }
};

export const SECTOR_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'Primary Sector (Raw Materials)': { bg: 'bg-green-500', text: 'text-green-300', border: 'border-green-700' },
  'Secondary Sector (Goods & Manufacturing)': { bg: 'bg-blue-500', text: 'text-blue-300', border: 'border-blue-700' },
  'Military & Defense': { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-700' },
  'State & Infrastructure': { bg: 'bg-orange-500', text: 'text-orange-300', border: 'border-orange-700' },
  'Cultural & Social Services': { bg: 'bg-purple-500', text: 'text-purple-300', border: 'border-purple-700' },
  'Arcane & Magical Arts': { bg: 'bg-pink-500', text: 'text-pink-300', border: 'border-pink-700' },
  'Tertiary Sector (General Services)': { bg: 'bg-indigo-500', text: 'text-indigo-300', border: 'border-indigo-700' },
  'Unspecified Sector': { bg: 'bg-gray-500', text: 'text-gray-300', border: 'border-gray-700' },
};
