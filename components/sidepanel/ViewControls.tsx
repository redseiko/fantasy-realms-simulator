
import React from 'react';
import { ActiveView } from '../../types';
import Icon from '../ui/Icon';

interface ViewControlsProps {
    activeView: ActiveView;
    onActiveViewChange: (view: ActiveView) => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ activeView, onActiveViewChange }) => {
    const iconButtonClasses = (view: ActiveView) => `
      p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500
      ${activeView === view ? 'bg-gray-700 text-yellow-400' : 'text-gray-400 hover:bg-gray-700 hover:text-yellow-400'}
    `;
    return (
        <div className="w-full border-b border-gray-600 bg-gray-900/50 px-4 py-2 flex justify-end items-center space-x-2 flex-shrink-0">
            <button
                onClick={() => onActiveViewChange('economy')}
                className={iconButtonClasses('economy')}
                aria-label="Show nation economy report"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
            </button>
            <button
                onClick={() => onActiveViewChange('market')}
                className={iconButtonClasses('market')}
                aria-label="Show nation market report"
            >
                <Icon name="scale" className="w-6 h-6" />
            </button>
            <button
                onClick={() => onActiveViewChange('buildings')}
                className={iconButtonClasses('buildings')}
                aria-label="Show nation buildings report"
            >
                <Icon name="building" className="w-6 h-6" />
            </button>
            <button
                onClick={() => onActiveViewChange('history')}
                className={iconButtonClasses('history')}
                aria-label="Show nation history"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </button>
        </div>
    );
};

export default ViewControls;
