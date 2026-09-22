import React, { useState } from 'react';
import { PlayerState, GameScreen } from '../types';
import { Gamepad2, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { EduverseDataService } from '../utils/eduStore';

interface ArenaGameScreenProps {
  player: PlayerState;
  onAddXp: (amount: number) => void;
  onNavigate: (screen: GameScreen) => void;
}

interface QuizItem {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export const ArenaGameScreen: React.FC<ArenaGameScreenProps> = ({
  player,
  onAddXp,
  onNavigate,
}) => {
  const activeGame = EduverseDataService.getGameByClassAndSubject(
    player.selectedClass || 4,
    player.selectedSubject || 'IPAS'
  );

  const defaultIpasQuizzes: QuizItem[] = [
    {
      question: '1. Energi adalah...',
      options: [
        'Kemampuan untuk melakukan usaha atau kerja',
        'Benda yang tidak dapat bergerak',
        'Zat yang tidak berguna bagi manusia',
        'Warna pelangi di langit sore',
      ],
      correctIdx: 0,
      explanation: 'Benar sekali! Energi adalah kemampuan untuk melakukan usaha atau kerja.',
    },
    {
      question: '2. Benda yang menggunakan energi listrik adalah...',
      options: [
        'Meja kayu',
        'Batu kali',
        'Kipas angin dan televisi',
        'Buku tulis',
      ],
      correctIdx: 2,
      explanation: 'Tepat! Kipas angin dan televisi membutuhkan aliran energi listrik agar dapat berfungsi.',
    },
    {
      question: '3. Energi matahari menghasilkan...',
      options: [
        'Cahaya dan panas',
        'Es dan salju',
        'Batu dan pasir',
        'Minyak bumi',
      ],
      correctIdx: 0,
      explanation: 'Hebat! Energi matahari memancarkan cahaya terang dan panas yang menghangatkan seluruh bumi.',
    },
  ];

  const quizzes: QuizItem[] =
    activeGame && activeGame.questions.length > 0
      ? activeGame.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctIdx: q.correctAnswerIndex,
          explanation: q.explanation || 'Jawaban tepat!',
        }))
      : defaultIpasQuizzes;

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = quizzes[currentQIndex] || quizzes[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIdx) {
      playSound('success', player.soundEnabled);
      setScore((s) => s + 1);
      onAddXp(10);
    } else {
      playSound('wrong', player.soundEnabled);
    }
  };

  const handleNext = () => {
    playSound('click', player.soundEnabled);
    setSelectedIdx(null);
    setIsAnswered(false);

    if (currentQIndex < quizzes.length - 1) {
      setCurrentQIndex((q) => q + 1);
    } else {
      setIsFinished(true);
      playSound('levelup', player.soundEnabled);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }
    }
  };

  const handleRestart = () => {
    playSound('click', player.soundEnabled);
    setCurrentQIndex(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div
      id="arena-game-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-gradient-to-b from-purple-100 via-pink-50 to-amber-100 p-4 sm:p-6 flex flex-col items-center justify-center select-none"
    >
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-orange-400 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-orange-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎮</span>
            <div>
              <div className="inline-block bg-orange-100 text-orange-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full mb-0.5 border border-orange-300">
                ARENA GAME EDUVERSE • KELAS {player.selectedClass || 4}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                {activeGame?.title || `Tantangan Kuis ${player.selectedSubject || 'IPAS'}`}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('world_map')}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Peta</span>
          </button>
        </div>

        {!isFinished ? (
          <div>
            {/* Question Counter */}
            <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-3">
              <span>Soal {currentQIndex + 1} dari {quizzes.length}</span>
              <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                ⭐ +10 XP tiap jawaban benar
              </span>
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-4 sm:p-5 mb-4">
              <h3 className="text-base sm:text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5 mb-4">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-800';

                if (isAnswered) {
                  if (idx === currentQ.correctIdx) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-black';
                  } else if (idx === selectedIdx) {
                    btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIdx && (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-black">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>+10 XP</span>
                      </span>
                    )}
                    {isAnswered && idx === selectedIdx && idx !== currentQ.correctIdx && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div
                className={`p-3.5 rounded-2xl border-2 mb-4 text-xs sm:text-sm font-bold animate-fadeIn ${
                  selectedIdx === currentQ.correctIdx
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                id="btn-quiz-next"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_#9a3412] active:translate-y-1 transition-all cursor-pointer font-['Fredoka',sans-serif]"
              >
                {currentQIndex < quizzes.length - 1 ? 'Pertanyaan Berikutnya →' : 'Lihat Hasil Akhir 🎉'}
              </button>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center py-4 animate-scaleUp">
            <span className="text-6xl block mb-2 animate-bounce">🏆</span>
            <div className="inline-block bg-emerald-100 text-emerald-900 font-extrabold text-xs px-3.5 py-1 rounded-full mb-3 border border-emerald-300">
              TAMAT BABAK PERTAMA!
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-emerald-900 font-['Fredoka',sans-serif] mb-2 leading-snug">
              SELAMAT! KAMU MENYELESAIKAN PETUALANGAN HUTAN PENGETAHUAN!
            </h3>

            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-5">
              Kamu berhasil menjawab {score} dari {quizzes.length} soal kuis dengan cemerlang!
            </p>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 max-w-sm mx-auto mb-6 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-amber-800 block">Total Hadiah XP Kuis</span>
              <span className="text-3xl font-black text-amber-950 font-['Fredoka',sans-serif] block mt-1">
                ⭐ +{score * 10} XP
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>

              <button
                id="btn-arena-ke-peta"
                onClick={() => onNavigate('world_map')}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer font-['Fredoka',sans-serif]"
              >
                <span>Buka Peta Petualangan 🗺️</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
