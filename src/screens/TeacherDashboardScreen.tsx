import React, { useState, useEffect } from 'react';
import {
  Teacher,
  MateriItem,
  CLASS_LEVELS,
  getSubjectIcon,
} from '../types';
import { EduverseDataService } from '../utils/eduStore';
import {
  BookOpen,
  Gamepad2,
  Search,
  Users,
  Award,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  Play,
  CheckCircle2,
  Video,
  X,
  ExternalLink,
  Save,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface TeacherDashboardScreenProps {
  teacher: Teacher;
  onLogout: () => void;
  onSwitchToStudentView: () => void;
  soundEnabled: boolean;
}

type DashboardTab = 'materi' | 'game' | 'misi' | 'siswa' | 'badge' | 'progress';

interface MateriFormData {
  id?: string;
  title: string;
  classLevel: number;
  subject: string;
  customSubject: string;
  description: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  xpReward: number;
  isActive: boolean;
}

export const TeacherDashboardScreen: React.FC<TeacherDashboardScreenProps> = ({
  teacher,
  onLogout,
  onSwitchToStudentView,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('materi');

  // Materials state
  const [materiList, setMateriList] = useState<MateriItem[]>([]);

  // Filter state
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<MateriFormData>({
    title: '',
    classLevel: 4,
    subject: 'Matematika',
    customSubject: '',
    description: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    xpReward: 20,
    isActive: true,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState<MateriItem | null>(null);

  // Student experience preview modal state
  const [previewMateri, setPreviewMateri] = useState<MateriItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all materials from data store
  const refreshMateriList = () => {
    const list = EduverseDataService.getAllMateri();
    setMateriList(list);
  };

  useEffect(() => {
    refreshMateriList();
  }, [teacher.id]);

  // Standard subjects list for dropdown
  const standardSubjects = [
    'Matematika',
    'IPAS',
    'Bahasa Indonesia',
    'PAI',
    'Akidah Akhlak',
    'Fikih',
    'SKI',
    "Qur'an Hadis",
    'Bahasa Arab',
    'Bahasa Inggris',
    'Bahasa Jawa',
    'Seni',
    'PJOK',
  ];

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  // Open Form: Add new material
  const handleOpenAddMateri = () => {
    playSound('click', soundEnabled);
    setIsEditing(false);
    setValidationError(null);
    setFormData({
      id: undefined,
      title: '',
      classLevel: filterClass === 'all' ? 4 : filterClass,
      subject: filterSubject === 'all' ? 'Matematika' : filterSubject,
      customSubject: '',
      description: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      xpReward: 20,
      isActive: true,
    });
    setIsFormOpen(true);
  };

  // Open Form: Edit existing material
  const handleOpenEditMateri = (item: MateriItem) => {
    playSound('click', soundEnabled);
    setIsEditing(true);
    setValidationError(null);

    const isCustom = !standardSubjects.includes(item.subject);
    setFormData({
      id: item.id,
      title: item.title,
      classLevel: item.classLevel,
      subject: isCustom ? '__custom__' : item.subject,
      customSubject: isCustom ? item.subject : '',
      description: item.description || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      xpReward: item.xpReward || 20,
      isActive: item.isActive !== false,
    });
    setIsFormOpen(true);
  };

  // Save Material (with simple validations)
  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Judul wajib diisi
    if (!formData.title.trim()) {
      setValidationError('Judul materi wajib diisi!');
      return;
    }

    // 2. Kelas wajib dipilih
    if (!formData.classLevel || formData.classLevel < 1 || formData.classLevel > 6) {
      setValidationError('Kelas wajib dipilih (Kelas 1 - 6)!');
      return;
    }

    // 3. Mata pelajaran wajib dipilih
    const finalSubject =
      formData.subject === '__custom__'
        ? formData.customSubject.trim()
        : formData.subject.trim();

    if (!finalSubject) {
      setValidationError('Mata pelajaran wajib dipilih atau dituliskan!');
      return;
    }

    // 4. Isi materi wajib diisi
    if (!formData.content.trim()) {
      setValidationError('Isi materi pembelajaran wajib diisi!');
      return;
    }

    const contentId = formData.id || `materi-${Date.now()}`;
    const payload: MateriItem = {
      id: contentId,
      contentId,
      teacherId: teacher.id,
      classLevel: Number(formData.classLevel),
      classId: `kelas-${formData.classLevel}`,
      subject: finalSubject,
      subjectId: finalSubject.toLowerCase().replace(/\s+/g, '_'),
      subjectIcon: getSubjectIcon(finalSubject),
      title: formData.title.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      videoUrl: formData.videoUrl.trim() || undefined,
      order: materiList.length + 1,
      xpReward: Number(formData.xpReward) || 20,
      isActive: formData.isActive,
      isDemo: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    EduverseDataService.saveMateri(payload, teacher.id);
    playSound('success', soundEnabled);

    setIsFormOpen(false);
    refreshMateriList();
    showToast(`✓ Materi "${payload.title}" berhasil disimpan!`);
  };

  // Delete Material Handler
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    playSound('wrong', soundEnabled);
    EduverseDataService.deleteMateri(itemToDelete.id);
    setItemToDelete(null);
    refreshMateriList();
    showToast(`✓ Materi "${itemToDelete.title}" berhasil dihapus.`);
  };

  // Filtered materials
  const filteredMateri = materiList.filter((m) => {
    const classMatch = filterClass === 'all' || m.classLevel === filterClass;
    const subjectMatch =
      filterSubject === 'all' || m.subject.toLowerCase() === filterSubject.toLowerCase();
    const searchMatch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && subjectMatch && searchMatch;
  });

  return (
    <div
      id="teacher-dashboard-screen"
      className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col select-none"
    >
      {/* ========================================================
          HEADER: DASHBOARD GURU
          ======================================================== */}
      <header className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/80 px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Welcome Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-base sm:text-xl font-['Fredoka',sans-serif] tracking-tight">
                  DASHBOARD GURU
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {teacher.schoolName || 'MI Teladan'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Selamat datang di <strong className="text-amber-400">EDUVERSE</strong> — {teacher.name}
              </p>
            </div>
          </div>

          {/* Right: Mode Siswa & Logout Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-mode-siswa"
              onClick={() => {
                playSound('click', soundEnabled);
                onSwitchToStudentView();
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer font-['Fredoka',sans-serif]"
              title="Masuk ke petualangan siswa untuk menguji materi yang telah Anda buat"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>🎮 MODE SISWA (UJI PETUALANGAN)</span>
            </button>

            <button
              id="btn-logout-guru"
              onClick={() => {
                playSound('click', soundEnabled);
                onLogout();
              }}
              className="bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-600"
              title="Keluar dari akun guru"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-emerald-600 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col">
        {/* ========================================================
            NAVIGATION TABS (Materi, Game, Misi, Siswa, Badge, Progress)
            ======================================================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-5 scrollbar-none border-b border-slate-700/80">
          <button
            id="tab-materi"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('materi');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Materi ({materiList.length})</span>
          </button>

          <button
            id="tab-game"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('game');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'game'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 Game</span>
          </button>

          <button
            id="tab-misi"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('misi');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'misi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>🔎 Misi</span>
          </button>

          <button
            id="tab-siswa"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('siswa');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'siswa'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👨‍🎓 Siswa</span>
          </button>

          <button
            id="tab-badge"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('badge');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'badge'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>🏅 Badge</span>
          </button>

          <button
            id="tab-progress"
            onClick={() => {
              playSound('click', soundEnabled);
              setActiveTab('progress');
            }}
            className={`flex items-center gap-2 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-['Fredoka',sans-serif] ${
              activeTab === 'progress'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Progress</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: 📚 MATERI (UTAMA / FULLY DEVELOPED)
            ======================================================== */}
        {activeTab === 'materi' && (
          <div className="space-y-4">
            {/* Top Bar: Section Title & + TAMBAH MATERI button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-4 sm:p-5 rounded-3xl border border-slate-700 shadow-md">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2">
                  <span>📚</span>
                  <span>Materi Pembelajaran Saya</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Materi yang Anda simpan akan langsung tersinkronisasi ke <strong>Pondok Materi</strong> siswa sesuai tingkatan kelas dan mata pelajaran.
                </p>
              </div>

              <button
                id="btn-tambah-materi"
                onClick={handleOpenAddMateri}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer font-['Fredoka',sans-serif] shrink-0"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>+ TAMBAH MATERI</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              {/* Class Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Kelas:</span>
                </span>
                <button
                  onClick={() => setFilterClass('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    filterClass === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Semua Kelas
                </button>
                {CLASS_LEVELS.map((c) => (
                  <button
                    key={c.level}
                    onClick={() => setFilterClass(c.level)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterClass === c.level
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              {/* Subject Filter & Search Input */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Semua Mata Pelajaran</option>
                  {standardSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul materi..."
                    className="w-full bg-slate-700 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* List / Cards of Materials */}
            {filteredMateri.length === 0 ? (
              <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-3xl p-10 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-300">Belum Ada Materi Untuk Kategori Ini</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Klik tombol <strong>+ TAMBAH MATERI</strong> di atas untuk membuat materi pelajaran baru!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMateri.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/90 border border-slate-700 hover:border-amber-400/50 rounded-2xl p-4.5 flex flex-col justify-between transition-all shadow-md group relative"
                  >
                    <div>
                      {/* Top Badges: Class, Subject, Status, XP */}
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span>{item.subjectIcon || getSubjectIcon(item.subject)}</span>
                          <span>Kelas {item.classLevel} • {item.subject}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.isDemo ? (
                            <span className="text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                              DEMO AWAL
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                item.isActive !== false
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-700 text-slate-400 border-slate-600'
                              }`}
                            >
                              {item.isActive !== false ? 'Aktif' : 'Draft'}
                            </span>
                          )}

                          <span className="text-[11px] font-black bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            ⭐ +{item.xpReward || 20} XP
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-black text-base sm:text-lg text-white font-['Fredoka',sans-serif] group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                        {item.description || item.content.slice(0, 110)}
                      </p>

                      {/* Video or Image Indicator */}
                      <div className="flex items-center gap-2 mt-2.5">
                        {item.videoUrl && (
                          <span className="text-[11px] text-sky-400 flex items-center gap-1 bg-sky-950/40 px-2 py-1 rounded-lg border border-sky-800/40">
                            <Video className="w-3 h-3" />
                            <span>Ada Video</span>
                          </span>
                        )}
                        {item.imageUrl && (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800/40">
                            <span>🖼️ Ada Gambar</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Edit, Hapus, Preview */}
                    <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditMateri(item)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit Materi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            playSound('click', soundEnabled);
                            setPreviewMateri(item);
                          }}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          title="Preview tampilan siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          playSound('click', soundEnabled);
                          setItemToDelete(item);
                        }}
                        className="bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-rose-500/30"
                        title="Hapus Materi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            PLACEHOLDER MENUS: GAME, MISI, SISWA, BADGE, PROGRESS
            ======================================================== */}
        {activeTab !== 'materi' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
                {activeTab === 'game' && '🎮'}
                {activeTab === 'misi' && '🔎'}
                {activeTab === 'siswa' && '👨‍🎓'}
                {activeTab === 'badge' && '🏅'}
                {activeTab === 'progress' && '📊'}
              </div>

              <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30 mb-2 font-['Fredoka',sans-serif]">
                TAHAP BERIKUTNYA
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] mb-2">
                Fitur ini sedang dalam pengembangan tahap berikutnya.
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Fokus pengembangan saat ini adalah pembuktian alur:
                <br />
                <strong className="text-emerald-400">Guru Membuat Materi</strong> ➔{' '}
                <strong className="text-amber-400">Materi Tersimpan</strong> ➔{' '}
                <strong className="text-sky-400">Materi Muncul di Sisi Siswa</strong>.
                <br />
                Menu ini akan diintegrasikan secara penuh pada tahap selanjutnya.
              </p>

              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  setActiveTab('materi');
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md cursor-pointer font-['Fredoka',sans-serif] transition-transform hover:scale-102"
              >
                ← Kembali ke Kelola Materi
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: FORM TAMBAH / EDIT MATERI
          ======================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {isEditing ? 'Perbarui Materi' : 'Materi Baru Siswa'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                {isEditing ? 'Edit Materi Pembelajaran' : 'Tambah Materi Baru'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Isi form di bawah ini. Materi akan langsung tersimpan dan dapat diakses siswa di petualangannya.
              </p>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="mb-4 bg-rose-950/60 border border-rose-500/50 rounded-2xl p-3 flex items-center gap-2 text-rose-300 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMateri} className="space-y-4">
              {/* 1. Judul Materi */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Judul Materi <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Operasi Pecahan Senilai"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none"
                />
              </div>

              {/* 2. Kelas & 3. Mata Pelajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Kelas <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => setFormData({ ...formData, classLevel: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none"
                  >
                    {CLASS_LEVELS.map((c) => (
                      <option key={c.level} value={c.level}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Mata Pelajaran <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none"
                  >
                    {standardSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="__custom__">+ Tambah Mata Pelajaran Lain...</option>
                  </select>
                </div>
              </div>

              {/* Custom Subject input if user selects "+ Tambah Mata Pelajaran Lain..." */}
              {formData.subject === '__custom__' && (
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30 animate-fadeIn">
                  <label className="block text-xs font-extrabold text-amber-300 mb-1">
                    Nama Mata Pelajaran Baru: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customSubject}
                    onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                    placeholder="Contoh: Sejarah Kebudayaan Islam / Bahasa Sunda"
                    className="w-full bg-slate-900 border border-amber-400/60 rounded-xl py-2 px-3 text-white text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* 4. Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Deskripsi Singkat (Ringkasan Ramah Siswa):
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang mudah dipahami siswa"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none"
                />
              </div>

              {/* 5. Isi Materi Lengkap */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Isi Materi Pembelajaran <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan uraian materi pelajaran lengkap di sini, poin penjelasan, konsep penting, atau contoh soal..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* 6. Gambar & 7. Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    URL Gambar Ilustrasi (Opsional):
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... (URL gambar)"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2 px-3.5 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    URL Video Pembelajaran (Opsional):
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2 px-3.5 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* 8. XP Reward & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Hadiah XP Siswa:
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2 px-3.5 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Status Materi:
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl py-2 px-3.5 text-white text-sm focus:outline-none"
                  >
                    <option value="active">Aktif (Dapat Dipelajari Siswa)</option>
                    <option value="draft">Draft (Disembunyikan Dulu)</option>
                  </select>
                </div>
              </div>

              {/* Bottom Actions: Batal & SIMPAN MATERI */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  id="btn-simpan-materi"
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-sm shadow-md cursor-pointer font-['Fredoka',sans-serif] flex items-center gap-1.5 transition-transform hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>SIMPAN MATERI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS MATERI
          ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 border-2 border-rose-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-2xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-xl font-black text-white font-['Fredoka',sans-serif]">
              Hapus Materi Pembelajaran
            </h3>
            <p className="text-xs text-slate-300 mt-1.5">
              Yakin ingin menghapus materi ini?
            </p>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700 my-4 text-left">
              <span className="text-[11px] font-black bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md">
                Kelas {itemToDelete.classLevel} • {itemToDelete.subject}
              </span>
              <h4 className="font-black text-white text-sm mt-1.5 font-['Fredoka',sans-serif]">
                {itemToDelete.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {itemToDelete.description || itemToDelete.content.slice(0, 80)}
              </p>
            </div>

            <p className="text-[11px] text-rose-300 font-bold mb-5">
              ⚠️ Materi ini akan dihapus dari sistem dan tidak lagi muncul di Pondok Materi siswa.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-delete"
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-md cursor-pointer transition-transform hover:scale-102 font-['Fredoka',sans-serif]"
              >
                Ya, Hapus Materi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PREVIEW MATERI (PENGALAMAN SISWA)
          ======================================================== */}
      {previewMateri && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto text-slate-800">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
              <div>
                <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  👁️ Pratinjau Pengalaman Siswa
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tampilan ini persis seperti yang dibuka siswa di Pondok Materi Hutan Pengetahuan
                </p>
              </div>

              <button
                onClick={() => setPreviewMateri(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Pondok Materi Card Header */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-center mb-4">
              <span className="text-4xl block mb-2">
                {previewMateri.subjectIcon || getSubjectIcon(previewMateri.subject)}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-950 font-['Fredoka',sans-serif]">
                {previewMateri.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <span className="bg-amber-200 text-amber-900 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Kelas {previewMateri.classLevel}
                </span>
                <span className="bg-sky-100 text-sky-900 font-black text-xs px-2.5 py-0.5 rounded-full">
                  {previewMateri.subject}
                </span>
                <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-2.5 py-0.5 rounded-full">
                  ⭐ +{previewMateri.xpReward || 20} XP
                </span>
              </div>
            </div>

            {/* Description */}
            {previewMateri.description && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs sm:text-sm text-slate-700 font-medium">
                <strong className="text-amber-800 block mb-0.5">Ringkasan Materi:</strong>
                {previewMateri.description}
              </div>
            )}

            {/* Image (if provided) */}
            {previewMateri.imageUrl && (
              <div className="mb-4 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm">
                <img
                  src={previewMateri.imageUrl}
                  alt={previewMateri.title}
                  className="w-full max-h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Video (if provided) */}
            {previewMateri.videoUrl && (
              <div className="mb-4">
                {getYouTubeEmbedUrl(previewMateri.videoUrl) ? (
                  <div className="aspect-video rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm">
                    <iframe
                      src={getYouTubeEmbedUrl(previewMateri.videoUrl)!}
                      title={previewMateri.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={previewMateri.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-sky-50 border border-sky-300 rounded-xl flex items-center justify-between text-xs font-bold text-sky-800 hover:bg-sky-100"
                  >
                    <span className="flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-sky-600" />
                      <span>Buka Tautan Video Pembelajaran</span>
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Full Content */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-5">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">
                Isi Materi Pembelajaran:
              </h4>
              <div className="text-xs sm:text-sm text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                {previewMateri.content}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewMateri(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md cursor-pointer font-['Fredoka',sans-serif]"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
