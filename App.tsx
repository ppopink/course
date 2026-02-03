
import React, { useState, useEffect } from 'react';
import { GameState, Language, Level, GradingResult, LanguageProgress } from './types';
import { LEVELS } from './constants';
import { gradeCode, getHint } from './geminiService';
import LevelSelector from './components/LevelSelector';
import DepartmentSelector from './components/DepartmentSelector';
import OptionSelector from './components/OptionSelector';
import FillInTheBlank from './components/FillInTheBlank';
import FeedbackPanel from './components/FeedbackPanel';

const initialProgress: LanguageProgress = {
  completedLevels: [],
  unlockedLevelId: 1,
  score: 0
};

type ViewType = 'home' | 'dashboard' | 'editor' | 'notes' | 'profile';

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'dashboard', icon: '🧗', label: '闯关' },
  { id: 'notes', icon: '📜', label: '笔记' },
  { id: 'profile', icon: '🛡️', label: '我的' }
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('python-quest-tree-v4');
    return saved ? JSON.parse(saved) : {
      currentLanguage: null,
      progress: {
        [Language.PYTHON]: { ...initialProgress },
        [Language.C]: { ...initialProgress },
        [Language.JAVA]: { ...initialProgress }
      }
    };
  });

  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [fillValues, setFillValues] = useState<string[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('home');

  useEffect(() => {
    localStorage.setItem('python-quest-tree-v4', JSON.stringify(gameState));
  }, [gameState]);

  const currentLang = gameState.currentLanguage;
  const currentLevels = currentLang ? LEVELS[currentLang] : [];
  const currentLevel = currentLevels.length > 0 
    ? (currentLevels.find(l => l.id === currentLevelId) || currentLevels[0])
    : null;

  useEffect(() => {
    if (currentLevel) {
      setSelectedOptionIndex(null);
      setFillValues(currentLevel.type === 'fill' ? new Array(currentLevel.placeholders?.length || 0).fill('') : []);
      setResult(null);
      setHint(null);
    }
  }, [currentLevelId, currentLang]);

  const handleLanguageSelect = (lang: Language) => {
    setGameState(prev => {
      const newState = { ...prev, currentLanguage: lang };
      const langProg = newState.progress[lang];
      setCurrentLevelId(langProg.completedLevels.length > 0 
        ? Math.min(langProg.unlockedLevelId, LEVELS[lang].length) 
        : 1
      );
      return newState;
    });
    setView('dashboard');
  };

  const constructFinalCode = (): string => {
    if (!currentLevel) return "";
    if (currentLevel.type === 'choice') {
      return selectedOptionIndex !== null ? currentLevel.options![selectedOptionIndex] : "";
    } else {
      let finalCode = currentLevel.template || "";
      fillValues.forEach((val, i) => {
        finalCode = finalCode.replace(`{{${i}}}`, val || "___");
      });
      return finalCode;
    }
  };

  const handleSubmit = async () => {
    if (!currentLevel || !currentLang) return;
    const codeToSubmit = constructFinalCode();
    setIsGrading(true);
    setResult(null);

    const gradingResult = await gradeCode(currentLevel, codeToSubmit, currentLang);
    setResult(gradingResult);
    setIsGrading(false);

    if (gradingResult.success) {
      setGameState(prev => {
        const langProg = prev.progress[currentLang];
        const isNewCompletion = !langProg.completedLevels.includes(currentLevel.id);
        const newScore = isNewCompletion ? langProg.score + currentLevel.points : langProg.score;
        const newCompleted = isNewCompletion ? [...langProg.completedLevels, currentLevel.id] : langProg.completedLevels;
        const nextLevelId = Math.max(langProg.unlockedLevelId, currentLevel.id + 1);
        
        return {
          ...prev,
          progress: {
            ...prev.progress,
            [currentLang]: {
              ...langProg,
              completedLevels: newCompleted,
              score: newScore,
              unlockedLevelId: Math.min(nextLevelId, currentLevels.length)
            }
          }
        };
      });
    }
  };

  const handleNextLevel = () => {
    if (!result) return;
    if (result.success) {
      if (currentLevelId < currentLevels.length) {
        setCurrentLevelId(id => id + 1);
        setResult(null);
      } else {
        setView('dashboard');
      }
    } else {
      setResult(null);
    }
  };

  const totalScore = (Object.values(gameState.progress) as LanguageProgress[]).reduce((acc, curr) => acc + curr.score, 0);

  const getRank = (score: number, lang: Language | null) => {
    if (score < 30) return "初入江湖";
    if (score < 100) {
        if (lang === Language.PYTHON) return "魔法见习生";
        if (lang === Language.C) return "炼金学徒";
        if (lang === Language.JAVA) return "见习工头";
        return "进阶玩家";
    }
    if (score < 250) {
        if (lang === Language.PYTHON) return "元素使者";
        if (lang === Language.C) return "真理探寻者";
        if (lang === Language.JAVA) return "高级建造师";
        return "精英导师";
    }
    if (lang === Language.PYTHON) return "大召唤师";
    if (lang === Language.C) return "真理炼金师";
    if (lang === Language.JAVA) return "帝国建筑师";
    return "宗师级";
  };

  const progressData = {
    [Language.PYTHON]: {
        completed: gameState.progress[Language.PYTHON].completedLevels.length,
        total: LEVELS[Language.PYTHON].length
    },
    [Language.C]: {
        completed: gameState.progress[Language.C].completedLevels.length,
        total: LEVELS[Language.C].length
    },
    [Language.JAVA]: {
        completed: gameState.progress[Language.JAVA].completedLevels.length,
        total: LEVELS[Language.JAVA].length
    }
  };

  const activeNavIndex = NAV_ITEMS.findIndex(item => item.id === view);

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <DepartmentSelector onSelect={handleLanguageSelect} progress={progressData} />;
      case 'dashboard':
        return (
          <div className="w-full pb-20">
            <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md rounded-3xl mb-6">
                <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-700 font-bold text-sm hover:text-slate-900 transition-colors">
                    <span>←</span> 返回首页
                </button>
                <span className="font-black text-slate-800">{currentLang} 路径</span>
            </div>
            {currentLang && currentLevels.length > 0 ? (
              <LevelSelector 
                levels={currentLevels} 
                gameState={gameState.progress[currentLang]}
                language={currentLang}
                onSelect={(id) => { setCurrentLevelId(id); setView('editor'); }} 
              />
            ) : (
                <div className="flex flex-col items-center justify-center p-20 opacity-40">
                    <span className="text-8xl mb-4">🚧</span>
                    <p className="text-xl font-black">修行路径开发中</p>
                    <button onClick={() => setView('home')} className="mt-6 text-blue-500 font-bold underline">返回圣殿</button>
                </div>
            )}
          </div>
        );
      case 'editor':
        if (!currentLevel) return null;
        return (
          <div className="max-w-2xl mx-auto w-full px-6 py-6 flex flex-col h-screen bg-white shadow-2xl relative z-[1000]">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setView('dashboard')} className="text-3xl text-slate-300 hover:text-slate-600">✕</button>
                <div className="flex-1 duo-progress h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#58cc02] to-emerald-400 transition-all duration-700" style={{ width: `${(currentLevelId / currentLevels.length) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex gap-4 items-start mb-4">
                    <div className="text-5xl animate-bounce">
                        {currentLang === Language.PYTHON ? '🔮' : currentLang === Language.C ? '⚙️' : '🏰'}
                    </div>
                    <div className="bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 relative">
                        <div className="absolute -left-3 top-6 w-5 h-5 bg-slate-50 border-l-4 border-b-4 border-slate-100 rotate-45"></div>
                        <p className="text-slate-700 text-xl font-black leading-tight">{currentLevel.instruction}</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6 overflow-y-auto px-1">
                    {currentLevel.type === 'choice' ? (
                        <OptionSelector options={currentLevel.options || []} selectedIndex={selectedOptionIndex} onSelect={setSelectedOptionIndex} disabled={isGrading} />
                    ) : (
                        <FillInTheBlank template={currentLevel.template || ""} placeholders={currentLevel.placeholders || []} values={fillValues} onChange={(idx, val) => { const newValues = [...fillValues]; newValues[idx] = val; setFillValues(newValues); }} disabled={isGrading} />
                    )}
                </div>
            </div>

            <div className="mt-auto pt-6 pb-12 flex gap-4">
                <button onClick={async () => setHint(await getHint(currentLevel, constructFinalCode(), currentLang!))} className="px-8 py-3 rounded-2xl border-2 border-slate-200 text-slate-400 font-black hover:bg-slate-50">
                    💡 提示
                </button>
                <button onClick={handleSubmit} disabled={isGrading || (currentLevel.type === 'choice' ? selectedOptionIndex === null : fillValues.some(v => !v.trim()))} className={`flex-1 py-4 rounded-2xl text-xl font-black text-white shadow-[0_6px_0_#2d5a27] active:shadow-none active:translate-y-1 transition-all ${isGrading ? 'bg-slate-300 shadow-none' : 'bg-[#58cc02]'}`}>
                    {isGrading ? "检查中..." : "提交鉴定"}
                </button>
            </div>

            {result && <FeedbackPanel result={result} level={currentLevel} onNext={handleNextLevel} isLastLevel={currentLevelId === currentLevels.length} />}
            {hint && !result && (
                <div className="fixed bottom-36 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl shadow-xl z-[2000] animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-amber-800 text-sm font-bold">圣殿指示：{hint}</p>
                    <button onClick={() => setHint(null)} className="absolute top-2 right-2 text-amber-500">✕</button>
                </div>
            )}
          </div>
        );
      case 'notes':
        return (
          <div className="max-w-2xl mx-auto w-full px-6 py-4 pb-40">
            <h2 className="text-3xl font-black text-slate-800 mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-3xl inline-block">圣殿笔记 📜</h2>
            <div className="space-y-6">
              {currentLang && LEVELS[currentLang].map(l => {
                const isLearned = gameState.progress[currentLang].completedLevels.length >= l.id;
                if (!isLearned && !gameState.progress[currentLang].completedLevels.includes(l.id)) return null;
                // Correct logic: show if completed
                 if (!gameState.progress[currentLang].completedLevels.includes(l.id)) return null;
                return (
                  <div key={l.id} className="bg-white p-6 rounded-[32px] border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full opacity-20" style={{ backgroundColor: currentLang === Language.PYTHON ? '#1cb0f6' : '#58cc02' }}></div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">✨</span>
                      <h3 className="font-black text-lg text-slate-700">{l.title} (归类: {l.topic})</h3>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">{l.description}</p>
                    <div className="bg-slate-900 rounded-2xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner">
                        {l.template?.replace(/\{\{\d+\}\}/g, l.placeholders?.[0] || '...')}
                    </div>
                  </div>
                );
              })}
              {(!currentLang || gameState.progress[currentLang].completedLevels.length === 0) && (
                <div className="text-center py-20 opacity-40">
                    <span className="text-6xl block mb-4">📓</span>
                    <p className="font-bold">你还没有解锁任何真理，快去闯关吧！</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-md mx-auto w-full px-6 py-4 pb-40">
            <div className="bg-white rounded-[40px] p-8 border-2 border-slate-100 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#58cc02]/10 rounded-bl-[100px]"></div>
                <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg">🛡️</div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">{getRank(gameState.progress[currentLang || Language.PYTHON].score, currentLang)}</h2>
                        <p className="text-[#58cc02] font-black uppercase text-xs tracking-widest">
                            {currentLang ? `${currentLang} 修行中` : '等待宿命开启'}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-3xl">
                        <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Total XP</span>
                        <span className="text-2xl font-black text-slate-800">{totalScore}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl">
                        <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Completed</span>
                        <span className="text-2xl font-black text-slate-800">
                            {(Object.values(gameState.progress) as LanguageProgress[]).reduce((a, c) => a + c.completedLevels.length, 0)}
                        </span>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-6 ml-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl inline-block">修行进度</h3>
            <div className="space-y-4">
                {(Object.entries(gameState.progress) as [Language, LanguageProgress][]).map(([lang, prog]) => {
                    const total = LEVELS[lang as Language].length;
                    if (total === 0) return null;
                    const percent = Math.round((prog.completedLevels.length / total) * 100);
                    const icon = lang === Language.PYTHON ? '🔮' : lang === Language.C ? '⚙️' : '🏰';
                    return (
                        <div key={lang} className="bg-white px-6 py-5 rounded-3xl border-2 border-slate-50 flex items-center gap-4">
                            <span className="text-2xl">{icon}</span>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-black text-slate-700 text-sm">{lang}</span>
                                    <span className="font-bold text-slate-400 text-xs">{percent}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#58cc02]" style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#58cc02]/30">
      {view !== 'editor' && (
        <div className="max-w-md mx-auto w-full px-6 pt-6 pb-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
                 <span className="text-2xl">🌱</span>
                 <h1 className="text-xl font-black text-[#58cc02] tracking-wide fredoka">不学编程</h1>
             </div>
             <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
                 <span className="text-amber-400">⭐</span>
                 <span className="font-black text-white">{totalScore}</span>
             </div>
        </div>
      )}

      <main className="flex-1">
        {renderContent()}
      </main>

      {view !== 'editor' && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3c3c3c] h-18 rounded-[30px] flex items-center p-1.5 z-[100] w-[90%] max-sm max-w-sm shadow-2xl overflow-hidden">
            <div 
                className="absolute h-[calc(100%-12px)] bg-[#58cc02] rounded-[24px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-inner"
                style={{ 
                    width: `calc((100% - 12px) / 4)`, 
                    left: `calc(6px + (100% - 12px) / 4 * ${activeNavIndex >= 0 ? activeNavIndex : 0})`,
                    zIndex: 1
                }}
            />
            
            {NAV_ITEMS.map((item) => {
                const isActive = view === item.id;
                return (
                <button 
                    key={item.id} 
                    onClick={() => setView(item.id as ViewType)} 
                    className="relative flex-1 flex flex-col items-center justify-center transition-all h-full z-10"
                >
                    <span className={`text-2xl transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'opacity-40 grayscale'}`}>
                        {item.icon}
                    </span>
                    <span className={`text-[10px] font-black mt-1 transition-all duration-300 ${isActive ? 'text-white scale-100 opacity-100' : 'text-white/40 scale-90 opacity-0 h-0 overflow-hidden'}`}>
                        {item.label}
                    </span>
                </button>
                );
            })}
        </nav>
      )}
    </div>
  );
};

export default App;
