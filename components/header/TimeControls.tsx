
import React from 'react';

interface TimeControlsProps {
  isPaused: boolean;
  onTogglePlayPause: () => void;
  onAdvanceDay: () => void;
  disabled: boolean;
}

const TimeControls: React.FC<TimeControlsProps> = ({ isPaused, onTogglePlayPause, onAdvanceDay, disabled }) => {
  const controlButtonClasses = `p-2 rounded-full transition-colors text-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 hover:text-yellow-400'}`;

  return (
    <div className="flex items-center space-x-4 p-1 bg-gray-900/50 rounded-full border border-gray-700">
      <button 
        onClick={onTogglePlayPause} 
        disabled={disabled} 
        className={controlButtonClasses} 
        aria-label={isPaused ? "Play" : "Pause"}
      >
        {isPaused ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>
      
      <div className="w-px h-6 bg-gray-600"></div>

      <button 
        onClick={onAdvanceDay} 
        disabled={disabled} 
        className={controlButtonClasses} 
        aria-label="Advance one day"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5v14l7-7-7-7zm15 0h2v14h-2V5z" />
         </svg>
      </button>
    </div>
  );
};

export default TimeControls;
