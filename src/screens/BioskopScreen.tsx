import React, { useState, useEffect } from 'react';
import { PlayerState } from '../types';
import { Play, Pause, RotateCcw, CheckCircle2, Film, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface BioskopScreenProps {
  player: PlayerState;
  onCompleteVideo: (earnedXp: number) => void;
  onBackToForest: () => void;
}

export const BioskopScreen: React.FC<BioskopScreenProps> = ({
  player,
  onCompleteVideo,
  onBackToForest,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const [showDoneModal, setShowDoneModal] = useState<boolean>(false);

  // Video scenes by subject
  const defaultIpasScenes = [
    {
      time: '00:00',
      title: '1. Matahari: Sumber Energi Utama',
      illustration: '☀️🌱',
      text: 'Matahari memancarkan energi cahaya dan panas yang menghangatkan bumi dan membantu tumbuhan membuat makanan.',
      color: 'from-amber-400 to-yellow-500',
    },
    {
      time: '00:08',
      title: '2. Energi Angin & Gerak',
      illustration: '🌬️🌀',
      text: 'Hembusan angin memiliki energi gerak yang dapat memutar kincir angin raksasa dan menghasilkan listrik ramah lingkungan!',
      color: 'from-sky-400 to-teal-500',
    },
    {
      time: '00:16',
      title: '3. Energi Listrik di Rumah Kita',
      illustration: '⚡💡',
      text: 'Listrik dialirkan ke rumah-rumah untuk menyalakan lampu, kipas angin, televisi, dan alat belajar siswa!',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const subjectScenes: Record<string, typeof defaultIpasScenes> = {
    'Matematika': [
      {
        time: '00:00',
        title: '1. Mengenal Pecahan',
        illustration: '🍕✂️',
        text: 'Satu loyang pizza dibagi 2 sama besar menjadi pecahan 1/2. Pecahan adalah bagian dari keseluruhan!',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        time: '00:08',
        title: '2. Pembilang dan Penyebut',
        illustration: '🔢📐',
        text: 'Angka di atas disebut pembilang (bagian yang diambil), angka di bawah disebut penyebut (total bagian keseluruhan).',
        color: 'from-amber-400 to-orange-500',
      },
      {
        time: '00:16',
        title: '3. Pecahan Senilai',
        illustration: '⚖️✨',
        text: 'Pecahan 1/2 sama nilainya dengan 2/4 dan 4/8. Walaupun angkanya berbeda, besarnya tetap sama!',
        color: 'from-emerald-500 to-teal-600',
      },
    ],
    'Bahasa Indonesia': [
      {
        time: '00:00',
        title: '1. Kalimat Transitif',
        illustration: '✍️⚽',
        text: 'Kalimat transitif membutuhkan objek untuk melengkapi artinya, contohnya: "Rafi menendang bola".',
        color: 'from-purple-500 to-indigo-600',
      },
      {
        time: '00:08',
        title: '2. Kalimat Intransitif',
        illustration: '🏃‍♂️💨',
        text: 'Kalimat intransitif tidak membutuhkan objek, contohnya: "Alya berlari kencang" atau "Adik tertidur pulas".',
        color: 'from-rose-400 to-pink-500',
      },
      {
        time: '00:16',
        title: '3. Pola SPO (Subjek-Predikat-Objek)',
        illustration: '📚🎯',
        text: 'Subjek adalah pelaku, Predikat adalah aktivitas kerja, dan Objek adalah yang dikenai tindakan.',
        color: 'from-teal-500 to-cyan-600',
      },
    ],
    'PAI': [
      {
        time: '00:00',
        title: '1. Berbakti Kepada Orang Tua',
        illustration: '🤲❤️',
        text: 'Orang tua merawat dan mendoakan kita dengan kasih sayang. Ridho Allah terletak pada ridho kedua orang tua.',
        color: 'from-emerald-500 to-green-600',
      },
      {
        time: '00:08',
        title: '2. Memuliakan Guru',
        illustration: '🏫📖',
        text: 'Guru adalah pelita ilmu di madrasah. Hormatilah guru dengan mendengarkan nasehat dan menyapa dengan salam.',
        color: 'from-sky-500 to-indigo-500',
      },
      {
        time: '00:16',
        title: '3. Bertutur Kata Santun',
        illustration: '🌸💬',
        text: 'Katakan perkataan yang baik atau diam. Tutur kata yang lembut adalah cerminan akhlak mulia seorang muslim.',
        color: 'from-amber-400 to-yellow-500',
      },
    ],
  };

  const videoScenes = subjectScenes[player.selectedSubject || 'IPAS'] || defaultIpasScenes;

  // Video playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 4;
          if (next < 35) setActiveFrame(0);
          else if (next < 70) setActiveFrame(1);
          else setActiveFrame(2);
          return next;
        });
      }, 400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    playSound('click', player.soundEnabled);
    if (progress >= 100) {
      setProgress(0);
      setActiveFrame(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleFinishWatching = () => {
    playSound('complete', player.soundEnabled);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
    setShowDoneModal(true);
    onCompleteVideo(10);
  };

  const currentScene = videoScenes[activeFrame];

  return (
    <div
      id="bioskop-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 flex flex-col items-center justify-center select-none"
    >
      <div className="max-w-3xl w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-5 sm:p-7 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3 mb-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎬</span>
            <div>
              <div className="inline-block bg-sky-500/20 text-sky-300 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full mb-0.5 border border-sky-400/30">
                BIOSKOP BELAJAR EDUVERSE • KELAS {player.selectedClass || 4}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif]">
                Video Pembelajaran: {player.selectedSubject || 'IPAS'}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Saksikan penjelasan visual interaktif untuk memahami materi {player.selectedSubject || 'IPAS'} dengan seru dan menyenangkan!
              </p>
            </div>
          </div>

          <button
            id="btn-bioskop-kembali-ke-hutan"
            onClick={onBackToForest}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Kembali ke Hutan</span>
          </button>
        </div>

        {/* Video Screen Area (Theater Frame) */}
        <div className="relative aspect-video w-full bg-black rounded-2xl border-4 border-amber-500/80 shadow-inner overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          {/* Subtle Projector Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Status */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              EDU-PLAY
            </span>
            <span className="font-mono">{currentScene.time} / 00:25</span>
          </div>

          {/* Center Stage Presentation Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
            <div className={`p-4 rounded-3xl bg-gradient-to-br ${currentScene.color} shadow-2xl mb-3 transform transition-all duration-500 ${isPlaying ? 'scale-105' : ''}`}>
              <span className="text-5xl sm:text-7xl block animate-pulse">
                {currentScene.illustration}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white font-['Fredoka',sans-serif] drop-shadow-md">
              {currentScene.title}
            </h3>
            <p className="max-w-md text-xs sm:text-sm text-slate-200 mt-1.5 px-4 font-medium leading-relaxed drop-shadow-sm">
              {currentScene.text}
            </p>
          </div>

          {/* Video Scrubber & Bottom Controls */}
          <div className="relative z-10 space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Play / Pause Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="btn-play-video"
              onClick={togglePlay}
              className={`flex items-center gap-2 font-black text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>JEDA</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{progress > 0 && progress < 100 ? 'LANJUT PLAY' : '▶ PLAY'}</span>
                </>
              )}
            </button>

            {progress > 0 && (
              <button
                onClick={() => {
                  setProgress(0);
                  setActiveFrame(0);
                  setIsPlaying(true);
                }}
                className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors"
                title="Putar dari Awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Selesai Menonton Button */}
          <button
            id="btn-selesai-menonton"
            onClick={handleFinishWatching}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-[0_4px_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>SELESAI MENONTON (+10 XP)</span>
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {showDoneModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full border-4 border-amber-400 shadow-2xl p-6 text-center animate-bounce">
            <span className="text-5xl block mb-2">🎬</span>
            <div className="inline-block bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full mb-2">
              ⭐ +10 XP Diterima!
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif] mb-2">
              Luar Biasa!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              Kamu sudah menyelesaikan menonton video edukasi tentang berbagai bentuk energi!
            </p>
            <button
              onClick={() => {
                setShowDoneModal(false);
                onBackToForest();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 transition-all"
            >
              Kembali ke Hutan 🌳
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
