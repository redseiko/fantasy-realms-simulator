

import React from 'react';
import { Nation, MapData, Era, TradeGood, SortKey, SortOrder, ActiveView } from '../../types';
import WorldMap from '../map/WorldMap';
import SidePanel from '../sidepanel/SidePanel';
import NationListPanel from '../nationlist/NationListPanel';
import { DEFAULT_PANEL_CONFIG } from '../../config';
import { usePanelResize } from '../../hooks/usePanelResize';

interface MainDisplayProps {
    isLoading: boolean;
    error: string | null;
    mapData: MapData;
    nations: Nation[];
    sortedNations: Nation[];
    onSelectNation: (nation: Nation | string) => void;
    seed: number;
    selectedNation: Nation | null;
    onDeselectNation: () => void;
    isNationListCollapsed: boolean;
    onToggleNationListCollapse: () => void;
    sortKey: SortKey;
    sortOrder: SortOrder;
    onSort: (key: SortKey) => void;
    eras: Era[];
    tradeGoods: TradeGood[];
    currencyName: string;
    currencySymbol: string;
    activeView: ActiveView;
    onActiveViewChange: (view: ActiveView) => void;
}

const MainDisplay: React.FC<MainDisplayProps> = ({
    isLoading, error, mapData, nations, sortedNations, onSelectNation, seed,
    selectedNation, onDeselectNation, isNationListCollapsed, onToggleNationListCollapse,
    sortKey, sortOrder, onSort, eras, tradeGoods, currencyName, currencySymbol,
    activeView, onActiveViewChange
}) => {
    const { 
        width: rightPanelWidth, 
        handleMouseDown: handleResizeMouseDown 
    } = usePanelResize(
        DEFAULT_PANEL_CONFIG.rightPanel.defaultPx,
        DEFAULT_PANEL_CONFIG.rightPanel.minPx,
        DEFAULT_PANEL_CONFIG.rightPanel.maxPx
    );

    const currentLeftWidth = isNationListCollapsed 
        ? DEFAULT_PANEL_CONFIG.leftPanel.collapsedPx 
        : DEFAULT_PANEL_CONFIG.leftPanel.expandedPx;

    return (
        <div className="h-full relative">
            <WorldMap
                isLoading={isLoading}
                mapData={mapData}
                nations={nations}
                onSelectNation={onSelectNation}
                seed={seed}
            />

            <NationListPanel
                isLoading={isLoading}
                error={error}
                sortedNations={sortedNations}
                selectedNation={selectedNation}
                onSelectNation={onSelectNation}
                isCollapsed={isNationListCollapsed}
                onToggleCollapse={onToggleNationListCollapse}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={onSort}
                width={currentLeftWidth}
            />

            {selectedNation && (
                <>
                    {/* Backdrop to close right panel */}
                    <div
                        className="absolute inset-0 z-10"
                        onClick={onDeselectNation}
                    />

                    {/* Right Panel: Nation Details */}
                    <div
                        className="absolute top-0 right-0 bottom-0 h-full p-2 z-20"
                        style={{ width: `${rightPanelWidth}px` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidePanel
                            nation={selectedNation}
                            eras={eras}
                            tradeGoods={tradeGoods}
                            currencyName={currencyName}
                            currencySymbol={currencySymbol}
                            onClose={onDeselectNation}
                            activeView={activeView}
                            onActiveViewChange={onActiveViewChange}
                        />
                    </div>

                    {/* Right Resizer */}
                     <div
                        onMouseDown={handleResizeMouseDown}
                        className="absolute top-0 bottom-0 z-30 w-2.5 cursor-col-resize group"
                        style={{ right: `${rightPanelWidth - 5}px` }}
                        title="Drag to resize"
                    >
                         <div className="w-0.5 h-full bg-transparent group-hover:bg-yellow-400/50 transition-colors duration-200 mx-auto"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainDisplay;