export type CharacterType = 'female_hijab' | 'male';

export type GameScreen = 
  | 'opening'
  | 'character_select'
  | 'select_class_subject'
  | 'world_map'
  | 'forest'
  | 'pondok_materi'
  | 'bioskop'
  | 'pos_detektif'
  | 'desa_misi'
  | 'desa_petualang'
  | 'arena_game'
  | 'teacher_auth'
  | 'teacher_dashboard';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface BadgeTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category?: string;
}

export interface Teacher {
  id: string; // teacherId
  name: string;
  email: string;
  nipOrCode?: string;
  schoolName?: string;
}

export interface MateriSection {
  title: string;
  content: string;
  keyTakeaway?: string;
  illustration?: string;
}

export interface MateriItem {
  id: string; // contentId
  contentId?: string; // field for future online database migration
  teacherId: string;
  classLevel: number; // 1 - 6
  classId?: string; // e.g. "kelas-4"
  subject: string; // "Matematika", "IPAS", "Bahasa Indonesia", etc.
  subjectId?: string; // e.g. "matematika"
  subjectIcon?: string; // "📐", "🔬", "📖", etc.
  title: string;
  description: string;
  content: string;
  sections?: MateriSection[];
  summaryPoints?: string[];
  imageUrl?: string;
  videoUrl?: string; // YouTube or video URL
  order?: number;
  xpReward: number;
  isActive: boolean;
  isDemo?: boolean; // CONTOH DEMO
  createdAt: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options [A, B, C, D]
  correctAnswerIndex: number; // 0 - 3
  explanation?: string;
}

export interface GameItem {
  id: string; // contentId
  relatedMaterialId?: string; // connects dynamically to MateriItem.id
  teacherId: string;
  classLevel: number;
  subject: string;
  title: string;
  instructions: string;
  questions: GameQuestion[];
  xpReward: number;
  badgeRewardId?: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  isActive: boolean;
  createdAt: string;
}

export interface MissionChallengeItem {
  id: string;
  name: string;
  icon: string;
  isTarget: boolean;
  educationNote: string;
}

export interface MissionItem {
  id: string; // contentId
  missionId?: string;
  relatedMaterialId?: string; // connects dynamically to MateriItem.id
  teacherId: string;
  classLevel: number;
  subject: string;
  title: string;
  description: string;
  instructions: string;
  targetPrompt: string;
  items?: MissionChallengeItem[];
  xpReward: number;
  badgeReward: Badge;
  isActive: boolean;
  createdAt: string;
}

export interface StudentRosterRecord {
  id: string;
  name: string;
  classLevel: number;
  xp: number;
  level: number;
  badgesCount: number;
  completedMateriCount: number;
  completedGamesCount: number;
  lastActive: string;
}

export interface PlayerState {
  name: string;
  character: CharacterType;
  selectedClass: number; // 1 to 6
  selectedSubject: string; // e.g. "IPAS", "Matematika", etc.
  selectedMateriId: string; // currently active topic ID
  xp: number;
  level: number;
  badges: Badge[];
  completedMateriIds: string[];
  completedVideoIds: string[];
  completedMissionIds: string[];
  completedGameIds: string[];
  // Backwards-compatible flags for active topic
  materiCompleted: boolean;
  videoCompleted: boolean;
  detectiveCompleted: boolean;
  unlockedAreas: string[]; // e.g. ['desa', 'hutan', 'arena']
  hasStarted: boolean;
  soundEnabled: boolean;
}

export const INITIAL_PLAYER_STATE: PlayerState = {
  name: '',
  character: 'female_hijab',
  selectedClass: 4,
  selectedSubject: 'IPAS',
  selectedMateriId: 'demo-ipas-energi',
  xp: 0,
  level: 1,
  badges: [],
  completedMateriIds: [],
  completedVideoIds: [],
  completedMissionIds: [],
  completedGameIds: [],
  materiCompleted: false,
  videoCompleted: false,
  detectiveCompleted: false,
  unlockedAreas: ['desa', 'hutan'],
  hasStarted: false,
  soundEnabled: true,
};

export const CLASS_LEVELS = [
  { level: 1, label: 'Kelas 1', icon: '🌱', description: 'Pengenalan & Dasar Bermain Belajar' },
  { level: 2, label: 'Kelas 2', icon: '🌿', description: 'Eksplorasi Dunia Angka & Kata' },
  { level: 3, label: 'Kelas 3', icon: '🌳', description: 'Petualangan Konsep & Cerita' },
  { level: 4, label: 'Kelas 4', icon: '🌲', description: 'Investigasi Sains & Pecahan' },
  { level: 5, label: 'Kelas 5', icon: '🏔️', description: 'Tantangan Logika & Alam Raya' },
  { level: 6, label: 'Kelas 6', icon: '🏰', description: 'Misi Master & Persiapan Lulus' },
];

export const DEFAULT_SUBJECT_ICONS: Record<string, string> = {
  'Matematika': '📐',
  'IPAS': '🔬',
  'Bahasa Indonesia': '📖',
  'PAI': '🕌',
  'Akidah Akhlak': '🕌',
  'Fikih': '⚖️',
  'SKI': '📜',
  'Qur\'an Hadis': '📖',
  'Bahasa Arab': '🕌',
  'Bahasa Inggris': '🌍',
  'Bahasa Jawa': '🍃',
  'Seni': '🎨',
  'PJOK': '⚽',
};

export function getSubjectIcon(subject: string): string {
  if (DEFAULT_SUBJECT_ICONS[subject]) {
    return DEFAULT_SUBJECT_ICONS[subject];
  }
  const lower = subject.toLowerCase();
  if (lower.includes('matematika') || lower.includes('hitung')) return '📐';
  if (lower.includes('ipa') || lower.includes('sains') || lower.includes('alam')) return '🔬';
  if (lower.includes('bahasa') || lower.includes('indonesia')) return '📖';
  if (lower.includes('arab') || lower.includes('agama') || lower.includes('islam') || lower.includes('pai')) return '🕌';
  if (lower.includes('seni') || lower.includes('gambar')) return '🎨';
  if (lower.includes('olahraga') || lower.includes('pjok')) return '⚽';
  return '📚';
}

export function calculateLevel(xp: number): number {
  if (xp >= 150) return 5;
  if (xp >= 100) return 4;
  if (xp >= 60) return 3;
  if (xp >= 30) return 2;
  return 1;
}

export function getLevelTitle(level: number): string {
  switch (level) {
    case 5:
      return '👑 Master EDUVERSE';
    case 4:
      return '⭐ Petualang Hebat';
    case 3:
      return '🔎 Detektif';
    case 2:
      return '🌿 Penjelajah';
    case 1:
    default:
      return '🌱 Penjelajah Pemula';
  }
}

export function getXpProgressForLevel(xp: number): {
  level: number;
  title: string;
  current: number;
  max: number;
  percentage: number;
  xpNeeded: number;
} {
  const level = calculateLevel(xp);
  const title = getLevelTitle(level);

  if (level >= 5) {
    return { level, title, current: xp, max: 150, percentage: 100, xpNeeded: 0 };
  }
  if (level === 4) {
    const cur = xp - 100;
    const max = 50; // 100 to 150
    return { level, title, current: cur, max, percentage: Math.min(100, Math.round((cur / max) * 100)), xpNeeded: 150 - xp };
  }
  if (level === 3) {
    const cur = xp - 60;
    const max = 40; // 60 to 100
    return { level, title, current: cur, max, percentage: Math.min(100, Math.round((cur / max) * 100)), xpNeeded: 100 - xp };
  }
  if (level === 2) {
    const cur = xp - 30;
    const max = 30; // 30 to 60
    return { level, title, current: cur, max, percentage: Math.min(100, Math.round((cur / max) * 100)), xpNeeded: 60 - xp };
  }
  // Level 1: 0 to 30
  return { level, title, current: xp, max: 30, percentage: Math.min(100, Math.round((xp / 30) * 100)), xpNeeded: 30 - xp };
}
