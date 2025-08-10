
import { useState, useCallback, useRef } from 'react';
import { MAP_WIDTH, MAP_HEIGHT } from '../types';

const MIN_VIEWBOX_WIDTH = 100;

export const useMapInteraction = () => {
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT });
    const [isPanning, setIsPanning] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const panStateRef = useRef<{ lastPoint: { x: number; y: number } } | null>(null);

    const resetView = useCallback(() => {
        setViewBox({ x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement;
        if (target.closest('[data-clickable="true"]')) return;

        e.preventDefault();
        setIsPanning(true);
        panStateRef.current = { lastPoint: { x: e.clientX, y: e.clientY } };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isPanning || !panStateRef.current) return;
        e.preventDefault();

        const scale = viewBox.width / (svgRef.current?.clientWidth || MAP_WIDTH);
        const dx = e.clientX - panStateRef.current.lastPoint.x;
        const dy = e.clientY - panStateRef.current.lastPoint.y;

        panStateRef.current.lastPoint = { x: e.clientX, y: e.clientY };

        setViewBox(prev => {
            const newX = prev.x - dx * scale;
            const newY = prev.y - dy * scale;
            const clampedX = Math.max(0, Math.min(newX, MAP_WIDTH - prev.width));
            const clampedY = Math.max(0, Math.min(newY, MAP_HEIGHT - prev.height));
            return { ...prev, x: clampedX, y: clampedY };
        });
    }, [isPanning, viewBox.width]);

    const handleMouseUpOrLeave = useCallback(() => {
        setIsPanning(false);
        panStateRef.current = null;
    }, []);

    const handleZoom = useCallback((direction: 'in' | 'out') => {
        const scaleFactor = 1.25;
        const zoomFactor = direction === 'in' ? 1 / scaleFactor : scaleFactor;

        setViewBox(prev => {
            let newWidth = prev.width * zoomFactor;
            if (newWidth > MAP_WIDTH) {
                return { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };
            }
            newWidth = Math.max(MIN_VIEWBOX_WIDTH, newWidth);
            const newHeight = newWidth * (MAP_HEIGHT / MAP_WIDTH);

            const centerX = prev.x + prev.width / 2;
            const centerY = prev.y + prev.height / 2;

            let newX = centerX - newWidth / 2;
            let newY = centerY - newHeight / 2;

            newX = Math.max(0, Math.min(newX, MAP_WIDTH - newWidth));
            newY = Math.max(0, Math.min(newY, MAP_HEIGHT - newHeight));

            return { width: newWidth, height: newHeight, x: newX, y: newY };
        });
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        if (!svgRef.current) return;
        e.preventDefault();

        const scaleFactor = 1.1;
        const zoomFactor = e.deltaY < 0 ? 1 / scaleFactor : scaleFactor;

        setViewBox(prev => {
            let newWidth = prev.width * zoomFactor;
            if (newWidth > MAP_WIDTH) {
                return { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };
            }
            newWidth = Math.max(MIN_VIEWBOX_WIDTH, newWidth);
            const newHeight = newWidth * (MAP_HEIGHT / MAP_WIDTH);

            const svgRect = svgRef.current!.getBoundingClientRect();
            const mouseX = e.clientX - svgRect.left;
            const mouseY = e.clientY - svgRect.top;

            const mousePoint = {
                x: (mouseX / svgRect.width) * prev.width + prev.x,
                y: (mouseY / svgRect.height) * prev.height + prev.y,
            };

            let newX = mousePoint.x - (mouseX / svgRect.width) * newWidth;
            let newY = mousePoint.y - (mouseY / svgRect.height) * newHeight;

            newX = Math.max(0, Math.min(newX, MAP_WIDTH - newWidth));
            newY = Math.max(0, Math.min(newY, MAP_HEIGHT - newHeight));

            return { x: newX, y: newY, width: newWidth, height: newHeight };
        });
    }, []);

    return {
        svgRef,
        viewBox,
        isPanning,
        handleMouseDown,
        handleMouseMove,
        handleMouseUpOrLeave,
        handleWheel,
        handleZoom,
        resetView,
    };
};
