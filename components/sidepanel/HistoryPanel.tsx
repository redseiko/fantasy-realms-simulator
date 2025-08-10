
import React from 'react';
import { Nation, Era } from '../../types';
import Icon from '../ui/Icon';
import { formatYearWithEra } from '../../utils/time';

interface HistoryPanelProps {
    nation: Nation;
    eras: Era[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ nation, eras }) => (
    <div className="flex-grow flex flex-col items-center justify-center p-6 w-full h-full relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Icon name={nation.icon} className="w-64 h-64 text-gray-500" />
        </div>
        <div className="relative text-center bg-yellow-50/10 p-8 rounded-lg border-2 border-amber-800/50 shadow-2xl">
            <h4 className="font-bold text-yellow-300 mb-2 text-xl tracking-wide">The Founding of {nation.name}</h4>
            <p className="text-md text-amber-200/80 mb-6">{formatYearWithEra(nation.foundingYear, eras)}</p>
            <p className="text-lg text-amber-100/90 italic text-center leading-relaxed max-w-prose">"{nation.foundingStory}"</p>
        </div>
    </div>
);

export default HistoryPanel;
