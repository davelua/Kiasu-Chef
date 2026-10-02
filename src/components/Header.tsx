import React from 'react';
import { Camera } from 'lucide-react';

interface HeaderProps {
  singlish: boolean;
  onToggleSinglish: () => void;
  onReset: () => void;
  showReset: boolean;
}

// Crisp vector Singapore flag that renders consistently across all OS platforms
const SingaporeFlag: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <span className={`inline-block relative rounded-[2px] overflow-hidden shadow-2xs border border-black/15 flex-shrink-0 ${className}`}>
    <svg viewBox="0 0 36 24" className="w-full h-full block">
      {/* Red upper half */}
      <rect width="36" height="12" fill="#ED2939" />
      {/* White lower half */}
      <rect y="12" width="36" height="12" fill="#FFFFFF" />
      {/* Crescent moon */}
      <path
        d="M10.5 2.5 A4.5 4.5 0 1 0 10.5 10.5 A4.8 4.8 0 1 1 10.5 2.5 Z"
        fill="#FFFFFF"
      />
      {/* 5 stars */}
      <g fill="#FFFFFF">
        <polygon points="12.5,3.6 12.8,4.4 13.7,4.4 13.0,4.9 13.3,5.7 12.5,5.2 11.7,5.7 12.0,4.9 11.3,4.4 12.2,4.4" />
        <polygon points="14.3,5.0 14.6,5.8 15.5,5.8 14.8,6.3 15.1,7.1 14.3,6.6 13.5,7.1 13.8,6.3 13.1,5.8 14.0,5.8" />
        <polygon points="13.6,7.4 13.9,8.2 14.8,8.2 14.1,8.7 14.4,9.5 13.6,9.0 12.8,9.5 13.1,8.7 12.4,8.2 13.3,8.2" />
        <polygon points="11.2,7.4 11.5,8.2 12.4,8.2 11.7,8.7 12.0,9.5 11.2,9.0 10.4,9.5 10.7,8.7 10.0,8.2 10.9,8.2" />
        <polygon points="10.5,5.0 10.8,5.8 11.7,5.8 11.0,6.3 11.3,7.1 10.5,6.6 9.7,7.1 10.0,6.3 9.3,5.8 10.2,5.8" />
      </g>
    </svg>
  </span>
);

export const Header: React.FC<HeaderProps> = ({
  singlish,
  onToggleSinglish,
  onReset,
  showReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8C7B5] bg-[#FAF6EF]/95 backdrop-blur-md shadow-xs">
      {/* Decorative Singapore Kopitiam green tile stripe */}
      <div className="h-1.5 w-full header-tile-pattern border-b border-[#21432A]" />

      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
          aria-label="Kiasu Chef Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2F5938] text-white flex items-center justify-center shadow-md border border-[#21432A] group-hover:bg-[#25462C] transition-colors relative overflow-hidden">
            <span className="text-xl select-none" role="img" aria-label="wok">🍳</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-3.5 rounded-[2px] overflow-hidden shadow-xs border border-white flex items-center justify-center">
              <SingaporeFlag className="w-full h-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#382415] leading-none">
                Kiasu Chef
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E53935]/15 text-[#C62828] border border-[#E53935]/30 leading-none">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#7A6251] font-medium leading-tight mt-0.5">
              {singlish ? "Don't waste food lah" : 'Smart zero-waste cooking'}
            </p>
          </div>
        </button>

        {/* Controls: Reset & Singlish Toggle */}
        <div className="flex items-center gap-2">
          {showReset && (
            <button
              onClick={onReset}
              className="h-8.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 rounded-lg border border-[#D8C7B5] bg-white text-[#382415] hover:bg-[#F3ECE0] active:scale-95 transition-all shadow-xs cursor-pointer select-none leading-none"
              title={singlish ? 'Snap another fridge lah' : 'Snap another photo'}
            >
              <Camera className="w-3.5 h-3.5 text-[#D32F2F] flex-shrink-0" />
              <span className="hidden sm:inline">{singlish ? 'New Snap' : 'New Photo'}</span>
            </button>
          )}

          {/* Singlish toggle with pixel-perfect alignment */}
          <button
            onClick={onToggleSinglish}
            className={`h-8.5 inline-flex items-center justify-center gap-2 px-3 rounded-full text-xs font-semibold transition-all border shadow-xs cursor-pointer select-none active:scale-95 ${
              singlish
                ? 'bg-[#2F5938] text-white border-[#21432A] hover:bg-[#25462C]'
                : 'bg-white text-[#5C4535] border-[#D8C7B5] hover:bg-[#F3ECE0]'
            }`}
            title="Toggle between Singlish and Standard English"
            aria-pressed={singlish}
          >
            <div className="flex items-center justify-center flex-shrink-0">
              <SingaporeFlag className="w-4 h-2.5" />
            </div>
            <div className="flex items-center gap-1 leading-none">
              <span className="font-medium">Singlish:</span>
              <span className={`font-bold ${singlish ? 'text-[#FFE082]' : 'text-[#8C7565]'}`}>
                {singlish ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

