import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, Eye, ChefHat } from 'lucide-react';

interface ScanningViewProps {
  imagePreview: string;
  singlish: boolean;
}

const SINGLISH_MESSAGES = [
  "Checking what's expiring lah...",
  "Auntie is peeking into your fridge...",
  "Aiyo, so many sauces...",
  "Wah lau, why got only one egg?",
  "Chope-ing the best recipe...",
  "Sniffing for sambal belacan...",
  "Calculating the highest Kiasu Score...",
];

const ENGLISH_MESSAGES = [
  "Checking what's expiring soon...",
  "Scanning your fridge shelves...",
  "Taking inventory of sauces and condiments...",
  "Checking egg and protein inventory...",
  "Selecting the best Singapore home recipes...",
  "Optimising ingredient combinations...",
  "Calculating your food waste savings...",
];

export const ScanningView: React.FC<ScanningViewProps> = ({
  imagePreview,
  singlish,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = singlish ? SINGLISH_MESSAGES : ENGLISH_MESSAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
      {/* Scanner Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#2F5938]/30 text-[#1B5E20] text-xs font-semibold mb-4 animate-pulse">
        <Scan className="w-3.5 h-3.5" />
        <span>{singlish ? 'Auntie AI Vision Active' : 'Analysing Fridge Contents...'}</span>
      </div>

      <h2 className="font-display font-extrabold text-2xl text-[#382415] mb-2 text-center">
        {singlish ? 'Scanning your fridge...' : 'Analyzing Your Fridge...'}
      </h2>
      <p className="text-xs text-[#7A6251] mb-5 text-center">
        {singlish
          ? 'Hold tight, auntie is identifying every single item!'
          : 'Detecting vegetables, proteins, eggs, and sauces...'}
      </p>

      {/* Image Container with Scanning HUD and Laser */}
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-3 border-[#2F5938] shadow-xl bg-[#212121]">
        {/* The User's Image */}
        <img
          src={imagePreview}
          alt="Fridge Scan"
          className="w-full h-full object-cover opacity-90 filter contrast-105"
        />

        {/* Dark Vignette Overlay for Sci-Fi / Auntie HUD */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Animated Laser Sweep Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E53935] to-transparent shadow-[0_0_15px_#E53935] animate-laser-sweep z-20 pointer-events-none" />

        {/* Secondary Green Grid Radar Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-[#43A047] opacity-60 animate-laser-sweep [animation-delay:1.2s] z-10 pointer-events-none" />

        {/* Viewfinder Target Corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#E53935] rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#E53935] rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#E53935] rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#E53935] rounded-br-sm pointer-events-none" />

        {/* Floating Mock Detection HUD Pins */}
        <div className="absolute top-1/4 left-1/5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-[#43A047] shadow-sm flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#43A047]" />
          <span>[VEG_DETECTED]</span>
        </div>
        <div className="absolute bottom-1/3 right-1/4 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-[#D32F2F] shadow-sm flex items-center gap-1 animate-pulse [animation-delay:0.8s]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]" />
          <span>[PROTEIN_SCAN]</span>
        </div>
        <div className="absolute top-1/2 right-1/6 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-[#F59E0B] shadow-sm flex items-center gap-1 animate-pulse [animation-delay:1.5s]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>[CONDIMENT]</span>
        </div>

        {/* Bottom Status Ticker inside image */}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between text-[11px] text-white/90 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
            AI Multimodal v2.5
          </span>
          <span className="text-[#81C784]">CONFIDENCE: 98.4%</span>
        </div>
      </div>

      {/* Rotating Auntie Singlish Loading Message Card */}
      <div className="w-full mt-6 bg-white rounded-2xl border border-[#D8C7B5] p-4 shadow-md flex items-center gap-3.5 transition-all">
        <div className="w-12 h-12 rounded-xl bg-[#2F5938] text-white flex items-center justify-center flex-shrink-0 text-2xl shadow-inner">
          👩🏻‍🍳
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-bold tracking-wide uppercase text-[#D32F2F]">
              {singlish ? 'Auntie is thinking...' : 'Chef Auntie Status'}
            </span>
            <span className="text-[10px] text-[#A08C7C]">
              {messageIndex + 1}/{messages.length}
            </span>
          </div>
          <p className="font-display font-bold text-base sm:text-lg text-[#382415] leading-snug transition-all duration-300">
            "{messages[messageIndex]}"
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full bg-[#E8DEC8] h-2 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#2F5938] via-[#D32F2F] to-[#2F5938] animate-[shimmer_2s_infinite] w-full rounded-full" />
        </div>
        <span className="text-[11px] text-[#7A6251] mt-2">
          {singlish ? 'Brewing recipes, please wait a while...' : 'Extracting recipes tailored to your ingredients...'}
        </span>
      </div>
    </div>
  );
};
