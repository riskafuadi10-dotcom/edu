import {
  Teacher,
  MateriItem,
  GameItem,
  MissionItem,
  MissionChallengeItem,
  BadgeTemplate,
  StudentRosterRecord,
} from '../types';

const STORE_KEY = 'eduverse_platform_data_v3';
const ACTIVE_TEACHER_KEY = 'eduverse_active_teacher_v3';

// Initial demo teachers
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'guru-1',
    name: 'Ibu Rahma Maulida, S.Pd.I',
    email: 'rahma@madrasah.id',
    nipOrCode: '198705122010012015',
    schoolName: 'MI Al-Falah Jakarta',
  },
  {
    id: 'guru-2',
    name: 'Bapak Ahmad Fauzi, M.Pd.',
    email: 'ahmad.fauzi@madrasah.id',
    nipOrCode: '198203152008011009',
    schoolName: 'MI Nurul Iman Bandung',
  },
];

// Initial demo badge templates
export const INITIAL_BADGES: BadgeTemplate[] = [
  {
    id: 'badge-penjelajah-pemula',
    name: 'Penjelajah Pemula',
    icon: '🌱',
    description: 'Menyelesaikan langkah pertama petualangan belajar di Eduverse',
    category: 'Eksplorasi',
  },
  {
    id: 'badge-rajin-belajar',
    name: 'Rajin Belajar',
    icon: '📚',
    description: 'Menyelesaikan dan membaca seluruh materi di Pondok Materi',
    category: 'Materi',
  },
  {
    id: 'badge-detektif-energi',
    name: 'Detektif Energi',
    icon: '🔎',
    description: 'Menemukan dan mengklasifikasikan semua benda energi listrik',
    category: 'Misi IPAS',
  },
  {
    id: 'badge-master-matematika',
    name: 'Master Matematika',
    icon: '⭐',
    description: 'Menuntaskan tantangan berhitung dan operasi pecahan',
    category: 'Misi Matematika',
  },
  {
    id: 'badge-juara-misi',
    name: 'Juara Misi',
    icon: '🏆',
    description: 'Menyelesaikan seluruh pos tantangan di dunia petualangan',
    category: 'Prestasi',
  },
  {
    id: 'badge-sahabat-bahasa',
    name: 'Sahabat Bahasa',
    icon: '📖',
    description: 'Menguasai struktur kalimat transitif dan intransitif',
    category: 'Misi Bahasa',
  },
  {
    id: 'badge-akhlak-terpuji',
    name: 'Bintang Adab & Akhlak',
    icon: '🕌',
    description: 'Menerapkan adab belajar dan akhlak terpuji sehari-hari',
    category: 'Misi PAI',
  },
];

