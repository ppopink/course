
import React from 'react';
import { Language } from '../types';

interface ProgressInfo {
  completed: number;
  total: number;
}

interface DepartmentSelectorProps {
  onSelect: (lang: Language) => void;
  progress: Record<Language, ProgressInfo>;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ onSelect, progress }) => {
  const departments = [
    { 
      lang: Language.PYTHON, 
      title: "Python 大召唤师", 
      desc: "简洁即是正义。通过强大的库和简洁的语法，你将学会如何用最少的代码实现最强大的功能。", 
      icon: "🔮", 
      color: "bg-gradient-to-br from-[#1cb0f6] to-[#007fb1]",
      shadow: "shadow-[0_10px_0_#1899d6]",
      accent: "bg-[#ddf4ff]",
      text: "text-[#1cb0f6]",
      barColor: "bg-[#1cb0f6]",
      btnStyle: {
        bg: "bg-[#1cb0f6]",
        border: "border-[#1899d6]",
        shadow: "shadow-[0_6px_0_#1899d6]"
      }
    },
    { 
      lang: Language.C, 
      title: "C 语言炼金术师", 
      desc: "欢迎来到真理之门。这里没有捷径，你必须亲手操控内存，在底层逻辑中炼化出极致的性能。", 
      icon: "⚙️", 
      color: "bg-gradient-to-br from-[#58cc02] to-[#46a302]",
      shadow: "shadow-[0_10px_0_#46a302]",
      accent: "bg-[#d7ffb8]",
      text: "text-[#58cc02]",
      barColor: "bg-[#58cc02]",
      btnStyle: {
        bg: "bg-[#58cc02]",
        border: "border-[#46a302]",
        shadow: "shadow-[0_6px_0_#46a302]"
      }
    },
    { 
      lang: Language.JAVA, 
      title: "Java 帝国建筑师", 
      desc: "规范、严谨、永恒。在城堡蓝图的指引下，构建属于你的庞大系统，掌握面向对象的终极奥义。", 
      icon: "🏰", 
      color: "bg-gradient-to-br from-[#ff4b4b] to-[#d33131]",
      shadow: "shadow-[0_10px_0_#d33131]",
      accent: "bg-[#ffdbdb]",
      text: "text-[#ff4b4b]",
      barColor: "bg-[#ff4b4b]",
      btnStyle: {
        bg: "bg-[#ff4b4b]",
        border: "border-[#d33131]",
        shadow: "shadow-[0_6px_0_#d33131]"
      }
    }
  ];

  return (
    <div className="max-w-md mx-auto w-full pt-8 px-6 flex flex-col gap-10 pb-40">
      {/* 首页英雄卡片 - 星空风格重制 */}
      <div className="relative w-full rounded-[40px] p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-[0_0_40px_rgba(79,70,229,0.3)] group hover:scale-[1.02] transition-transform duration-500">
        <div className="bg-[#0f1623]/90 backdrop-blur-xl rounded-[38px] px-8 py-6 relative overflow-hidden h-full">
            {/* 内部光效 */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-600/30 blur-[60px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-600/30 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 py-2">
                <h2 className="text-4xl font-black fredoka mb-2 leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    攀登<br/>编程巅峰
                </h2>
                <p className="font-bold text-slate-400 text-sm max-w-[65%] leading-relaxed">
                    选择你的宿命，<br/>开启代码冒险！
                </p>
            </div>

            {/* 3D 浮动元素 - 火箭 */}
            <div className="absolute right-2 bottom-1 text-[6rem] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform rotate-[-12deg] group-hover:rotate-0 transition-transform duration-700">
                🚀
            </div>
            
            {/* 装饰性星点 */}
            <div className="absolute top-6 right-8 text-indigo-200/60 text-xl animate-ping" style={{ animationDuration: '3s' }}>✦</div>
            <div className="absolute bottom-24 left-1/2 text-purple-200/40 text-sm">★</div>
            
            {/* 底部高光条 */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {departments.map((dept) => {
          const prog = progress[dept.lang];
          const percentage = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
          const hasStarted = prog.completed > 0;
          
          return (
            <div 
              key={dept.lang}
              onClick={() => onSelect(dept.lang)}
              className={`group cursor-pointer bg-white border-2 border-slate-100 rounded-[40px] p-8 transition-all hover:scale-[1.01] active:scale-[0.99] ${dept.shadow}`}
            >
              <div className="flex items-center gap-6 mb-6">
                  <div className={`w-24 h-24 ${dept.color} rounded-[28px] flex items-center justify-center text-5xl shadow-xl transform group-hover:rotate-3 transition-transform`}>
                      {dept.icon}
                  </div>
                  <div className="flex-1">
                      <h3 className="text-2xl font-black text-[#1e293b] fredoka leading-tight">{dept.title}</h3>
                      <div className="flex items-center gap-1 mt-2">
                          <span className="text-amber-400 text-lg">★★★★★</span>
                      </div>
                  </div>
              </div>
              
              <p className="text-slate-600 font-bold text-base mb-8 leading-relaxed">
                  {dept.desc}
              </p>

              <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                      <div className={`${dept.accent} ${dept.text} px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest`}>
                          修行进度: {prog.completed} / {prog.total}
                      </div>
                      <span className="text-xs font-black text-slate-400">{percentage}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                      <div 
                        className={`h-full ${dept.barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                  </div>
              </div>

              <div className="flex items-center justify-end">
                  <button className={`
                    duo-btn px-10 py-4 text-base text-white border-2 border-b-4
                    ${dept.btnStyle.bg} ${dept.btnStyle.border} ${dept.btnStyle.shadow}
                    active:shadow-none active:translate-y-[2px] transition-all
                  `}>
                      {hasStarted ? '继续冒险' : '开始冒险'}
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentSelector;
