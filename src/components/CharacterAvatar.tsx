import React, { useState } from 'react';
import { CharacterType } from '../types';
import boyAvatarImg from '../assets/images/muslim_boy_cartoon_1790036724984.jpg';
import girlAvatarImg from '../assets/images/muslimah_girl_cartoon_1790036739303.jpg';

interface CharacterAvatarProps {
  type: CharacterType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'sprite';
  isMoving?: boolean;
  isCelebrating?: boolean;
  interactive?: boolean;
  className?: string;
  showBadge?: boolean;
  showGreetingOnClick?: boolean;
}

const GREETINGS_GIRL = [
  "Assalamu'alaikum! Aku Alya, siap bertualang! ✨",
  "Bismillah! Ayo cari ilmu bermanfaat hari ini! 🌸",
  "Semangat belajarnya ya, teman-teman! 📚",
  "Alhamdulillah! Petualangan kita seru sekali! 💖",
];

const GREETINGS_BOY = [
  "Assalamu'alaikum! Aku Rafi, penjelajah cilik! 🧭",
  "Bismillah! Jangan lupa berdoa sebelum belajar! 🌟",
  "Ayo pecahkan misi dan kumpulkan XP! 🎯",
  "Keren! Bersama kita pasti bisa jadi juara! 🚀",
];

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  type,
  size = 'md',
  isMoving = false,
  isCelebrating = false,
  interactive = false,
  className = '',
  showBadge = false,
  showGreetingOnClick = false,
}) => {
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isWaving, setIsWaving] = useState(false);

  const isGirl = type === 'female_hijab';
  const avatarSrc = isGirl ? girlAvatarImg : boyAvatarImg;
  const characterName = isGirl ? 'Alya' : 'Rafi';
  const roleTitle = isGirl ? 'Muslimah Cilik' : 'Muslim Penjelajah';

  // Dimension mappings
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    '2xl': 'w-48 h-48',
    sprite: 'w-14 h-14',
  };

  const handleAvatarClick = () => {
    if (!interactive && !showGreetingOnClick) return;
    setIsWaving(true);
    const greetings = isGirl ? GREETINGS_GIRL : GREETINGS_BOY;
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    setSpeechBubble(randomGreet);

    setTimeout(() => {
      setIsWaving(false);
    }, 1200);

    setTimeout(() => {
      setSpeechBubble(null);
    }, 4000);
  };

  return (
    <div
      onClick={handleAvatarClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive || showGreetingOnClick ? 'cursor-pointer group' : ''
      } ${className}`}
      title={`${characterName} - ${roleTitle}`}
    >
      {/* Speech Bubble when clicked */}
      {speechBubble && (
        <div className="absolute -top-12 z-50 bg-white/95 text-slate-800 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-2xl shadow-xl border-2 border-amber-400 whitespace-nowrap animate-bounce flex items-center gap-1.5">
          <span>{isGirl ? '🌸' : '⭐'}</span>
          <span>{speechBubble}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-400 rotate-45" />
        </div>
      )}

      {/* Main Avatar Container with Animation */}
      <div
        className={`relative ${sizeMap[size]} rounded-full overflow-hidden transition-all duration-300 ${
          isGirl
            ? 'ring-4 ring-rose-300 shadow-[0_8px_20px_rgba(244,63,94,0.35)]'
            : 'ring-4 ring-emerald-300 shadow-[0_8px_20px_rgba(16,185,129,0.35)]'
        } ${
          isMoving
            ? 'animate-bounce'
            : isCelebrating
            ? 'animate-pulse scale-110'
            : isWaving
            ? 'scale-110 rotate-3'
            : 'hover:scale-105'
        }`}
      >
        {/* Soft Background Radial Glow */}
        <div
          className={`absolute inset-0 ${
            isGirl
              ? 'bg-gradient-to-tr from-rose-200 via-amber-100 to-sky-100'
              : 'bg-gradient-to-tr from-emerald-200 via-teal-100 to-amber-100'
          }`}
        />

        {/* 3D Cute Muslim / Muslimah Cartoon Avatar Image */}
        <img
          src={avatarSrc}
          alt={isGirl ? 'Alya - Muslimah Lucu' : 'Rafi - Muslim Lucu'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center relative z-10 transition-transform duration-300 group-hover:scale-110"
        />

        {/* Shimmer Light Highlight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none z-20" />

        {/* Ground shadow for sprite */}
        {size === 'sprite' && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-[1px] z-0" />
        )}
      </div>

      {/* Cute Floating Emote (Heart for Girl, Star for Boy) on Hover */}
      <span
        className={`absolute -top-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform group-hover:scale-125 z-30 ${
          isGirl ? 'text-rose-500' : 'text-amber-500'
        }`}
      >
        {isGirl ? '🌺' : '🧭'}
      </span>

      {/* Optional Badge Indicator icon */}
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md z-30 flex items-center justify-center">
          ★
        </span>
      )}
    </div>
  );
};

