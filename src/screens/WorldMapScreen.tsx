import React, { useState } from 'react';
import { PlayerState, GameScreen } from '../types';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CuteMuslimCharacter } from '../components/CuteMuslimCharacter';
import worldMapImg from '../assets/images/world_map_realistic_1790036705356.jpg';
import {
  Lock,
  Sparkles,
  Navigation,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Gift,
  HelpCircle,
  X,
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface WorldMapScreenProps {
  player: PlayerState;
  onSelectLocation: (screen: GameScreen) => void;
  justUnlockedArena?: boolean;
  onDismissUnlockBanner?: () => void;
}

type TimeOfDay = 'day' | 'sunset' | 'night';

interface MapLandmark {
  id: string;
  screen: GameScreen;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  xPercent: number; // 0 to 100 on the real map
  yPercent: number; // 0 to 100 on the real map
  unlocked: boolean;
  lockedReason?: string;
  isMainObjective?: boolean;
  starsCount?: number;
  xpRewardLabel?: string;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  player,
  onSelectLocation,
  justUnlockedArena = false,
  onDismissUnlockBanner,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedLandmark, setSelectedLandmark] = useState<MapLandmark | null>(null);

  // Character physical position on the map (percentages)
  const isArenaUnlocked = player.detectiveCompleted || player.unlockedAreas.includes('arena');

  // Character physical position state
  const [characterCoords, setCharacterCoords] = useState<{ x: number; y: number }>({
    x: 32, // initially at Hutan Pengetahuan
    y: 42,
  });
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelSpeech, setTravelSpeech] = useState<string | null>(null);

  // Easter Egg states
  const [balloonClaimed, setBalloonClaimed] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);
  const [dolphinJumping, setDolphinJumping] = useState(false);

  // Landmarks defined with realistic coordinates on the generated isometric island
  const landmarks: MapLandmark[] = [
    {
      id: 'hutan',
      screen: 'forest',
      name: 'Hutan Pengetahuan',
      subtitle: 'Misi & Belajar Utama',
      description: 'Hutan lebat nan magis berisi Pondok Materi, Bioskop Belajar, dan Pos Detektif Sains Energi!',
      icon: '🌳',
      xPercent: 33,
      yPercent: 44,
      unlocked: true,
      isMainObjective: true,
      starsCount: player.materiCompleted && player.videoCompleted && player.detectiveCompleted ? 3 : player.materiCompleted ? 1 : 0,
      xpRewardLabel: '+100 XP',
    },
    {
      id: 'desa_misi',
      screen: 'desa_misi',
      name: 'Desa Misi',
      subtitle: 'Detektif Eduverse & Tantangan Belajar',
      description: 'Pusat penyelidikan dan misi detektif edukatif dinamis yang terhubung langsung dengan materi Bapak/Ibu guru!',
      icon: '🔎',
      xPercent: 18,
      yPercent: 68,
      unlocked: true,
      starsCount: player.detectiveCompleted ? 3 : 1,
      xpRewardLabel: '+30 XP',
    },
    {
      id: 'bioskop',
      screen: 'bioskop',
      name: 'Bioskop Belajar',
      subtitle: 'Teater Layar Animasi Sains',
      description: 'Menonton video cerita dan animasi sains edukatif bersama sahabat belajar MI.',
      icon: '🎬',
      xPercent: 52,
      yPercent: 30,
      unlocked: true,
      starsCount: player.videoCompleted ? 3 : 0,
      xpRewardLabel: '+40 XP',
    },
    {
      id: 'arena',
      screen: 'arena_game',
      name: 'Arena Game & Kuis',
      subtitle: 'Colosseum Tantangan Cerdas Cermat',
      description: 'Uji pemahaman dan raih skor tertinggi dalam kuis seru berhadiah lencana!',
      icon: '🎮',
      xPercent: 58,
      yPercent: 66,
      unlocked: isArenaUnlocked,
      lockedReason: 'Selesaikan Misi Detektif di Hutan Pengetahuan terlebih dahulu untuk membuka Arena Game!',
      starsCount: player.completedGameIds.length > 0 ? 3 : 0,
      xpRewardLabel: '+80 XP',
    },
    {
      id: 'gua',
      screen: 'world_map',
      name: 'Gua Puzzle Kristal',
      subtitle: 'Gua Amethyst Teka-Teki Logika',
      description: 'Gua misterius dengan batu kristal bercahaya yang menyimpan teka-teki logika matematika.',
      icon: '💎',
      xPercent: 82,
      yPercent: 62,
      unlocked: false,
      lockedReason: '🔒 Gua Puzzle masih terkunci! Wilayah teka-teki logika ini akan terbuka pada babak petualangan berikutnya.',
      xpRewardLabel: '+120 XP',
    },
    {
      id: 'pulau',
      screen: 'world_map',
      name: 'Pulau Tantangan Pesisir',
      subtitle: 'Kepulauan Karang & Laut Biru',
      description: 'Dermaga pantai dengan ombak jernih dan pulau terpencil untuk ujian ketangkasan.',
      icon: '🏝️',
      xPercent: 84,
      yPercent: 28,
      unlocked: false,
      lockedReason: '🔒 Pulau Tantangan masih terkunci! Uji ketangkasan sains menantimu di sini setelah naik level.',
      xpRewardLabel: '+150 XP',
    },
    {
      id: 'menara',
      screen: 'world_map',
      name: 'Menara Prestasi Langit',
      subtitle: 'Observatorium Puncak Awan',
      description: 'Menara observatorium tinggi tempat para juara menatap bintang dan memamerkan piala.',
      icon: '🏆',
      xPercent: 38,
      yPercent: 16,
      unlocked: false,
      lockedReason: '🔒 Menara Prestasi masih terkunci! Kumpulkan lebih banyak XP dan lencana untuk memasukinya.',
      xpRewardLabel: '+200 XP',
    },
    {
      id: 'istana',
      screen: 'world_map',
      name: 'Istana Final Quest',
      subtitle: 'Kastel Megah Raja Pengetahuan',
      description: 'Istana agung penutupan petualangan akbar Eduverse untuk penobatan sang master sains!',
      icon: '🏰',
      xPercent: 68,
      yPercent: 12,
      unlocked: false,
      lockedReason: '🔒 Istana Final Quest masih terkunci! Wilayah agung ini hanya terbuka setelah menyelesaikan seluruh zona pulau.',
      xpRewardLabel: '+500 XP',
    },
  ];

  // Character walk to landmark and transition
  const handleLandmarkClick = (lm: MapLandmark) => {
    setSelectedLandmark(lm);

    if (!lm.unlocked) {
      playSound('wrong', player.soundEnabled);
      setLockedNotice(lm.lockedReason || 'Area ini masih terkunci!');
      return;
    }

    // Unlocked location: trigger character walk
    playSound('click', player.soundEnabled);
    setIsTraveling(true);
    setTravelSpeech(`Menuju ${lm.name}! 🚀`);
    setCharacterCoords({ x: lm.xPercent, y: lm.yPercent });

    // Transition smoothly after walk completes
    setTimeout(() => {
      playSound('complete', player.soundEnabled);
      setIsTraveling(false);
      setTravelSpeech(null);
      onSelectLocation(lm.screen);
    }, 1100);
  };

  // Easter Egg: Hot Air Balloon
  const handleBalloonClick = () => {
    if (balloonClaimed) {
      setEasterEggMessage("🎈 Balon udara sedang terbang tinggi mengelilingi Eduverse! Nikmati pemandangan pulau yang indah!");
    } else {
      setBalloonClaimed(true);
      playSound('levelup', player.soundEnabled);
      player.xp += 15;
      setEasterEggMessage("🎈 Kamu menemukan Balon Udara Rahasia! Hadits Nabi SAW: 'Menuntut ilmu adalah kewajiban bagi setiap muslim.' (+15 XP Bonus)");
    }
  };

  // Easter Egg: River Dolphin
  const handleDolphinClick = () => {
    setDolphinJumping(true);
    playSound('click', player.soundEnabled);
    setEasterEggMessage("🐬 Byuuuuur! Lumba-lumba sungai melompat gembira melihat petualang cilik yang rajin belajar!");
    setTimeout(() => setDolphinJumping(false), 2000);
  };

  // Easter Egg: Secret Coast Chest
  const handleChestClick = () => {
    if (chestClaimed) {
      setEasterEggMessage("🧰 Peti karun pantai sudah terbuka. Isi mutiara ilmunya telah tersimpan di sakumu!");
    } else {
      setChestClaimed(true);
      playSound('complete', player.soundEnabled);
      player.xp += 25;
      setEasterEggMessage("🧰 Bismillah! Kamu membuka Peti Karun Kuno di tepi pantai! Kamu mendapatkan +25 XP dan Mutiara Ketekunan!");
    }
  };

  return (
    <div
      id="world-map-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-slate-900 flex flex-col items-center select-none p-2 sm:p-4"
    >
      <div className="max-w-6xl w-full flex flex-col gap-3">
        {/* Banner Alert if Arena just unlocked */}
        {justUnlockedArena && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h4 className="font-black text-base sm:text-lg font-['Fredoka',sans-serif]">
                  Area Baru Terbuka!
                </h4>
                <p className="text-xs sm:text-sm font-semibold opacity-95">
                  Hebat! Misi Detektif berhasil. 🎮 <strong>Arena Game</strong> sekarang sudah terbuka dan siap dimainkan!
                </p>
              </div>
            </div>
            {onDismissUnlockBanner && (
              <button
                onClick={onDismissUnlockBanner}
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            )}
          </div>
        )}

        {/* Easter Egg / Info Alert Message */}
        {easterEggMessage && (
          <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-2xl shadow-lg flex items-center justify-between animate-fadeIn text-amber-950">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{easterEggMessage}</span>
            </div>
            <button
              onClick={() => setEasterEggMessage(null)}
              className="p-1 hover:bg-amber-200 rounded-lg text-amber-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Locked Popup Alert */}
        {lockedNotice && (
          <div className="bg-rose-50 border-2 border-rose-400 p-3 rounded-2xl shadow-md flex items-center justify-between animate-fadeIn text-rose-950">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{lockedNotice}</span>
            </div>
            <button
              onClick={() => setLockedNotice(null)}
              className="text-rose-800 hover:text-rose-950 font-black text-xs bg-rose-200 px-2.5 py-1 rounded-lg ml-2 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* TOP BAR: Title, Time/Atmosphere Controls, and Player Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                  Peta Petualangan 3D Realistis
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Kepulauan Eduverse
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium">
                Klik lokasi untuk berjalan dan memulai misi pembelajaran!
              </p>
            </div>
          </div>

          {/* Controls: Atmosphere (Day, Sunset, Night) & Zoom */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            {/* Atmosphere mode buttons */}
            <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setTimeOfDay('day')}
                title="Pagi Cerah"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                  timeOfDay === 'day'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pagi</span>
              </button>
              <button
                onClick={() => setTimeOfDay('sunset')}
                title="Sore Emas"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                  timeOfDay === 'sunset'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sore</span>
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                title="Malam Bintang"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                  timeOfDay === 'night'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Malam</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                title="Zoom Out"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-bold text-slate-300 px-1.5">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                title="Zoom In"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mini Player Profile Chip */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-2xl">
              <CharacterAvatar type={player.character} size="sm" showBadge />
              <div className="text-left text-xs">
                <div className="font-black text-white font-['Fredoka',sans-serif]">
                  {player.name || 'Petualang'}
                </div>
                <div className="text-[10px] text-amber-400 font-bold">
                  ⭐ {player.xp} XP • Lv.{player.level}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THE REALISTIC 3D ADVENTURE MAP VIEWPORT */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[500px] sm:min-h-[560px] rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-slate-950">
          {/* Zoomable Container */}
          <div
            className="relative w-full h-full transition-transform duration-500 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* REALISTIC 3D ISOMETRIC WORLD MAP IMAGE */}
            <img
              src={worldMapImg}
              alt="Dunia Petualangan Eduverse 3D Realistis"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            />

            {/* Atmospheric Lighting Overlays */}
            {/* Sunset Filter */}
            {timeOfDay === 'sunset' && (
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-amber-600/20 to-rose-700/25 mix-blend-color-burn pointer-events-none transition-all duration-700" />
            )}
            {/* Night Filter with Stars & Vignette */}
            {timeOfDay === 'night' && (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-indigo-950/50 to-slate-950/80 mix-blend-multiply pointer-events-none transition-all duration-700">
                {/* Twinkling star glints */}
                <div className="absolute top-6 left-12 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                <div className="absolute top-16 right-20 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse opacity-85" />
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-sky-200 rounded-full animate-ping opacity-60" />
                <div className="absolute top-10 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            )}

            {/* Realistic Drifting Clouds / Fog */}
            <div className="absolute -top-10 left-[-20%] w-[140%] h-40 bg-gradient-to-b from-white/20 via-white/10 to-transparent blur-xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/4 right-0 w-72 h-24 bg-white/15 rounded-full blur-2xl pointer-events-none" />

            {/* SVG Connecting Paths overlay connecting major landmarks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 650">
              <defs>
                <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Desa -> Hutan */}
              <path
                d="M 180 440 Q 250 380 330 286"
                stroke="url(#pathGlow)"
                strokeWidth="6"
                fill="none"
                strokeDasharray="8 8"
                strokeLinecap="round"
                className="animate-pulse"
              />
              {/* Hutan -> Bioskop */}
              <path
                d="M 330 286 Q 420 230 520 195"
                stroke="url(#pathGlow)"
                strokeWidth="6"
                fill="none"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
              {/* Hutan -> Arena Game */}
              <path
                d="M 330 286 Q 440 360 580 430"
                stroke={isArenaUnlocked ? 'url(#pathGlow)' : '#94a3b8'}
                strokeWidth="6"
                fill="none"
                strokeDasharray="8 8"
                strokeLinecap="round"
                className={isArenaUnlocked ? 'opacity-90' : 'opacity-40'}
              />
              {/* Arena Game -> Gua Puzzle */}
              <path
                d="M 580 430 Q 700 450 820 403"
                stroke="#cbd5e1"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-35"
              />
              {/* Bioskop -> Pulau Tantangan */}
              <path
                d="M 520 195 Q 680 160 840 182"
                stroke="#cbd5e1"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-35"
              />
              {/* Hutan -> Menara Prestasi */}
              <path
                d="M 330 286 Q 340 180 380 104"
                stroke="#cbd5e1"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-35"
              />
              {/* Menara Prestasi -> Istana Final Quest */}
              <path
                d="M 380 104 Q 530 60 680 78"
                stroke="#cbd5e1"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-35"
              />
            </svg>

            {/* EASTER EGG 1: Floating Hot Air Balloon */}
            <div
              onClick={handleBalloonClick}
              title="Klik Balon Udara Rahasia!"
              className="absolute top-[8%] left-[22%] z-30 cursor-pointer animate-bounce transition-transform hover:scale-125"
            >
              <div className="relative group">
                <span className="text-3xl sm:text-4xl block filter drop-shadow-lg">🎈</span>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[9px] font-black px-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  +15 XP
                </span>
              </div>
            </div>

            {/* EASTER EGG 2: River Dolphin Splash */}
            <div
              onClick={handleDolphinClick}
              title="Klik Lumba-Lumba Sungai!"
              className={`absolute top-[48%] left-[46%] z-30 cursor-pointer transition-all ${
                dolphinJumping ? 'scale-150 -translate-y-4' : 'hover:scale-125'
              }`}
            >
              <div className="relative">
                <span className="text-2xl sm:text-3xl block filter drop-shadow-md">
                  {dolphinJumping ? '🐬' : '🌊'}
                </span>
              </div>
            </div>

            {/* EASTER EGG 3: Secret Coastal Chest */}
            <div
              onClick={handleChestClick}
              title="Peti Karun Rahasia Pesisir"
              className="absolute bottom-[10%] right-[32%] z-30 cursor-pointer hover:scale-125 transition-transform"
            >
              <div className="relative group">
                <span className="text-2xl sm:text-3xl block filter drop-shadow-md">
                  {chestClaimed ? '✨' : '🧰'}
                </span>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-300 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  {chestClaimed ? 'Mutiara Ilmu' : 'Peti Rahasia'}
                </span>
              </div>
            </div>

            {/* MAP LANDMARK NODES */}
            {landmarks.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id;

              return (
                <div
                  key={landmark.id}
                  id={`map-landmark-${landmark.id}`}
                  onClick={() => handleLandmarkClick(landmark)}
                  style={{
                    left: `${landmark.xPercent}%`,
                    top: `${landmark.yPercent}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-25 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    {/* Main Objective Highlight / "Mulai di Sini!" badge */}
                    {landmark.isMainObjective && (
                      <div className="mb-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-[10px] sm:text-xs px-3 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce flex items-center gap-1 z-30">
                        <Sparkles className="w-3 h-3 text-amber-900 fill-amber-900" />
                        <span>Mulai di Sini!</span>
                      </div>
                    )}

                    {/* Landmark 3D Diorama Card */}
                    <div
                      className={`relative p-2.5 sm:p-3.5 rounded-3xl transition-all duration-300 flex items-center justify-center ${
                        landmark.unlocked
                          ? 'bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-[0_10px_25px_rgba(0,0,0,0.4)] group-hover:scale-115 group-hover:-translate-y-2 group-hover:ring-4 group-hover:ring-amber-300'
                          : 'bg-slate-800/80 backdrop-blur-xs border-2 border-slate-600 opacity-75 group-hover:opacity-95 group-hover:scale-105'
                      } ${isSelected ? 'ring-4 ring-emerald-400 scale-110' : ''}`}
                    >
                      <span className="text-3xl sm:text-4xl block filter drop-shadow">
                        {landmark.icon}
                      </span>

                      {/* Lock / Unlock status badges */}
                      {landmark.unlocked ? (
                        landmark.starsCount && landmark.starsCount > 0 ? (
                          <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md border border-white">
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                            BUKA
                          </span>
                        )
                      ) : (
                        <span className="absolute -top-2 -right-2 bg-slate-900 text-slate-300 rounded-full p-1 shadow-md border border-slate-600">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}

                      {/* Ripple pulsing beacon on active primary landmark */}
                      {landmark.isMainObjective && (
                        <span className="absolute inset-0 rounded-3xl ring-4 ring-emerald-400/60 animate-ping pointer-events-none" />
                      )}
                    </div>

                    {/* Name Pill Tag */}
                    <div
                      className={`mt-1.5 px-2.5 py-0.5 rounded-xl shadow-md text-center whitespace-nowrap transition-transform duration-200 group-hover:scale-105 border ${
                        landmark.unlocked
                          ? 'bg-slate-900/90 text-white border-amber-400/70'
                          : 'bg-slate-900/80 text-slate-400 border-slate-700'
                      }`}
                    >
                      <div className="font-black text-[11px] sm:text-xs font-['Fredoka',sans-serif] flex items-center gap-1">
                        <span>{landmark.name}</span>
                        {landmark.unlocked && <ChevronRight className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* THE CUTE MUSLIM / MUSLIMAH CHARACTER WALKING ON THE REAL MAP! */}
            <div
              style={{
                left: `${characterCoords.x}%`,
                top: `${characterCoords.y}%`,
                transition: 'left 1.1s cubic-bezier(0.4, 0, 0.2, 1), top 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto"
            >
              <CuteMuslimCharacter
                type={player.character}
                variant="sprite"
                isMoving={isTraveling}
                actionMessage={travelSpeech || undefined}
                soundEnabled={player.soundEnabled}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM INSPECTOR PANEL: Selected Landmark Details & Quick Start */}
        <div className="bg-slate-800/90 backdrop-blur-md p-3.5 sm:p-5 rounded-3xl border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shrink-0">
              {selectedLandmark ? selectedLandmark.icon : '🗺️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {selectedLandmark?.unlocked ? 'Lokasi Aktif' : 'Lokasi Terkunci'}
                </span>
                {selectedLandmark?.xpRewardLabel && (
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Hadiah: {selectedLandmark.xpRewardLabel}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif]">
                {selectedLandmark ? selectedLandmark.name : 'Pilih Lokasi di Peta Realistis'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-xl">
                {selectedLandmark
                  ? selectedLandmark.description
                  : 'Klik pada Hutan Pengetahuan untuk mulai menjelajahi materi sains, menonton video, dan memecahkan misi detektif.'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="w-full md:w-auto flex items-center gap-2.5">
            <button
              onClick={() => {
                const forestLm = landmarks.find((l) => l.id === 'hutan');
                if (forestLm) handleLandmarkClick(forestLm);
              }}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base py-3 px-6 rounded-2xl shadow-[0_4px_0_#065f46] hover:shadow-[0_2px_0_#065f46] hover:translate-y-0.5 transition-all cursor-pointer font-['Fredoka',sans-serif] flex items-center justify-center gap-2"
            >
              <span>🌳 Masuk Hutan Pengetahuan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
