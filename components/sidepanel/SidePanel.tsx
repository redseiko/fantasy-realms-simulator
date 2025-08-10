
import React, { useMemo } from 'react';
import { Nation, Era, ActiveView, TradeGood } from '../../types';
import Icon from '../ui/Icon';
import ViewControls from './ViewControls';
import EconomyReport from './EconomyReport';
import MarketReport from './MarketReport';
import HistoryPanel from './HistoryPanel';
import BuildingsReport from './BuildingsReport';

interface SidePanelProps {
  nation: Nation;
  eras: Era[];
  tradeGoods: TradeGood[];
  currencySymbol: string;
  currencyName: string;
  onClose: () => void;
  activeView: ActiveView;
  onActiveViewChange: (view: ActiveView) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ nation, eras, tradeGoods, currencySymbol, currencyName, onClose, activeView, onActiveViewChange }) => {

  const goodIconMap = useMemo(() =>
      (tradeGoods || []).reduce((acc, good) => {
          if (good && good.name) acc[good.name] = good.icon;
          return acc;
      }, {} as Record<string, string>),
  [tradeGoods]);

  const renderActiveView = () => {
    switch(activeView) {
      case 'economy':
        return <EconomyReport nation={nation} currencyName={currencyName} currencySymbol={currencySymbol} />;
      case 'market':
        return <MarketReport nation={nation} goodIconMap={goodIconMap} currencyName={currencyName} />;
      case 'buildings':
        return <BuildingsReport nation={nation} goodIconMap={goodIconMap} />;
      case 'history':
        return <HistoryPanel nation={nation} eras={eras} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg flex flex-col shadow-2xl h-full overflow-hidden">
      {/* Panel Header */}
      <div id="nation-panel-title" className="p-4 flex items-center border-b border-gray-700 bg-gray-900/20 flex-shrink-0">
        <div className="mr-4">
          <Icon name={nation.icon} seed={nation.name} asEmblem={true} className="w-12 h-12" />
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white">{nation.name}</h3>
          <p className="text-md text-gray-300">{nation.dominantRace}</p>
        </div>
         <button onClick={onClose} aria-label="Close panel" className="ml-4 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
      </div>

      {/* View Content */}
      <div className="w-full flex flex-col flex-grow min-h-0">
        <ViewControls activeView={activeView} onActiveViewChange={onActiveViewChange} />
        <div className="flex-grow relative overflow-y-auto hide-scrollbar">
           <div className="p-6">
              {renderActiveView()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
