import React from 'react';
import { PlayerState, GameScreen } from '../types';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { ArrowLeft, Compass, Sparkles, MessageCircle, Trees, Award } from 'lucide-react';
import { playSound } from '../utils/sound';

interface DesaPetualangScreenProps {
  player: PlayerState;
  onNavigate: (screen: GameScreen) => void;
}

export const DesaPetualangScreen: React.FC<DesaPetualangScreenProps> = ({
  player,
  onNavigate,
}) => {
  return (
    <div
      id="desa-petualang-screen"
      className="min-h-[calc(100vh-65px)] w-full bg-gradient-to-b from-amber-100 via-orange-50 to-emerald-100 p-4 sm:p-6 flex flex-col items-center justify-center select-none"
    >
      <div className="max-w-3xl w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🏠</span>
            <div>
              <div className="inline-block bg-amber-200 text-amber-900 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full mb-0.5">
                DESA UTAMA EDUVERSE
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                Desa Petualang
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('world_map')}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Peta</span>
          </button>
        </div>

        {/* NPC Greeting Card: Guru Desa */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-md text-4xl shrink-0">
            🧑‍🏫
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-emerald-800 font-black text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pak Guru Rian (Pembimbing Desa)</span>
            </div>
            <h3 className="text-lg font-black text-slate-800 font-['Fredoka',sans-serif]">
              “Halo, Petualang {player.name || 'Cilik'}! Selamat Datang di Desa!”
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Di dunia Eduverse ini, kamu akan belajar sains dan pengetahuan alam sambil berpetualang.
              Langkah pertamamu adalah menuju ke <strong>🌳 Hutan Pengetahuan</strong>.
              Di sana kamu bisa belajar di <strong>Pondok Materi</strong>, menonton di <strong>Bioskop Belajar</strong>, dan memecahkan misteri di <strong>Pos Detektif</strong>!
            </p>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 flex items-center gap-3">
            <CharacterAvatar type={player.character} size="md" />
            <div>
              <div className="text-xs font-bold text-amber-800">Petualang Aktif</div>
              <div className="text-base font-black text-slate-800">{player.name || 'Petualang'}</div>
              <div className="text-xs text-emerald-700 font-extrabold">⭐ {player.xp} XP • Level {player.level}</div>
            </div>
          </div>

          <div className="bg-sky-50/80 border border-sky-300 rounded-2xl p-4 flex items-center gap-3">
            <div className="text-3xl p-2 bg-white rounded-xl shadow-xs">🏅</div>
            <div>
              <div className="text-xs font-bold text-sky-800">Lencana Diperoleh</div>
              <div className="text-base font-black text-slate-800">
                {player.badges.length > 0 ? player.badges[0].name : 'Belum Ada Lencana'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {player.detectiveCompleted ? 'Misi Detektif Selesai!' : 'Ayo selesaikan misi Hutan'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Langsung ke Hutan Pengetahuan */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onNavigate('forest')}
            className="w-full flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer font-['Fredoka',sans-serif]"
          >
            <Trees className="w-5 h-5" />
            <span>BERANGKAT KE HUTAN PENGETAHUAN →</span>
          </button>

          <button
            onClick={() => onNavigate('world_map')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition-colors text-sm"
          >
            Buka Peta Dunia
          </button>
        </div>
      </div>
    </div>
  );
};
