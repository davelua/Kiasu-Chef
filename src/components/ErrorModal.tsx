import React from 'react';
import { AlertCircle, Camera, RefreshCw, Sparkles, X } from 'lucide-react';
import { SAMPLE_FRIDGES } from '../data/sampleFridges';

interface ErrorModalProps {
  error: string;
  errorCode?: 'NO_FOOD_DETECTED' | 'IMAGE_BLURRY' | 'API_ERROR' | 'UNKNOWN';
  singlish: boolean;
  onRetry: () => void;
  onReset: () => void;
  onTrySample: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  error,
  errorCode = 'UNKNOWN',
  singlish,
  onRetry,
  onReset,
  onTrySample,
}) => {
  const getSinglishTitle = () => {
    switch (errorCode) {
      case 'NO_FOOD_DETECTED':
        return 'Aiyo, no food leh!';
      case 'IMAGE_BLURRY':
        return 'Wah lau eh, so blur!';
      case 'API_ERROR':
      default:
        return 'Wah lau, server sleeping!';
    }
  };

  const getEnglishTitle = () => {
    switch (errorCode) {
      case 'NO_FOOD_DETECTED':
        return 'No Food Detected';
      case 'IMAGE_BLURRY':
        return 'Photo Too Blurry';
      case 'API_ERROR':
      default:
        return 'Connection Failed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#D8C7B5] p-5 shadow-2xl text-center space-y-4 relative animate-in zoom-in-95">
        {/* Dismiss corner button */}
        <button
          onClick={onReset}
          className="absolute top-3 right-3 text-[#A08C7C] hover:text-[#382415] p-1 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Auntie Emoji in Circle */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFEBEE] border-2 border-[#D32F2F] flex items-center justify-center text-3xl shadow-inner">
          {errorCode === 'IMAGE_BLURRY' ? '🔍' : errorCode === 'NO_FOOD_DETECTED' ? '🧐' : '😴'}
        </div>

        <div>
          <h3 className="font-display font-extrabold text-xl text-[#382415]">
            {singlish ? getSinglishTitle() : getEnglishTitle()}
          </h3>
          <p className="text-xs sm:text-sm text-[#6A4E38] mt-1.5 leading-relaxed">
            {error}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{singlish ? 'Try Again Lah' : 'Try Again'}</span>
          </button>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D8C7B5] bg-[#FAF6EF] hover:bg-[#F3ECE0] text-[#382415] font-semibold text-xs active:scale-98 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#2F5938]" />
            <span>{singlish ? 'Snap Another Photo' : 'Choose Another Photo'}</span>
          </button>

          <button
            onClick={onTrySample}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-[#2F5938] hover:underline font-semibold py-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{singlish ? 'Or try with Auntie’s sample fridge' : 'Or try with sample fridge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
