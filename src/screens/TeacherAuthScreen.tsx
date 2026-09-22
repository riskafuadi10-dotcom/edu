import React, { useState } from 'react';
import { Teacher } from '../types';
import { EduverseDataService, INITIAL_TEACHERS } from '../utils/eduStore';
import { GraduationCap, ArrowLeft, Check, Sparkles, School, KeyRound, Mail, UserPlus, LogIn } from 'lucide-react';
import { playSound } from '../utils/sound';

interface TeacherAuthScreenProps {
  onSuccessLogin: (teacher: Teacher) => void;
  onBackToStudent: () => void;
  soundEnabled: boolean;
}

export const TeacherAuthScreen: React.FC<TeacherAuthScreenProps> = ({
  onSuccessLogin,
  onBackToStudent,
  soundEnabled,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [emailOrNip, setEmailOrNip] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [nipCode, setNipCode] = useState('');
  const [error, setError] = useState('');

  const handleQuickDemoTeacher = (demoTeacher: Teacher) => {
    playSound('click', soundEnabled);
    EduverseDataService.setActiveTeacher(demoTeacher);
    onSuccessLogin(demoTeacher);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrNip.trim()) {
      playSound('wrong', soundEnabled);
      setError('Masukkan Email atau NIP Guru terlebih dahulu.');
      return;
    }
    setError('');
    playSound('success', soundEnabled);
    const teacher = EduverseDataService.loginTeacher(emailOrNip, teacherName);
    onSuccessLogin(teacher);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      playSound('wrong', soundEnabled);
      setError('Masukkan nama lengkap Bapak/Ibu guru.');
      return;
    }
    if (!emailOrNip.trim()) {
      playSound('wrong', soundEnabled);
      setError('Masukkan email madrasah/pribadi.');
      return;
    }
    setError('');
    playSound('levelup', soundEnabled);
    const newTeacher = EduverseDataService.registerTeacher(
      teacherName,
      emailOrNip,
      schoolName,
      nipCode
    );
    onSuccessLogin(newTeacher);
  };

  return (
    <div
      id="teacher-auth-screen"
      className="min-h-screen w-full bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 select-none relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="max-w-xl w-full mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            onBackToStudent();
          }}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-200 bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-2xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Petualangan Siswa</span>
        </button>

        <span className="text-xs text-indigo-300 font-bold bg-indigo-800/60 px-3 py-1 rounded-full border border-indigo-600/50">
          Portal Guru MI
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md rounded-3xl border-2 border-indigo-500/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400" />

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25 border-2 border-white/30">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka',sans-serif]">
            RUANG GURU EDUVERSE
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-md mx-auto">
            Kelola materi, video, kuis arena, misi detektif, dan pantau perkembangan siswa kelas 1–6 MI secara dinamis.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl mb-6 border border-slate-700">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>MASUK GURU</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>DAFTAR GURU BARU</span>
          </button>
        </div>

        {/* Quick Demo Teachers Preset */}
        <div className="mb-6 bg-slate-800/60 border border-slate-700 p-3.5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coba Cepat Akun Guru Demo:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INITIAL_TEACHERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleQuickDemoTeacher(t)}
                className="bg-slate-700/60 hover:bg-indigo-700/60 border border-slate-600 hover:border-indigo-400 p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-center"
              >
                <span className="font-extrabold text-xs text-white truncate">{t.name}</span>
                <span className="text-[10px] text-slate-300 truncate">{t.schoolName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Guru atau NIP / Kode Guru:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailOrNip}
                  onChange={(e) => setEmailOrNip(e.target.value)}
                  placeholder="Contoh: rahma@madrasah.id atau 1987..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer font-['Fredoka',sans-serif] flex items-center justify-center gap-2"
            >
              <span>MASUK KE DASHBOARD</span>
              <Check className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nama Lengkap & Gelar Guru:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Contoh: Ibu Siti Fatimah, S.Pd."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Madrasah / Pribadi:
              </label>
              <input
                type="email"
                value={emailOrNip}
                onChange={(e) => setEmailOrNip(e.target.value)}
                placeholder="Contoh: siti.fatimah@madrasah.id"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Madrasah / Sekolah:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: MI Nurul Huda"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  NIP / Kode Guru (Opsional):
                </label>
                <input
                  type="text"
                  value={nipCode}
                  onChange={(e) => setNipCode(e.target.value)}
                  placeholder="Contoh: 198901..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer font-['Fredoka',sans-serif] mt-2 flex items-center justify-center gap-2"
            >
              <span>DAFTAR & BUAT AKUN GURU</span>
              <Check className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
