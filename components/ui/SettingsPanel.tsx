
import React from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  seed: number;
  onSeedChange: (newSeed: number) => void;
  onRegenerate: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, seed, onSeedChange, onRegenerate }) => {
  if (!isOpen) {
    return null;
  }

  const handleRegenerateClick = () => {
    onRegenerate();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100] flex items-center justify-center" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md m-4 text-white p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <label htmlFor="seed-input" className="block text-sm font-medium text-gray-300 mb-2">
            World Generation Seed
          </label>
          <input
            type="number"
            id="seed-input"
            value={seed}
            onChange={(e) => onSeedChange(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter a number"
          />
          <p className="text-xs text-gray-500 mt-2">
            Changing the seed will create a new world. The same seed will always generate the same world.
          </p>
        </div>

        <button
          onClick={handleRegenerateClick}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500"
        >
          Generate New World
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
