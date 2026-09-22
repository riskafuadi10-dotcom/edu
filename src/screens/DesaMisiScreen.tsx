import React, { useState, useEffect } from 'react';
import { PlayerState, Badge, MateriItem, GameItem, MissionItem, GameQuestion } from '../types';
import { EduverseDataService } from '../utils/eduStore';
import { playSound } from '../utils/sound';
import { CharacterAvatar } from '../components/CharacterAvatar';
import confetti from 'canvas-confetti';
import {
  Search,
  BookOpen,
  Film,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Gamepad2,
  Lock,
  RotateCcw,
  Volume2,
  Info,
} from 'lucide-react';

interface DesaMisiScreenProps {
  player: PlayerState;
  onBackToMap: () => void;
  onCompleteDetective: (earnedXp: number, badge: Badge) => void;
  onAddXp?: (amount: number) => void;
  onSelectMateri?: (materiId: string, classLevel: number, subject: string) => void;
  initialMateriId?: string;
}

type MissionStage = 'materi' | 'video' | 'tantangan' | 'game' | 'selesai';

export const DesaMisiScreen: React.FC<DesaMisiScreenProps> = ({
  player,
  onBackToMap,
  onCompleteDetective,
  onAddXp,
  onSelectMateri,
  initialMateriId,
}) => {
  // Filter state for "PILIH PETUALANGAN"
  const [selectedClass, setSelectedClass] = useState<number>(player.selectedClass || 4);
  const [selectedSubject, setSelectedSubject] = useState<string>(player.selectedSubject || 'IPAS');
  
  // Active selected mission (material)
  const [activeMateriId, setActiveMateriId] = useState<string | null>(initialMateriId || null);
  const [stage, setStage] = useState<MissionStage>('materi');

  // Detective Challenge State (Stage 3)
  const [revealedClueIds, setRevealedClueIds] = useState<string[]>([]);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);

  // Game/Quiz State (Stage 4)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Video playback helper (Stage 2)
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Available subjects for the current selected class (dynamically computed from store)
  const availableSubjects = EduverseDataService.getAvailableSubjectsByClass(selectedClass);

  // Ensure selectedSubject is valid in availableSubjects
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [selectedClass, availableSubjects, selectedSubject]);

  // Load materials dynamically from EduverseDataService
  const materiList = EduverseDataService.getMateriByClassAndSubject(selectedClass, selectedSubject);

  // Active material if a mission is in progress
  const activeMateri: MateriItem | undefined = activeMateriId
    ? EduverseDataService.getMateriById(activeMateriId)
    : undefined;

  // Active mission derived dynamically from active material
  const activeMission: MissionItem | null = activeMateri
    ? EduverseDataService.getEffectiveMissionForMateri(activeMateri)
    : null;

  // Active game (quiz) linked to this material
  const activeGame: GameItem | undefined = activeMateri
    ? EduverseDataService.getGameForMateri(activeMateri.id)
    : undefined;

  // Start a specific mission
  const handleStartMission = (materi: MateriItem) => {
    playSound('click', player.soundEnabled);
    setActiveMateriId(materi.id);
    setStage('materi');
    setRevealedClueIds([]);
    setChallengeFeedback(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);

    if (onSelectMateri) {
      onSelectMateri(materi.id, materi.classLevel, materi.subject);
    }
  };

  // Stage 1 -> Stage 2 (or 3)
  const handleFinishMateriReading = () => {
    playSound('click', player.soundEnabled);
    if (onAddXp) onAddXp(20);

    // If material has video, go to video stage, otherwise jump to tantangan
    if (activeMateri?.videoUrl) {
      setStage('video');
    } else {
      setStage('tantangan');
    }
  };

  // Stage 2 -> Stage 3
  const handleFinishVideo = () => {
    playSound('click', player.soundEnabled);
    if (onAddXp) onAddXp(10);
    setStage('tantangan');
  };

  // Stage 3: Clue Card Inspection
  const handleInspectClue = (item: { id: string; isTarget: boolean; name: string; educationNote: string }) => {
    if (revealedClueIds.includes(item.id)) return;

    if (item.isTarget) {
      playSound('success', player.soundEnabled);
      setChallengeFeedback(`✨ Bukti Ditemukan: ${item.name}! ${item.educationNote}`);
    } else {
      playSound('wrong', player.soundEnabled);
      setChallengeFeedback(`⚠️ Petunjuk Keliru: ${item.name}. ${item.educationNote}`);
    }

    setRevealedClueIds((prev) => [...prev, item.id]);
  };

  // Check if all correct target clues in Stage 3 have been uncovered
  const targetItems = activeMission?.items?.filter((it) => it.isTarget) || [];
  const foundTargetCount = activeMission?.items?.filter((it) => it.isTarget && revealedClueIds.includes(it.id)).length || 0;
  const isChallengeComplete = targetItems.length > 0 && foundTargetCount >= targetItems.length;

  // Stage 3 -> Stage 4
  const handleFinishTantangan = () => {
    playSound('complete', player.soundEnabled);
    setStage('game');
  };

  // Stage 4: Quiz Answer Selection
  const handleSelectQuizAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    playSound('click', player.soundEnabled);
    setSelectedAnswerIdx(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswerIdx === null || !activeGame) return;
    const currentQ = activeGame.questions[currentQuestionIdx];
    const isCorrect = selectedAnswerIdx === currentQ.correctAnswerIndex;

    if (isCorrect) {
      playSound('success', player.soundEnabled);
      setQuizScore((prev) => prev + 1);
    } else {
      playSound('wrong', player.soundEnabled);
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestionOrFinish = () => {
    if (!activeGame) return;
    if (currentQuestionIdx < activeGame.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz complete!
      handleFinishMission();
    }
  };

  // Stage 5: Finalize Mission & Grant Rewards
  const handleFinishMission = () => {
    playSound('levelup', player.soundEnabled);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    const rewardBadge: Badge = activeMission?.badgeReward || {
      id: `badge-${activeMateri?.id || 'detektif'}`,
      name: `DETEKTIF ${activeMateri?.subject.toUpperCase() || 'ILMU'}`,
      icon: activeMateri?.subjectIcon || '🔎',
      description: `Berhasil menyelesaikan Misi Detektif ${activeMateri?.title || ''}`,
      earnedAt: new Date().toLocaleDateString('id-ID'),
    };

    onCompleteDetective(30, rewardBadge);

    // Sync student roster in teacher's database
    EduverseDataService.syncStudentProgress(
      player.name,
      selectedClass,
      player.xp + 30,
      player.level,
      player.badges.length + 1
    );

    setStage('selesai');
  };

  // ==========================================
  // VIEW: MISSION IN PROGRESS (DETEKTIF ACTIVE)
  // ==========================================
  if (activeMateriId) {
    // Edge case: Material deleted by teacher
    if (!activeMateri) {
      return (
        <div id="desa-misi-screen" className="min-h-[calc(100vh-65px)] w-full bg-slate-900 text-white p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-slate-800/95 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="text-6xl mb-3">🔒</div>
            <h3 className="text-2xl font-black text-rose-400 font-['Fredoka',sans-serif]">MISI TIDAK TERSEDIA</h3>
            <p className="text-slate-300 mt-2 mb-6">
              Materi yang diperlukan untuk misi ini sudah tidak tersedia atau telah diperbarui oleh guru.
            </p>
            <button
              id="btn-misi-kembali-pilihan"
              onClick={() => setActiveMateriId(null)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              ← Kembali ke Pilihan Misi
            </button>
          </div>
        </div>
      );
    }

    return (
      <div id="desa-misi-screen" className="min-h-[calc(100vh-65px)] w-full bg-slate-900 text-slate-100 flex flex-col items-center p-3 sm:p-6 select-none">
        <div className="max-w-4xl w-full flex flex-col gap-4">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                id="btn-kembali-ke-pilihan-misi"
                onClick={() => {
                  playSound('click', player.soundEnabled);
                  setActiveMateriId(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs sm:text-sm font-bold text-amber-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pilih Misi Lain</span>
              </button>
              <div>
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  MISI DETEKTIF • {activeMateri.subject} • KELAS {activeMateri.classLevel}
                </span>
                <h2 className="text-base sm:text-xl font-black font-['Fredoka',sans-serif] text-white">
                  🔎 DETEKTIF: "{activeMateri.title}"
                </h2>
              </div>
            </div>

            <button
              id="btn-kembali-ke-peta-dari-misi"
              onClick={onBackToMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>← Kembali ke Peta</span>
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between overflow-x-auto text-xs font-bold gap-2">
            {[
              { id: 'materi', label: '1. 📚 Materi' },
              { id: 'video', label: '2. 🎬 Video', disabled: !activeMateri.videoUrl },
              { id: 'tantangan', label: '3. 🔎 Tantangan' },
              { id: 'game', label: '4. 🎮 Game' },
              { id: 'selesai', label: '5. ⭐ Selesai' },
            ].map((stepItem) => {
              const isCurrent = stage === stepItem.id;
              const isPast =
                (stepItem.id === 'materi' && ['video', 'tantangan', 'game', 'selesai'].includes(stage)) ||
                (stepItem.id === 'video' && ['tantangan', 'game', 'selesai'].includes(stage)) ||
                (stepItem.id === 'tantangan' && ['game', 'selesai'].includes(stage)) ||
                (stepItem.id === 'game' && stage === 'selesai');

              return (
                <div
                  key={stepItem.id}
                  className={`flex-1 min-w-[100px] text-center py-1.5 px-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-900 shadow-md font-black'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 bg-slate-800/40 opacity-70'
                  }`}
                >
                  {stepItem.label}
                </div>
              );
            })}
          </div>

          {/* ========================================= */}
          {/* STAGE 1: 📚 MATERI PEMBELAJARAN (GURU)    */}
          {/* ========================================= */}
          {stage === 'materi' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-700/80 pb-4">
                <div>
                  <div className="inline-block bg-sky-500/20 text-sky-300 font-black text-xs px-2.5 py-0.5 rounded-full mb-1 border border-sky-400/30">
                    TAHAP 1: PENGUMPULAN DATA & PENGETAHUAN
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                    {activeMateri.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">{activeMateri.description}</p>
                </div>
                <div className="text-4xl p-2.5 bg-slate-700/50 rounded-2xl border border-slate-600">
                  {activeMateri.subjectIcon || '📚'}
                </div>
              </div>

              {/* Main Content Box */}
              <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-700 text-slate-200 leading-relaxed text-sm sm:text-base whitespace-pre-line max-h-[380px] overflow-y-auto">
                {activeMateri.content}
              </div>

              {/* Summary Points if available */}
              {activeMateri.summaryPoints && activeMateri.summaryPoints.length > 0 && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4">
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Poin Kunci Penyelidikan:
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                    {activeMateri.summaryPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700/80">
                <span className="text-xs text-slate-400">
                  Pelajari materi di atas dengan seksama untuk memecahkan misi detektif!
                </span>
                <button
                  id="btn-materi-lanjut-video"
                  onClick={handleFinishMateriReading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>{activeMateri.videoUrl ? 'Lanjut ke Video Pembelajaran 🎬' : 'Lanjut ke Tantangan Detektif 🔎'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* STAGE 2: 🎬 BIOSKOP / VIDEO MATERI        */}
          {/* ========================================= */}
          {stage === 'video' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <div className="inline-block bg-purple-500/20 text-purple-300 font-black text-xs px-2.5 py-0.5 rounded-full mb-1 border border-purple-400/30">
                    TAHAP 2: PEMERIKSAAN REKAMAN VISUAL
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                    Video Edukasi: {activeMateri.title}
                  </h3>
                </div>
                <span className="text-3xl">🎬</span>
              </div>

              {activeMateri.videoUrl ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 bg-black flex items-center justify-center shadow-lg relative">
                  {activeMateri.videoUrl.includes('youtube.com') || activeMateri.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        activeMateri.videoUrl.includes('embed')
                          ? activeMateri.videoUrl
                          : activeMateri.videoUrl.replace('watch?v=', 'embed/')
                      }
                      title={activeMateri.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="p-6 text-center text-slate-300">
                      <Film className="w-12 h-12 mx-auto text-amber-400 mb-2" />
                      <p className="font-bold text-base">{activeMateri.title}</p>
                      <a
                        href={activeMateri.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-3 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                      >
                        Buka Tautan Video Guru ↗
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/60 rounded-2xl p-6 text-center text-slate-400 border border-slate-700">
                  <Film className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm">Video belum dilampirkan oleh guru pada materi ini.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <button
                  onClick={() => setStage('materi')}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold"
                >
                  ← Baca Kembali Materi
                </button>
                <button
                  id="btn-video-lanjut-tantangan"
                  onClick={handleFinishVideo}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Lanjut ke Tantangan Detektif 🔎</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* STAGE 3: 🔎 TANTANGAN KARTU BUKTI DETEKTIF */}
          {/* ========================================= */}
          {stage === 'tantangan' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-700 pb-3">
                <div>
                  <div className="inline-block bg-amber-500/20 text-amber-300 font-black text-xs px-2.5 py-0.5 rounded-full mb-1 border border-amber-400/30">
                    TAHAP 3: INVESTIGASI KARTU BUKTI
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                    {activeMission?.title || `Misi Detektif: ${activeMateri.title}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
                    {activeMission?.instructions || `Pilihlah kartu bukti dan konsep yang tepat mengenai ${activeMateri.title}!`}
                  </p>
                </div>

                <div className="bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Bukti Ditemukan</span>
                  <span className="text-lg font-black text-emerald-400">
                    {foundTargetCount} / {targetItems.length}
                  </span>
                </div>
              </div>

              {/* Clues Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {activeMission?.items?.map((item) => {
                  const isRevealed = revealedClueIds.includes(item.id);
                  const isCorrect = item.isTarget;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleInspectClue(item)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] relative overflow-hidden select-none ${
                        isRevealed
                          ? isCorrect
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow-md shadow-emerald-500/20'
                            : 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-500/20'
                          : 'bg-slate-900/80 border-slate-700 hover:border-amber-400 text-slate-200 hover:scale-[1.02] shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-3xl">{item.icon}</span>
                        {isRevealed ? (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )
                        ) : (
                          <Search className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="font-bold text-sm leading-snug">{item.name}</p>
                        {isRevealed && (
                          <p className="text-[11px] mt-1.5 opacity-90 leading-tight">
                            {item.educationNote}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Real-time feedback bar */}
              {challengeFeedback && (
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{challengeFeedback}</span>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <button
                  onClick={() => setStage('materi')}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold"
                >
                  ← Tinjau Materi
                </button>

                {isChallengeComplete ? (
                  <button
                    id="btn-tantangan-lanjut-game"
                    onClick={handleFinishTantangan}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer animate-pulse"
                  >
                    <span>Lanjut ke Tantangan Game 🎮</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-amber-300 font-bold">
                    Temukan seluruh bukti yang benar ({foundTargetCount}/{targetItems.length}) untuk melanjutkan!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* STAGE 4: 🎮 GAME / KUIS MATERI GURU       */}
          {/* ========================================= */}
          {stage === 'game' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <div className="inline-block bg-teal-500/20 text-teal-300 font-black text-xs px-2.5 py-0.5 rounded-full mb-1 border border-teal-400/30">
                    TAHAP 4: UJI TANGKAS & EVALUASI DETEKTIF
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                    {activeGame ? activeGame.title : `Arena Kuis: ${activeMateri.title}`}
                  </h3>
                </div>
                <span className="text-3xl">🎮</span>
              </div>

              {/* Case 1: Guru has created a game/quiz for this material */}
              {activeGame && activeGame.questions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Question Progress */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Pertanyaan {currentQuestionIdx + 1} dari {activeGame.questions.length}
                    </span>
                    <span className="font-bold text-amber-400">Skor: {quizScore} Benar</span>
                  </div>

                  {/* Question Box */}
                  <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700">
                    <p className="text-base sm:text-lg font-bold text-white">
                      {activeGame.questions[currentQuestionIdx].question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeGame.questions[currentQuestionIdx].options.map((opt, idx) => {
                      const isSelected = selectedAnswerIdx === idx;
                      const isCorrect = idx === activeGame.questions[currentQuestionIdx].correctAnswerIndex;

                      let btnStyle = 'bg-slate-900/80 border-slate-700 hover:border-amber-400 text-slate-200';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectQuizAnswer(idx)}
                          className={`p-3.5 rounded-xl border-2 text-left text-sm transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-center font-bold text-xs flex items-center justify-center shrink-0">
                            {['A', 'B', 'C', 'D'][idx]}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation if submitted */}
                  {isAnswerSubmitted && activeGame.questions[currentQuestionIdx].explanation && (
                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-300">
                      <span className="font-bold text-amber-300">Penjelasan: </span>
                      {activeGame.questions[currentQuestionIdx].explanation}
                    </div>
                  )}

                  {/* Question Action Button */}
                  <div className="flex justify-end pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        disabled={selectedAnswerIdx === null}
                        onClick={handleSubmitQuizAnswer}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                      >
                        Kirim Jawaban
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestionOrFinish}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                      >
                        {currentQuestionIdx < activeGame.questions.length - 1
                          ? 'Pertanyaan Selanjutnya →'
                          : 'Selesaikan Misi & Ambil Hadiah ⭐'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Case 2: Teacher has NOT created a game yet for this material (As specified in prompt #12) */
                <div className="bg-slate-900/80 rounded-2xl border border-amber-400/40 p-6 sm:p-8 text-center flex flex-col items-center gap-3">
                  <span className="text-5xl">🎮</span>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-300 font-['Fredoka',sans-serif]">
                    Game untuk materi ini belum dibuat oleh guru.
                  </h4>
                  <p className="text-sm text-slate-300 max-w-md">
                    Jangan khawatir! Kamu sudah berhasil mempelajari materi dan mengungkap bukti detektif untuk materi ini.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-3">
                    <button
                      onClick={() => setStage('materi')}
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md cursor-pointer"
                    >
                      📚 Pelajari Materi
                    </button>
                    <button
                      onClick={handleFinishMission}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                      ⭐ Selesaikan Misi & Ambil Hadiah
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================= */}
          {/* STAGE 5: ⭐ MISI SELESAI & REWARD BADGE   */}
          {/* ========================================= */}
          {stage === 'selesai' && (
            <div className="bg-slate-800/95 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-5 shadow-2xl">
              <div className="text-6xl animate-bounce">🏆</div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                  MISI DETEKTIF BERHASIL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka',sans-serif] mt-2">
                  Alhamdulillah! Misi Berhasil Dipecahkan!
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  Kamu telah menuntaskan penyelidikan detektif untuk materi "{activeMateri.title}". Pengetahuanmu kini bertambah luas!
                </p>
              </div>

              {/* Reward Cards */}
              <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                <div className="flex-1 min-w-[130px] p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700 text-center">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-black text-amber-400 block mt-1">+30 XP</span>
                  <span className="text-[11px] text-slate-400">Bonus Misi Detektif</span>
                </div>
                <div className="flex-1 min-w-[130px] p-3.5 bg-slate-900/80 rounded-2xl border border-amber-400/40 text-center">
                  <span className="text-2xl">{activeMission?.badgeReward?.icon || '🏅'}</span>
                  <span className="text-xs font-black text-amber-300 block mt-1">
                    {activeMission?.badgeReward?.name || `DETEKTIF ${activeMateri.subject.toUpperCase()}`}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">Lencana Diraih!</span>
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-slate-700 w-full">
                <button
                  id="btn-selesai-kembali-ke-peta"
                  onClick={onBackToMap}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  ← Kembali ke Peta EDUVERSE
                </button>
                <button
                  id="btn-selesai-pilih-misi-lain"
                  onClick={() => setActiveMateriId(null)}
                  className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-sm shadow-md cursor-pointer"
                >
                  🔎 Pilih Misi Detektif Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MISSION HUB / "PILIH PETUALANGAN"
  // ==========================================
  return (
    <div
      id="desa-misi-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-slate-900 text-slate-100 p-3 sm:p-6 flex flex-col items-center select-none"
    >
      <div className="max-w-5xl w-full flex flex-col gap-6">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🔎</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif] text-white">
                DETEKTIF EDUVERSE
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Pusat misi penyelidikan dan tantangan belajar madrasah dinamis
              </p>
            </div>
          </div>

          <button
            id="btn-kembali-ke-peta-dari-desa"
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Kembali ke Peta</span>
          </button>
        </div>

        {/* Welcome Character Greeting Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-800 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl relative overflow-hidden">
          <div className="relative shrink-0">
            <CharacterAvatar type={player.character} size="lg" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-xs shadow-md">
              🔎
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block bg-amber-400/20 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full mb-1 border border-amber-400/30">
              MARKAS BESAR DETEKTIF
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif]">
              Selamat datang di Markas Detektif EDUVERSE!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              "Pilih misi belajar dan pecahkan tantangannya! Setiap materi yang dibuat oleh Bapak/Ibu guru telah kami siapkan menjadi arena petualangan penyelidikan yang seru."
            </p>
          </div>
        </div>

        {/* SECTION: PILIH PETUALANGAN */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div>
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider block">
                FILTER PETUALANGAN
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Fredoka',sans-serif]">
                🔎 PILIH PETUALANGAN
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              Tersedia {materiList.length} Misi di Kelas {selectedClass}
            </span>
          </div>

          {/* 1. Pilih Kelas */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Pilih Tingkat Kelas:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    id={`btn-pilih-kelas-${cls}`}
                    onClick={() => {
                      playSound('click', player.soundEnabled);
                      setSelectedClass(cls);
                    }}
                    className={`py-2 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md scale-105'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-amber-400/60'
                    }`}
                  >
                    Kelas {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Mata Pelajaran (Dynamic from teacher's materials) */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Pilih Mata Pelajaran:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map((subj) => {
                const isSelected = selectedSubject.toLowerCase() === subj.toLowerCase();
                return (
                  <button
                    key={subj}
                    id={`btn-pilih-mapel-${subj.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      playSound('click', player.soundEnabled);
                      setSelectedSubject(subj);
                    }}
                    className={`py-1.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-105'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-sky-400/60'
                    }`}
                  >
                    <span>{subj}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION: TAMPILKAN MATERI & MISI YANG TERSEDIA */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2">
              <span>📚 Misi {selectedSubject} Kelas {selectedClass}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                {materiList.length} Misi
              </span>
            </h3>
          </div>

          {materiList.length === 0 ? (
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <span className="text-4xl">📭</span>
              <p className="font-bold text-base text-slate-300">Belum ada materi untuk mata pelajaran ini.</p>
              <p className="text-xs max-w-md">
                Bapak/Ibu guru dapat menambahkan materi baru melalui Dashboard Guru, atau silakan pilih kelas dan mata pelajaran lain di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materiList.map((materi) => {
                const gameForThis = EduverseDataService.getGameForMateri(materi.id);
                const isCompleted = player.completedMateriIds?.includes(materi.id);

                return (
                  <div
                    key={materi.id}
                    className="bg-slate-800/90 border border-slate-700 hover:border-amber-400/60 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all shadow-lg hover:shadow-amber-500/5 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-3xl p-2 bg-slate-900/60 rounded-2xl border border-slate-700">
                          {materi.subjectIcon || '🔎'}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          {materi.videoUrl && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                              🎬 Video Siap
                            </span>
                          )}
                          {gameForThis && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                              🎮 Game Tersedia
                            </span>
                          )}
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            ⭐ +30 XP
                          </span>
                        </div>
                      </div>

                      <h4 className="text-lg font-black text-white font-['Fredoka',sans-serif] group-hover:text-amber-300 transition-colors">
                        🔎 MISI: {materi.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {materi.description || 'Penyelidikan mendalam seputar materi pelajaran ini.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400 truncate">
                        {materi.isDemo ? 'Contoh Demo Madrasah' : 'Materi Pembelajaran Guru'}
                      </span>
                      <button
                        id={`btn-mulai-misi-${materi.id}`}
                        onClick={() => handleStartMission(materi)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
                      >
                        <span>{isCompleted ? '🔄 Ulangi Misi' : '🚀 Mulai Misi'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
