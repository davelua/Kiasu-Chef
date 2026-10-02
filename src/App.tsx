import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ScanningView } from './components/ScanningView';
import { ResultsView } from './components/ResultsView';
import { ErrorModal } from './components/ErrorModal';
import { DetectedIngredient, Recipe } from './types';
import { SAMPLE_FRIDGES } from './data/sampleFridges';

export default function App() {
  const [singlish, setSinglish] = useState<boolean>(true);
  const [view, setView] = useState<'landing' | 'scanning' | 'results'>('landing');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [kiasuScore, setKiasuScore] = useState<number>(0);
  const [savedCount, setSavedCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<
    'NO_FOOD_DETECTED' | 'IMAGE_BLURRY' | 'API_ERROR' | 'UNKNOWN'
  >('UNKNOWN');

  // Trigger analysis with Gemini API
  const handleAnalyzeImage = async (imgData: string, mime: string) => {
    setImagePreview(imgData);
    setMimeType(mime);
    setView('scanning');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgData,
          mimeType: mime,
          singlish: singlish,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        let defaultMsg = singlish
          ? 'Wah lau, server sleeping. Try again lah.'
          : 'Server connection failed. Please try again.';

        if (data.errorCode === 'NO_FOOD_DETECTED') {
          defaultMsg = singlish
            ? 'Aiyo, no food leh. Try another photo?'
            : 'No food ingredients detected. Please try another photo.';
        } else if (data.errorCode === 'IMAGE_BLURRY') {
          defaultMsg = singlish
            ? 'Wah lau eh, so blur auntie cannot see! Try snapping again with more light lah.'
            : 'The photo is too blurry. Please try again with better lighting.';
        }

        setError(data.error || defaultMsg);
        setErrorCode(data.errorCode || 'API_ERROR');
        setView('landing');
        setIsLoading(false);
        return;
      }

      setIngredients(data.ingredients || []);
      setRecipes(data.recipes || []);
      setKiasuScore(data.kiasuScore || 0);
      setSavedCount(data.savedCount || 0);
      setView('results');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(
        singlish
          ? 'Wah lau, server sleeping. Try again lah.'
          : 'Server connection failed. Please check your network and try again.'
      );
      setErrorCode('API_ERROR');
      setView('landing');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove misdetected ingredient and recalculate
  const handleRemoveIngredient = (id: string) => {
    const updated = ingredients.filter((item) => item.id !== id);
    setIngredients(updated);

    // Recalculate kiasu score locally
    if (updated.length === 0) {
      setKiasuScore(0);
      setSavedCount(0);
      return;
    }

    const allNames = updated.map((i) => i.name.toLowerCase());
    const usedSet = new Set<string>();
    recipes.forEach((r) => {
      r.ingredients_used.forEach((u) => {
        const uLower = u.toLowerCase();
        const matched = allNames.find((n) => n.includes(uLower) || uLower.includes(n));
        if (matched) usedSet.add(matched);
      });
    });

    const newSaved = Math.min(usedSet.size, updated.length);
    const newScore = Math.min(100, Math.max(10, Math.round((newSaved / updated.length) * 100)));
    setSavedCount(newSaved);
    setKiasuScore(newScore);
  };

  // Add a new ingredient
  const handleAddIngredient = (name: string, category: string) => {
    const newIng: DetectedIngredient = {
      id: `manual-${Date.now()}`,
      name: name,
      quantity_estimate: '1 portion',
      category: category || 'Pantry & Condiments',
    };
    const updated = [...ingredients, newIng];
    setIngredients(updated);
  };

  // Regenerate recipes using modified ingredient list
  const handleRegenerate = async () => {
    if (ingredients.length === 0) return;
    setIsRegenerating(true);

    try {
      const response = await fetch('/api/regenerate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.map((i) => ({ name: i.name })),
          singlish: singlish,
        }),
      });

      const data = await response.json();
      if (data.success && data.recipes) {
        setRecipes(data.recipes);
        setKiasuScore(data.kiasuScore);
        setSavedCount(data.savedCount);
      } else {
        alert(data.error || (singlish ? 'Wah lau, failed to cook again. Try one more time!' : 'Failed to regenerate.'));
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      alert(singlish ? 'Wah lau, network error leh!' : 'Network error.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleReset = () => {
    setView('landing');
    setImagePreview('');
    setError(null);
  };

  const handleRetryLastImage = () => {
    if (imagePreview) {
      handleAnalyzeImage(imagePreview, mimeType);
    } else {
      setError(null);
    }
  };

  const handleTrySampleFridge = () => {
    const sample = SAMPLE_FRIDGES[0];
    handleAnalyzeImage(sample.imageUrl, 'image/svg+xml');
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#382415] flex flex-col font-sans selection:bg-[#E53935] selection:text-white">
      {/* Kopitiam Header */}
      <Header
        singlish={singlish}
        onToggleSinglish={() => setSinglish((prev) => !prev)}
        onReset={handleReset}
        showReset={view !== 'landing'}
      />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {view === 'landing' && (
          <LandingHero
            singlish={singlish}
            onImageSelected={handleAnalyzeImage}
            isLoading={isLoading}
          />
        )}

        {view === 'scanning' && (
          <ScanningView
            imagePreview={imagePreview}
            singlish={singlish}
          />
        )}

        {view === 'results' && (
          <ResultsView
            ingredients={ingredients}
            recipes={recipes}
            kiasuScore={kiasuScore}
            savedCount={savedCount}
            singlish={singlish}
            onRemoveIngredient={handleRemoveIngredient}
            onAddIngredient={handleAddIngredient}
            onRegenerate={handleRegenerate}
            onReset={handleReset}
            isRegenerating={isRegenerating}
          />
        )}
      </main>

      {/* Error Modal */}
      {error && (
        <ErrorModal
          error={error}
          errorCode={errorCode}
          singlish={singlish}
          onRetry={handleRetryLastImage}
          onReset={() => setError(null)}
          onTrySample={handleTrySampleFridge}
        />
      )}
    </div>
  );
}
