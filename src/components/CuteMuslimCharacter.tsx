import React, { useState, useEffect } from 'react';
import { CharacterType } from '../types';
import boyAvatarImg from '../assets/images/muslim_boy_cartoon_1790036724984.jpg';
import girlAvatarImg from '../assets/images/muslimah_girl_cartoon_1790036739303.jpg';
import { Sparkles, Heart, Compass, BookOpen } from 'lucide-react';
import { playSound } from '../utils/sound';

export interface CuteMuslimCharacterProps {
  type: CharacterType;
  variant?: 'mascot' | 'sprite' | 'showcase' | 'mini';
  isMoving?: boolean;
  isCelebrating?: boolean;
  actionMessage?: string;
  soundEnabled?: boolean;
  onCharacterClick?: () => void;
  className?: string;
}

const QUOTES_ALYA = [
  "Bismillah! Belajar adalah ibadah yang mulia 🌸",
  "Semangat ya! Setiap soal yang kita jawab menambah kepintaran! 📚",
  "Assalamu'alaikum temanku! Ayo jelajahi peta Eduverse! ✨",
  "Alhamdulillah, aku senang bisa belajar bersamamu hari ini! 💖",
];

const QUOTES_RAFI = [
  "Bismillah! Petualang hebat pantang menyerah! 🧭",
  "Siap mencari petunjuk rahasia dan kumpulkan XP! 🎯",
  "Assalamu'alaikum sahabat! Ilmu adalah kompas masa depan! 🌟",
  "Takbiiir! Hebat sekali jawabanmu tadi! 🚀",
];

export const CuteMuslimCharacter: React.FC<CuteMuslimCharacterProps> = ({
  type,
  variant = 'mascot',
  isMoving = false,
  isCelebrating = false,
  actionMessage,
  soundEnabled = true,
  onCharacterClick,
  className = '',
}) => {
  const isGirl = type === 'female_hijab';
  const avatarImg = isGirl ? girlAvatarImg : boyAvatarImg;
  const name = isGirl ? 'Alya' : 'Rafi';
  const role = isGirl ? 'Muslimah Cerdas & Ramah' : 'Muslim Penjelajah Pemberani';

  const [activeSpeech, setActiveSpeech] = useState<string>(actionMessage || '');
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (actionMessage) {
      setActiveSpeech(actionMessage);
    }
  }, [actionMessage]);

  const handleClick = () => {
    setIsJumping(true);
    playSound('click', soundEnabled);
    if (onCharacterClick) {
      onCharacterClick();
    }

    const quotes = isGirl ? QUOTES_ALYA : QUOTES_RAFI;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveSpeech(randomQuote);

    setTimeout(() => {
      setIsJumping(false);
    }, 1000);
  };

  // MINI SPRITE MODE (e.g. for moving pin on map)
  if (variant === 'sprite') {
    return (
      <div
        onClick={handleClick}
        className={`relative flex flex-col items-center cursor-pointer select-none ${className}`}
      >
        {/* Animated Speech / Target Bubble */}
        {activeSpeech && (
          <div className="absolute -top-12 z-30 bg-white/95 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-amber-400 whitespace-nowrap animate-bounce flex items-center gap-1 pointer-events-none">
            <span>{isGirl ? '🌸' : '⭐'}</span>
            <span>{activeSpeech}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-amber-400 rotate-45" />
          </div>
        )}

        {/* Sprite Character with walking trot animation */}
        <div
          className={`relative w-14 h-14 rounded-full overflow-hidden border-3 shadow-xl transition-transform ${
            isGirl ? 'border-rose-400 ring-2 ring-rose-200' : 'border-emerald-500 ring-2 ring-emerald-200'
          } ${
            isMoving
              ? 'animate-bounce scale-110'
              : isJumping
              ? 'animate-pulse scale-125 -translate-y-2'
              : 'hover:scale-115'
          }`}
        >
          <img
            src={avatarImg}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Character Pin Foot Shadow */}
        <div className="w-10 h-2 bg-black/30 rounded-full blur-[1px] mt-1" />

        {/* Mini Label */}
        <div className="mt-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border border-white/40 shadow-xs">
          {name}
        </div>
      </div>
    );
  }

  // SHOWCASE / BIG CARD MODE (e.g. Character selection)
  if (variant === 'showcase') {
    return (
      <div
        onClick={handleClick}
        className={`group relative flex flex-col items-center p-5 rounded-3xl border-3 transition-all duration-300 cursor-pointer ${
          isGirl
            ? 'bg-gradient-to-b from-rose-50/90 via-amber-50/80 to-white border-rose-300 hover:border-rose-500 hover:shadow-rose-100 hover:shadow-2xl'
            : 'bg-gradient-to-b from-emerald-50/90 via-teal-50/80 to-white border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-100 hover:shadow-2xl'
        } ${className}`}
      >
        {/* Animated Glow Aura */}
        <div
          className={`absolute -inset-1 rounded-3xl blur-md opacity-25 group-hover:opacity-60 transition duration-500 ${
            isGirl ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
        />

        {/* Speech Bubble */}
        {activeSpeech && (
          <div className="mb-3 bg-white border-2 border-amber-300 text-slate-800 text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-md text-center max-w-xs animate-fadeIn relative">
            <span className="mr-1">{isGirl ? '🌺' : '🧭'}</span>
            <span>"{activeSpeech}"</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-amber-300 rotate-45" />
          </div>
        )}

        {/* 3D Big Illustrated Avatar Frame */}
        <div
          className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 shadow-2xl transition-transform duration-300 group-hover:scale-105 ${
            isGirl
              ? 'border-rose-400 ring-6 ring-rose-200/80'
              : 'border-emerald-500 ring-6 ring-emerald-200/80'
          } ${isJumping ? 'scale-110 -translate-y-2' : ''}`}
        >
          <img
            src={avatarImg}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Sparkle Badges on image */}
          <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md text-amber-500">
            {isGirl ? <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> : <Compass className="w-4 h-4 text-emerald-600" />}
          </div>
        </div>

        {/* Name & Title */}
        <div className="mt-4 text-center z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full mb-1 bg-white/90 shadow-xs border border-amber-200">
            <span>{isGirl ? '👧 Siswi Berhijab' : '👦 Siswa Bersongkok'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka',sans-serif]">
            {name}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
            {role}
          </p>
        </div>

        {/* Interactive Badge Hint */}
        <div className="mt-3 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-xl border border-amber-300">
          ✨ Klik untuk mendengar sapaan {name}
        </div>
      </div>
    );
  }

  // DEFAULT: MASCOT / COMPANION GUIDE MODE (e.g. In Forest / Pondok Materi / Quiz)
  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-amber-300 shadow-md select-none cursor-pointer group hover:shadow-xl transition-all ${className}`}
    >
      {/* 3D Round Avatar */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden border-3 shadow-md ${
          isGirl ? 'border-rose-400 ring-3 ring-rose-200' : 'border-emerald-500 ring-3 ring-emerald-200'
        } ${isJumping ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}
      >
        <img
          src={avatarImg}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] text-center font-black py-0.5">
          {name}
        </div>
      </div>

      {/* Speech Text Content */}
      <div className="flex-1 pr-2">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Sahabat Belajar MI</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-snug">
          {activeSpeech || (isGirl ? QUOTES_ALYA[0] : QUOTES_RAFI[0])}
        </p>
        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
          <span>👆 Klik {name} untuk motivasi baru</span>
        </div>
      </div>
    </div>
  );
};
