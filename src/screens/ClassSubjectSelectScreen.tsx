import React, { useState, useEffect } from 'react';
import { PlayerState, CLASS_LEVELS, getSubjectIcon, MateriItem } from '../types';
import { EduverseDataService } from '../utils/eduStore';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { Compass, Sparkles, BookOpen, ArrowRight, ArrowLeft, Check, Layers } from 'lucide-react';
import { playSound } from '../utils/sound';

interface ClassSubjectSelectScreenProps {
  player: PlayerState;
  onConfirmSelection: (classLevel: number, subject: string, materiId: string) => void;
  onBack: () => void;
}

export const ClassSubjectSelectScreen: React.FC<ClassSubjectSelectScreenProps> = ({
  player,
  onConfirmSelection,
  onBack,
}) => {
  const [selectedClass, setSelectedClass] = useState<number>(player.selectedClass || 4);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(player.selectedSubject || 'IPAS');
  const [availableMaterials, setAvailableMaterials] = useState<MateriItem[]>([]);
  const [selectedMateriId, setSelectedMateriId] = useState<string>(player.selectedMateriId || '');

  // When class changes, compute available subjects
  useEffect(() => {
    const subjects = EduverseDataService.getAvailableSubjectsByClass(selectedClass);
    setAvailableSubjects(subjects);

    // If current selectedSubject is not in available subjects, pick first
    const nextSubject = subjects.includes(selectedSubject) ? selectedSubject : subjects[0] || 'IPAS';
    setSelectedSubject(nextSubject);
  }, [selectedClass]);

  // When class or subject changes, load materials for it
  useEffect(() => {
    const materials = EduverseDataService.getMateriByClassAndSubject(selectedClass, selectedSubject);
    setAvailableMaterials(materials);

    if (materials.length > 0) {
      const match = materials.find((m) => m.id === selectedMateriId);
      setSelectedMateriId(match ? match.id : materials[0].id);
    } else {
      setSelectedMateriId('');
    }
  }, [selectedClass, selectedSubject]);

  const handleClassClick = (level: number) => {
    playSound('click', player.soundEnabled);
    setSelectedClass(level);
  };

  const handleSubjectClick = (subj: string) => {
    playSound('click', player.soundEnabled);
    setSelectedSubject(subj);
  };

  const handleMateriClick = (mId: string) => {
    playSound('click', player.soundEnabled);
    setSelectedMateriId(mId);
  };

  const handleStartAdventure = () => {
    playSound('complete', player.soundEnabled);
    onConfirmSelection(selectedClass, selectedSubject, selectedMateriId);
  };

  return (
    <div
      id="class-subject-select-screen"
      className="min-h-screen w-full bg-gradient-to-b from-emerald-100 via-sky-100 to-amber-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none"
    >
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 shadow-2xl p-4 sm:p-8 relative overflow-hidden flex flex-col gap-6">
        {/* Top Rainbow Stripe */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400" />

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
          <button
            onClick={() => {
              playSound('click', player.soundEnabled);
              onBack();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-2xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <CharacterAvatar type={player.character} size="sm" />
            <div>
              <span className="font-black text-xs sm:text-sm text-slate-800 block">
                {player.name || 'Petualang Cilik'}
              </span>
              <span className="text-[10px] text-amber-700 font-extrabold block">
                ⭐ {player.xp} XP • Level {player.level}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>PILIH TANTANGAN PETUALANGAN BELAJAR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 font-['Fredoka',sans-serif]">
            PILIH KELAS & MATA PELAJARANMU
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto mt-1 font-medium">
            Jelajahi dunia petualangan dengan materi dan tantangan seru sesuai tingkatan kelasmu di Madrasah!
          </p>
        </div>

        {/* STEP 1: PEMILIHAN KELAS (GAME CARDS) */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-black text-slate-800 text-sm sm:text-base font-['Fredoka',sans-serif]">
              Langkah 1: Pilih Kelas MI Kamu
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {CLASS_LEVELS.map((cls) => {
              const isSelected = selectedClass === cls.level;
              return (
                <div
                  key={cls.level}
                  onClick={() => handleClassClick(cls.level)}
                  className={`cursor-pointer rounded-2xl p-3 border-3 transition-all flex flex-col items-center justify-center text-center relative ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-md scale-102 ring-3 ring-emerald-200'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl block mb-1">{cls.icon}</span>
                  <span className="font-black text-slate-800 text-sm font-['Fredoka',sans-serif] block">
                    {cls.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block line-clamp-1 mt-0.5">
                    {cls.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: PEMILIHAN MATA PELAJARAN */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-black text-slate-800 text-sm sm:text-base font-['Fredoka',sans-serif]">
              Langkah 2: Pilih Mata Pelajaran (Kelas {selectedClass})
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableSubjects.map((subj) => {
              const isSelected = selectedSubject.toLowerCase() === subj.toLowerCase();
              const icon = getSubjectIcon(subj);
              return (
                <button
                  key={subj}
                  onClick={() => handleSubjectClick(subj)}
                  className={`cursor-pointer px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-102 ring-2 ring-sky-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-300'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{subj}</span>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: PILIH TOPIK MATERI / PETUALANGAN */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-black text-slate-800 text-sm sm:text-base font-['Fredoka',sans-serif]">
                Langkah 3: Pilih Materi Pembelajaran
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-extrabold">
              {availableMaterials.length} Materi Tersedia
            </span>
          </div>

          {availableMaterials.length === 0 ? (
            <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-4 text-center">
              <BookOpen className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <p className="text-xs text-amber-800 font-bold">
                Materi untuk mata pelajaran ini siap ditambahkan oleh Bapak/Ibu Guru.
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Kamu tetap dapat menjelajahi Hutan Pengetahuan untuk mata pelajaran ini!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableMaterials.map((mat) => {
                const isSelected = selectedMateriId === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => handleMateriClick(mat.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                      {mat.subjectIcon || getSubjectIcon(mat.subject)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs sm:text-sm text-slate-800 font-['Fredoka',sans-serif]">
                          {mat.title}
                        </h4>
                        <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                          +{mat.xpReward} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {mat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              Petualangan Aktif: <strong>Kelas {selectedClass} • {selectedSubject}</strong>
            </span>
          </div>

          <button
            id="btn-masuk-petualangan"
            onClick={handleStartAdventure}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-base sm:text-lg px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Fredoka',sans-serif] transition-transform hover:scale-102"
          >
            <span>🚀 JELAJAHI HUTAN PENGETAHUAN</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
