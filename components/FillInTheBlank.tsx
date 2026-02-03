
import React from 'react';

interface FillInTheBlankProps {
  template: string;
  placeholders: string[];
  values: string[];
  onChange: (index: number, value: string) => void;
  disabled: boolean;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ template, placeholders, values, onChange, disabled }) => {
  // 正则匹配占位符，例如 {{0}}, {{1}}
  const placeholderRegex = /\{\{(\d+)\}\}/g;
  
  // 计算输入框宽度的辅助函数，对中文字符增加权重
  const calculateWidth = (val: string, placeholder: string) => {
    const text = val || placeholder;
    // 简单估算：非 ASCII 字符（如中文）占 2 个单位，ASCII 占 1.1 个单位
    let len = 0;
    for (let i = 0; i < text.length; i++) {
      len += text.charCodeAt(i) > 127 ? 2.2 : 1.1;
    }
    return `${Math.max(len + 2, 4)}ch`;
  };

  // 将模板按行拆分，以保持代码的垂直结构
  const lines = template.split('\n');
  let placeholderCount = 0;

  return (
    <div className="bg-[#1e293b] border-2 border-[#334155] rounded-3xl p-6 md:p-8 shadow-inner overflow-x-auto">
      <div className="flex flex-col gap-3 font-mono text-[15px] md:text-base leading-relaxed text-[#cbd5e1]">
        {lines.map((line, lineIdx) => {
          const parts = line.split(placeholderRegex);
          // parts 的结构大致为 [text, placeholderIndex, text, placeholderIndex, ...]
          
          return (
            <div key={lineIdx} className="flex flex-wrap items-center min-h-[2.5rem]">
              {parts.map((part, partIdx) => {
                // 如果是占位符索引（正则捕获组的内容）
                if (partIdx % 2 === 1) {
                  const currentIdx = placeholderCount++;
                  const placeholderText = placeholders[currentIdx] || '';
                  const currentValue = values[currentIdx] || '';

                  return (
                    <input
                      key={currentIdx}
                      type="text"
                      value={currentValue}
                      onChange={(e) => onChange(currentIdx, e.target.value)}
                      disabled={disabled}
                      placeholder={placeholderText}
                      style={{ width: calculateWidth(currentValue, placeholderText) }}
                      className={`
                        mx-1.5 px-3 py-1.5 border-2 bg-[#0f172a] rounded-xl text-[#1cb0f6] font-bold 
                        focus:outline-none transition-all placeholder-[#475569] text-center
                        ${disabled ? 'border-[#334155] text-slate-500' : 'border-[#334155] focus:border-[#1cb0f6] shadow-sm'}
                      `}
                    />
                  );
                }
                // 普通文本
                return (
                  <span key={partIdx} className="whitespace-pre">
                    {part}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FillInTheBlank;
