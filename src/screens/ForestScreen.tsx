import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerState, GameScreen } from '../types';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { Lock, Unlock, Sparkles, Footprints, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, BookOpen, Film, Search, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/sound';
import { EduverseDataService } from '../utils/eduStore';

interface ForestScreenProps {
  player: PlayerState;
  onEnterLocation: (screen: GameScreen) => void;
  onBackToMap: () => void;
  justUnlockedDetective?: boolean;
  onSelectClassSubject?: () => void;
}

interface Building {
  id: 'pondok' | 'bioskop' | 'detektif';
  name: string;
  subtitle: string;
  icon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  targetScreen: GameScreen;
  isLocked: boolean;
  lockMessage: string;
  isCompleted: boolean;
}

export const ForestScreen: React.FC<ForestScreenProps> = ({
  player,
  onEnterLocation,
  onBackToMap,
  justUnlockedDetective = false,
  onSelectClassSubject,
}) => {
  const activeMateri =
    EduverseDataService.getMateriById(player.selectedMateriId || '') ||
    EduverseDataService.getMateriByClassAndSubject(player.selectedClass || 4, player.selectedSubject || 'IPAS')[0];

  // Player position in percentage coordinates (0 - 100)
  // Start near the forest entrance (bottom-left path)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 30, y: 72 });
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [activeBuildingNearby, setActiveBuildingNearby] = useState<Building | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<boolean>(justUnlockedDetective);

  const forestContainerRef = useRef<HTMLDivElement>(null);
  const lastStepSoundRef = useRef<number>(0);

  // Buildings definitions
  const buildings: Building[] = [
    {
      id: 'pondok',
      name: 'Pondok Materi',
      subtitle: activeMateri ? activeMateri.title : 'Temukan pengetahuan baru!',
      icon: '🏡',
      x: 22,
      y: 28,
      targetScreen: 'pondok_materi',
      isLocked: false,
      lockMessage: '',
      isCompleted: player.materiCompleted,
    },
    {
      id: 'bioskop',
      name: 'Bioskop Belajar',
      subtitle: `Belajar video ${player.selectedSubject || 'IPAS'}!`,
      icon: '🎬',
      x: 75,
      y: 25,
      targetScreen: 'bioskop',
      isLocked: false,
      lockMessage: '',
      isCompleted: player.videoCompleted,
    },
    {
      id: 'detektif',
      name: 'Pos Detektif',
      subtitle: player.materiCompleted
        ? `Tantangan Detektif ${player.selectedSubject || 'IPAS'} terbuka!`
        : 'Selesaikan materi terlebih dahulu.',
      icon: '🔎',
      x: 72,
      y: 74,
      targetScreen: 'pos_detektif',
      isLocked: !player.materiCompleted,
      lockMessage: 'Selesaikan materi terlebih dahulu.',
      isCompleted: player.detectiveCompleted,
    },
  ];

  // Play step sound with throttle
  const triggerStepSound = useCallback(() => {
    const now = Date.now();
    if (now - lastStepSoundRef.current > 240) {
      playSound('step', player.soundEnabled);
      lastStepSoundRef.current = now;
    }
  }, [player.soundEnabled]);

  // Check proximity to buildings
  const checkProximity = useCallback(
    (x: number, y: number) => {
      let nearby: Building | null = null;
      for (const b of buildings) {
        // Distance calculation in percentage space
        const dx = b.x - x;
        const dy = b.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 18) {
          nearby = b;
          break;
        }
      }
      setActiveBuildingNearby(nearby);
    },
    [buildings]
  );

  // Move player by delta
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      setPlayerPos((prev) => {
        const nextX = Math.max(8, Math.min(92, prev.x + dx));
        const nextY = Math.max(12, Math.min(88, prev.y + dy));
        checkProximity(nextX, nextY);
        return { x: nextX, y: nextY };
      });
      setIsMoving(true);
      triggerStepSound();
      setTimeout(() => setIsMoving(false), 200);
    },
    [checkProximity, triggerStepSound]
  );

  // Move directly towards a clicked point
  const handleGroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!forestContainerRef.current) return;
    const rect = forestContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Smooth walk to target
    const targetX = Math.max(8, Math.min(92, clickX));
    const targetY = Math.max(12, Math.min(88, clickY));

    setPlayerPos({ x: targetX, y: targetY });
    setIsMoving(true);
    triggerStepSound();
    checkProximity(targetX, targetY);
    setTimeout(() => setIsMoving(false), 300);
  };

  // Keyboard navigation listener (W, A, S, D and Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const STEP = 3.5;
      let handled = false;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(0, -STEP);
          handled = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(0, STEP);
          handled = true;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(-STEP, 0);
          handled = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(STEP, 0);
          handled = true;
          break;
        case 'Enter':
        case ' ':
          if (activeBuildingNearby) {
            handleEnterBuilding(activeBuildingNearby);
            handled = true;
          }
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, activeBuildingNearby]);

  // Initial check
  useEffect(() => {
    checkProximity(playerPos.x, playerPos.y);
  }, []);

  const handleEnterBuilding = (building: Building) => {
    if (building.isLocked) {
      playSound('wrong', player.soundEnabled);
    } else {
      playSound('click', player.soundEnabled);
      onEnterLocation(building.targetScreen);
    }
  };

  return (
    <div
      id="forest-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 p-2 sm:p-4 flex flex-col items-center select-none"
    >
      <div className="max-w-6xl w-full flex flex-col flex-1">
        {/* Forest Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3 bg-white/85 backdrop-blur-md px-3 sm:px-5 py-2 rounded-2xl border-2 border-emerald-300 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-emerald-950 font-['Fredoka',sans-serif] leading-tight">
                Hutan Pengetahuan
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-700 font-semibold">
                Jelajahi hutan untuk menemukan Pondok Materi, Bioskop, dan Pos Detektif!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSelectClassSubject && (
              <button
                id="btn-forest-ganti-mapel"
                onClick={() => {
                  playSound('click', player.soundEnabled);
                  onSelectClassSubject();
                }}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Ganti Kelas atau Mata Pelajaran"
              >
                <span>🔄</span>
                <span>Kelas {player.selectedClass || 4} • {player.selectedSubject || 'IPAS'}</span>
              </button>
            )}

            <button
              onClick={onBackToMap}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>🗺️ Ke Peta</span>
            </button>
          </div>
        </div>

        {/* Unlock Alert Notification if just unlocked */}
        {showUnlockAnimation && (
          <div className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center justify-between animate-bounce border-2 border-amber-300">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black font-['Fredoka',sans-serif]">
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 shrink-0" />
              <span>🔓 Hebat! Kamu telah membuka Pos Detektif!</span>
            </div>
            <button
              onClick={() => setShowUnlockAnimation(false)}
              className="text-white/90 hover:text-white font-bold text-xs bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* ========================================================
            THE 2D ADVENTURE FOREST WORLD
            ======================================================== */}
        <div
          ref={forestContainerRef}
          onClick={handleGroundClick}
          className="relative flex-1 w-full min-h-[500px] sm:min-h-[580px] bg-gradient-to-b from-emerald-500 via-emerald-600 to-green-700 rounded-3xl border-4 border-emerald-800 shadow-2xl overflow-hidden cursor-crosshair"
        >
          {/* Natural Grass Pattern Texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Map Scenery: Rivers, Paths, Bridges, Flower beds */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 650" preserveAspectRatio="none">
            {/* Winding Flowing River (Sungai Kecil) */}
            <path
              d="M 500 0 C 470 140, 560 260, 520 400 C 490 510, 580 580, 550 650"
              stroke="#38bdf8"
              strokeWidth="56"
              fill="none"
              strokeLinecap="round"
            />
            {/* River Water Highlight Streamers */}
            <path
              d="M 505 10 C 475 140, 565 260, 525 400 C 495 510, 585 580, 555 640"
              stroke="#bae6fd"
              strokeWidth="10"
              fill="none"
              strokeDasharray="30 20"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* Riverbank stones */}
            <circle cx="460" cy="180" r="10" fill="#94a3b8" />
            <circle cx="560" cy="300" r="12" fill="#64748b" />
            <circle cx="480" cy="460" r="9" fill="#94a3b8" />
            <circle cx="570" cy="540" r="11" fill="#64748b" />

            {/* Wooden Footbridge over the river */}
            <g id="wooden-bridge">
              {/* Bridge Shadow */}
              <rect x="475" y="360" width="100" height="34" rx="6" fill="#1e293b" opacity="0.3" />
              {/* Bridge Planks */}
              <rect x="475" y="356" width="100" height="34" rx="4" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
              {/* Plank lines */}
              <line x1="495" y1="356" x2="495" y2="390" stroke="#78350f" strokeWidth="2" />
              <line x1="515" y1="356" x2="515" y2="390" stroke="#78350f" strokeWidth="2" />
              <line x1="535" y1="356" x2="535" y2="390" stroke="#78350f" strokeWidth="2" />
              <line x1="555" y1="356" x2="555" y2="390" stroke="#78350f" strokeWidth="2" />
              {/* Railings */}
              <line x1="475" y1="356" x2="575" y2="356" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
              <line x1="475" y1="390" x2="575" y2="390" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Winding Cobblestone Pathway (Jalan Setapak) */}
            {/* South Entrance -> Pondok Materi */}
            <path
              d="M 300 650 Q 280 500 240 330 Q 220 250 220 200"
              stroke="#fed7aa"
              strokeWidth="28"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
            {/* Pondok Materi -> Bridge */}
            <path
              d="M 230 250 Q 340 310 475 370"
              stroke="#fed7aa"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
            {/* Bridge -> Bioskop Belajar */}
            <path
              d="M 575 370 Q 660 330 750 220"
              stroke="#fed7aa"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
            {/* Bridge -> Pos Detektif */}
            <path
              d="M 575 380 Q 640 440 720 540"
              stroke="#fed7aa"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Environmental Forest Decor: Trees, Flowers, Rocks, Butterflies */}
          {/* Trees (Banyak Pohon) */}
          <div className="absolute top-4 left-6 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-md">
            🌲
          </div>
          <div className="absolute top-16 left-28 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-md">
            🌳
          </div>
          <div className="absolute top-44 left-8 text-4xl sm:text-5xl select-none pointer-events-none drop-shadow-md">
            🌳
          </div>
          <div className="absolute bottom-6 left-8 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-md">
            🌲
          </div>
          <div className="absolute top-6 left-1/3 text-4xl sm:text-5xl select-none pointer-events-none drop-shadow-md">
            🌳
          </div>
          <div className="absolute top-4 right-1/4 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-md">
            🌲
          </div>
          <div className="absolute top-12 right-8 text-4xl sm:text-5xl select-none pointer-events-none drop-shadow-md">
            🌳
          </div>
          <div className="absolute bottom-28 right-8 text-4xl sm:text-6xl select-none pointer-events-none drop-shadow-md">
            🌲
          </div>
          <div className="absolute bottom-6 right-1/3 text-3xl sm:text-5xl select-none pointer-events-none drop-shadow-md">
            🌳
          </div>

          {/* Rocks (Batu) */}
          <div className="absolute top-1/2 left-16 text-xl sm:text-2xl select-none pointer-events-none">
            🪨
          </div>
          <div className="absolute bottom-24 left-1/2 text-2xl select-none pointer-events-none">
            🪨
          </div>
          <div className="absolute top-36 right-1/3 text-xl select-none pointer-events-none">
            🪨
          </div>

          {/* Flowers & Grass (Bunga & Rumput) */}
          <div className="absolute top-20 left-48 text-base sm:text-xl select-none pointer-events-none">
            🌺
          </div>
          <div className="absolute bottom-36 left-28 text-sm sm:text-lg select-none pointer-events-none">
            🌼
          </div>
          <div className="absolute top-48 right-24 text-base select-none pointer-events-none">
            🌷
          </div>
          <div className="absolute bottom-16 right-20 text-base select-none pointer-events-none">
            🌸
          </div>
          <div className="absolute top-1/3 left-1/4 text-sm select-none pointer-events-none opacity-80">
            🌿
          </div>
          <div className="absolute bottom-1/4 right-1/4 text-sm select-none pointer-events-none opacity-80">
            🌿
          </div>

          {/* Mushrooms (Jamur Hutan) */}
          <div className="absolute bottom-32 left-16 text-lg sm:text-2xl select-none pointer-events-none drop-shadow-xs">
            🍄
          </div>
          <div className="absolute top-40 right-1/4 text-base sm:text-xl select-none pointer-events-none drop-shadow-xs">
            🍄
          </div>

          {/* Guide Signposts (Papan Petunjuk Hutan) */}
          <div className="absolute bottom-20 left-44 text-2xl sm:text-3xl select-none pointer-events-none drop-shadow-md">
            🪧
          </div>
          <div className="absolute top-32 right-36 text-xl sm:text-2xl select-none pointer-events-none drop-shadow-md">
            🪧
          </div>

          {/* Animated Butterflies (Kupu-kupu) */}
          <div className="absolute top-28 left-1/3 text-xl sm:text-2xl animate-bounce pointer-events-none">
            🦋
          </div>
          <div className="absolute bottom-40 right-1/3 text-lg sm:text-xl animate-pulse pointer-events-none">
            🦋
          </div>

          {/* Light Shimmer Sparkles (Cahaya Kecil) */}
          <div className="absolute top-16 left-1/2 text-sm text-yellow-200 animate-ping pointer-events-none">
            ✨
          </div>
          <div className="absolute bottom-20 left-1/3 text-sm text-yellow-200 animate-pulse pointer-events-none">
            ✨
          </div>
          <div className="absolute top-1/2 right-1/4 text-sm text-yellow-200 animate-ping pointer-events-none">
            ✨
          </div>

          {/* Drifting Clouds (Awan) */}
          <div className="absolute top-3 left-12 bg-white/40 rounded-full w-24 h-7 blur-xs pointer-events-none" />
          <div className="absolute top-8 right-20 bg-white/40 rounded-full w-28 h-8 blur-xs pointer-events-none" />

          {/* ========================================================
              BUILDING 1: 🏡 PONDOK MATERI
              ======================================================== */}
          <div
            id="forest-building-pondok"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterBuilding(buildings[0]);
            }}
            style={{ left: `${buildings[0].x}%`, top: `${buildings[0].y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              {/* Building Card / Cabin Illustration */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-b from-amber-100 to-amber-200 border-3 border-amber-800 rounded-3xl shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl sm:text-5xl block">🏡</span>
                {player.materiCompleted && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                    ✓ SELESAI
                  </span>
                )}
              </div>

              {/* Building Signboard */}
              <div className="mt-1.5 bg-amber-900/90 text-amber-100 border border-amber-600 px-3 py-1 rounded-xl shadow-md text-center max-w-[140px]">
                <div className="font-black text-xs font-['Fredoka',sans-serif]">
                  PONDOK MATERI
                </div>
                <div className="text-[10px] text-amber-300 font-semibold truncate">
                  {player.selectedSubject || 'IPAS'}: {activeMateri?.title || 'Materi'}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              BUILDING 2: 🎬 BIOSKOP BELAJAR
              ======================================================== */}
          <div
            id="forest-building-bioskop"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterBuilding(buildings[1]);
            }}
            style={{ left: `${buildings[1].x}%`, top: `${buildings[1].y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="relative p-3 sm:p-4 bg-gradient-to-b from-sky-100 to-indigo-200 border-3 border-sky-800 rounded-3xl shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl sm:text-5xl block">🎬</span>
                {player.videoCompleted && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                    ✓ SELESAI
                  </span>
                )}
              </div>

              <div className="mt-1.5 bg-slate-900/90 text-sky-100 border border-sky-600 px-3 py-1 rounded-xl shadow-md text-center max-w-[140px]">
                <div className="font-black text-xs font-['Fredoka',sans-serif]">
                  BIOSKOP BELAJAR
                </div>
                <div className="text-[10px] text-sky-300 font-semibold truncate">
                  Video {player.selectedSubject || 'IPAS'}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              BUILDING 3: 🔎 POS DETEKTIF
              ======================================================== */}
          <div
            id="forest-building-detektif"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterBuilding(buildings[2]);
            }}
            style={{ left: `${buildings[2].x}%`, top: `${buildings[2].y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div
                className={`relative p-3 sm:p-4 rounded-3xl border-3 shadow-xl transition-all duration-300 group-hover:scale-110 ${
                  player.materiCompleted
                    ? 'bg-gradient-to-b from-orange-100 to-amber-200 border-orange-700 ring-4 ring-amber-300 animate-pulse'
                    : 'bg-slate-200 border-slate-500 opacity-80'
                }`}
              >
                <span className="text-4xl sm:text-5xl block">🔎</span>
                {player.detectiveCompleted ? (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                    ✓ SELESAI
                  </span>
                ) : player.materiCompleted ? (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-xs animate-bounce">
                    <Unlock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 shadow-xs">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div
                className={`mt-1.5 px-3 py-1 rounded-xl shadow-md text-center max-w-[140px] border ${
                  player.materiCompleted
                    ? 'bg-orange-950/90 text-orange-100 border-orange-600'
                    : 'bg-slate-800/90 text-slate-300 border-slate-600'
                }`}
              >
                <div className="font-black text-xs font-['Fredoka',sans-serif]">
                  {player.materiCompleted ? 'POS DETEKTIF' : '🔒 POS DETEKTIF'}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold truncate">
                  {player.materiCompleted ? `Misi ${player.selectedSubject || 'IPAS'}` : 'Masih Terkunci'}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PLAYER AVATAR MOVING INSIDE THE FOREST
              ======================================================== */}
          <div
            id="player-sprite-forest"
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              transition: isMoving ? 'none' : 'left 0.25s ease-out, top 0.25s ease-out',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-xl"
          >
            {/* Player Name Tag Floating Above Head */}
            <div className="flex flex-col items-center">
              <span className="bg-slate-900/85 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5 border border-white/40">
                {player.name || 'Petualang'}
              </span>
              <CharacterAvatar
                type={player.character}
                size="sprite"
                isMoving={isMoving}
              />
            </div>
          </div>

          {/* Interaction Bubble Prompt When Player is Nearby a Building */}
          {activeBuildingNearby && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-30 bg-white/95 backdrop-blur-md border-3 border-amber-400 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center gap-3 animate-fadeIn max-w-md w-[92%]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2.5 bg-amber-100 rounded-2xl text-2xl sm:text-3xl shrink-0">
                {activeBuildingNearby.icon}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-black text-slate-800 text-sm sm:text-base font-['Fredoka',sans-serif]">
                  {activeBuildingNearby.name}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {activeBuildingNearby.isLocked
                    ? activeBuildingNearby.lockMessage
                    : activeBuildingNearby.subtitle}
                </div>
              </div>

              {activeBuildingNearby.isLocked ? (
                <div className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 border border-slate-300">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Terkunci</span>
                </div>
              ) : (
                <button
                  id="btn-masuk-bangunan-hutan"
                  onClick={() => handleEnterBuilding(activeBuildingNearby)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm px-5 py-2.5 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>MASUK</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls & Travel Guide */}
        <div className="mt-2.5 bg-white/80 backdrop-blur-xs p-2 sm:p-3 rounded-2xl border border-emerald-300 shadow-xs flex flex-wrap items-center justify-between gap-2">
          {/* Controls instructions */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Footprints className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Cara Bergerak:</strong> Gunakan keyboard <strong>W A S D</strong> / tombol panah, atau <strong>klik/sentuh layar</strong> untuk berjalan ke arah yang diinginkan.
            </span>
          </div>

          {/* Mobile / On-screen Touch D-Pad */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-300 p-1.5 rounded-2xl ml-auto shadow-xs">
            <button
              onClick={() => movePlayer(-5, 0)}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold active:scale-90 shadow-xs cursor-pointer"
              title="Kiri"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => movePlayer(0, -5)}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold active:scale-90 shadow-xs cursor-pointer"
                title="Atas"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => movePlayer(0, 5)}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold active:scale-90 shadow-xs cursor-pointer"
                title="Bawah"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => movePlayer(5, 0)}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold active:scale-90 shadow-xs cursor-pointer"
              title="Kanan"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
