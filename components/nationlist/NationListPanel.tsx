
import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Nation, SortKey, SortOrder } from '../../types';
import NationTile from './NationTile';
import SortControls from './SortControls';
import Icon from '../ui/Icon';
import { DEFAULT_PANEL_CONFIG, UI_COLORS } from '../../config';

interface NationListPanelProps {
    isLoading: boolean;
    error: string | null;
    sortedNations: Nation[];
    selectedNation: Nation | null;
    onSelectNation: (nation: Nation) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    sortKey: SortKey;
    sortOrder: SortOrder;
    onSort: (key: SortKey) => void;
    width: number;
}

// Custom outer element to hide scrollbar
const CustomOuterElement = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props} className={`${props.className || ''} hide-scrollbar`} />
));
CustomOuterElement.displayName = 'CustomOuterElement';


const NationListPanel: React.FC<NationListPanelProps> = ({
    isLoading, error, sortedNations, selectedNation, onSelectNation,
    isCollapsed, onToggleCollapse, sortKey, sortOrder, onSort, width
}) => {
    const listContainerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const [listDimensions, setListDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = listContainerRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                if (width > 0 && height > 0) {
                    setListDimensions({ width, height });
                }
            }
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [isCollapsed]); // Re-observe on collapse toggle

    useEffect(() => {
        if (selectedNation && listRef.current && sortedNations.length > 0) {
            const index = sortedNations.findIndex(n => n.name === selectedNation.name);
            if (index > -1) {
                // 'smart' will only scroll if the item is not visible
                listRef.current.scrollToItem(index, 'smart');
            }
        }
    }, [selectedNation, sortedNations, isCollapsed]);


    const renderNationList = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-gray-300 h-full">
                    <svg className="animate-spin h-12 w-12 text-yellow-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl">Constructing World...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg m-4">
                    <p className="font-bold text-xl">Error Constructing World</p>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (listDimensions.width === 0 || listDimensions.height === 0) {
            return null; // Don't render list until dimensions are known
        }

        const NationRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const nation = sortedNations[index];
            if (!nation) return null;

            const isSelected = selectedNation?.name === nation.name;

            if (isCollapsed) {
                const iconSize = DEFAULT_PANEL_CONFIG.leftPanel.collapsedIconSizePx;
                const iconSizeTailwind = `w-${iconSize / 4} h-${iconSize / 4}`;

                return (
                    <div style={style} className="flex items-center justify-center h-full" title={nation.name}>
                        <div className="relative">
                            <button
                                onClick={() => onSelectNation(nation)}
                                className="p-1 rounded-full border-2 border-transparent hover:border-yellow-400/50 transition-colors"
                                aria-label={`Select ${nation.name}`}
                                aria-pressed={isSelected}
                            >
                                <Icon name={nation.icon} seed={nation.name} asEmblem={true} className={iconSizeTailwind}/>
                            </button>
                             {isSelected && (
                                <div className={`absolute -top-1 -right-1 ${UI_COLORS.focusIndicator.background} rounded-full p-0.5 shadow-lg pointer-events-none`}>
                                    <Icon name="search" className={`w-3 h-3 ${UI_COLORS.focusIndicator.icon}`} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            return (
                <div style={style}>
                    <div className="p-1 h-full">
                        <NationTile
                            nation={nation}
                            isSelected={isSelected}
                            onSelect={() => onSelectNation(nation)}
                        />
                    </div>
                </div>
            );
        };

        return (
            <List
                ref={listRef}
                key={isCollapsed ? 'collapsed' : 'expanded'}
                height={listDimensions.height}
                width={listDimensions.width}
                itemCount={sortedNations.length}
                itemSize={isCollapsed ? DEFAULT_PANEL_CONFIG.leftPanel.collapsedItemHeightPx : 84}
                outerElementType={CustomOuterElement}
            >
                {NationRow}
            </List>
        );
    };

    return (
        <div
            className="absolute top-0 left-0 bottom-0 flex flex-col p-2 z-20 transition-all duration-300 ease-in-out"
            style={{ width: `${width}px` }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl h-full flex flex-col gap-3 overflow-hidden p-3">
                <div className="flex-shrink-0 flex items-center justify-between">
                    {!isCollapsed && (
                        <h2 className="text-lg font-bold text-white">Nations</h2>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        className={`p-2 text-gray-400 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg ${isCollapsed ? 'mx-auto' : ''}`}
                        aria-label={isCollapsed ? "Expand nation list" : "Collapse nation list"}
                        title={isCollapsed ? "Expand nation list" : "Collapse nation list"}
                    >
                        {isCollapsed ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                </div>
                {!isCollapsed && (
                    <SortControls
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                        onSort={onSort}
                    />
                )}
                <div className="flex-grow min-h-0 relative">
                    <div ref={listContainerRef} className="absolute inset-0">
                        {renderNationList()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NationListPanel;
