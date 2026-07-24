import type { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <div className={`bg-card border border-borderBase rounded-card p-4 ${className}`}>
    {children}
  </div>
);

export const MiniCard = ({ title, tag, children }: { title: string, tag?: ReactNode, children: ReactNode }) => (
  <div className="bg-card border border-borderBase rounded-card p-3.5 flex flex-col justify-between h-full">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-[12.5px] font-bold">{title}</h4>
      {tag && <span className="text-[10.5px] font-bold text-green">{tag}</span>}
    </div>
    {children}
  </div>
);

export const SegmentToggle = ({ options, active, onChange }: { options: string[], active: string, onChange: (val: string) => void }) => (
  <div className="flex bg-card border border-borderBase rounded-[14px] p-1 mb-4">
    {options.map(opt => (
      <span
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 text-center py-2 rounded-[10px] text-xs font-bold cursor-pointer transition-all duration-200 ${
          active === opt 
            ? 'bg-gradient-to-br from-purple to-violet text-white' 
            : 'text-textSec'
        }`}
      >
        {opt}
      </span>
    ))}
  </div>
);

export const HexAchievement = ({ number, title, gradient }: { number?: string | number, title: string, gradient: string }) => (
  <div className="flex flex-col items-center flex-shrink-0 w-[88px]">
    <div 
      className="w-16 h-16 mb-2 flex flex-col items-center justify-center"
      style={{
        clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
        background: gradient
      }}
    >
      <span className="text-xs font-extrabold text-white">{number}</span>
    </div>
    <span className="text-[11px] font-bold text-center">{title}</span>
  </div>
);
