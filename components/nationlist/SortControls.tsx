
import React from 'react';
import { SortKey, SortOrder } from '../../types';
import Icon from '../ui/Icon';

interface SortControlsProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}

const sortOptions: { key: SortKey; label: string; icon: JSX.Element }[] = [
  {
    key: 'name',
    label: 'Name',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v5a1 1 0 11-2 0V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: 'population',
    label: 'Population',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    key: 'gdp',
    label: 'GDP',
    icon: <Icon name="coin" className="h-5 w-5" />,
  },
];

const SortControls: React.FC<SortControlsProps> = ({ sortKey, sortOrder, onSort }) => {
  return (
    <div className="flex-shrink-0 bg-gray-800/60 p-1.5 rounded-lg flex items-center justify-center gap-2">
      {sortOptions.map(option => {
        const isActive = sortKey === option.key;
        const buttonClasses = `
          flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800
          ${isActive
            ? 'bg-gray-700 text-white shadow-inner'
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
          }
        `;
        return (
          <button
            key={option.key}
            onClick={() => onSort(option.key)}
            className={buttonClasses}
            aria-label={`Sort by ${option.label}`}
            title={`Sort by ${option.label}`}
          >
            {option.icon}
            {isActive && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                {sortOrder === 'asc' ? (
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SortControls;
