import React, { useState } from 'react';
import { PlayerState } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle2, Zap, Award, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { EduverseDataService } from '../utils/eduStore';

interface PondokMateriScreenProps {
  player: PlayerState;
  onCompleteMateri: (earnedXp: number) => void;
  onBackToForest: () => void;
}

export const PondokMateriScreen: React.FC<PondokMateriScreenProps> = ({
  player,
  onCompleteMateri,
  onBackToForest,
}) => {
  const activeMateri =
    EduverseDataService.getMateriById(player.selectedMateriId || '') ||
    EduverseDataService.getMateriByClassAndSubject(player.selectedClass || 4, player.selectedSubject || 'IPAS')[0];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [completedModal, setCompletedModal] = useState<boolean>(false);

  const ipasCards = [
    {
      cardIndex: 1,
      title: 'Apa itu energi?',
      subtitle: 'Konsep Dasar • IPAS Kelas 4',
      badge: 'Kartu 1 dari 4',
      icon: '⚡',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-center shadow-xs">
            <span className="text-5xl block mb-2">⚡</span>
            <blockquote className="text-xl sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif] leading-snug">
              “Energi adalah kemampuan untuk melakukan usaha atau kerja.”
            </blockquote>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-amber-200 text-slate-700 text-sm sm:text-base leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Mengapa Kita Memerlukan Energi?</span>
            </div>
            <p>
              Semua hal di dunia ini bergerak atau berubah karena adanya energi. Tubuh kita membutuhkan energi dari makanan untuk berjalan, bermain, dan belajar setiap hari!
            </p>
            <p className="text-xs sm:text-sm text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
              ✨ <strong>Prinsip Penting:</strong> Energi tidak dapat diciptakan atau dimusnahkan, tetapi dapat diubah dari satu bentuk ke bentuk yang lain.
            </p>
          </div>
        </div>
      ),
    },
    {
      cardIndex: 2,
      title: 'Contoh energi dalam kehidupan sehari-hari.',
      subtitle: 'Bentuk Energi di Lingkungan Kita',
      badge: 'Kartu 2 dari 4',
      icon: '🌍',
      content: (
        <div className="space-y-3.5">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Berikut bentuk-bentuk energi yang sering kita jumpai setiap hari:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">☀️</span>
                <span className="font-black text-sm text-yellow-950 font-['Fredoka',sans-serif]">Energi Cahaya</span>
              </div>
              <p className="text-xs text-slate-700">
                Membuat kita dapat melihat benda di sekitar. Sumber cahaya terbesar bumi adalah <strong>Matahari</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🔥</span>
                <span className="font-black text-sm text-rose-950 font-['Fredoka',sans-serif]">Energi Panas (Kalor)</span>
              </div>
              <p className="text-xs text-slate-700">
                Menghangatkan suhu, membantu mengeringkan pakaian, dan digunakan ibu memasak di dapur.
              </p>
            </div>

            <div className="p-3.5 bg-sky-50 border-2 border-sky-300 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌬️</span>
                <span className="font-black text-sm text-sky-950 font-['Fredoka',sans-serif]">Energi Gerak</span>
              </div>
              <p className="text-xs text-slate-700">
                Energi dari benda yang berpindah atau bergerak, seperti angin yang berhembus dan roda sepeda yang berputar.
              </p>
            </div>

            <div className="p-3.5 bg-purple-50 border-2 border-purple-300 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🔊</span>
                <span className="font-black text-sm text-purple-950 font-['Fredoka',sans-serif]">Energi Bunyi</span>
              </div>
              <p className="text-xs text-slate-700">
                Dihasilkan dari getaran benda, seperti petikan senar gitar, tepuk tangan, dan suara lonceng sekolah.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      cardIndex: 3,
      title: 'Energi listrik.',
      subtitle: 'Kekuatan Utama Rumah & Sekolah',
      badge: 'Kartu 3 dari 4',
      icon: '🔌',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 rounded-2xl p-4 text-center">
            <span className="text-4xl sm:text-5xl block mb-2">⚡</span>
            <h4 className="text-lg sm:text-xl font-black text-sky-950 font-['Fredoka',sans-serif]">
              Apa itu Energi Listrik?
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-lg mx-auto">
              Energi listrik adalah energi yang mengalir melalui kabel dalam bentuk muatan listrik. Energi ini sangat praktis karena paling mudah diubah ke bentuk energi lainnya!
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              🔄 Perubahan Energi Listrik yang Mengagumkan:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-2xl block mb-1">💡</span>
                <span className="font-black text-amber-900 block">Listrik ➔ Cahaya</span>
                <span className="text-slate-600 text-[11px]">Contoh: Lampu belajar</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                <span className="text-2xl block mb-1">♨️</span>
                <span className="font-black text-rose-900 block">Listrik ➔ Panas</span>
                <span className="text-slate-600 text-[11px]">Contoh: Setrika & Rice Cooker</span>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200 text-center">
                <span className="text-2xl block mb-1">🌀</span>
                <span className="font-black text-sky-900 block">Listrik ➔ Gerak</span>
                <span className="text-slate-600 text-[11px]">Contoh: Kipas angin & Blender</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      cardIndex: 4,
      title: 'Contoh benda yang menggunakan energi listrik.',
      subtitle: 'Persiapan Menjadi Detektif Energi!',
      badge: 'Kartu 4 dari 4',
      icon: '💡',
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 font-semibold">
            Perhatikan baik-baik benda-benda ini, kamu akan mencarinya nanti di <strong>Pos Detektif</strong>:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center">
              <span className="text-3xl sm:text-4xl block mb-1">💡</span>
              <div className="font-black text-xs sm:text-sm text-amber-900 font-['Fredoka',sans-serif]">Lampu</div>
              <div className="text-[10px] text-slate-500 font-semibold">Energi Cahaya</div>
            </div>

            <div className="p-3 bg-sky-50 border-2 border-sky-300 rounded-2xl text-center">
              <span className="text-3xl sm:text-4xl block mb-1">🌀</span>
              <div className="font-black text-xs sm:text-sm text-sky-900 font-['Fredoka',sans-serif]">Kipas Angin</div>
              <div className="text-[10px] text-slate-500 font-semibold">Energi Gerak</div>
            </div>

            <div className="p-3 bg-indigo-50 border-2 border-indigo-300 rounded-2xl text-center">
              <span className="text-3xl sm:text-4xl block mb-1">📺</span>
              <div className="font-black text-xs sm:text-sm text-indigo-900 font-['Fredoka',sans-serif]">Televisi</div>
              <div className="text-[10px] text-slate-500 font-semibold">Cahaya & Bunyi</div>
            </div>

            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center">
              <span className="text-3xl sm:text-4xl block mb-1">♨️</span>
              <div className="font-black text-xs sm:text-sm text-rose-900 font-['Fredoka',sans-serif]">Setrika</div>
              <div className="text-[10px] text-slate-500 font-semibold">Energi Panas</div>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl text-center">
            <span className="text-xs sm:text-sm text-emerald-950 font-bold block">
              ⭐ Selesaikan belajar sekarang untuk meraih <strong>+20 XP</strong> dan membuka <strong>Pos Detektif</strong>!
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Dynamic cards for custom teacher materials or other demo materials
  const getDynamicCards = () => {
    if (!activeMateri) return ipasCards;
    if (activeMateri.id === 'demo-ipas-energi') return ipasCards;

    // If explicit sections exist
    if (activeMateri.sections && activeMateri.sections.length > 0) {
      return activeMateri.sections.map((sec, idx) => ({
        cardIndex: idx + 1,
        title: sec.title,
        subtitle: `${activeMateri.subject} Kelas ${activeMateri.classLevel}`,
        badge: `Kartu ${idx + 1} dari ${activeMateri.sections!.length}`,
        icon: idx === 0 ? '📘' : idx === 1 ? '💡' : '✨',
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-4xl block mb-2">{idx === 0 ? '📖' : idx === 1 ? '🔍' : '🌟'}</span>
              <h4 className="text-lg sm:text-xl font-black text-amber-950 font-['Fredoka',sans-serif] leading-snug">
                {sec.title}
              </h4>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-amber-200 text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
              <p className="whitespace-pre-line leading-relaxed font-medium">
                {sec.content}
              </p>
              {sec.keyTakeaway && (
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2 text-xs sm:text-sm text-amber-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sec.keyTakeaway}</span>
                </div>
              )}
            </div>
          </div>
        ),
      }));
    }

    // Default 3-step dynamic cards for ANY material created by teacher
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = activeMateri.videoUrl ? activeMateri.videoUrl.match(regExp) : null;
    const youtubeEmbedUrl = match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;

    return [
      // Card 1: Pengantar Materi
      {
        cardIndex: 1,
        title: activeMateri.title,
        subtitle: `${activeMateri.subject} • Kelas ${activeMateri.classLevel}`,
        badge: 'Kartu 1 dari 3: Pengantar',
        icon: '📖',
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
              <span className="text-4xl block mb-2">🌟</span>
              <h3 className="text-lg sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif] leading-snug">
                {activeMateri.title}
              </h3>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-amber-200/80 text-amber-900 font-black text-xs px-3 py-1 rounded-full">
                <span>Kelas {activeMateri.classLevel}</span>
                <span>•</span>
                <span>{activeMateri.subject}</span>
                <span>•</span>
                <span>⭐ +{activeMateri.xpReward || 20} XP</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Ringkasan Pembelajaran:</span>
              </div>
              <p className="text-slate-700 font-medium">
                {activeMateri.description || 'Pelajari materi ini dengan cermat untuk memahami konsep penting dan raih XP petualangan!'}
              </p>

              {activeMateri.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-amber-200 shadow-xs">
                  <img
                    src={activeMateri.imageUrl}
                    alt={activeMateri.title}
                    className="w-full max-h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {youtubeEmbedUrl && (
                <div className="mt-3 aspect-video rounded-2xl overflow-hidden border border-amber-300 shadow-sm">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={activeMateri.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        ),
      },

      // Card 2: Isi Lengkap Materi
      {
        cardIndex: 2,
        title: 'Penjelasan & Uraian Materi',
        subtitle: `${activeMateri.subject} • Kelas ${activeMateri.classLevel}`,
        badge: 'Kartu 2 dari 3: Materi Inti',
        icon: '💡',
        content: (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 max-h-[360px] overflow-y-auto">
              <div className="flex items-center gap-2 font-black text-amber-900 border-b border-amber-100 pb-2 text-base">
                <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{activeMateri.title}</span>
              </div>
              <div className="whitespace-pre-line text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">
                {activeMateri.content}
              </div>
            </div>
          </div>
        ),
      },

      // Card 3: Kesimpulan & Uji Pemahaman
      {
        cardIndex: 3,
        title: 'Poin Penting & Penyelesaian',
        subtitle: `Raih +${activeMateri.xpReward || 20} XP!`,
        badge: 'Kartu 3 dari 3: Kesimpulan',
        icon: '🏆',
        content: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
              <span className="text-5xl block mb-2">🎉</span>
              <h4 className="text-lg sm:text-xl font-black text-emerald-950 font-['Fredoka',sans-serif]">
                Hebat! Kamu Hampir Selesai!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Kamu telah membaca dan mempelajari materi <strong>{activeMateri.title}</strong>.
              </p>
            </div>

            {activeMateri.summaryPoints && activeMateri.summaryPoints.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700">Poin Penting:</div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeMateri.summaryPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl text-center">
              <span className="text-xs sm:text-sm text-emerald-950 font-bold block">
                ⭐ Klik <strong>SELESAI BELAJAR</strong> sekarang untuk mengklaim <strong>+{activeMateri.xpReward || 20} XP</strong> dan membuka tantangan berikutnya!
              </span>
            </div>
          </div>
        ),
      },
    ];
  };

  const cards = getDynamicCards();

  const handleNext = () => {
    if (currentSlide < cards.length - 1) {
      playSound('click', player.soundEnabled);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      playSound('click', player.soundEnabled);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    playSound('complete', player.soundEnabled);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
    const reward = activeMateri?.xpReward || 20;
    onCompleteMateri(reward);
    setCompletedModal(true);
  };

  const current = cards[currentSlide] || cards[0];
  const isFirstCard = currentSlide === 0;
  const isLastCard = currentSlide === cards.length - 1;

  return (
    <div
      id="pondok-materi-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-gradient-to-b from-amber-100 via-emerald-50 to-teal-100 p-3 sm:p-6 flex flex-col items-center select-none"
    >
      <div className="max-w-2xl w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              playSound('click', player.soundEnabled);
              onBackToForest();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-white/80 hover:bg-white border border-amber-300 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Hutan</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Kartu {currentSlide + 1} / {cards.length}</span>
            <div className="flex gap-1">
              {cards.map((_item: unknown, idx: number) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'w-6 bg-amber-500'
                      : idx < currentSlide
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Learning Card */}
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden relative">
          <div className="h-3 bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400" />

          {/* Card Header */}
          <div className="p-4 sm:p-6 pb-2 border-b border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-300">
                {current.badge}
              </span>
              <span className="text-xs font-bold text-slate-500">{current.subtitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center gap-2">
              <span>{current.icon}</span>
              <span>{current.title}</span>
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 min-h-[300px] flex flex-col justify-center">
            {current.content}
          </div>

          {/* Card Footer Controls: ← Kembali, Berikutnya →, or ✅ SELESAI BELAJAR */}
          <div className="p-4 sm:p-6 pt-3 bg-amber-50/50 border-t border-amber-100 flex items-center justify-between gap-3">
            <button
              id="btn-materi-kembali"
              onClick={handlePrev}
              disabled={isFirstCard}
              className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                isFirstCard
                  ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Kembali</span>
            </button>

            {!isLastCard ? (
              <button
                id="btn-materi-berikutnya"
                onClick={handleNext}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span>Berikutnya →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-selesai-belajar"
                onClick={handleFinish}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all animate-bounce cursor-pointer"
              >
                <span>✅ SELESAI BELAJAR</span>
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  +20 XP
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal ("Hebat! Kamu telah membuka Pos Detektif!") */}
      {completedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 text-center relative overflow-hidden animate-scaleUp">
            <div className="absolute top-0 right-0 left-0 h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400" />
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-300 shadow-md">
              <span className="text-4xl animate-bounce">🎉</span>
            </div>

            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Materi Selesai!
            </span>

            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif] mt-2 mb-1">
              Hebat! Kamu telah membuka Pos Detektif!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Kamu telah mempelajari materi energi dengan sempurna dan mendapatkan <strong>+20 XP</strong>! Sekarang Pos Detektif di Hutan Pengetahuan sudah terbuka untuk penyelidikanmu.
            </p>

            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 mb-5 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-amber-900">
              <span className="text-xl">🔓</span>
              <span>Pos Detektif Siap Dijelajahi!</span>
            </div>

            <button
              id="btn-modal-ke-hutan"
              onClick={() => {
                setCompletedModal(false);
                onBackToForest();
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan ke Hutan Pengetahuan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
