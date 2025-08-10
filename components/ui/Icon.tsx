
import React from 'react';
import { getColorForSeed } from '../../utils/colorUtils';

interface IconProps {
  name: string; // Icon keyword e.g. "mountain" or emoji "⚔️"
  seed?: string;
  asEmblem?: boolean; // Render as a colored emblem
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, seed, asEmblem = false, className = 'w-16 h-16 text-yellow-400' }) => {
  
  const renderIconContent = (iconClassName: string) => {
    switch (name.toLowerCase()) {
      case 'mountain':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 20h18L12 4 3 20zm9-12l7 12H5l7-12z" />
          </svg>
        );
      case 'dragon':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4c-3.31 0-6 2.69-6 6 0 2.24 1.23 4.21 3 5.29V19h6v-3.71c1.77-1.08 3-3.05 3-5.29 0-3.31-2.69-6-6-6zm-3.99 9.01C6.73 12.31 6 11.2 6 10c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.2-.73 2.31-1.99 3.01M3 10h2m14 0h2m-9 7v3m0-17V1m-6.36 3.64l1.41 1.41M19.36 3.64l-1.41 1.41" />
          </svg>
        );
      case 'tree':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21V11m0-4V3m0 8h5.5a2.5 2.5 0 110 5H12m0-5H6.5a2.5 2.5 0 100 5H12m0-5a3 3 0 013 3v1a3 3 0 01-3 3h-1m1-3a3 3 0 01-3-3v-1a3 3 0 013-3z" />
          </svg>
        );
      case 'castle':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 22h16v-6H4v6zm1-10V8h4v4H5zm5 0V8h4v4h-4zm5 0V8h4v4h-4zM4 6h16V4H4v2z" />
          </svg>
        );
      case 'ship':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21h20M5 21V10l7-6 7 6v11M2 13h20" />
          </svg>
        );
      case 'wolf':
        return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.5 12.5a2 2 0 104 0 2 2 0 00-4 0zM17 14c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 1.99 1.01 3.75 2.58 4.93A8.961 8.961 0 0010 21a8.961 8.961 0 004.42-2.07A4.953 4.953 0 0017 14zm-7-2a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      case 'crystal':
         return (
          <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 8.5l10 13.5L22 8.5L12 2z" />
          </svg>
        );
        case 'settings':
        case 'gear':
         return (
            <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
         );
        case 'scale':
        case 'balance':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m15-1l-3 1M6 7h12M6 7l-3 7h18l-3-7M9 14v5m6-5v5M3 18h18" />
                </svg>
            );
        case 'building':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V10a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0H5" /><rect x="9" y="14" width="6" height="7" rx="1" strokeWidth="1.5"/>
                </svg>
            );
        case 'coin':
            return (
                 <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                 </svg>
            );
        case 'production':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7 7 7M12 3v12" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 18h14" />
                </svg>
            );
        case 'consumption':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7-7-7m7 7V9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 6h14" />
                </svg>
            );
        case 'pickaxe':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 21v-5.333a2 2 0 012-2h4a2 2 0 012 2V21m-6-6v6m0-18l6 6m-6-6L6 9" />
                </svg>
            );
        case 'hammer':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12l-8.5-8.5S2 8 8 14s6 4.5 6 4.5l8.5-8.5L15 12z" />
                </svg>
            );
        case 'sword':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 7.5l-4.5 4.5-4.5-4.5 4.5-4.5 4.5 4.5zM12 12v9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 21h6" />
                </svg>
            );
        case 'shield':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        case 'fabric':
             return (
                 <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
            );
        case 'potion':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 2h6v2H9V2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v7.5c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-2.21-1.79-4-4-4V4z" />
                </svg>
            );
        case 'book':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            );
        case 'grain':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 5c-3 5-3 9 0 14m-8-14c-3 5-3 9 0 14M4 5c3 5 3 9 0 14" />
                </svg>
            );
        case 'scroll':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 6v14a2 2 0 002 2h14a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m4 0h2a2 2 0 002-2V2M8 6H6a2 2 0 01-2-2V2" />
                </svg>
            );
      case 'search':
            return (
                <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            );
      case 'view-grid':
          return (
              <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
          );
      case 'view-list':
          return (
            <svg className={iconClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          );
      default:
        // Use emoji as a fallback
        return <span className={iconClassName} style={{fontSize: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{name}</span>;
    }
  };

  if (asEmblem && seed) {
    const { tailwind } = getColorForSeed(seed);
    const { bg, border } = tailwind;
    const emblemBaseClasses = 'rounded-full flex items-center justify-center p-1 shadow-lg border-2';
    // The icon content inside an emblem should be smaller and a contrasting color.
    const iconInEmblemClasses = 'w-full h-full text-white'; 
    return (
      <div className={`${className} ${emblemBaseClasses} ${bg} ${border}`}>
        {renderIconContent(iconInEmblemClasses)}
      </div>
    );
  }

  return renderIconContent(className);
};

export default Icon;
