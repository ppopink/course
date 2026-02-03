
import React, { useMemo } from 'react';
import { GradingResult, Level } from '../types';

interface FeedbackPanelProps {
  result: GradingResult;
  level: Level;
  onNext: () => void;
  isLastLevel: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ result, level, onNext, isLastLevel }) => {
  const { success, feedback, explanation } = result;

  // 粒子特效数据
  const particles = useMemo(() => {
    return Array.from({ length: success ? 100 : 50 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 1400,
      rotate: Math.random() * 1080,
      scale: Math.random() * 2 + 0.5,
      color: success 
        ? ['#58cc02', '#1cb0f6', '#ffcf33', '#ff4b4b', '#ce82ff'][i % 5]
        : ['#64748b', '#334155', '#1e293b', '#475569'][i % 4], // 失败时使用深浅灰烬
      delay: Math.random() * 0.3
    }));
  }, [success]);

  return (
    <div className={`fixed inset-0 z-[3000] flex items-center justify-center p-4 overflow-hidden ${!success ? 'animate-shake-extreme' : ''}`}>
      {/* 1. 背景遮罩 */}
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-2xl animate-in fade-in duration-700" />
      
      {/* 2. 反馈卡片主体 (中层 z-10) */}
      <div className={`
        relative z-10 w-full max-w-sm bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500
        border-b-[12px] ${success ? 'border-[#58cc02]' : 'border-rose-600'}
      `}>
        <div className="p-8 flex flex-col items-center text-center">
          <div className="text-8xl mb-6 transform transition-transform duration-500 hover:rotate-12 drop-shadow-2xl">
            {success ? '🔮' : '🧪'}
          </div>
          
          <h4 className={`text-4xl font-black mb-4 fredoka ${success ? 'text-[#58cc02]' : 'text-rose-600'}`}>
            {success ? '完美契约！' : '实验炸膛！'}
          </h4>
          
          <div className={`
            w-full py-6 px-7 rounded-[32px] mb-6 font-bold text-xl leading-relaxed shadow-inner
            ${success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800 border-2 border-rose-100'}
          `}>
            {feedback}
          </div>

          {explanation && (
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[35px] p-6 mb-8 w-full text-left relative">
              <span className={`
                absolute -top-3 left-8 px-5 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-md
                ${success ? 'bg-[#58cc02]' : 'bg-rose-500'}
              `}>
                {success ? '真理解析' : '导师谏言'}
              </span>
              <p className="text-slate-600 font-bold leading-relaxed text-sm pt-2 italic">
                {explanation}
              </p>
            </div>
          )}

          <button 
            onClick={onNext}
            className={`
              w-full duo-btn px-10 py-5 text-2xl font-black text-white
              ${success ? 'duo-btn-green' : 'bg-rose-600 border-rose-800 shadow-[0_6px_0_#9f1239]'}
            `}
          >
            {success ? (isLastLevel ? "荣耀而归" : "继续冒险") : "重新校准"}
          </button>
        </div>
      </div>

      {/* 3. 粒子特效层 (最顶层: z-[100]) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[100]">
        {success ? (
          particles.map(p => (
            <div 
              key={p.id}
              className="absolute animate-confetti"
              style={{
                width: `${12 * p.scale}px`,
                height: `${12 * p.scale}px`,
                backgroundColor: p.color,
                borderRadius: p.id % 3 === 0 ? '50%' : '3px',
                '--tw-translate-x': `${p.x}px`,
                '--tw-translate-y': `${p.y}px`,
                '--tw-rotate': `${p.rotate}deg`,
                animationDelay: `${p.delay}s`,
                boxShadow: `0 0 10px ${p.color}88`
              } as any}
            />
          ))
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
             {/* 核心强力烟雾 - 叠加多层以增强厚度 */}
             <div className="absolute w-[300px] h-[300px] bg-slate-200 rounded-full animate-explosion-smoke blur-3xl opacity-100 mix-blend-screen" />
             <div className="absolute w-[250px] h-[250px] bg-purple-400 rounded-full animate-explosion-smoke blur-2xl opacity-70" style={{ animationDelay: '0.05s' }} />
             <div className="absolute w-[200px] h-[200px] bg-slate-600 rounded-full animate-explosion-smoke blur-xl opacity-80" style={{ animationDelay: '0.1s' }} />
             
             {/* 爆炸瞬间的白色闪光 */}
             <div className="absolute w-full h-full bg-white animate-in fade-out-0 duration-300 opacity-20" />

             {/* 飞出的灰烬粒子 */}
             {particles.map(p => (
                <div 
                  key={p.id}
                  className="absolute bg-slate-800 animate-confetti border border-slate-600"
                  style={{
                    width: `${6 * p.scale}px`,
                    height: `${6 * p.scale}px`,
                    borderRadius: '2px',
                    '--tw-translate-x': `${p.x * 0.8}px`,
                    '--tw-translate-y': `${p.y * 0.8}px`,
                    '--tw-rotate': `${p.rotate}deg`,
                    animationDelay: `${p.delay}s`,
                    opacity: 0.9
                  } as any}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;
