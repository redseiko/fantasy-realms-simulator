
import React from 'react';

interface MapControlsProps {
    onZoom: (direction: 'in' | 'out') => void;
    onReset: () => void;
    zoomLevel: number;
}

const MapControls: React.FC<MapControlsProps> = ({ onZoom, onReset, zoomLevel }) => {
    return (
        <div className="absolute bottom-4 right-4 flex items-center gap-2" data-clickable="true">
            <div className="flex flex-col bg-gray-900/70 rounded-full shadow-lg border border-gray-600/50">
                <button
                    onClick={() => onZoom('in')}
                    className="text-gray-300 hover:bg-yellow-500 hover:text-gray-900 transition-all p-3 rounded-t-full"
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                </button>
                <div className="w-full h-px bg-gray-600/80"></div>
                <button
                    onClick={() => onZoom('out')}
                    className="text-gray-300 hover:bg-yellow-500 hover:text-gray-900 transition-all p-3 rounded-b-full"
                    aria-label="Zoom out"
                    title="Zoom out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </button>
            </div>
            <button
                onClick={onReset}
                className="bg-gray-900/70 text-gray-300 hover:bg-yellow-500 hover:text-gray-900 transition-all p-2 rounded-full shadow-lg border border-gray-600/50"
                aria-label="Reset map view"
                title="Reset map view"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 11v-5h-5m5 5L4 4" />
                </svg>
            </button>
            <span className="bg-gray-900/70 text-gray-200 text-xs font-semibold px-2 py-1 rounded-full shadow-lg border border-gray-600/50 pointer-events-none">
                {zoomLevel.toFixed(1)}x
            </span>
        </div>
    );
};

export default MapControls;
