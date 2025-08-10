
import { useState, useEffect, useCallback } from 'react';

export const usePanelResize = (initialWidth: number, minWidth: number, maxWidth: number) => {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            setWidth(prev => {
                const newWidth = prev - e.movementX; // Movement X is inverted for right panel
                return Math.max(minWidth, Math.min(newWidth, maxWidth));
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing, minWidth, maxWidth]);

    return { width, isResizing, handleMouseDown };
};
