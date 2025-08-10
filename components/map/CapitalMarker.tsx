
import React from 'react';
import { NationMapData } from '../../types';
import Icon from '../ui/Icon';

interface CapitalMarkerProps {
    capital: NationMapData;
    isHovered: boolean;
    onSelectNation: (nationName: string) => void;
    onHoverStart: (nationName: string) => void;
    onHoverEnd: () => void;
}

const CapitalMarker: React.FC<CapitalMarkerProps> = ({ capital, isHovered, onSelectNation, onHoverStart, onHoverEnd }) => {
    return (
        <g transform={`translate(${capital.center.x} ${capital.center.y})`}>
            <g className="pointer-events-none">
                <foreignObject
                    x="-20"
                    y="-20"
                    width="40"
                    height="40">
                    <div className={`w-full h-full bg-gray-900/50 rounded-full flex items-center justify-center p-1 shadow-lg transition-all ring-offset-2 ring-offset-gray-900 ${isHovered ? 'ring-2 ring-yellow-400' : ''}`}>
                        <Icon name={capital.icon || 'castle'} className="w-6 h-6 text-white" />
                    </div>
                </foreignObject>
                <text
                    x="0"
                    y="38"
                    textAnchor="middle"
                    className={`font-extrabold tracking-wide pointer-events-none transition-colors ${isHovered ? 'fill-yellow-300' : 'fill-white/90'}`}
                    style={{
                        fontSize: '18px',
                        paintOrder: 'stroke',
                        stroke: 'rgba(0,0,0,0.8)',
                        strokeWidth: '4px',
                        strokeLinejoin: 'round',
                    }}>
                    {capital.ownerNationName}
                </text>
            </g>

            {/* Invisible hitbox for stable interactions */}
            <rect
                x="-40"
                y="-25"
                width="80"
                height="75"
                fill="transparent"
                className="cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent map pan
                    onSelectNation(capital.ownerNationName);
                }}
                onMouseEnter={() => onHoverStart(capital.ownerNationName)}
                onMouseLeave={onHoverEnd}
                data-clickable="true"
            />
        </g>
    );
};

export default CapitalMarker;
