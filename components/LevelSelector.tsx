
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Level, LanguageProgress, Language } from '../types';

interface LevelSelectorProps {
  levels: Level[];
  gameState: LanguageProgress;
  language: Language;
  onSelect: (id: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, gameState, language, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<{id: number, x: number, y: number}[]>([]);
  const [containerHeight, setContainerHeight] = useState(2000);

  // Sort levels
  const sortedLevels = useMemo(() => [...levels].sort((a, b) => a.id - b.id), [levels]);

  // Generate diverse particles - Flowing, NOT tumbling
  const particles = useMemo(() => {
    // Language specific symbols
    const BASE_SYMBOLS = ['{}', '[]', '()', ';', '&&', '||', '=>', '!', '==', '0x', '++'];
    const LANG_SYMBOLS = {
      [Language.PYTHON]: ['def', 'self', 'None', 'elif', 'pass', 'import', 'print', 'len', '@', 'f""'],
      [Language.C]: ['int', 'void', 'char*', 'malloc', 'free', '->', 'struct', '#include', 'NULL', '&'],
      [Language.JAVA]: ['class', 'new', 'super', 'final', 'this', 'extends', 'try', 'null', '@Override']
    }[language] || ['0', '1'];

    const ALL_SYMBOLS = [...BASE_SYMBOLS, ...LANG_SYMBOLS];

    return Array.from({ length: 60 }).map((_, i) => {
      const isStar = Math.random() < 0.3; // 30% stars
      
      return {
        id: i,
        type: isStar ? 'star' : 'text',
        char: isStar ? '' : ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)],
        // Speed variation creates the "collision/overtaking" illusion
        duration: 15 + Math.random() * 30, 
        delay: -(Math.random() * 50), 
        size: isStar ? (3 + Math.random() * 6) : (10 + Math.random() * 12), 
        opacity: 0.2 + Math.random() * 0.6,
        // Spread them out across the pipe width
        // Range within the 140px pipe
        offset: (Math.random() - 0.5) * 90, 
        // Sway parameters for fluid motion
        swayDuration: 3 + Math.random() * 4,
        swayAmp: 10 + Math.random() * 20,
      };
    });
  }, [language]);

  // Auto-scroll to active level
  useEffect(() => {
    const scrollToActive = () => {
      const activeId = Math.min(gameState.unlockedLevelId, levels.length);
      const activeEl = document.getElementById(`node-${activeId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };
    const timer = setTimeout(scrollToActive, 500);
    return () => clearTimeout(timer);
  }, [levels, gameState.unlockedLevelId]);

  // Calculate curve positions - More winding
  const getXOffset = (index: number) => {
    // High winding factor
    return Math.sin(index * 0.9) * 80; 
  };

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const positions = sortedLevels.map(l => {
        const el = document.getElementById(`node-${l.id}`);
        if (el && containerRef.current) {
          const rect = el.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          return {
            id: l.id,
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top,
          };
        }
        return null;
      }).filter(Boolean) as {id: number, x: number, y: number}[];
      
      setNodePositions(positions);
      setContainerHeight(containerRef.current.scrollHeight);
    };

    const timer = setTimeout(updatePositions, 300);
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [sortedLevels]);

  const pathData = useMemo(() => {
    if (nodePositions.length < 2) return "";
    const sortedPoints = [...nodePositions].sort((a, b) => a.id - b.id);
    let d = `M ${sortedPoints[0].x} ${sortedPoints[0].y}`;
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const p0 = sortedPoints[i];
      const p1 = sortedPoints[i + 1];
      const cp1x = p0.x;
      const cp1y = p0.y - (p0.y - p1.y) * 0.5;
      const cp2x = p1.x;
      const cp2y = p1.y + (p0.y - p1.y) * 0.5;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    const last = sortedPoints[sortedPoints.length - 1];
    d += ` L ${last.x} ${last.y - 120}`;
    return d;
  }, [nodePositions]);

  return (
    <div ref={containerRef} className="map-container w-full max-w-lg mx-auto overflow-visible relative">
      <svg 
        className="trunk-svg" 
        style={{ height: containerHeight, zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="coreLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>

          {/* Soft outer glow for the pipe */}
          <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g>
            {/* 1. Outer Shadow/Glow (The Aura) */}
            <path 
              d={pathData} 
              fill="none" 
              stroke={language === Language.PYTHON ? "#1e3a8a" : "#334155"} 
              strokeOpacity="0.3"
              strokeWidth="160" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              filter="url(#pipe-glow)"
            />

            {/* 2. The Pipe Shell (Dark Border) */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="#020617" 
              strokeWidth="140" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />

            {/* 3. The Inner Void (Content) - FILLING THE GAP */}
            {/* Increased from 120 to 134 to almost touch the 140 shell */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="#0f172a" 
              strokeWidth="134" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />

             {/* 4. Full Body Glass Highlight */}
             {/* Wide stroke to fill the tube with "white/gray" tint */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeWidth="130" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* 5. The Grid/Skeleton */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="130" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeDasharray="1 30" 
            />

            {/* 6. Specular Highlight (The shiny center ridge) */}
             <path 
              d={pathData} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="60" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* 7. Core Center Beam */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="url(#coreLight)" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ mixBlendMode: 'screen' }}
            />
        </g>

        {/* 7. Particles - Fluid Motion, No Tumbling */}
        {nodePositions.length > 0 && particles.map((p) => {
           // Text/Star common styles
           const color = language === Language.PYTHON ? '#93c5fd' : language === Language.JAVA ? '#fca5a5' : '#86efac';
           
           return (
             <g key={p.id}>
                {/* The main movement container along the path */}
                <g>
                    <animateMotion 
                        dur={`${p.duration}s`} 
                        repeatCount="indefinite" 
                        begin={`${p.delay}s`}
                        rotate="auto" // Keeps them aligned with path direction roughly
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                    >
                        <mpath href="#path-guide" />
                    </animateMotion>

                    {/* The "Fluid Sway" - Sine wave perpendicular to movement */}
                    {/* And the fixed offset from center */}
                    <g>
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values={`0 ${p.offset - p.swayAmp}; 0 ${p.offset + p.swayAmp}; 0 ${p.offset - p.swayAmp}`}
                            dur={`${p.swayDuration}s`}
                            repeatCount="indefinite"
                        />
                        
                        {/* The Actual Element */}
                        {p.type === 'star' ? (
                            <circle
                                r={p.size / 2}
                                fill="#fff"
                                opacity={p.opacity}
                                filter="url(#pipe-glow)"
                            />
                        ) : (
                            <text
                                fontSize={p.size}
                                fill={color}
                                opacity={p.opacity}
                                fontFamily="Fira Code, monospace"
                                fontWeight="500"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ 
                                    textShadow: `0 0 5px ${color}`,
                                    userSelect: 'none'
                                }}
                            >
                                {p.char}
                                {/* Breathing effect */}
                                <animate 
                                    attributeName="opacity" 
                                    values={`${p.opacity};${Math.min(1, p.opacity * 1.5)};${p.opacity}`} 
                                    dur={`${2 + Math.random() * 2}s`} 
                                    repeatCount="indefinite" 
                                />
                            </text>
                        )}
                    </g>
                </g>
             </g>
           );
        })}
        
        <defs>
            <path id="path-guide" d={pathData} />
        </defs>

      </svg>

      <div className="flex flex-col-reverse items-center w-full relative z-10 pb-20 pt-20">
        {sortedLevels.map((level, index) => {
            const isUnlocked = level.id <= gameState.unlockedLevelId;
            const isCompleted = gameState.completedLevels.includes(level.id);
            const isCurrent = isUnlocked && !isCompleted;
            const showChapter = index === 0 || sortedLevels[index-1].chapterId !== level.chapterId;
            const xOffset = getXOffset(index);

            return (
            <React.Fragment key={level.id}>
                {showChapter && (
                <div className="chapter-flag">
                    <div className="chapter-title tracking-wider">
                        {level.chapterTitle}
                    </div>
                </div>
                )}

                <div 
                    className="relative node-group" 
                    style={{ transform: `translateX(${xOffset}px)` }}
                >
                  {/* Floating elements for 3D feel */}
                  {isCurrent && (
                     <>
                        <div className="absolute -top-24 w-1 h-20 bg-gradient-to-t from-blue-500 to-transparent opacity-50 left-1/2 -translate-x-1/2"></div>
                        
                        <div className="star-sparkle-container">
                            <svg className="star-shape star-main" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C12 0 15 9 24 12C15 15 12 24 12 24C12 24 9 15 0 12C9 9 12 0 12 0Z" />
                            </svg>
                            <svg className="star-shape star-small" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C12 0 15 9 24 12C15 15 12 24 12 24C12 24 9 15 0 12C9 9 12 0 12 0Z" />
                            </svg>
                            <div className="star-shape star-dot"></div>
                        </div>
                     </>
                  )}

                  <div 
                      id={`node-${level.id}`}
                      onClick={() => isUnlocked && onSelect(level.id)}
                      className={`
                      map-node
                      ${level.isBoss ? 'scale-125' : ''}
                      ${isCompleted ? 'node-completed' : isUnlocked ? 'node-unlocked' : 'node-locked'}
                      `}
                  >
                      <div className="flex items-center justify-center font-black relative z-10">
                      {isCompleted ? (
                          <span className="text-3xl drop-shadow-md filter brightness-110">⭐</span>
                      ) : isUnlocked ? (
                           level.isBoss ? <span className="text-4xl drop-shadow-md">👑</span> : <span className="text-2xl fredoka text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{level.id}</span>
                      ) : (
                          <span className="text-2xl opacity-50">🔒</span>
                      )}
                      </div>
                      
                      {isCurrent && (
                        <div className="absolute -bottom-10 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg animate-bounce border border-blue-400 whitespace-nowrap z-20">
                            START
                        </div>
                      )}
                  </div>
                
                  <div 
                      className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-opacity duration-300
                        ${xOffset > 0 ? 'right-[110%] pr-4' : 'left-[110%] pl-4'}
                      `}
                  >
                      <div className={`node-label ${!isUnlocked ? 'opacity-40' : 'opacity-100'}`}>
                          <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-0.5 whitespace-nowrap">{level.topic}</div>
                          <div className="font-bold text-sm text-white node-title-clamp">{level.title}</div>
                      </div>
                  </div>
                </div>
            </React.Fragment>
            );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
