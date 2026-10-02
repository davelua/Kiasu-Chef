import React, { useRef, useState } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, Flame, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { SAMPLE_FRIDGES } from '../data/sampleFridges';
import { SampleFridge } from '../types';

interface LandingHeroProps {
  singlish: boolean;
  onImageSelected: (base64Image: string, mimeType: string) => void;
  isLoading: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  singlish,
  onImageSelected,
  isLoading,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(singlish ? 'Aiyo, please pick a real photo lah!' : 'Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleFridge) => {
    onImageSelected(sample.imageUrl, 'image/svg+xml');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#2F5938]/30 text-[#1B5E20] text-xs font-semibold mb-4 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#2F5938] animate-pulse" />
        <span>{singlish ? 'Auntie-Approved AI Scanner' : 'Zero-Waste Kitchen AI'}</span>
        <span className="text-[#382415]/40">•</span>
        <span>{singlish ? 'NTUC & Wet Market Ready' : 'Local Groceries Ready'}</span>
      </div>

      {/* Main Title & Tagline */}
      <div className="text-center mb-6">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#382415] tracking-tight leading-[1.1] mb-3">
          Kiasu Chef
        </h1>
        <p className="text-lg sm:text-xl font-medium text-[#6A4E38] max-w-md mx-auto leading-relaxed">
          {singlish ? (
            <>
              <span className="font-bold text-[#D32F2F]">Don't waste food lah.</span> Snap your fridge, we tell you what to cook.
            </>
          ) : (
            <>
              <span className="font-bold text-[#D32F2F]">Don't waste food.</span> Snap your fridge, we'll tell you what to cook.
            </>
          )}
        </p>
      </div>

      {/* Main Action Card / Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full rounded-2xl bg-white border-2 border-dashed p-6 text-center transition-all shadow-md relative overflow-hidden ${
          dragActive
            ? 'border-[#2F5938] bg-[#F1F8F2] scale-[1.01]'
            : 'border-[#D0C0B0] hover:border-[#2F5938]/60 bg-gradient-to-b from-white to-[#FDFBF7]'
        }`}
      >
        {/* Subtle decorative stamp */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-[#D32F2F]/20 flex items-center justify-center rotate-12 pointer-events-none select-none">
          <span className="text-[10px] font-bold text-[#D32F2F]/30 uppercase tracking-widest text-center">
            SHIOK<br />GUARANTEED
          </span>
        </div>

        <div className="flex flex-col items-center">
          {/* Big Camera Icon with Pulse */}
          <div className="w-18 h-18 rounded-2xl bg-[#D32F2F] text-white flex items-center justify-center shadow-lg shadow-[#D32F2F]/25 mb-4 group-hover:scale-105 transition-transform animate-pulse-glow">
            <Camera className="w-9 h-9 stroke-[2.2]" />
          </div>

          <h2 className="font-display font-bold text-xl text-[#382415] mb-1.5">
            {singlish ? 'Snap Your Fridge Now' : 'Photograph Your Fridge or Pantry'}
          </h2>
          <p className="text-xs text-[#7A6251] max-w-xs mb-5">
            {singlish
              ? 'Works with veggies, crisper box, condiments, taukwa, meats or open freezer shelf!'
              : 'Works with fresh produce, crisper drawers, sauces, proteins, or open pantry shelves.'}
          </p>

          {/* Primary Mobile Camera CTA */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-base shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>{singlish ? 'Snap Your Fridge' : 'Take Fridge Photo'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D8C7B5] bg-[#FAF6EF] hover:bg-[#F0E6D8] text-[#382415] font-semibold text-sm active:scale-98 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#6A4E38]" />
              <span>{singlish ? 'Upload Photo' : 'Upload File'}</span>
            </button>
          </div>

          <p className="text-[11px] text-[#A08C7C] mt-3">
            {singlish ? 'Drag & drop photo here also can lah' : 'Or drag and drop your photo here'}
          </p>
        </div>
      </div>

      {/* Sample Fridge Presets (Crucial for desktop & instant demo) */}
      <div className="w-full mt-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <h2 className="text-sm font-bold text-[#382415]">
              {singlish ? 'No photo handy? Try Auntie’s Fridge:' : 'Or try with a sample fridge:'}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-[#D32F2F]">1-Click Try</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {SAMPLE_FRIDGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isLoading}
              className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#E2D5C7] hover:border-[#2F5938] hover:shadow-md transition-all text-left group active:scale-99 cursor-pointer"
            >
              <div className="w-16 h-14 rounded-lg overflow-hidden border border-[#D8C7B5] bg-[#FAF6EF] flex-shrink-0 shadow-2xs relative">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-sm text-[#382415] truncate group-hover:text-[#2F5938]">
                    {sample.title}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] flex-shrink-0">
                    {sample.badge}
                  </span>
                </div>
                <p className="text-xs text-[#7A6251] truncate">
                  {sample.subtitle}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A08C7C] group-hover:text-[#2F5938] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Auntie Value Highlights */}
      <div className="w-full grid grid-cols-3 gap-2.5 mt-7 text-center">
        <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#E8DEC8] flex flex-col items-center shadow-2xs">
          <span className="text-2xl mb-1" role="img" aria-label="wok">🥘</span>
          <span className="text-xs font-bold text-[#382415]">
            {singlish ? 'Zi Char Flavour' : 'Authentic SG Dishes'}
          </span>
          <span className="text-[10px] text-[#7A6251]">
            {singlish ? 'Stir-fry, soup & rice' : 'Home-style recipes'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#E8DEC8] flex flex-col items-center shadow-2xs">
          <span className="text-2xl mb-1" role="img" aria-label="recycle">🥬</span>
          <span className="text-xs font-bold text-[#382415]">
            {singlish ? 'Zero Waste' : 'Save Money & Food'}
          </span>
          <span className="text-[10px] text-[#7A6251]">
            {singlish ? 'Clear your expiring items' : 'Reduce food waste'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#E8DEC8] flex flex-col items-center shadow-2xs">
          <span className="text-2xl mb-1" role="img" aria-label="chilli">🌶️</span>
          <span className="text-xs font-bold text-[#382415]">
            {singlish ? 'Shiok Tips' : 'Practical Tips'}
          </span>
          <span className="text-[10px] text-[#7A6251]">
            {singlish ? 'Auntie kitchen advice' : 'Simple clear steps'}
          </span>
        </div>
      </div>
    </div>
  );
};
