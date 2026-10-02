import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  RefreshCw,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Award,
  Timer,
  Share2,
  ChefHat,
  BookmarkCheck,
} from 'lucide-react';
import { DetectedIngredient, Recipe } from '../types';

interface ResultsViewProps {
  ingredients: DetectedIngredient[];
  recipes: Recipe[];
  kiasuScore: number;
  savedCount: number;
  singlish: boolean;
  onRemoveIngredient: (id: string) => void;
  onAddIngredient: (name: string, category: string) => void;
  onRegenerate: () => void;
  onReset: () => void;
  isRegenerating: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  ingredients,
  recipes,
  kiasuScore,
  savedCount,
  singlish,
  onRemoveIngredient,
  onAddIngredient,
  onRegenerate,
  onReset,
  isRegenerating,
}) => {
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(recipes[0]?.id || null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, DetectedIngredient[]>);

  const toggleRecipeExpand = (id: string) => {
    setExpandedRecipeId((prev) => (prev === id ? null : id));
  };

  const toggleStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;
    onAddIngredient(newIngredientName.trim(), 'Pantry & Condiments');
    setNewIngredientName('');
    setShowAddForm(false);
  };

  const handleShare = () => {
    const summary = `🍳 Kiasu Chef Cookout!\nI saved ${savedCount} fridge items with Kiasu Score ${kiasuScore}%!\nMenu:\n${recipes
      .map((r) => `• ${r.emoji} ${r.title} (${r.cook_time_minutes} mins)`)
      .join('\n')}\nDon't waste food lah!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const getShiokLabel = (rating: number) => {
    if (singlish) {
      switch (rating) {
        case 1:
          return 'Sian';
        case 2:
          return 'Okay lah';
        case 3:
          return 'Can lah';
        case 4:
          return 'Steady poon pee pee';
        case 5:
        default:
          return 'Shiok!';
      }
    } else {
      switch (rating) {
        case 1:
          return 'Basic';
        case 2:
          return 'Simple';
        case 3:
          return 'Good';
        case 4:
          return 'Very Good';
        case 5:
        default:
          return 'Shiok!';
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* 1. Kiasu Score Header Card */}
      <div className="w-full rounded-2xl bg-gradient-to-br from-[#2F5938] to-[#1E3B24] text-white p-5 shadow-lg border border-[#21432A] relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 header-tile-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Circular Gauge / Badge */}
            <div className="relative w-18 h-18 rounded-2xl bg-white/10 backdrop-blur-xs border-2 border-white/30 flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
              <span className="text-2xl font-black font-display text-[#FFE082] leading-none">
                {kiasuScore}%
              </span>
              <span className="text-[10px] tracking-wider uppercase text-white/80 font-bold mt-1">
                Kiasu
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-bold tracking-wide uppercase">
                  {singlish ? 'Auntie Rating' : 'Food Waste Metric'}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {kiasuScore >= 80 ? '🏆 Maximum Value!' : kiasuScore >= 50 ? '👍 Solid Savings!' : '💪 Keep going!'}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                {singlish ? `You saved ${savedCount} items from the bin!` : `You saved ${savedCount} items from the bin!`}
              </h2>
              <p className="text-xs text-white/75 mt-0.5">
                {singlish
                  ? 'All 3 recipes below use up your expiring ingredients, zero waste!'
                  : '3 tailored recipes designed to minimize kitchen waste.'}
              </p>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-xs font-semibold text-white border border-white/20 self-stretch sm:self-center justify-center cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedNotification ? (singlish ? 'Copied liao!' : 'Copied!') : (singlish ? 'Share Score' : 'Share')}</span>
          </button>
        </div>
      </div>

      {/* 2. Detected Ingredients ("Wah, what we found") */}
      <div className="w-full rounded-2xl bg-white border border-[#E2D5C7] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="fridge">🧊</span>
            <div>
              <h2 className="font-display font-bold text-lg text-[#382415]">
                {singlish ? 'Wah, what we found' : 'What we found'}
              </h2>
              <p className="text-xs text-[#7A6251]">
                {singlish
                  ? 'Click "X" if auntie got it wrong, or tap "+ Add" for your own items!'
                  : 'Remove any inaccurate items or add pantry staples.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#F3ECE0] text-[#2F5938] border border-[#D8C7B5] transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{singlish ? '+ Add Item' : '+ Add'}</span>
          </button>
        </div>

        {/* Inline Add Item Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="mb-4 p-3 rounded-xl bg-[#FAF6EF] border border-[#D8C7B5] flex gap-2">
            <input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder={singlish ? 'e.g. 2 eggs, dark soy sauce, garlic...' : 'e.g. Eggs, Soy Sauce, Garlic...'}
              className="flex-1 text-xs px-3 py-2 rounded-lg bg-white border border-[#D0C0B0] text-[#382415] focus:outline-none focus:border-[#2F5938]"
              autoFocus
            />
            <button
              type="submit"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-[#2F5938] text-white hover:bg-[#25462C] cursor-pointer"
            >
              {singlish ? 'Add Lah' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs px-2.5 py-2 rounded-lg bg-transparent text-[#7A6251] hover:text-[#382415]"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Grouped Ingredient Chips */}
        <div className="space-y-3">
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <div key={category} className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#A08C7C] uppercase tracking-wider">
                {category} ({items.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {items.map((ing) => (
                  <span
                    key={ing.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF6EF] border border-[#DCCEC0] text-[#382415] hover:border-[#D32F2F]/50 transition-colors shadow-2xs"
                  >
                    <span className="font-semibold">{ing.name}</span>
                    <span className="text-[10px] text-[#8C7565]">({ing.quantity_estimate})</span>
                    <button
                      onClick={() => onRemoveIngredient(ing.id)}
                      className="w-4 h-4 rounded-full hover:bg-[#E53935] hover:text-white flex items-center justify-center transition-colors text-[#A08C7C] ml-0.5 cursor-pointer"
                      title={`Remove ${ing.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}

          {ingredients.length === 0 && (
            <div className="text-center py-4 text-xs text-[#A08C7C]">
              {singlish ? 'No ingredients left! Add some items above.' : 'No ingredients in list. Please add some above.'}
            </div>
          )}
        </div>

        {/* Regenerate Action Banner below chips */}
        <div className="mt-4 pt-3 border-t border-[#EFE5D8] flex items-center justify-between">
          <span className="text-xs text-[#7A6251]">
            {singlish ? 'Edited your list? Auntie can rethink:' : 'Updated ingredients? Recalculate recipes:'}
          </span>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating || ingredients.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F5938] hover:bg-[#25462C] disabled:opacity-50 text-white text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? (singlish ? 'Cooking...' : 'Generating...') : (singlish ? 'Cook Again Lah' : 'Cook Again')}</span>
          </button>
        </div>
      </div>

      {/* 3. Three Recipe Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-bold text-xl text-[#382415]">
            {singlish ? "Auntie's 3 Shiok Dishes" : 'Suggested Recipes (3)'}
          </h2>
          <span className="text-xs text-[#7A6251] font-medium">
            {singlish ? 'Tap cards to see full steps' : 'Tap to expand cooking steps'}
          </span>
        </div>

        {recipes.map((recipe, index) => {
          const isExpanded = expandedRecipeId === recipe.id;

          return (
            <div
              key={recipe.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm bg-white ${
                isExpanded ? 'border-[#2F5938] ring-1 ring-[#2F5938]/30 shadow-md' : 'border-[#E2D5C7] hover:border-[#2F5938]/60'
              }`}
            >
              {/* Card Header Summary */}
              <div
                onClick={() => toggleRecipeExpand(recipe.id)}
                className="p-5 cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF6EF] border border-[#D8C7B5] flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                      {recipe.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2F5938]">
                          Recipe #{index + 1}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF6EF] text-[#6A4E38] border border-[#D8C7B5]">
                          {recipe.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-[#382415] mt-1 leading-snug">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    className="w-8 h-8 rounded-full bg-[#FAF6EF] hover:bg-[#F3ECE0] flex items-center justify-center text-[#7A6251] flex-shrink-0 transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Key Metrics: Time, Calories, Shiok Rating */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#F5EFE6] text-xs text-[#6A4E38]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{recipe.cook_time_minutes} mins</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-semibold">
                    <Flame className="w-3.5 h-3.5 text-[#D32F2F]" />
                    <span>~{recipe.calories_estimate} kcal</span>
                  </div>

                  {/* 1-5 Chilli Rating */}
                  <div className="flex items-center gap-1 ml-auto">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`text-sm select-none transition-transform ${
                            level <= recipe.shiok_rating ? 'opacity-100 scale-105' : 'opacity-20 grayscale'
                          }`}
                        >
                          🌶️
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-[#D32F2F] text-xs">
                      {getShiokLabel(recipe.shiok_rating)}
                    </span>
                  </div>
                </div>

                {/* Ingredients Used preview */}
                <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-[#2F5938] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Uses:
                  </span>
                  {recipe.ingredients_used.slice(0, 4).map((ing, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B5E20]"
                    >
                      {ing}
                    </span>
                  ))}
                  {recipe.ingredients_used.length > 4 && (
                    <span className="text-[10px] text-[#7A6251]">
                      +{recipe.ingredients_used.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable Section: Steps, Ingredients & Auntie Tip */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#EFE5D8] bg-[#FAF8F5] space-y-4 animate-in fade-in duration-200">
                  {/* Auntie's Chef Tip in Kopitiam Speech Bubble */}
                  <div className="rounded-xl bg-[#FFF8E1] border border-[#FFE082] p-3.5 shadow-2xs relative">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F57F17] text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
                        👩🏻‍🍳
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#D84315] uppercase tracking-wide">
                          {singlish ? "Auntie's Chef Tip:" : "Chef's Tip:"}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-[#4E342E] mt-0.5 leading-relaxed">
                          "{recipe.chef_tip}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Missing / Required Pantry Staples */}
                  {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8DEC8]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309] mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{singlish ? 'Pantry items you might need:' : 'Pantry staples needed:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.missing_ingredients.map((miss, mIdx) => (
                          <span
                            key={mIdx}
                            className="text-xs px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                          >
                            {miss}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step-by-Step Cooking Instructions with Checkboxes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-[#382415]">
                        {singlish ? 'How to Cook (Step-by-Step):' : 'Cooking Instructions:'}
                      </h4>
                      <span className="text-[11px] text-[#7A6251]">
                        Check off as you cook
                      </span>
                    </div>

                    <div className="space-y-2">
                      {recipe.steps.map((step, sIdx) => {
                        const stepKey = `${recipe.id}-step-${sIdx}`;
                        const isDone = !!checkedSteps[stepKey];

                        return (
                          <label
                            key={sIdx}
                            onClick={() => toggleStep(stepKey)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              isDone
                                ? 'bg-[#E8F5E9]/60 border-[#C8E6C9] text-[#7A6251]'
                                : 'bg-white border-[#E2D5C7] text-[#382415] hover:border-[#2F5938]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="mt-0.5 w-4 h-4 rounded text-[#2F5938] focus:ring-[#2F5938] cursor-pointer"
                            />
                            <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                              <span className="font-bold mr-1.5 text-[#2F5938]">
                                Step {sIdx + 1}.
                              </span>
                              <span className={isDone ? 'line-through opacity-70' : ''}>
                                {step}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Sticky Mobile Floating Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#FAF6EF]/95 backdrop-blur-md border-t border-[#D8C7B5] p-3 shadow-lg z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating || ingredients.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2F5938] hover:bg-[#25462C] disabled:opacity-50 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? (singlish ? 'Auntie is cooking...' : 'Cooking...') : (singlish ? 'Cook Again Lah' : 'Cook Again')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#D8C7B5] bg-white hover:bg-[#F3ECE0] text-[#382415] font-semibold text-sm active:scale-98 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#D32F2F]" />
            <span className="hidden sm:inline">{singlish ? 'Snap Another Fridge' : 'New Photo'}</span>
            <span className="sm:hidden">{singlish ? 'Snap' : 'New'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
