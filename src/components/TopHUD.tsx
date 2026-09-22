import React, { useState } from 'react';
import { PlayerState, getXpProgressForLevel, GameScreen } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Map, User, Search, Volume2, VolumeX, Award, Sparkles, X, RotateCcw } from 'lucide-react';
import { playSound } from '../utils/sound';

interface TopHUDProps {
  player: PlayerState;
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onSelectClassSubject?: () => void;
  onOpenTeacherPortal?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  player,
  currentScreen,
  onNavigate,
  onToggleSound,
  onResetProgress,
  onSelectClassSubject,
  onOpenTeacherPortal,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMisiModal, setShowMisiModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const xpProgress = getXpProgressForLevel(player.xp);

  const handleMapClick = () => {
    playSound('click', player.soundEnabled);
    onNavigate('world_map');
  };

  const handleProfileClick = () => {
    playSound('click', player.soundEnabled);
    setShowProfileModal(true);
  };

  const handleMisiClick = () => {
    playSound('click', player.soundEnabled);
    setShowMisiModal(true);
  };

  const handleBadgeClick = () => {
    playSound('click', player.soundEnabled);
    setShowBadgeModal(true);
  };

  const handleSoundToggle = () => {
    onToggleSound();
  };

  return (
    <>
      <header
        id="top-hud-bar"
        className="w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 px-3 py-2 sm:px-6 sm:py-2.5 shadow-sm sticky top-0 z-40 transition-all"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Player Profile & Level */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            {/* 👤 Nama & Level */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-300/80 rounded-2xl px-2.5 py-1 transition-all shadow-xs group cursor-pointer"
              title="Lihat Profil Petualang"
            >
              <CharacterAvatar type={player.character} size="sm" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-800 text-xs sm:text-sm leading-tight font-['Fredoka',sans-serif]">
                    👤 {player.name || 'Petualang'}
                  </span>
                  <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                    🎯 Lv.{player.level}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-16 sm:w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${xpProgress.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
                    {xpProgress.title}
                  </span>
                </div>
              </div>
            </button>

            {/* ⭐ XP Counter */}
            <div
              className="flex items-center gap-1 bg-amber-500/10 border border-amber-300 text-amber-800 font-black px-2 sm:px-2.5 py-1 rounded-xl text-xs sm:text-sm shadow-xs"
              title="Total XP (Pengalaman)"
            >
              <span className="text-sm sm:text-base leading-none">⭐</span>
              <span>XP: {player.xp}</span>
            </div>

            {/* 🏅 Badges Counter */}
            <button
              onClick={handleBadgeClick}
              className="flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-200 text-indigo-700 font-black px-2 sm:px-2.5 py-1 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer transition-colors"
              title="Klik untuk melihat Badge yang dikumpulkan"
            >
              <span className="text-sm sm:text-base leading-none">🏅</span>
              <span>Badge: {player.badges.length}</span>
            </button>

            {/* Dynamic Class & Subject Selector Pill */}
            {onSelectClassSubject && (
              <button
                id="hud-btn-select-subject"
                onClick={() => {
                  playSound('click', player.soundEnabled);
                  onSelectClassSubject();
                }}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black px-2.5 py-1 rounded-xl text-xs sm:text-sm shadow-xs transition-all hover:scale-102 cursor-pointer"
                title="Ganti Kelas atau Mata Pelajaran"
              >
                <span>📚</span>
                <span>Kelas {player.selectedClass || 4} • {player.selectedSubject || 'IPAS'}</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-sm font-extrabold">🔄 Ganti</span>
              </button>
            )}
          </div>

          {/* Right: The 4 Functional Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. 🗺️ PETA */}
            <button
              id="hud-btn-map"
              onClick={handleMapClick}
              className={`flex items-center gap-1 font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all active:scale-95 shadow-xs cursor-pointer ${
                currentScreen === 'world_map'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
              title="Buka Peta Petualangan"
            >
              <Map className="w-4 h-4 text-emerald-600" />
              <span>🗺️ PETA</span>
            </button>

            {/* 2. 🔎 MISI */}
            <button
              id="hud-btn-mission"
              onClick={handleMisiClick}
              className="relative flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-800 font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl border border-sky-300 transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Lihat Daftar Misi"
            >
              <Search className="w-4 h-4 text-sky-600" />
              <span>🔎 MISI</span>
              {(!player.materiCompleted || !player.videoCompleted || !player.detectiveCompleted) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* 3. 🏅 BADGE */}
            <button
              id="hud-btn-badge"
              onClick={handleBadgeClick}
              className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-300 transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Koleksi Lencana Petualang"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>🏅 BADGE</span>
            </button>

            {/* 4. 👤 PROFIL */}
            <button
              id="hud-btn-profile"
              onClick={handleProfileClick}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-300 transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Buka Profil Petualang"
            >
              <User className="w-4 h-4 text-amber-700" />
              <span>👤 PROFIL</span>
            </button>

            {/* Sound Toggle */}
            <button
              id="hud-btn-sound"
              onClick={handleSoundToggle}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                player.soundEnabled
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
              }`}
              title={player.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {player.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Teacher Portal Shortcut */}
            {onOpenTeacherPortal && (
              <button
                id="hud-btn-teacher-portal"
                onClick={() => {
                  playSound('click', player.soundEnabled);
                  onOpenTeacherPortal();
                }}
                className="bg-indigo-900 hover:bg-indigo-950 text-indigo-100 font-extrabold px-2 sm:px-3 py-1.5 rounded-xl border border-indigo-700 text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Masuk ke Ruang Guru / Dashboard"
              >
                <span>👩‍🏫</span>
                <span className="hidden md:inline">Ruang Guru</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          MODAL: MISI PETUALANGAN
          ======================================================== */}
      {showMisiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-3 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />
            
            <div className="flex items-center justify-between mb-4 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔎</span>
                <div>
                  <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                    Daftar Misi Petualang
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Hutan Pengetahuan — Kelas {player.selectedClass || 4} • {player.selectedSubject || 'IPAS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMisiModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              {/* Misi 1 */}
              <div
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  player.materiCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <span className="text-2xl mt-0.5">
                  {player.materiCompleted ? '✅' : '🏡'}
                </span>
                <div className="flex-1 text-sm">
                  <div className="font-bold flex items-center justify-between">
                    <span>1. Belajar di Pondok Materi</span>
                    <span className="text-xs font-black text-amber-600">+20 XP</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Kunjungi Pondok Materi di Hutan untuk memahami energi di sekitar kita.
                  </p>
                  {player.materiCompleted ? (
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Misi Selesai!
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMisiModal(false);
                        onNavigate('forest');
                      }}
                      className="mt-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-xl shadow-xs"
                    >
                      Pergi ke Hutan →
                    </button>
                  )}
                </div>
              </div>

              {/* Misi 2 */}
              <div
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  player.videoCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-sky-50 border-sky-300 text-sky-950'
                }`}
              >
                <span className="text-2xl mt-0.5">
                  {player.videoCompleted ? '✅' : '🎬'}
                </span>
                <div className="flex-1 text-sm">
                  <div className="font-bold flex items-center justify-between">
                    <span>2. Nonton di Bioskop Belajar</span>
                    <span className="text-xs font-black text-amber-600">+10 XP</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tonton video pembelajaran tentang bentuk-bentuk energi.
                  </p>
                  {player.videoCompleted ? (
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Misi Selesai!
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMisiModal(false);
                        onNavigate('forest');
                      }}
                      className="mt-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-xl shadow-xs"
                    >
                      Pergi ke Bioskop →
                    </button>
                  )}
                </div>
              </div>

              {/* Misi 3 */}
              <div
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  player.detectiveCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : player.materiCompleted
                    ? 'bg-orange-50 border-orange-300 text-orange-950'
                    : 'bg-slate-100 border-slate-300 text-slate-500 opacity-80'
                }`}
              >
                <span className="text-2xl mt-0.5">
                  {player.detectiveCompleted ? '✅' : player.materiCompleted ? '🔓' : '🔒'}
                </span>
                <div className="flex-1 text-sm">
                  <div className="font-bold flex items-center justify-between">
                    <span>3. Pecahkan Misi Pos Detektif</span>
                    <span className="text-xs font-black text-amber-600">+30 XP + Badge</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {player.materiCompleted
                      ? 'Temukan benda-benda yang menggunakan energi listrik!'
                      : 'Pos masih terkunci. Pelajari materi di Pondok Materi terlebih dahulu.'}
                  </p>
                  {player.detectiveCompleted ? (
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Badge Detektif Energi Diperoleh!
                    </span>
                  ) : player.materiCompleted ? (
                    <button
                      onClick={() => {
                        setShowMisiModal(false);
                        onNavigate('forest');
                      }}
                      className="mt-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-xl shadow-xs"
                    >
                      Buka Pos Detektif →
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMisiModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-2xl transition-all shadow-md active:scale-98"
            >
              Tutup Misi
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PROFIL PETUALANG
          ======================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center gap-2">
                <span>👤</span> Kartu Petualang
              </h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setShowResetConfirm(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Character & Name Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-2xl border-2 border-amber-300 flex items-center gap-4 mb-4">
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-amber-200">
                <CharacterAvatar type={player.character} size="lg" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-700">
                  Profil Petualang
                </span>
                <h4 className="text-xl font-black text-slate-800 leading-tight font-['Fredoka',sans-serif]">
                  {player.name || 'Petualang Cilik'}
                </h4>
                <div className="text-xs text-slate-600 font-bold mt-0.5">
                  Karakter: {player.character === 'female_hijab' ? '👧 Alya (Perempuan Berhijab)' : '👦 Rafi (Laki-laki)'}
                </div>

                {/* The 3 Core Stats Panel */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-white/90 border border-amber-300 rounded-xl py-1 px-1.5 shadow-2xs">
                    <span className="text-[10px] text-amber-800 font-bold block">XP</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                      ⭐ {player.xp}
                    </span>
                  </div>
                  <div className="bg-white/90 border border-indigo-200 rounded-xl py-1 px-1.5 shadow-2xs">
                    <span className="text-[10px] text-indigo-800 font-bold block">Badge</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                      🏅 {player.badges.length}
                    </span>
                  </div>
                  <div className="bg-white/90 border border-emerald-300 rounded-xl py-1 px-1.5 shadow-2xs">
                    <span className="text-[10px] text-emerald-800 font-bold block">Level</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 font-['Fredoka',sans-serif]">
                      🎯 {player.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Collection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Koleksi Lencana ({player.badges.length})
                </span>
                {player.badges.length > 0 && (
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setShowBadgeModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Lihat Semua →
                  </button>
                )}
              </div>
              {player.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {player.badges.map((b) => (
                    <div
                      key={b.id}
                      className="bg-amber-50/80 border border-amber-300 rounded-xl p-2.5 flex items-center gap-2.5 shadow-xs"
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-amber-900 truncate">{b.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{b.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                  Belum ada lencana. Selesaikan misi di Hutan Pengetahuan untuk mendapatkan lencana pertamamu!
                </div>
              )}
            </div>

            {/* Reset / Mulai Ulang Option for testing */}
            <div className="pt-3 border-t border-slate-200">
              {showResetConfirm ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-rose-800 mb-2">
                    Yakin ingin mengulang petualangan dari awal? Semua XP dan lencana akan direset.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        onResetProgress();
                        setShowResetConfirm(false);
                        setShowProfileModal(false);
                      }}
                      className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg shadow-xs"
                    >
                      Ya, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 py-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Petualangan dari Awal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KOLEKSI LENCANA / BADGE
          ======================================================== */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-indigo-300 shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400" />
            
            <div className="flex items-center justify-between mb-4 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🏅</span>
                <div>
                  <h3 className="text-xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                    Koleksi Lencana Petualang
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Lencana Kehormatan & Prestasi Belajar</p>
                </div>
              </div>
              <button
                onClick={() => setShowBadgeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              {/* Lencana 1: Detektif Energi */}
              <div
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  player.detectiveCompleted
                    ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <span className="text-4xl shrink-0">
                  {player.detectiveCompleted ? '🔎' : '🔒'}
                </span>
                <div className="flex-1 text-sm">
                  <div className="font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center justify-between">
                    <span>Detektif Energi</span>
                    {player.detectiveCompleted ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                        TERBUKA
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                        TERKUNCI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {player.detectiveCompleted
                      ? 'Berhasil menemukan semua benda bertenaga listrik di Hutan Pengetahuan!'
                      : 'Selesaikan Misi Detektif Energi di Hutan Pengetahuan untuk mendapatkan lencana ini.'}
                  </p>
                </div>
              </div>

              {/* Lencana 2: Penjelajah Hutan */}
              <div
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  player.materiCompleted && player.videoCompleted
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <span className="text-4xl shrink-0">
                  {player.materiCompleted && player.videoCompleted ? '🌳' : '🔒'}
                </span>
                <div className="flex-1 text-sm">
                  <div className="font-black text-slate-800 font-['Fredoka',sans-serif] flex items-center justify-between">
                    <span>Sahabat Hutan</span>
                    {player.materiCompleted && player.videoCompleted ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                        TERBUKA
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                        TERKUNCI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pelajari materi di Pondok Materi dan tonton video di Bioskop Belajar.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBadgeModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Tutup Koleksi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