// Demo materials across classes and subjects
export const INITIAL_MATERI: MateriItem[] = [
  // 1. KELAS 4 MATEMATIKA: OPERASI PECAHAN
  {
    id: 'demo-matematika-pecahan',
    contentId: 'demo-matematika-pecahan',
    teacherId: 'guru-1',
    classLevel: 4,
    classId: 'kelas-4',
    subject: 'Matematika',
    subjectId: 'matematika',
    subjectIcon: '📐',
    title: 'Operasi Pecahan',
    description: 'Belajar memahami konsep pecahan, pecahan senilai, dan operasi penjumlahan pecahan.',
    content: `Pecahan digunakan untuk menyatakan bagian dari suatu keseluruhan yang utuh!

1. APA ITU PECAHAN?
Bentuk umum pecahan adalah a/b.
• a disebut PEMBILANG (bagian yang dihitung).
• b disebut PENYEBUT (jumlah total potongan yang sama besar).
Contoh: 1 potong martabak dari 4 potong sama besar ditulis sebagai 1/4.

2. PECAHAN SENILAI:
Pecahan senilai adalah pecahan yang nilainya sama meski angka pembilang dan penyebutnya berbeda.
Contoh: 1/2 senilai dengan 2/4 dan senilai dengan 3/6.

3. PENJUMLAHAN PECAHAN BERPENYEBUT SAMA:
Cukup jumlahkan pembilangnya:
1/5 + 2/5 = (1 + 2)/5 = 3/5.`,
    summaryPoints: [
      'Pecahan ditulis a/b: a = pembilang, b = penyebut.',
      'Pecahan senilai memiliki nilai yang sama, contoh: 1/2 = 2/4 = 3/6.',
      'Penjumlahan penyebut sama cukup menjumlahkan pembilang di atasnya.',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=bF4KzDqMh9k',
    order: 1,
    xpReward: 20,
    isActive: true,
    isDemo: true,
    createdAt: '2026-09-01',
  },

  // 2. KELAS 4 IPAS: ENERGI DI SEKITARKU
  {
    id: 'demo-ipas-energi',
    contentId: 'demo-ipas-energi',
    teacherId: 'guru-1',
    classLevel: 4,
    classId: 'kelas-4',
    subject: 'IPAS',
    subjectId: 'ipas',
    subjectIcon: '🔬',
    title: 'Energi di Sekitarku',
    description: 'Mengenal berbagai bentuk energi di sekitar kita serta perubahan energi listrik, gerak, dan panas.',
    content: `Energi adalah kemampuan untuk melakukan usaha atau kerja. Segala sesuatu yang kita lakukan membutuhkan energi!

1. BENTUK-BENTUK ENERGI:
• Energi Kinetik: Energi yang dimiliki benda bergerak (angin berhembus, air mengalir).
• Energi Potensial: Energi yang tersimpan pada benda (buah di atas pohon, pegas).
• Energi Listrik: Energi dari aliran muatan listrik (sumber daya TV, kipas, lampu).
• Energi Panas (Kalor): Energi dari suhu panas (matahari, kompor).
• Energi Cahaya: Energi yang menerangi sekitar kita (matahari, senter, lampu).

2. HUKUM KEKEKALAN ENERGI:
"Energi tidak dapat diciptakan dan tidak dapat dimusnahkan, tetapi dapat berubah dari satu bentuk ke bentuk yang lain."

3. CONTOH PERUBAHAN ENERGI:
• Lampu: Energi listrik ➔ Energi cahaya dan panas.
• Kipas Angin: Energi listrik ➔ Energi gerak (kinetik).
• Setrika: Energi listrik ➔ Energi panas.`,
    summaryPoints: [
      'Energi tidak dapat diciptakan atau dimusnahkan, hanya dapat berubah bentuk.',
      'Energi listrik merupakan sumber daya utama peralatan rumah tangga.',
      'Lampu mengubah listrik menjadi cahaya, kipas menjadi gerak.',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kQ3K7hC6Jsc',
    order: 2,
    xpReward: 20,
    isActive: true,
    isDemo: true,
    createdAt: '2026-09-02',
  },

  // 3. KELAS 4 BAHASA INDONESIA: KALIMAT TRANSITIF DAN INTRANSITIF
  {
    id: 'demo-bahasa-kalimat',
    contentId: 'demo-bahasa-kalimat',
    teacherId: 'guru-1',
    classLevel: 4,
    classId: 'kelas-4',
    subject: 'Bahasa Indonesia',
    subjectId: 'bahasa_indonesia',
    subjectIcon: '📖',
    title: 'Kalimat Transitif dan Intransitif',
    description: 'Mengenal struktur kalimat dasar bahasa Indonesia: Subjek, Predikat, Objek, dan Keterangan.',
    content: `Kalimat adalah susunan kata yang menyatakan pikiran yang lengkap.

1. KALIMAT TRANSITIF:
Kalimat transitif adalah kalimat yang MEMERLUKAN OBJEK (O). Tanpa objek, makna kalimatnya belum lengkap.
Rumus: S - P - O (atau S - P - O - K)
Contoh:
• "Alya (S) membaca (P) buku cerita (O)."
• "Rafi (S) memakan (P) apel manis (O)."

2. KALIMAT INTRANSITIF:
Kalimat intransitif adalah kalimat yang TIDAK MEMERLUKAN OBJEK. Kalimat ini sudah memiliki arti yang jelas dan utuh hanya dengan Subjek dan Predikat.
Rumus: S - P (atau S - P - K)
Contoh:
• "Adik (S) tertawa (P)."
• "Burung (S) terbang (P) di angkasa (K)."
• "Kakek (S) tertidur pulas (P)."`,
    summaryPoints: [
      'Kalimat transitif membutuhkan objek penderita (S - P - O).',
      'Kalimat intransitif tidak membutuhkan objek (S - P atau S - P - K).',
      'Keterangan tempat atau waktu bukanlah objek kalimat.',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order: 3,
    xpReward: 20,
    isActive: true,
    isDemo: true,
    createdAt: '2026-09-03',
  },

  // 4. PAI / AKIDAH AKHLAK KELAS 4: AKHLAK TERPUJI
  {
    id: 'demo-pai-akhlak',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'PAI',
    subjectIcon: '🕌',
    title: 'Akhlak Terpuji (Adab Belajar & Berteman)',
    description: 'Meneladani budi pekerti luhur dalam menuntut ilmu di madrasah dan saling menghargai sesama teman.',
    content: `Sebagai siswa madrasah (MI), akhlak terpuji (akhlakul karimah) adalah perhiasan terbaik seorang muslim cilik.

1. ADAB KEPADA GURU:
• Mengucapkan salam dengan santun saat bertemu guru.
• Mendengarkan penjelasan guru dengan seksama dan tidak memotong pembicaraan.
• Mendoakan kebaikan untuk guru-guru kita yang telah mengajarkan ilmu.

2. ADAB KEPADA TEMAN SEBAYA:
• Bersikap jujur, ramah, dan tidak sombong.
• Suka tolong-menolong ketika ada teman yang kesulitan atau lupa membawa alat tulis.
• Menjaga lisan dari kata-kata yang mengejek atau menyakiti perasaan teman.

3. ADAB MENUNTUT ILMU:
• Membaca doa sebelum mulai belajar: "Rabbi zidnii 'ilman warzuqnii fahman".
• Merapikan buku dan perlengkapan belajar setelah digunakan.
• Mengamalkan ilmu yang sudah dipelajari untuk kebaikan keluarga dan lingkungan.`,
    summaryPoints: [
      'Menghormati guru adalah kunci keberkahan ilmu pengetahuan.',
      'Saling menyayangi teman dan menjauhi perbuatan saling mengejek.',
      'Membiasakan berdoa sebelum dan sesudah belajar.',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=xyz123abc',
    order: 1,
    xpReward: 20,
    isActive: true,
    createdAt: '2026-09-04',
  },

  // 5. MATEMATIKA KELAS 1: BERHITUNG 1 - 20
  {
    id: 'demo-matematika-k1',
    teacherId: 'guru-2',
    classLevel: 1,
    subject: 'Matematika',
    subjectIcon: '🌱',
    title: 'Mengenal Angka dan Berhitung Ceria 1 - 20',
    description: 'Belajar berhitung menggunakan benda-benda lucu di sekitar kita.',
    content: `Halo petualang cilik Kelas 1!
Ayo kita menghitung bersama buah-buahan dan hewan-hewan lucu di Hutan Pengetahuan!
1, 2, 3, 4, 5 apel manis...
6, 7, 8, 9, 10 kupu-kupu terbang...
Menghitung itu sangat seru!`,
    summaryPoints: ['Menghitung benda nyata', 'Mengurutkan angka 1 hingga 20'],
    videoUrl: '',
    order: 1,
    xpReward: 15,
    isActive: true,
    createdAt: '2026-09-05',
  },

  // 6. BAHASA ARAB KELAS 3: PERALATAN SEKOLAH
  {
    id: 'demo-arab-k3',
    teacherId: 'guru-1',
    classLevel: 3,
    subject: 'Bahasa Arab',
    subjectIcon: '🕌',
    title: 'Adawatul Madrosiyyah (Peralatan Sekolah)',
    description: 'Menghafal kosakata bahasa Arab seputar perlengkapan kelas dan tas sekolah.',
    content: `Mari mengenal nama alat tulis dalam Bahasa Arab:
• Buku = Kitaabun (كِتَابٌ)
• Pena / Pulpen = Qolamun (قَلَمٌ)
• Penggaris = Misthorotun (مِسْطَرَةٌ)
• Tas Sekolah = Haqiibatun (حَقِيبَةٌ)
• Papan Tulis = Sabbuurotun (سَبُّورَةٌ)`,
    summaryPoints: ['Kosakata peralatan sekolah Arab', 'Pengucapan fasih dan maknanya'],
    videoUrl: '',
    order: 1,
    xpReward: 20,
    isActive: true,
    createdAt: '2026-09-06',
  },

  // 7. IPAS KELAS 5: SISTEM PERNAPASAN
  {
    id: 'demo-ipas-k5',
    teacherId: 'guru-1',
    classLevel: 5,
    subject: 'IPAS',
    subjectIcon: '🏔️',
    title: 'Organ & Sistem Pernapasan Manusia',
    description: 'Bagaimana udara oksigen masuk dari hidung hingga paru-paru kita.',
    content: `Udara bersih masuk melalui rongga hidung, melewati tenggorokan (faring dan laring), batang tenggorokan (trakea), lalu menuju paru-paru melalui bronkus dan alveolus.
Di alveolus inilah terjadi pertukaran gas oksigen (O2) dan karbon dioksida (CO2)!`,
    summaryPoints: ['Urutan pernapasan: Hidung -> Trakea -> Paru-paru', 'Pertukaran gas terjadi di alveolus'],
    videoUrl: '',
    order: 1,
    xpReward: 25,
    isActive: true,
    createdAt: '2026-09-07',
  },

  // 8. MATEMATIKA KELAS 6: BANGUN RUANG KUBUS BALOK
  {
    id: 'demo-matematika-k6',
    teacherId: 'guru-2',
    classLevel: 6,
    subject: 'Matematika',
    subjectIcon: '🏰',
    title: 'Volume & Luas Permukaan Kubus Balok',
    description: 'Menghitung volume ruang kubus (s x s x s) dan balok (p x l x t).',
    content: `Rumus Volume:
• Kubus: V = sisi x sisi x sisi (s³)
• Balok: V = panjang x lebar x tinggi (p x l x t)
Kubus memiliki 6 sisi persegi yang sama besar dan 12 rusuk sama panjang.`,
    summaryPoints: ['Volume kubus s x s x s', 'Volume balok p x l x t'],
    videoUrl: '',
    order: 1,
    xpReward: 25,
    isActive: true,
    createdAt: '2026-09-08',
  },
];

// Initial demo games
export const INITIAL_GAMES: GameItem[] = [
  // 1. IPAS KELAS 4: QUIZ ENERGI
  {
    id: 'game-ipas-energi',
    relatedMaterialId: 'demo-ipas-energi',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'IPAS',
    title: 'Tantangan Arena: Misteri Energi Cilik',
    instructions: 'Jawablah 3 pertanyaan seputar bentuk dan perubahan energi dengan tepat untuk meraih XP!',
    difficulty: 'Sedang',
    xpReward: 30,
    badgeRewardId: 'badge-detektif-energi',
    isActive: true,
    createdAt: '2026-09-01',
    questions: [
      {
        id: 'q1',
        question: 'Perubahan energi apa yang terjadi pada saat kamu menyalakan kipas angin di kamar?',
        options: [
          'Energi listrik menjadi energi gerak',
          'Energi gerak menjadi energi panas',
          'Energi kimia menjadi energi cahaya',
          'Energi bunyi menjadi energi listrik',
        ],
        correctAnswerIndex: 0,
        explanation: 'Kipas angin memanfaatkan motor listrik untuk memutar baling-baling, sehingga mengubah energi listrik menjadi energi gerak.',
      },
      {
        id: 'q2',
        question: 'Manakah dari benda berikut yang sumber energinya berasal dari baterai (energi kimia)?',
        options: [
          'Kulkas besar di dapur',
          'Senter saku portabel',
          'Mesin cuci otomatis',
          'Kompor gas dua tungku',
        ],
        correctAnswerIndex: 1,
        explanation: 'Senter saku menyimpan energi kimia di dalam baterai yang kemudian diubah menjadi listrik lalu menjadi energi cahaya.',
      },
      {
        id: 'q3',
        question: 'Pernyataan yang BENAR mengenai hukum kekekalan energi adalah...',
        options: [
          'Energi dapat diciptakan oleh manusia dengan teknologi canggih',
          'Energi akan hilang selamanya jika sudah digunakan',
          'Energi tidak dapat dimusnahkan, tetapi hanya dapat berubah bentuk',
          'Energi listrik hanya bisa diubah menjadi satu jenis energi saja',
        ],
        correctAnswerIndex: 2,
        explanation: 'Sesuai hukum kekekalan energi, energi tidak bisa diciptakan ataupun dihancurkan, melainkan berubah wujud dari satu bentuk ke bentuk lain.',
      },
    ],
  },

  // 2. MATEMATIKA KELAS 4: QUIZ PECAHAN
  {
    id: 'game-matematika-pecahan',
    relatedMaterialId: 'demo-matematika-pecahan',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'Matematika',
    title: 'Arena Pecahan Ajaib',
    instructions: 'Buktikan ketelitianmu dalam menentukan pecahan senilai dan penjumlahan pecahan!',
    difficulty: 'Sedang',
    xpReward: 30,
    badgeRewardId: 'badge-master-matematika',
    isActive: true,
    createdAt: '2026-09-02',
    questions: [
      {
        id: 'qm1',
        question: 'Pecahan berikut yang senilai dengan 1/2 adalah...',
        options: ['2/3', '2/4', '3/5', '1/4'],
        correctAnswerIndex: 1,
        explanation: 'Jika pembilang dan penyebut 1/2 dikalikan 2, maka hasilnya adalah (1x2)/(2x2) = 2/4.',
      },
      {
        id: 'qm2',
        question: 'Berapakah hasil dari 2/7 + 3/7?',
        options: ['5/14', '5/7', '6/7', '1/7'],
        correctAnswerIndex: 1,
        explanation: 'Karena penyebutnya sudah sama yaitu 7, cukup jumlahkan pembilangnya: 2 + 3 = 5. Hasilnya 5/7.',
      },
      {
        id: 'qm3',
        question: 'Ibu memotong kue menjadi 8 bagian sama besar. Alya memakan 3 bagian. Pecahan yang dimakan Alya adalah...',
        options: ['3/8', '8/3', '1/8', '5/8'],
        correctAnswerIndex: 0,
        explanation: 'Bagian yang dimakan adalah 3 (pembilang), dan jumlah total bagian adalah 8 (penyebut). Jadi 3/8.',
      },
    ],
  },

  // 3. BAHASA INDONESIA KELAS 4: QUIZ KALIMAT
  {
    id: 'game-bahasa-kalimat',
    relatedMaterialId: 'demo-bahasa-kalimat',
    teacherId: 'guru-2',
    classLevel: 4,
    subject: 'Bahasa Indonesia',
    title: 'Teka-Teki Kalimat Tangkas',
    instructions: 'Temukan perbedaan antara kalimat transitif dan kalimat intransitif!',
    difficulty: 'Mudah',
    xpReward: 25,
    badgeRewardId: 'badge-sahabat-bahasa',
    isActive: true,
    createdAt: '2026-09-03',
    questions: [
      {
        id: 'qb1',
        question: 'Manakah kalimat berikut yang termasuk kalimat transitif (membutuhkan objek)?',
        options: [
          'Rafi bernyanyi gembira.',
          'Alya memetik bunga mawar.',
          'Burung merpati terbang tinggi.',
          'Adik tidur pulas.',
        ],
        correctAnswerIndex: 1,
        explanation: '"Alya memetik bunga mawar" memiliki pola S-P-O. "Bunga mawar" berperan sebagai objek yang dipetik.',
      },
      {
        id: 'qb2',
        question: 'Pada kalimat "Budi membaca buku di perpustakaan", kata "di perpustakaan" berfungsi sebagai...',
        options: ['Subjek', 'Predikat', 'Objek', 'Keterangan Tempat'],
        correctAnswerIndex: 3,
        explanation: 'Kata yang menunjukkan lokasi kejadian merupakan Keterangan Tempat (K).',
      },
      {
        id: 'qb3',
        question: 'Kalimat intransitif adalah kalimat yang...',
        options: [
          'Tidak memerlukan objek penderita',
          'Wajib memiliki dua objek',
          'Hanya terdiri dari satu kata saja',
          'Selalu diawali tanda tanya',
        ],
        correctAnswerIndex: 0,
        explanation: 'Kalimat intransitif sudah memiliki makna yang utuh meski tanpa objek pendamping.',
      },
    ],
  },

  // 4. PAI KELAS 4: QUIZ AKHLAK
  {
    id: 'game-pai-akhlak',
    relatedMaterialId: 'demo-pai-akhlak',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'PAI',
    title: 'Kuis Bintang Akhlak Terpuji',
    instructions: 'Pilihlah sikap terpuji yang mencerminkan siswa madrasah teladan!',
    difficulty: 'Mudah',
    xpReward: 25,
    badgeRewardId: 'badge-akhlak-terpuji',
    isActive: true,
    createdAt: '2026-09-04',
    questions: [
      {
        id: 'qp1',
        question: 'Apa yang sebaiknya kita ucapkan ketika berpapasan dengan Bapak atau Ibu guru di koridor madrasah?',
        options: [
          'Langsung berlari kencang',
          'Mengucapkan salam dengan ramah dan tersenyum',
          'Pura-pura tidak melihat',
          'Berteriak memanggil nama teman',
        ],
        correctAnswerIndex: 1,
        explanation: 'Mengucapkan salam (Assalamu\'alaikum) dan bersikap santun adalah adab terpuji menghormati guru.',
      },
      {
        id: 'qp2',
        question: 'Doa memohon tambahan ilmu dan pemahaman yang baik adalah...',
        options: [
          'Robbi zidnii \'ilman warzuqnii fahman',
          'Alhamdulillahirobbil \'alamin',
          'Bismillahi tawakkaltu \'alallah',
          'Astaghfirullahal \'azim',
        ],
        correctAnswerIndex: 0,
        explanation: '"Robbi zidnii \'ilman warzuqnii fahman" artinya: Ya Tuhanku, tambahkanlah ilmuku dan karuniakanlah aku kepahaman.',
      },
      {
        id: 'qp3',
        question: 'Jika melihat teman terjatuh di halaman sekolah, sikap kita adalah...',
        options: [
          'Menertawakannya bersama teman lain',
          'Memotret dan membiarkannya',
          'Segera menolong dan membantunya berdiri',
          'Berjalan melewatinya begitu saja',
        ],
        correctAnswerIndex: 2,
        explanation: 'Menolong sesama teman yang kesulitan merupakan wujud persaudaraan dan akhlak karimah.',
      },
    ],
  },
];

// Initial demo missions
export const INITIAL_MISSIONS: MissionItem[] = [
  // 1. IPAS KELAS 4: DETEKTIF ENERGI
  {
    id: 'mission-ipas-energi',
    missionId: 'mission-ipas-energi',
    relatedMaterialId: 'demo-ipas-energi',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'IPAS',
    title: 'Misi Detektif Energi Listrik',
    description: 'Bantu Penjaga Hutan mengidentifikasi semua peralatan yang menggunakan daya listrik.',
    instructions: 'Pilih benda-benda yang membutuhkan energi listrik untuk beroperasi!',
    targetPrompt: 'Temukan benda-benda yang menggunakan energi listrik.',
    xpReward: 30,
    badgeReward: {
      id: 'badge-detektif-energi',
      name: 'DETEKTIF ENERGI',
      icon: '🔎',
      description: 'Menemukan semua benda bertenaga listrik di Hutan Pengetahuan',
      earnedAt: new Date().toLocaleDateString('id-ID'),
    },
    items: [
      { id: 'lampu', name: 'Lampu', icon: '💡', isTarget: true, educationNote: 'Lampu mengubah listrik menjadi cahaya.' },
      { id: 'kipas', name: 'Kipas', icon: '🌀', isTarget: true, educationNote: 'Kipas mengubah listrik menjadi gerak.' },
      { id: 'televisi', name: 'Televisi', icon: '📺', isTarget: true, educationNote: 'Televisi butuh listrik untuk gambar dan suara.' },
      { id: 'senter', name: 'Senter', icon: '🔦', isTarget: true, educationNote: 'Senter memakai listrik dari baterai.' },
      { id: 'sepeda', name: 'Sepeda', icon: '🚲', isTarget: false, educationNote: 'Sepeda digerakkan oleh otot manusia.' },
      { id: 'buku', name: 'Buku', icon: '📖', isTarget: false, educationNote: 'Buku dari kertas tanpa daya listrik.' },
    ],
    isActive: true,
    createdAt: '2026-09-01',
  },

  // 2. MATEMATIKA KELAS 4: DETEKTIF PECAHAN SENILAI
  {
    id: 'mission-matematika-pecahan',
    missionId: 'mission-matematika-pecahan',
    relatedMaterialId: 'demo-matematika-pecahan',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'Matematika',
    title: 'Misi Detektif Pecahan Senilai',
    description: 'Cari kartu pecahan yang nilainya sama dengan setengah (1/2)!',
    instructions: 'Pilih pecahan-pecahan yang senilai dengan 1/2!',
    targetPrompt: 'Temukan semua pecahan yang senilai dengan 1/2.',
    xpReward: 30,
    badgeReward: {
      id: 'badge-master-matematika',
      name: 'DETEKTIF PECAHAN',
      icon: '⭐',
      description: 'Menemukan seluruh pecahan senilai dengan tepat',
      earnedAt: new Date().toLocaleDateString('id-ID'),
    },
    items: [
      { id: 'p1', name: '2/4', icon: '🔢', isTarget: true, educationNote: '2/4 senilai dengan 1/2 (dikalikan 2/2).' },
      { id: 'p2', name: '3/6', icon: '🍕', isTarget: true, educationNote: '3/6 senilai dengan 1/2 (dikalikan 3/3).' },
      { id: 'p3', name: '4/8', icon: '🍰', isTarget: true, educationNote: '4/8 senilai dengan 1/2 (dikalikan 4/4).' },
      { id: 'p4', name: '5/10', icon: '🍫', isTarget: true, educationNote: '5/10 senilai dengan 1/2 (dikalikan 5/5).' },
      { id: 'p5', name: '1/3', icon: '❌', isTarget: false, educationNote: '1/3 tidak sama dengan 1/2 (lebih kecil).' },
      { id: 'p6', name: '3/4', icon: '❌', isTarget: false, educationNote: '3/4 lebih besar daripada 1/2.' },
    ],
    isActive: true,
    createdAt: '2026-09-02',
  },

  // 3. BAHASA INDONESIA KELAS 4: DETEKTIF KALIMAT TRANSITIF
  {
    id: 'mission-bahasa-kalimat',
    missionId: 'mission-bahasa-kalimat',
    relatedMaterialId: 'demo-bahasa-kalimat',
    teacherId: 'guru-2',
    classLevel: 4,
    subject: 'Bahasa Indonesia',
    title: 'Misi Detektif Kalimat Transitif',
    description: 'Pilah kalimat yang memiliki objek penderita yang jelas!',
    instructions: 'Pilih kalimat yang termasuk kalimat transitif (memiliki objek)!',
    targetPrompt: 'Temukan kalimat transitif yang memiliki Subjek, Predikat, dan Objek.',
    xpReward: 30,
    badgeReward: {
      id: 'badge-sahabat-bahasa',
      name: 'DETEKTIF KALIMAT',
      icon: '📖',
      description: 'Berhasil mengidentifikasi kalimat transitif dengan sempurna',
      earnedAt: new Date().toLocaleDateString('id-ID'),
    },
    items: [
      { id: 'k1', name: 'Alya membaca buku', icon: '📚', isTarget: true, educationNote: 'Objeknya adalah "buku".' },
      { id: 'k2', name: 'Rafi menendang bola', icon: '⚽', isTarget: true, educationNote: 'Objeknya adalah "bola".' },
      { id: 'k3', name: 'Ibu memasak nasi', icon: '🍚', isTarget: true, educationNote: 'Objeknya adalah "nasi".' },
      { id: 'k4', name: 'Kucing minum susu', icon: '🥛', isTarget: true, educationNote: 'Objeknya adalah "susu".' },
      { id: 'k5', name: 'Burung bernyanyi merdu', icon: '🐦', isTarget: false, educationNote: '"Merdu" adalah keterangan cara, bukan objek.' },
      { id: 'k6', name: 'Adik menangis tersedu', icon: '👶', isTarget: false, educationNote: 'Kalimat intransitif tanpa objek.' },
    ],
    isActive: true,
    createdAt: '2026-09-03',
  },

  // 4. PAI KELAS 4: MISI AKHLAK
  {
    id: 'mission-pai-akhlak',
    missionId: 'mission-pai-akhlak',
    relatedMaterialId: 'demo-pai-akhlak',
    teacherId: 'guru-1',
    classLevel: 4,
    subject: 'PAI',
    title: 'Misi Bintang Akhlak Terpuji',
    description: 'Kumpulkan semua perbuatan baik dan terpuji di lingkungan madrasah.',
    instructions: 'Pilih perbuatan yang termasuk Akhlak Terpuji (Mahmudah)!',
    targetPrompt: 'Temukan perbuatan terpuji yang dicintai Allah dan sesama manusia.',
    xpReward: 30,
    badgeReward: {
      id: 'badge-akhlak-terpuji',
      name: 'BINTANG ADAB',
      icon: '🕌',
      description: 'Menjunjung tinggi adab dan akhlak terpuji di madrasah',
      earnedAt: new Date().toLocaleDateString('id-ID'),
    },
    items: [
      { id: 'a1', name: 'Mengucap Salam', icon: '🤝', isTarget: true, educationNote: 'Menebar kedamaian dan doa kebaikan.' },
      { id: 'a2', name: 'Menolong Teman', icon: '🤲', isTarget: true, educationNote: 'Membantu meringankan beban sesama.' },
      { id: 'a3', name: 'Jujur & Amanah', icon: '💎', isTarget: true, educationNote: 'Selalu berkata benar dan dapat dipercaya.' },
      { id: 'a4', name: 'Berdoa Sebelum Belajar', icon: '🤲', isTarget: true, educationNote: 'Memohon berkah dan kefahaman ilmu.' },
      { id: 'a5', name: 'Mengejek Teman', icon: '🚫', isTarget: false, educationNote: 'Termasuk akhlak tercela (mazmumah).' },
      { id: 'a6', name: 'Membuang Sampah Sembarangan', icon: '🗑️', isTarget: false, educationNote: 'Merusak kebersihan yang merupakan sebagian dari iman.' },
    ],
    isActive: true,
    createdAt: '2026-09-04',
  },
];

// Initial demo student roster
export const INITIAL_STUDENTS: StudentRosterRecord[] = [
  {
    id: 'std-1',
    name: 'Alya Nur Azizah',
    classLevel: 4,
    xp: 80,
    level: 3,
    badgesCount: 2,
    completedMateriCount: 2,
    completedGamesCount: 1,
    lastActive: 'Hari ini',
  },
  {
    id: 'std-2',
    name: 'Muhammad Rafi Pratama',
    classLevel: 4,
    xp: 60,
    level: 3,
    badgesCount: 1,
    completedMateriCount: 1,
    completedGamesCount: 1,
    lastActive: 'Kemarin',
  },
  {
    id: 'std-3',
    name: 'Fahri Ramadhan',
    classLevel: 4,
    xp: 40,
    level: 2,
    badgesCount: 1,
    completedMateriCount: 1,
    completedGamesCount: 0,
    lastActive: '2 hari lalu',
  },
  {
    id: 'std-4',
    name: 'Siti Maryam',
    classLevel: 3,
    xp: 35,
    level: 2,
    badgesCount: 1,
    completedMateriCount: 1,
    completedGamesCount: 1,
    lastActive: '3 hari lalu',
  },
  {
    id: 'std-5',
    name: 'Zahra Humaira',
    classLevel: 1,
    xp: 15,
    level: 1,
    badgesCount: 0,
    completedMateriCount: 1,
    completedGamesCount: 0,
    lastActive: 'Minggu ini',
  },
];

interface EduStoreData {
  teachers: Teacher[];
  materiList: MateriItem[];
  gameList: GameItem[];
  missionList: MissionItem[];
  badgeTemplates: BadgeTemplate[];
  studentRoster: StudentRosterRecord[];
}

export class EduverseDataService {
  private static loadStore(): EduStoreData {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let list: MateriItem[] = parsed.materiList || [];
        list = list.map((item) => {
          const isDemoItem =
            item.isDemo ||
            item.id === 'demo-matematika-pecahan' ||
            item.id === 'demo-ipas-energi' ||
            item.id === 'demo-bahasa-kalimat';
          return {
            ...item,
            isDemo: isDemoItem,
            classId: item.classId || `kelas-${item.classLevel}`,
            subjectId: item.subjectId || item.subject.toLowerCase().replace(/\s+/g, '_'),
            contentId: item.contentId || item.id,
          };
        });

        // Ensure 3 requested initial demo items exist
        for (const demo of INITIAL_MATERI) {
          if (!list.some((m) => m.id === demo.id)) {
            list.push(demo);
          }
        }

        let missions: MissionItem[] = parsed.missionList || [];
        missions = missions.map((m) => {
          let relatedId = m.relatedMaterialId;
          if (!relatedId) {
            if (m.id === 'mission-ipas-energi') relatedId = 'demo-ipas-energi';
            else if (m.id === 'mission-matematika-pecahan') relatedId = 'demo-matematika-pecahan';
            else if (m.id === 'mission-bahasa-kalimat') relatedId = 'demo-bahasa-kalimat';
            else if (m.id === 'mission-pai-akhlak') relatedId = 'demo-pai-akhlak';
          }
          return {
            ...m,
            missionId: m.missionId || m.id,
            relatedMaterialId: relatedId,
          };
        });
        for (const demoM of INITIAL_MISSIONS) {
          if (!missions.some((m) => m.id === demoM.id)) {
            missions.push(demoM);
          }
        }

        let games: GameItem[] = parsed.gameList || [];
        games = games.map((g) => {
          let relatedId = g.relatedMaterialId;
          if (!relatedId) {
            if (g.id === 'game-ipas-energi') relatedId = 'demo-ipas-energi';
            else if (g.id === 'game-matematika-pecahan') relatedId = 'demo-matematika-pecahan';
            else if (g.id === 'game-bahasa-kalimat') relatedId = 'demo-bahasa-kalimat';
            else if (g.id === 'game-pai-akhlak') relatedId = 'demo-pai-akhlak';
          }
          return {
            ...g,
            relatedMaterialId: relatedId,
          };
        });
        for (const demoG of INITIAL_GAMES) {
          if (!games.some((g) => g.id === demoG.id)) {
            games.push(demoG);
          }
        }

        return {
          teachers: parsed.teachers || INITIAL_TEACHERS,
          materiList: list,
          gameList: games,
          missionList: missions,
          badgeTemplates: parsed.badgeTemplates || INITIAL_BADGES,
          studentRoster: parsed.studentRoster || INITIAL_STUDENTS,
        };
      }
    } catch (err) {
      console.error('Failed reading EduStore data, falling back to defaults:', err);
    }

    // Default seed
    const initial: EduStoreData = {
      teachers: INITIAL_TEACHERS,
      materiList: INITIAL_MATERI,
      gameList: INITIAL_GAMES,
      missionList: INITIAL_MISSIONS,
      badgeTemplates: INITIAL_BADGES,
      studentRoster: INITIAL_STUDENTS,
    };
    EduverseDataService.saveStore(initial);
    return initial;
  }

  private static saveStore(data: EduStoreData): void {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed saving EduStore data:', err);
    }
  }

  // --- TEACHER AUTH & SESSION ---
  public static getActiveTeacher(): Teacher {
    try {
      const raw = localStorage.getItem(ACTIVE_TEACHER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // Return default teacher
    return INITIAL_TEACHERS[0];
  }

  public static setActiveTeacher(teacher: Teacher | null): void {
    if (!teacher) {
      localStorage.removeItem(ACTIVE_TEACHER_KEY);
    } else {
      localStorage.setItem(ACTIVE_TEACHER_KEY, JSON.stringify(teacher));
    }
  }

  public static getAllTeachers(): Teacher[] {
    return EduverseDataService.loadStore().teachers;
  }

  public static loginTeacher(emailOrNip: string, teacherName?: string): Teacher {
    const store = EduverseDataService.loadStore();
    const query = emailOrNip.trim().toLowerCase();
    let teacher = store.teachers.find(
      (t) => t.email.toLowerCase() === query || (t.nipOrCode && t.nipOrCode.toLowerCase() === query)
    );

    if (!teacher) {
      // Auto-register friendly new teacher account
      teacher = {
        id: `guru-${Date.now()}`,
        name: teacherName || (query.includes('@') ? query.split('@')[0] : `Bapak/Ibu Guru`),
        email: query.includes('@') ? query : `${query}@madrasah.id`,
        nipOrCode: !query.includes('@') ? query : undefined,
        schoolName: 'MI Teladan',
      };
      store.teachers.push(teacher);
      EduverseDataService.saveStore(store);
    }

    EduverseDataService.setActiveTeacher(teacher);
    return teacher;
  }

  public static registerTeacher(name: string, email: string, schoolName?: string, nip?: string): Teacher {
    const store = EduverseDataService.loadStore();
    const existing = store.teachers.find((t) => t.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      existing.name = name;
      if (schoolName) existing.schoolName = schoolName;
      if (nip) existing.nipOrCode = nip;
      EduverseDataService.saveStore(store);
      EduverseDataService.setActiveTeacher(existing);
      return existing;
    }

    const newTeacher: Teacher = {
      id: `guru-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      schoolName: schoolName?.trim() || 'MI Terpadu',
      nipOrCode: nip?.trim(),
    };
    store.teachers.push(newTeacher);
    EduverseDataService.saveStore(store);
    EduverseDataService.setActiveTeacher(newTeacher);
    return newTeacher;
  }

  public static logoutTeacher(): void {
    EduverseDataService.setActiveTeacher(null);
  }

  // --- QUERY METHODS FOR STUDENT ---
  public static getAllMateri(): MateriItem[] {
    return EduverseDataService.loadStore().materiList;
  }

  public static getAllGames(): GameItem[] {
    return EduverseDataService.loadStore().gameList;
  }

  public static getAllMissions(): MissionItem[] {
    return EduverseDataService.loadStore().missionList;
  }

  public static getMateriByClass(classLevel: number): MateriItem[] {
    return EduverseDataService.loadStore().materiList.filter(
      (m) => m.classLevel === classLevel && m.isActive
    );
  }

  public static getAvailableSubjectsByClass(classLevel: number): string[] {
    const materiInClass = EduverseDataService.getMateriByClass(classLevel);
    const subjects = Array.from(new Set(materiInClass.map((m) => m.subject)));
    if (subjects.length === 0) {
      // Provide standard MI subjects if empty
      return ['Matematika', 'IPAS', 'Bahasa Indonesia', 'PAI', 'Bahasa Arab'];
    }
    return subjects;
  }

  public static getMateriByClassAndSubject(classLevel: number, subject: string): MateriItem[] {
    return EduverseDataService.loadStore().materiList.filter(
      (m) =>
        m.classLevel === classLevel &&
        m.subject.toLowerCase() === subject.toLowerCase() &&
        m.isActive
    );
  }

  public static getMateriById(id: string): MateriItem | undefined {
    return EduverseDataService.loadStore().materiList.find((m) => m.id === id);
  }

  public static getGameByClassAndSubject(classLevel: number, subject: string): GameItem | undefined {
    return EduverseDataService.loadStore().gameList.find(
      (g) =>
        g.classLevel === classLevel &&
        g.subject.toLowerCase() === subject.toLowerCase() &&
        g.isActive
    );
  }

  public static getGameById(id: string): GameItem | undefined {
    return EduverseDataService.loadStore().gameList.find((g) => g.id === id);
  }

  public static getMissionByClassAndSubject(classLevel: number, subject: string): MissionItem | undefined {
    return EduverseDataService.loadStore().missionList.find(
      (m) =>
        m.classLevel === classLevel &&
        m.subject.toLowerCase() === subject.toLowerCase() &&
        m.isActive
    );
  }

  public static getMissionById(id: string): MissionItem | undefined {
    return EduverseDataService.loadStore().missionList.find((m) => m.id === id);
  }

  public static getGameForMateri(materiId: string): GameItem | undefined {
    const store = EduverseDataService.loadStore();
    const materi = store.materiList.find((m) => m.id === materiId || m.contentId === materiId);
    if (!materi) return undefined;

    // 1. Look for game linked by relatedMaterialId
    const game = store.gameList.find(
      (g) =>
        (g.relatedMaterialId && (g.relatedMaterialId === materi.id || g.relatedMaterialId === materi.contentId)) ||
        g.id === `game-${materi.id}`
    );
    if (game) return game;

    // 2. Demo fallback
    if (materi.id === 'demo-ipas-energi') return store.gameList.find((g) => g.id === 'game-ipas-energi');
    if (materi.id === 'demo-matematika-pecahan') return store.gameList.find((g) => g.id === 'game-matematika-pecahan');
    if (materi.id === 'demo-bahasa-kalimat') return store.gameList.find((g) => g.id === 'game-bahasa-kalimat');
    if (materi.id === 'demo-pai-akhlak') return store.gameList.find((g) => g.id === 'game-pai-akhlak');

    return undefined;
  }

  public static generateCluesFromMateri(materi: MateriItem): MissionChallengeItem[] {
    const targets: { text: string; note: string }[] = [];

    if (materi.summaryPoints && materi.summaryPoints.length > 0) {
      materi.summaryPoints.forEach((sp, idx) => {
        targets.push({
          text: sp.replace(/^[0-9]+\.\s*/, '').trim(),
          note: `Fakta kunci #${idx + 1} dari materi ${materi.title}.`,
        });
      });
    }

    if (materi.sections && materi.sections.length > 0) {
      materi.sections.forEach((sec) => {
        if (sec.keyTakeaway) {
          targets.push({
            text: `${sec.title}: ${sec.keyTakeaway}`,
            note: sec.keyTakeaway,
          });
        }
      });
    }

    if (targets.length === 0 && materi.content) {
      const lines = materi.content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 10 && !l.startsWith('#'));
      for (const line of lines.slice(0, 4)) {
        targets.push({
          text: line.length > 55 ? line.slice(0, 52) + '...' : line,
          note: `Konsep valid dari materi ${materi.title}.`,
        });
      }
    }

    const subjectIcons: Record<string, string[]> = {
      Matematika: ['📐', '🔢', '⚖️', '🍕', '📊', '➕'],
      IPAS: ['💡', '🔬', '🌱', '⚡', '🔋', '🌍'],
      'Bahasa Indonesia': ['📚', '✍️', '📖', '📝', '🗣️', '🎓'],
      PAI: ['🕌', '🤲', '🌟', '💎', '🤝', '📖'],
      'Bahasa Arab': ['📖', '🕌', '✍️', '🗣️', '📜', '⭐'],
    };
    const defaultIcons = subjectIcons[materi.subject] || ['⭐', '🔍', '📘', '✨', '🏆', '🎯'];

    const items: MissionChallengeItem[] = [];

    const validTargets = targets.slice(0, 4);
    if (validTargets.length === 0) {
      validTargets.push({
        text: `Memahami konsep utama ${materi.title}`,
        note: `Konsep inti yang dijelaskan dalam materi ${materi.title}.`,
      });
      validTargets.push({
        text: `Menerapkan kaidah ${materi.subject}`,
        note: `Penerapan praktis pengetahuan ${materi.subject} di kehidupan sehari-hari.`,
      });
      validTargets.push({
        text: `Menyelesaikan tantangan ${materi.title}`,
        note: `Ketelitian dalam menganalisis materi ${materi.title}.`,
      });
    }

    validTargets.forEach((t, i) => {
      items.push({
        id: `target-${materi.id}-${i + 1}`,
        name: t.text,
        icon: defaultIcons[i % defaultIcons.length],
        isTarget: true,
        educationNote: t.note,
      });
    });

    items.push({
      id: `decoy-${materi.id}-1`,
      name: `Menghafal rumus tanpa memahami maknanya`,
      icon: '❌',
      isTarget: false,
      educationNote: `Belajar ${materi.subject} membutuhkan pemahaman konsep yang mendalam, bukan sekadar menghafal.`,
    });
    items.push({
      id: `decoy-${materi.id}-2`,
      name: `Mengabaikan penjelasan dan bimbingan guru`,
      icon: '🚫',
      isTarget: false,
      educationNote: `Petunjuk dan penjelasan guru adalah panduan utama untuk menguasai materi ${materi.title}.`,
    });

    return items;
  }

  public static getEffectiveMissionForMateri(materi: MateriItem): MissionItem {
    const store = EduverseDataService.loadStore();
    let existing = store.missionList.find(
      (m) =>
        (m.relatedMaterialId && (m.relatedMaterialId === materi.id || m.relatedMaterialId === materi.contentId)) ||
        m.id === `mission-${materi.id}`
    );

    if (!existing) {
      if (materi.id === 'demo-ipas-energi' || materi.contentId === 'demo-ipas-energi') {
        existing = store.missionList.find((m) => m.id === 'mission-ipas-energi');
      } else if (materi.id === 'demo-matematika-pecahan' || materi.contentId === 'demo-matematika-pecahan') {
        existing = store.missionList.find((m) => m.id === 'mission-matematika-pecahan');
      } else if (materi.id === 'demo-bahasa-kalimat' || materi.contentId === 'demo-bahasa-kalimat') {
        existing = store.missionList.find((m) => m.id === 'mission-bahasa-kalimat');
      } else if (materi.id === 'demo-pai-akhlak' || materi.contentId === 'demo-pai-akhlak') {
        existing = store.missionList.find((m) => m.id === 'mission-pai-akhlak');
      }
    }

    if (existing) {
      return {
        ...existing,
        missionId: existing.missionId || existing.id,
        relatedMaterialId: materi.id,
        classLevel: materi.classLevel,
        subject: materi.subject,
        title: `Misi: ${materi.title}`,
        description: materi.description || existing.description,
        xpReward: existing.xpReward || 30,
        badgeReward: existing.badgeReward || {
          id: `badge-detektif-${materi.id}`,
          name: `DETEKTIF ${materi.subject.toUpperCase()}`,
          icon: materi.subjectIcon || '🔎',
          description: `Berhasil menyelesaikan Misi Detektif ${materi.title}`,
          earnedAt: new Date().toLocaleDateString('id-ID'),
        },
      };
    }

    return {
      id: `mission-${materi.id}`,
      missionId: `mission-${materi.id}`,
      relatedMaterialId: materi.id,
      teacherId: materi.teacherId,
      classLevel: materi.classLevel,
      subject: materi.subject,
      title: `Misi Detektif: ${materi.title}`,
      description: materi.description || `Penyelidikan mendalam seputar materi ${materi.title}`,
      instructions: `Pilihlah fakta, konsep, dan bukti yang benar terkait materi ${materi.title}!`,
      targetPrompt: `Temukan bukti dan konsep penting mengenai ${materi.title}.`,
      xpReward: 30,
      badgeReward: {
        id: `badge-detektif-${materi.id}`,
        name: `DETEKTIF ${materi.subject.toUpperCase()}`,
        icon: materi.subjectIcon || '🔎',
        description: `Berhasil menyelesaikan Misi Detektif ${materi.title}`,
        earnedAt: new Date().toLocaleDateString('id-ID'),
      },
      items: EduverseDataService.generateCluesFromMateri(materi),
      isActive: true,
      createdAt: materi.createdAt || new Date().toISOString().split('T')[0],
    };
  }

  public static getAllBadgeTemplates(): BadgeTemplate[] {
    return EduverseDataService.loadStore().badgeTemplates;
  }

  // --- TEACHER CRUD OPERATIONS (SCOPED BY TEACHER ID) ---
  public static getTeacherMateri(teacherId?: string): MateriItem[] {
    const store = EduverseDataService.loadStore();
    if (!teacherId || teacherId === 'all') {
      return store.materiList;
    }
    return store.materiList.filter((m) => m.teacherId === teacherId || m.isDemo);
  }

  public static saveMateri(item: MateriItem, teacherId: string): MateriItem {
    const store = EduverseDataService.loadStore();
    const contentId = item.contentId || item.id || `materi-${Date.now()}`;
    const classId = item.classId || `kelas-${item.classLevel}`;
    const subjectId = item.subjectId || item.subject.toLowerCase().replace(/\s+/g, '_');

    const payload: MateriItem = {
      ...item,
      id: contentId,
      contentId,
      teacherId,
      classLevel: Number(item.classLevel) || 4,
      classId,
      subjectId,
      xpReward: Number(item.xpReward) || 20,
      isActive: true,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    };

    const index = store.materiList.findIndex((m) => m.id === payload.id);
    if (index >= 0) {
      store.materiList[index] = payload;
    } else {
      store.materiList.unshift(payload);
    }
    EduverseDataService.saveStore(store);
    return payload;
  }

  public static deleteMateri(id: string, _teacherId?: string): boolean {
    const store = EduverseDataService.loadStore();
    const exists = store.materiList.some((m) => m.id === id);
    if (!exists) return false;
    store.materiList = store.materiList.filter((m) => m.id !== id);
    store.missionList = store.missionList.filter((m) => m.relatedMaterialId !== id && m.id !== `mission-${id}`);
    store.gameList = store.gameList.filter((g) => g.relatedMaterialId !== id && g.id !== `game-${id}`);
    EduverseDataService.saveStore(store);
    return true;
  }

  public static getTeacherGames(teacherId: string): GameItem[] {
    return EduverseDataService.loadStore().gameList.filter((g) => g.teacherId === teacherId);
  }

  public static saveGame(item: GameItem, teacherId: string): void {
    const store = EduverseDataService.loadStore();
    const index = store.gameList.findIndex((g) => g.id === item.id);
    const payload = { ...item, teacherId };

    if (index >= 0) {
      store.gameList[index] = payload;
    } else {
      store.gameList.unshift(payload);
    }
    EduverseDataService.saveStore(store);
  }

  public static deleteGame(id: string, teacherId: string): boolean {
    const store = EduverseDataService.loadStore();
    const target = store.gameList.find((g) => g.id === id);
    if (!target) return false;
    if (target.teacherId && target.teacherId !== teacherId && teacherId !== 'admin') {
      return false;
    }
    store.gameList = store.gameList.filter((g) => g.id !== id);
    EduverseDataService.saveStore(store);
    return true;
  }

  public static getTeacherMissions(teacherId: string): MissionItem[] {
    return EduverseDataService.loadStore().missionList.filter((m) => m.teacherId === teacherId);
  }

  public static saveMission(item: MissionItem, teacherId: string): void {
    const store = EduverseDataService.loadStore();
    const index = store.missionList.findIndex((m) => m.id === item.id);
    const payload = { ...item, teacherId };

    if (index >= 0) {
      store.missionList[index] = payload;
    } else {
      store.missionList.unshift(payload);
    }
    EduverseDataService.saveStore(store);
  }

  public static deleteMission(id: string, teacherId: string): boolean {
    const store = EduverseDataService.loadStore();
    const target = store.missionList.find((m) => m.id === id);
    if (!target) return false;
    if (target.teacherId && target.teacherId !== teacherId && teacherId !== 'admin') {
      return false;
    }
    store.missionList = store.missionList.filter((m) => m.id !== id);
    EduverseDataService.saveStore(store);
    return true;
  }

  // --- STUDENT ROSTER MANAGEMENT ---
  public static getStudentRoster(): StudentRosterRecord[] {
    return EduverseDataService.loadStore().studentRoster;
  }

  public static syncStudentProgress(
    name: string,
    classLevel: number,
    xp: number,
    level: number,
    badgesCount: number
  ): void {
    if (!name.trim()) return;
    const store = EduverseDataService.loadStore();
    const query = name.trim().toLowerCase();
    const existing = store.studentRoster.find((s) => s.name.toLowerCase() === query);

    if (existing) {
      existing.classLevel = classLevel;
      existing.xp = Math.max(existing.xp, xp);
      existing.level = Math.max(existing.level, level);
      existing.badgesCount = Math.max(existing.badgesCount, badgesCount);
      existing.lastActive = 'Hari ini';
    } else {
      store.studentRoster.unshift({
        id: `std-${Date.now()}`,
        name: name.trim(),
        classLevel,
        xp,
        level,
        badgesCount,
        completedMateriCount: 1,
        completedGamesCount: 0,
        lastActive: 'Hari ini',
      });
    }
    EduverseDataService.saveStore(store);
  }

  public static addStudent(name: string, classLevel: number): StudentRosterRecord {
    const store = EduverseDataService.loadStore();
    const newStudent: StudentRosterRecord = {
      id: `std-${Date.now()}`,
      name: name.trim(),
      classLevel,
      xp: 0,
      level: 1,
      badgesCount: 0,
      completedMateriCount: 0,
      completedGamesCount: 0,
      lastActive: 'Baru mendaftar',
    };
    store.studentRoster.push(newStudent);
    EduverseDataService.saveStore(store);
    return newStudent;
  }

  public static resetToDemoDefaults(): void {
    localStorage.removeItem(STORE_KEY);
    EduverseDataService.loadStore();
  }
}
