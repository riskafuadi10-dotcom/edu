import React from 'react';
import { PlayerState } from '../types';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { Sparkles, Compass, Trees, Play } from 'lucide-react';
import { playSound } from '../utils/sound';

interface OpeningScreenProps {
  player: PlayerState;
  onStart: () => void;
  onResume?: () => void;
  onOpenTeacherPortal: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  player,
  onStart,
  onResume,
  onOpenTeacherPortal,
}) => {
  const handleStart = () => {
    playSound('success', player.soundEnabled);
    onStart();
  };

  const handleResume = () => {
    playSound('click', player.soundEnabled);
    if (onResume) onResume();
  };

  return (
    <div
      id="opening-screen"
      className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 flex flex-col justify-between select-none"
    >
      {/* Decorative Sky Elements: Sun, Clouds, Birds */}
      <div className="absolute top-6 left-8 sm:left-16 w-20 h-20 sm:w-28 sm:h-28 bg-amber-300 rounded-full blur-xs opacity-90 shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-pulse" />
      <div className="absolute top-12 left-1/4 bg-white/80 rounded-full w-28 h-10 blur-xs" />
      <div className="absolute top-8 right-1/4 bg-white/70 rounded-full w-36 h-12 blur-xs" />
      <div className="absolute top-20 right-12 bg-white/80 rounded-full w-24 h-8 blur-xs" />

      {/* Top Bar for Teacher Portal */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 pt-4 flex justify-end">
        <button
          id="btn-ruang-guru-portal"
          onClick={() => {
            playSound('click', player.soundEnabled);
            onOpenTeacherPortal();
          }}
          className="bg-indigo-900/90 hover:bg-indigo-950 text-indigo-100 hover:text-white border-2 border-indigo-400/50 shadow-lg px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-base sm:text-lg">👩‍🏫</span>
          <span>RUANG GURU (Dashboard)</span>
        </button>
      </div>

      {/* Main Content Card Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 pt-10 sm:pt-16 pb-8 flex flex-col items-center text-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border-2 border-emerald-400 text-emerald-800 font-bold px-4 py-1.5 rounded-full shadow-md text-xs sm:text-sm mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Game Edukasi Interaktif SD / MI</span>
        </div>

        {/* Big Game Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-emerald-900 tracking-tight font-['Fredoka',sans-serif] drop-shadow-[0_4px_10px_rgba(6,78,59,0.2)]">
          <span className="text-amber-500">EDU</span>
          <span className="text-emerald-700">VERSE</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl font-extrabold text-amber-800 mt-2 sm:mt-3 tracking-wide drop-shadow-xs">
          “Petualangan Belajar Tanpa Batas”
        </p>

        {/* Cheerful Characters Welcome Preview */}
        <div className="flex items-end justify-center gap-6 sm:gap-14 my-6 sm:my-8">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-white/90 rounded-3xl border-2 border-rose-300 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
              <CharacterAvatar
                type="female_hijab"
                size="xl"
                interactive
                showGreetingOnClick
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-rose-950 mt-1.5 bg-rose-100/90 border border-rose-300 px-3 py-0.5 rounded-full shadow-xs">
              🌸 Alya (Muslimah Cilik)
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-2 bg-white/90 rounded-3xl border-2 border-emerald-300 shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <CharacterAvatar
                type="male"
                size="xl"
                interactive
                showGreetingOnClick
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-emerald-950 mt-1.5 bg-emerald-100/90 border border-emerald-300 px-3 py-0.5 rounded-full shadow-xs">
              🧭 Rafi (Muslim Penjelajah)
            </span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full max-w-sm flex flex-col items-center gap-3">
          <button
            id="btn-mulai-petualangan"
            onClick={handleStart}
            className="w-full group relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xl sm:text-2xl py-4 sm:py-5 px-8 rounded-3xl shadow-[0_8px_0_#9a3412,0_15px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_#9a3412,0_8px_10px_rgba(0,0,0,0.2)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all cursor-pointer font-['Fredoka',sans-serif] flex items-center justify-center gap-3"
          >
            <span className="text-2xl sm:text-3xl animate-pulse">🚀</span>
            <span>MULAI PETUALANGAN</span>
          </button>

          {/* Continue button if player has existing save */}
          {player.hasStarted && player.name && (
            <button
              onClick={handleResume}
              className="w-full bg-white/90 hover:bg-white text-emerald-800 font-extrabold text-sm sm:text-base py-2.5 px-6 rounded-2xl border-2 border-emerald-400 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Lanjutkan Petualangan ({player.name})</span>
            </button>
          )}

          {/* Tagline */}
          <p className="text-sm sm:text-base font-extrabold text-emerald-900/80 mt-2 tracking-wide flex items-center justify-center gap-2">
            <span>Belajar</span>
            <span className="text-amber-600">•</span>
            <span>Bermain</span>
            <span className="text-amber-600">•</span>
            <span>Menjelajah</span>
          </p>
        </div>
      </div>

      {/* Decorative Bottom Nature Landscape: Grass hills, trees, pathways */}
      <div className="relative w-full h-36 sm:h-52 overflow-hidden pointer-events-none">
        {/* Back Hill */}
        <div className="absolute -bottom-10 -left-10 w-[120%] h-48 bg-emerald-500 rounded-[50%] opacity-70 transform -rotate-1" />
        {/* Front Hill */}
        <div className="absolute -bottom-8 -left-20 w-[130%] h-44 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-[45%]" />
        
        {/* Winding Pathway */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-full opacity-90 border-t-4 border-amber-300" />

        {/* Tree Silhouettes */}
        <div className="absolute bottom-4 left-6 sm:left-16 text-3xl sm:text-5xl">🌲</div>
        <div className="absolute bottom-6 left-16 sm:left-32 text-2xl sm:text-4xl">🌳</div>
        <div className="absolute bottom-4 right-8 sm:right-20 text-3xl sm:text-5xl">🌳</div>
        <div className="absolute bottom-7 right-20 sm:right-36 text-2xl sm:text-4xl">🌲</div>

        {/* Flowers & Grass Tufts */}
        <div className="absolute bottom-2 left-1/3 text-lg">🌺</div>
        <div className="absolute bottom-3 right-1/3 text-lg">🌼</div>
        <div className="absolute bottom-1 left-1/4 text-base">🌿</div>
        <div className="absolute bottom-1 right-1/4 text-base">🌿</div>
      </div>
    </div>
  );
};
