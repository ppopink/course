
import React from 'react';

interface OptionSelectorProps {
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedIndex, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          disabled={disabled}
          onClick={() => onSelect(index)}
          className={`
            w-full text-left p-5 rounded-2xl border-2 transition-all active:scale-[0.98]
            ${selectedIndex === index 
              ? 'border-[#1cb0f6] bg-[#ddf4ff] shadow-[0_4px_0_#1899d6]' 
              : 'border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] shadow-[0_4px_0_#e5e5e5]'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex gap-4 items-center">
            <div className={`
              w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-sm border-2
              ${selectedIndex === index ? 'bg-[#1cb0f6] border-[#1899d6] text-white' : 'border-[#e5e5e5] text-[#afafaf]'}
            `}>
              {index + 1}
            </div>
            <code className="text-sm font-mono text-[#4b4b4b] bg-black/5 px-2 py-1 rounded">
              {option}
            </code>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
