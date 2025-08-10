import { Era } from '../types';

export const FANTASY_MONTHS: string[] = [
  "Frostmoot", "Thawfest", "Greenbloom", "Suncrest",
  "Firepeak", "Harvestide", "Witchfall", "Starfall",
  "Gloomtide", "Deepwinter", "Year's Turn", "Firstseed"
];

export const FANTASY_DAYS_OF_WEEK: string[] = [
    "Sunsday",
    "Moonsday",
    "Grovday",
    "Mireday",
    "Spireday",
    "Soulsday",
    "Voidday"
];

export const DAYS_IN_MONTH = 30;

/**
 * Formats a given absolute year into a string relative to the world's eras.
 * @param year The absolute year number.
 * @param eras A sorted array of Era objects.
 * @returns A formatted string e.g., "Year 142 of the Age of Ascension".
 */
export const formatYearWithEra = (year: number, eras: Era[]): string => {
  if (!eras || eras.length === 0 || year === null) {
    return `Year ${year || '?'}`;
  }

  // Find the current era by looking for the last era that started before or on the given year.
  let currentEra = eras[0];
  for (let i = eras.length - 1; i >= 0; i--) {
    if (eras[i].startYear <= year) {
      currentEra = eras[i];
      break;
    }
  }

  const yearInEra = year - currentEra.startYear + 1;
  return `Year ${yearInEra} of the ${currentEra.name}`;
};