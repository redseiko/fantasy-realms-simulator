
import React, { useState } from 'react';
import { Era } from '../../types';
import { formatYearWithEra, FANTASY_DAYS_OF_WEEK } from '../../utils/time';

interface TimeDisplayProps {
  year: number | null;
  month: string;
  day: number;
  dayOfWeek: string;
  eras: Era[];
  isTimeReady: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ year, month, day, dayOfWeek, eras, isTimeReady }) => {
  const [isDaysPanelVisible, setDaysPanelVisible] = useState(false);

  return (
    <div className="text-center relative">
      {!isTimeReady ? (
        <div className="text-lg text-gray-400 animate-pulse">Synchronizing Timeline...</div>
      ) : (
        <div>
          <div className="text-sm uppercase tracking-widest text-gray-400 flex items-center justify-center">
            <span>Current Date</span>
            <button 
              onClick={() => setDaysPanelVisible(v => !v)}
              className="ml-2 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Show days of the week"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {dayOfWeek}, {month} {day}
          </div>
          <div className="text-lg text-yellow-400">
            {formatYearWithEra(year!, eras)}
          </div>
        </div>
      )}
      {isDaysPanelVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-900 border border-gray-600 rounded-lg shadow-xl p-3 z-20">
          <h4 className="font-bold text-white mb-2 text-center">Days of the Week</h4>
          <ul className="text-left text-gray-300">
            {FANTASY_DAYS_OF_WEEK.map(day => (
              <li key={day} className="py-1 px-2 rounded hover:bg-gray-700">{day}</li>
            ))}
          </ul>
           <button 
              onClick={() => setDaysPanelVisible(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
           </button>
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;
