
import React from 'react';
import TimeDisplay from './TimeDisplay';
import TimeControls from './TimeControls';
import Icon from '../ui/Icon';
import { Era } from '../../types';
import { FANTASY_MONTHS, FANTASY_DAYS_OF_WEEK } from '../../utils/time';

interface AppHeaderProps {
    currentYear: number | null;
    currentMonthIndex: number;
    currentDay: number;
    dayOfWeekIndex: number;
    eras: Era[];
    isTimeReady: boolean;
    isPaused: boolean;
    onTogglePlayPause: () => void;
    onAdvanceDay: () => void;
    isTimeControlsDisabled: boolean;
    onOpenSettings: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    currentYear, currentMonthIndex, currentDay, dayOfWeekIndex, eras, isTimeReady,
    isPaused, onTogglePlayPause, onAdvanceDay, isTimeControlsDisabled, onOpenSettings
}) => (
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md shadow-md border-b border-gray-700 flex-shrink-0">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-2 flex flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-yellow-400">
                  Fantasy Realms Simulator
                </h1>
                <p className="mt-1 text-sm text-gray-400">A procedurally generated world of rival nations.</p>
            </div>
            <div className="flex items-center gap-4">
                <TimeDisplay 
                    year={currentYear} 
                    month={FANTASY_MONTHS[currentMonthIndex]} 
                    day={currentDay}
                    dayOfWeek={FANTASY_DAYS_OF_WEEK[dayOfWeekIndex]}
                    eras={eras}
                    isTimeReady={isTimeReady}
                />
                <TimeControls
                    isPaused={isPaused}
                    onTogglePlayPause={onTogglePlayPause}
                    onAdvanceDay={onAdvanceDay}
                    disabled={isTimeControlsDisabled}
                />
                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-700 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Open settings"
                >
                  <Icon name="settings" className="w-6 h-6"/>
                </button>
            </div>
        </div>
    </header>
);

export default AppHeader;
