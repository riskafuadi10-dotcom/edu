import React, { useState } from 'react';
import { CharacterType, PlayerState } from '../types';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { Check, Sparkles, User, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/sound';

interface CharacterSelectScreenProps {
  player: PlayerState;
  onSaveCharacter: (name: string, character: CharacterType) => void;
  onBackToOpening?: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  player,
  onSaveCharacter,
  onBackToOpening,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>(
    player.character || 'female_hijab'
  );
  const [playerName, setPlayerName] = useState<string>(player.name || '');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSelectCharacter = (char: CharacterType) => {
    setSelectedCharacter(char);
    playSound('click', player.soundEnabled);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) {
      playSound('wrong', player.soundEnabled);
      setErrorMessage('Ayo tuliskan nama petualangmu terlebih dahulu!');
      return;
    }
    setErrorMessage('');
    playSound('complete', player.soundEnabled);
    onSaveCharacter(trimmed, selectedCharacter);
  };

  return (
    <div
      id="character-select-screen"
      className="min-h-screen w-full bg-gradient-to-b from-emerald-100 via-sky-100 to-amber-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none"
    >
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Top Rainbow Stripe */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400" />

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-full mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Persiapan Petualangan</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-800 font-['Fredoka',sans-serif]">
            SIAPA PETUALANGMU?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1.5 font-medium">
            Pilih petualangmu dan masukkan nama untuk menjelajahi Eduverse!
          </p>
        </div>

        {/* Character Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Karakter 1: 👧 Alya — perempuan berhijab */}
          <div
            onClick={() => handleSelectCharacter('female_hijab')}
            className={`cursor-pointer rounded-3xl p-5 sm:p-6 border-3 transition-all flex flex-col items-center relative ${
              selectedCharacter === 'female_hijab'
                ? 'bg-rose-50/90 border-rose-400 shadow-xl scale-102 ring-4 ring-rose-200'
                : 'bg-slate-50 border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
            }`}
          >
            {selectedCharacter === 'female_hijab' && (
              <span className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-md z-20">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}

            <div className="relative mb-3">
              <CharacterAvatar
                type="female_hijab"
                size="xl"
                interactive
                showGreetingOnClick
                isCelebrating={selectedCharacter === 'female_hijab'}
              />
            </div>

            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Alya
            </h3>
            <p className="text-xs text-rose-800 font-bold bg-rose-100/90 px-3 py-1 rounded-full mt-1 border border-rose-200">
              🌸 Muslimah Cilik Berhijab
            </p>
            <p className="text-[11px] text-slate-600 text-center font-medium mt-2 max-w-[220px]">
              Cerdas, teliti, dan penuh rasa ingin tahu tentang sains & alam semesta.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCharacter('female_hijab');
              }}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-xs ${
                selectedCharacter === 'female_hijab'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                  : 'bg-white hover:bg-rose-100 text-rose-700 border border-rose-300'
              }`}
            >
              {selectedCharacter === 'female_hijab' ? '✓ TERPILIH' : 'PILIH ALYA'}
            </button>
          </div>

          {/* Karakter 2: 👦 Rafi — laki-laki bersongkok */}
          <div
            onClick={() => handleSelectCharacter('male')}
            className={`cursor-pointer rounded-3xl p-5 sm:p-6 border-3 transition-all flex flex-col items-center relative ${
              selectedCharacter === 'male'
                ? 'bg-emerald-50/90 border-emerald-500 shadow-xl scale-102 ring-4 ring-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            {selectedCharacter === 'male' && (
              <span className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-md z-20">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}

            <div className="relative mb-3">
              <CharacterAvatar
                type="male"
                size="xl"
                interactive
                showGreetingOnClick
                isCelebrating={selectedCharacter === 'male'}
              />
            </div>

            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
              Rafi
            </h3>
            <p className="text-xs text-emerald-800 font-bold bg-emerald-100/90 px-3 py-1 rounded-full mt-1 border border-emerald-200">
              🧭 Muslim Penjelajah Cilik
            </p>
            <p className="text-[11px] text-slate-600 text-center font-medium mt-2 max-w-[220px]">
              Pemberani, aktif, gemar teka-teki logika dan petualangan di alam terbuka.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCharacter('male');
              }}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-xs ${
                selectedCharacter === 'male'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}
            >
              {selectedCharacter === 'male' ? '✓ TERPILIH' : 'PILIH RAFI'}
            </button>
          </div>
        </div>

        {/* Form: Nama Petualang */}
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label
              htmlFor="player-name-input"
              className="block text-sm sm:text-base font-black text-slate-800 mb-1.5 flex items-center gap-1.5 font-['Fredoka',sans-serif]"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>Siapa namamu, Petualang?</span>
            </label>
            <div className="relative">
              <input
                id="player-name-input"
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan nama..."
                maxLength={20}
                className="w-full text-base sm:text-lg font-bold px-4 py-3 sm:py-3.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-hidden bg-amber-50/50 text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                ✏️
              </span>
            </div>
            {errorMessage && (
              <p className="text-xs sm:text-sm font-bold text-rose-600 mt-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                ⚠️ {errorMessage}
              </p>
            )}
          </div>

          {/* Action Button: Lanjutkan */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {onBackToOpening && (
              <button
                type="button"
                onClick={onBackToOpening}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-sm"
              >
                ← Kembali
              </button>
            )}

            <button
              id="btn-lanjutkan-petualangan"
              type="submit"
              className="w-full flex-1 group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg sm:text-xl py-3.5 sm:py-4 px-6 rounded-2xl shadow-[0_6px_0_#065f46] hover:shadow-[0_3px_0_#065f46] hover:translate-y-0.5 active:translate-y-1.5 active:shadow-none transition-all cursor-pointer font-['Fredoka',sans-serif] flex items-center justify-center gap-2"
            >
              <span>🚀 LANJUTKAN PETUALANGAN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
