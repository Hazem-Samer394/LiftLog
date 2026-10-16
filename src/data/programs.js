export const programs = {
  /* ============================================================
     1) BEGINNER FULL BODY - 3 أيام
     ============================================================ */
  beginnerFullBody: {
    name: "Beginner Full Body",
    description: "تمرين الجسم كله في كل حصة — مناسب للمبتدئين",
    level: "Beginner",
    daysPerWeek: 3,
    days: {
      "Day 1": ["chest", "back", "legs", "biceps", "abs"],
      "Day 2": ["chest", "back", "legs", "shoulders", "triceps"],
      "Day 3": ["chest", "back", "legs", "biceps", "triceps", "abs"],
    },
  },

  /* ============================================================
     2) UPPER / LOWER - 4 أيام
     ============================================================ */
  upperLower4: {
    name: "Upper / Lower",
    description: "يومين للجزء العلوي ويومين للسفلي — توازن ممتاز",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Upper A": ["chest", "back", "shoulders", "biceps", "triceps"],
      "Lower A": ["legs", "abs"],
      "Upper B": ["chest", "back", "shoulders", "biceps", "triceps"],
      "Lower B": ["legs", "abs"],
    },
  },

  /* ============================================================
     3) UPPER / LOWER - 3 أيام
     ============================================================ */
  upperLower3: {
    name: "Upper / Lower 3 Days",
    description: "تقسيمة علوي/سفلي بـ 3 أيام فقط — مرونة عالية",
    level: "Intermediate",
    daysPerWeek: 3,
    days: {
      "Upper A": ["chest", "back", "shoulders", "biceps", "triceps"],
      "Lower A": ["legs", "abs"],
      "Upper B": ["chest", "back", "shoulders", "biceps", "triceps"],
    },
  },

  /* ============================================================
     4) PPL × 2 - 6 أيام
     ============================================================ */
  ppl6: {
    name: "PPL × 2",
    description: "دفع/سحب/رجل مرتين في الأسبوع — 6 أيام",
    level: "Advanced",
    daysPerWeek: 6,
    days: {
      "Push A": ["chest", "shoulders", "triceps"],
      "Pull A": ["back", "biceps", "forearms"],
      "Legs A": ["legs", "abs"],
      "Push B": ["chest", "shoulders", "triceps"],
      "Pull B": ["back", "biceps", "forearms"],
      "Legs B": ["legs", "abs"],
    },
  },

  /* ============================================================
     5) PPL - 3 أيام (الموجود عندك)
     ============================================================ */
  ppl: {
    name: "Push Pull Legs",
    description: "التقسيمة الكلاسيكية بـ 3 أيام",
    level: "Intermediate",
    daysPerWeek: 3,
    days: {
      push: ["chest", "shoulders", "triceps"],
      pull: ["back", "biceps"],
      legs: ["legs", "abs"],
    },
  },

  /* ============================================================
     6) ARNOLD SPLIT (الموجود عندك)
     ============================================================ */
  arnold: {
    name: "Arnold Split",
    description: "تقسيمة أرنولد الشهيرة — صدر/ظهر، أكتاف/ذراع، رجل",
    level: "Advanced",
    daysPerWeek: 6,
    days: {
      chestBack: ["chest", "back"],
      shouldersArms: ["shoulders", "biceps", "triceps"],
      legs: ["legs", "abs"],
      "Chest & Back B": ["chest", "back"],
      "Shoulders & Arms B": ["shoulders", "biceps", "triceps"],
      "Legs B": ["legs", "abs"],
    },
  },

  /* ============================================================
     7) BRO SPLIT (الموجود عندك)
     ============================================================ */
  bro: {
    name: "Bro Split",
    description: "كل يوم لعضلة واحدة — تركيز عالي",
    level: "Intermediate",
    daysPerWeek: 5,
    days: {
      chest: ["chest"],
      back: ["back"],
      shoulders: ["shoulders", "forearms"],
      arms: ["biceps", "triceps"],
      legs: ["legs", "abs"],
    },
  },

  /* ============================================================
     8) FLEXIBLE 3-DAY SPLIT
     ============================================================ */
  flexible3: {
    name: "Flexible 3-Day Split",
    description: "تقسيمة مرنة للمشغولين — 3 أيام",
    level: "Beginner",
    daysPerWeek: 3,
    days: {
      "Day 1": ["chest", "back"],
      "Day 2": ["legs", "abs"],
      "Day 3": ["chest", "back", "shoulders", "biceps", "triceps"],
    },
  },

  /* ============================================================
     9) FULL BODY A/B - 2-3 أيام
     ============================================================ */
  fullBodyAB: {
    name: "Full Body A/B",
    description: "تمرينان متبادلان للجسم كله — للمبتدئين جداً",
    level: "Beginner",
    daysPerWeek: 2,
    days: {
      "Full Body A": ["chest", "back", "legs", "shoulders"],
      "Full Body B": ["chest", "back", "legs", "biceps", "triceps", "abs"],
    },
  },

  /* ============================================================
     10) FULL BODY 3 DAYS
     ============================================================ */
  fullBody3: {
    name: "Full Body 3 Days",
    description: "الجسم كله 3 أيام في الأسبوع",
    level: "Beginner",
    daysPerWeek: 3,
    days: {
      "Day A": ["chest", "back", "legs"],
      "Day B": ["chest", "back", "legs", "abs"],
      "Day C": ["chest", "back", "legs", "shoulders", "biceps", "triceps"],
    },
  },

  /* ============================================================
     11) PUSH / PULL - 4 أيام
     ============================================================ */
  pushPull4: {
    name: "Push / Pull 4 Days",
    description: "تقسيمة بسيطة: دفع و سحب ×2",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Push A": ["chest", "shoulders", "triceps"],
      "Pull A": ["back", "biceps"],
      "Push B": ["chest", "shoulders", "triceps"],
      "Pull B": ["back", "biceps", "forearms"],
    },
  },

  /* ============================================================
     12) CHEST & BACK / LEGS / ARMS & SHOULDERS - 3 أيام
     ============================================================ */
  chestBackLegsArms: {
    name: "Chest & Back / Legs / Arms & Shoulders",
    description: "تقسيمة 3 أيام بتجميع العضلات المتقابلة",
    level: "Intermediate",
    daysPerWeek: 3,
    days: {
      "Chest & Back": ["chest", "back"],
      Legs: ["legs", "abs"],
      "Arms & Shoulders": ["shoulders", "biceps", "triceps", "forearms"],
    },
  },

  /* ============================================================
     13) CHEST & TRICEPS / BACK & BICEPS / LEGS & SHOULDERS - 3 أيام
     ============================================================ */
  classicPushPullLegs: {
    name: "Chest & Triceps / Back & Biceps / Legs & Shoulders",
    description: "التقسيمة التقليدية الشائعة",
    level: "Intermediate",
    daysPerWeek: 3,
    days: {
      "Chest & Triceps": ["chest", "triceps"],
      "Back & Biceps": ["back", "biceps"],
      "Legs & Shoulders": ["legs", "shoulders", "abs"],
    },
  },

  /* ============================================================
     14) CHEST FOCUS - 4 أيام
     ============================================================ */
  chestFocus: {
    name: "Chest Focus",
    description: "تركيز خاص على الصدر مع الحفاظ على باقي الجسم",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Chest Day A": ["chest", "triceps"],
      "Back & Biceps": ["back", "biceps"],
      "Chest Day B": ["chest", "shoulders"],
      "Legs & Abs": ["legs", "abs"],
    },
  },

  /* ============================================================
     15) BACK FOCUS - 4 أيام
     ============================================================ */
  backFocus: {
    name: "Back Focus",
    description: "تركيز على الظهر لعرض أكبر",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Back Day A": ["back", "biceps"],
      "Chest & Shoulders": ["chest", "shoulders"],
      "Back Day B": ["back", "forearms"],
      "Legs & Abs": ["legs", "abs"],
    },
  },

  /* ============================================================
     16) ARMS FOCUS - 4 أيام
     ============================================================ */
  armsFocus: {
    name: "Arms Focus",
    description: "تركيز على البايسبس والترايسبس",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Arms A": ["biceps", "triceps", "forearms"],
      "Chest & Back": ["chest", "back"],
      "Arms B": ["biceps", "triceps", "forearms"],
      "Shoulders & Legs": ["shoulders", "legs", "abs"],
    },
  },

  /* ============================================================
     17) LEGS FOCUS - 4 أيام
     ============================================================ */
  legsFocus: {
    name: "Legs Focus",
    description: "تركيز على الرجل مع باقي الجسم",
    level: "Intermediate",
    daysPerWeek: 4,
    days: {
      "Legs A": ["legs", "abs"],
      "Chest & Back": ["chest", "back"],
      "Legs B": ["legs", "abs"],
      "Shoulders & Arms": ["shoulders", "biceps", "triceps"],
    },
  },

  /* ============================================================
     18) SHORT WORKOUT - 3 أيام
     ============================================================ */
  shortWorkout: {
    name: "Short Workout",
    description: "تمارين سريعة للمشغولين — 3 أيام",
    level: "Beginner",
    daysPerWeek: 3,
    days: {
      "Day 1": ["chest", "back"],
      "Day 2": ["legs", "shoulders"],
      "Day 3": ["biceps", "triceps", "abs"],
    },
  },

  /* ============================================================
     19) MACHINE-BASED SPLIT - 3-4 أيام
     ============================================================ */
  machineBased: {
    name: "Machine-Based Split",
    description: "تقسيمة بالأجهزة والكابلات — للمبتدئين",
    level: "Beginner",
    daysPerWeek: 3,
    days: {
      "Upper Day": ["chest", "back", "shoulders"],
      "Lower Day": ["legs", "abs"],
      "Arms Day": ["biceps", "triceps", "forearms"],
    },
  },

  /* ============================================================
     20) HIGH-VOLUME SPLIT - 5 أيام
     ============================================================ */
  highVolume: {
    name: "High-Volume Split",
    description: "حجم تمرين عالي للمتقدمين",
    level: "Advanced",
    daysPerWeek: 5,
    days: {
      "Chest & Shoulders": ["chest", "shoulders"],
      Back: ["back"],
      Legs: ["legs"],
      "Arms": ["biceps", "triceps", "forearms"],
      "Full Upper": ["chest", "back", "shoulders", "biceps", "triceps"],
    },
  },

  /* ============================================================
     21) RECOVERY-FRIENDLY SPLIT - 2-3 أيام
     ============================================================ */
  recoveryFriendly: {
    name: "Recovery-Friendly Split",
    description: "أيام راحة أكتر — للتعافي",
    level: "Beginner",
    daysPerWeek: 2,
    days: {
      "Upper Body": ["chest", "back", "shoulders", "biceps", "triceps"],
      "Lower Body & Core": ["legs", "abs"],
    },
  },
};