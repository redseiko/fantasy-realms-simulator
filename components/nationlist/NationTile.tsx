
import React from 'react';
import { Nation } from '../../types';
import Icon from '../ui/Icon';
import { UI_COLORS } from '../../config';

interface NationTileProps {
  nation: Nation;
  isSelected: boolean;
  onSelect: () => void;
}

const NationTile: React.FC<NationTileProps> = ({ nation, isSelected, onSelect }) => {
  const populationFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });

  const { border, bg } = nation.color.tailwind;

  return (
    <button
      onClick={onSelect}
      className={`
        relative w-full p-2.5 bg-gray-800 border-2 rounded-lg flex flex-col transition-all duration-200 shadow-md
        hover:bg-gray-700/60 hover:shadow-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500
        ${border}
      `}
      aria-pressed={isSelected}
    >
      {isSelected && (
          <div className={`absolute top-1.5 right-1.5 ${UI_COLORS.focusIndicator.background} rounded-full p-1 shadow-lg pointer-events-none`}>
            <Icon name="search" className={`w-4 h-4 ${UI_COLORS.focusIndicator.icon}`} />
          </div>
      )}
      <div className="flex items-center w-full">
        <div className={`flex-shrink-0 w-3 h-3 rounded-full ${bg}`}></div>
        <div className="flex-grow text-left ml-3 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{nation.name}</h3>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-around items-center w-full text-xs">
         <div className="flex items-center space-x-1.5 text-gray-300" title={nation.dominantRace}>
            <Icon name={nation.icon} className="h-4 w-4" />
         </div>
         <div className="flex items-center space-x-1 text-gray-300" title="Population">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-semibold">{populationFormatter.format(nation.population)}</span>
         </div>
         <div className="flex items-center space-x-1 text-gray-300" title="GDP">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-semibold">{populationFormatter.format(nation.gdp)}</span>
         </div>
      </div>
    </button>
  );
};

export default NationTile;
