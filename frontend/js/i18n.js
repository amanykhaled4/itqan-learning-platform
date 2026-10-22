// Every piece of interface text, in Arabic and English.
// Lesson and exam content comes from the API in Arabic.

// Arabic counted nouns change with the number:
// 1 سؤال واحد · 2 سؤالان · 3–10 أسئلة · 11+ سؤالًا
function arCount(n, [one, two, few, many]) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n >= 3 && n <= 10) return `${n} ${few}`;
    return `${n} ${many}`;
}

const AR = {
    lessons: ["درس واحد", "درسان", "دروس", "درسًا"],
    questions: ["سؤال واحد", "سؤالان", "أسئلة", "سؤالًا"],
    units: ["وحدة واحدة", "وحدتان", "وحدات", "وحدة"],
    days: ["يوم واحد", "يومان", "أيام", "يومًا"],
    exams: ["اختبار واحد", "اختباران", "اختبارات", "اختبارًا"],
    minutes: ["دقيقة واحدة", "دقيقتان", "دقائق", "دقيقة"]
};

// The noun alone for "x من 12 درسًا": it agrees with the total
function arNoun(n, forms) {
    return n >= 3 && n <= 10 ? forms[2] : forms[3];
}

const translations = {
    ar: {
        // Brand & sidebar
        brandName: "منصة إتقان",
        brandIcon: "إ",
        brandTagline: "رحلتك نحو التميز",
        menuMain: "القائمة الرئيسية",
        menuAccount: "حسابي",
        navHome: "الرئيسية",
        navExams: "الاختبارات",
        navProgress: "تقدمي",
        navProfile: "الملف الشخصي",
        navSettings: "الإعدادات",
        navLogout: "تسجيل الخروج",
        helpTitle: "تحتاج مساعدة؟",
        helpText: "نحن هنا لمساعدتك",
        openMenu: "فتح القائمة",
        switchLanguage: "English",
        toggleTheme: "تغيير المظهر",

        // Notifications
        notifications: "الإشعارات",
        markAllRead: "تحديد الكل كمقروء",
        noNotifications: "لا توجد إشعارات جديدة",
        notifWelcomeTitle: "مرحبًا بك في إتقان ✦",
        notifWelcomeText: "ابدأ أول درس لك اليوم.",
        notifExamTitle: "اختبارات بانتظارك",
        notifExamText: (n) => `لديك ${arCount(n, AR.exams)} لم تحلها بعد.`,
        notifLessonTitle: "تابع من حيث توقفت",
        notifLessonText: (title) => `الدرس التالي: ${title}`,
        notifStreakTitle: "أحسنت! ✦",
        notifStreakText: (n) => `تعلّمت ${arCount(n, AR.days)} على التوالي، استمر!`,

        // Alerts & errors
        ok: "حسنًا",
        cancel: "إلغاء",
        logoutTitle: "تسجيل الخروج؟",
        logoutText: "هل تريد تسجيل الخروج من حسابك؟",
        logoutConfirm: "نعم، تسجيل الخروج",
        errorTitle: "حدث خطأ",
        sessionExpired: "انتهت جلستك، من فضلك سجّل الدخول مرة أخرى.",
        errors: {
            NETWORK: "تعذّر الاتصال بالخادم. تأكد من تشغيل الـ API ثم حاول مرة أخرى.",
            EMAIL_TAKEN: "هذا البريد الإلكتروني مسجّل بالفعل.",
            INVALID_LOGIN: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
            WRONG_PASSWORD: "كلمة المرور الحالية غير صحيحة.",
            EXAM_UNAVAILABLE: "هذا الاختبار غير متاح بعد.",
            EXAM_NOT_FOUND: "الاختبار غير موجود.",
            SUBJECT_NOT_FOUND: "المادة غير موجودة.",
            LESSON_NOT_FOUND: "الدرس غير موجود.",
            VALIDATION: "تأكد من صحة البيانات المدخلة.",
            DEFAULT: "حدث خطأ غير متوقع، حاول مرة أخرى."
        },

        // Auth pages
        authHeadline1: "مستقبلك يبدأ",
        authHeadline2: "من هنا",
        authText: "تعلّم بطريقة مختلفة، وتابع تقدمك، وطوّر مهاراتك من خلال تجربة تعليمية مصممة لتساعدك على النجاح.",
        feature1: "دروس منظمة وسهلة",
        feature2: "اختبارات بتصحيح فوري",
        feature3: "متابعة مستوى تقدمك",
        authFooter: "تعلّم • تطوّر • انجح",
        email: "البريد الإلكتروني",
        emailPlaceholder: "name@example.com",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        showPassword: "إظهار كلمة المرور",
        loginTitle: "مرحبًا بعودتك",
        loginSubtitle: "سجّل دخولك للوصول إلى حسابك.",
        login: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟",
        createAccount: "أنشئ حسابًا جديدًا",
        fillLogin: "من فضلك أدخل البريد الإلكتروني وكلمة المرور.",
        registerTitle: "إنشاء حساب جديد",
        registerSubtitle: "أنشئ حسابك وابدأ رحلتك التعليمية.",
        fullName: "الاسم",
        fullNamePlaceholder: "اسمك الكامل",
        grade: "الصف الدراسي",
        gradePlaceholder: "اختر الصف الدراسي",
        grades: { "الأول الثانوي": "الصف الأول الثانوي", "الثاني الثانوي": "الصف الثاني الثانوي", "الثالث الثانوي": "الصف الثالث الثانوي" },
        confirmPassword: "تأكيد كلمة المرور",
        confirmPasswordPlaceholder: "أعد كتابة كلمة المرور",
        terms: "أوافق على شروط استخدام المنصة",
        register: "إنشاء الحساب",
        haveAccount: "لديك حساب بالفعل؟",
        signIn: "سجّل الدخول",
        nameRequired: "من فضلك أدخل اسمك.",
        emailInvalid: "من فضلك أدخل بريدًا إلكترونيًا صحيحًا.",
        gradeRequired: "من فضلك اختر الصف الدراسي.",
        passwordShort: "كلمة المرور يجب ألا تقل عن 6 أحرف.",
        passwordMismatch: "كلمتا المرور غير متطابقتين.",
        termsRequired: "يجب الموافقة على شروط الاستخدام.",
        welcomeNew: "تم إنشاء حسابك بنجاح ✦",

        // Dashboard
        pageDashboard: "الرئيسية",
        welcomeBack: "أهلاً بعودتك",
        greeting: (name) => `مرحبًا، ${name}`,
        dashGreeting: (part, name) => `${part === "morning" ? "صباح الخير" : "مساء الخير"}${name ? `، ${name}` : ""}`,
        dashSummary: (p) => {
            const lessons = `${p.completedLessons} من ${p.totalLessons} ${arNoun(p.totalLessons, AR.lessons)}`;
            if (p.completedLessons === 0 && p.examsTaken === 0) return "حسابك جاهز. اختر مادة وابدأ أول درس، فالدروس قصيرة ومركّزة.";
            if (p.completedLessons === 0) return `متوسط درجاتك ${p.averageScore}% في ${arCount(p.examsTaken, AR.exams)}. ابدأ الدروس لتثبيت ما تعرفه وسد أي فجوات.`;
            if (p.examsTaken === 0) return `أنجزت ${lessons} حتى الآن. جرّب أحد الاختبارات لتقيس مستواك.`;
            return `أنجزت ${lessons} حتى الآن، ومتوسط درجاتك ${p.averageScore}% في ${arCount(p.examsTaken, AR.exams)}.`;
        },
        nextUp: "الدرس التالي",
        startHere: "ابدأ من هنا",
        resumeLesson: "متابعة الدرس",
        startLesson: "ابدأ الدرس",
        allDoneEyebrow: "المنهج مكتمل",
        kpiCompletion: "نسبة الإنجاز",
        kpiLessons: "الدروس المكتملة",
        kpiLessonsSub: (total) => `من أصل ${total} ${arNoun(total, AR.lessons)}`,
        kpiAverage: "متوسط الدرجات",
        kpiAverageSub: (n) => n ? `في ${arCount(n, AR.exams)}` : "لا توجد نتائج بعد",
        kpiStreak: "أيام متتالية",
        kpiStreakSub: (n) => n ? "حافظ على استمراريتك" : "ابدأ سلسلتك اليوم",
        subjectsEyebrow: "موادك الدراسية",
        subjectsTitle: "التقدم في المواد",
        viewDetails: "عرض التفاصيل",
        viewAll: "عرض الكل",
        suggestedExams: "اختبارات مقترحة",
        newExam: "جديد",
        noExamsYet: "لا توجد اختبارات متاحة حاليًا.",
        activityEyebrow: "سجلّك",
        lessonsDone: (done, total) => `${done} من ${total} ${arNoun(total, AR.lessons)}`,
        statOverall: "الإنجاز الكلي",
        statLessons: "دروس مكتملة",
        statExams: "اختبارات محلولة",
        statAverage: "متوسط الدرجات",

        // Course & lesson
        pageCourse: "المادة الدراسية",
        subjectProgress: "تقدمك في المادة",
        unitsTitle: "الوحدات الدراسية",
        unitsCount: (n) => arCount(n, AR.units),
        unitLabel: (n) => `الوحدة ${n}`,
        minutes: (n) => arCount(n, AR.minutes),
        completed: "مكتمل",
        pageLesson: "الدرس",
        markComplete: "تحديد كمكتمل",
        markIncomplete: "إلغاء الإكمال",
        lessonDone: "أحسنت! تم تسجيل إكمال الدرس ✦",
        previousLesson: "الدرس السابق",
        nextLesson: "الدرس التالي",
        backToSubject: "العودة للمادة",

        // Exams
        pageExams: "الاختبارات",
        examsEyebrow: "اختبر مستواك",
        examsSubtitle: "اختبر مستواك وتابع تقدمك الدراسي.",
        statTotalExams: "إجمالي الاختبارات",
        statAvailable: "متاحة الآن",
        statAttempts: "مرات الحل",
        availableExams: "الاختبارات المتاحة",
        questionsCount: (n) => arCount(n, AR.questions),
        startExam: "ابدأ الاختبار",
        retakeExam: "أعد المحاولة",
        bestScore: (p) => `أفضل نتيجة ${p}%`,
        comingSoon: "قريبًا",
        historyTitle: "نتائجك السابقة",
        noAttempts: "لم تحل أي اختبار بعد. ابدأ أول اختبار الآن!",
        gradeLabel: (p) => p >= 90 ? "ممتاز" : p >= 80 ? "جيد جدًا" : p >= 65 ? "جيد" : p >= 50 ? "مقبول" : "يحتاج مراجعة",

        // Exam page
        pageExam: "الاختبار",
        answered: (a, t) => `أجبت عن ${a} من ${t}`,
        submitExam: "تسليم الاختبار",
        submitConfirmTitle: "تسليم الاختبار؟",
        submitConfirmText: (n) => n === 0 ? "أجبت عن كل الأسئلة. هل تريد التسليم الآن؟" : `لديك ${arCount(n, AR.questions)} بدون إجابة. هل تريد التسليم؟`,
        submitConfirm: "نعم، سلّم",
        timeUp: "انتهى الوقت! تم تسليم إجاباتك تلقائيًا.",
        resultTitle: "نتيجتك",
        resultText: (s, t) => `أجبت إجابة صحيحة عن ${s} من ${t} ${arNoun(t, AR.questions)}.`,
        reviewTitle: "مراجعة الإجابات",
        backToExams: "العودة للاختبارات",
        tryAgain: "إعادة الاختبار",
        notAnswered: "لم تتم الإجابة",

        // Progress
        pageProgress: "تقدمي",
        progressEyebrow: "رحلتك التعليمية",
        progressTitle: "تقدّمك الدراسي",
        overall: "الإنجاز الكلي",
        progressMessage: (p) => p >= 75 ? "أداء رائع! أنت قريب جدًا من إكمال المنهج." : p >= 40 ? "تقدّم جيد جدًا، استمر بنفس الحماس." : p > 0 ? "بداية موفقة، كل درس يقرّبك من هدفك." : "ابدأ أول درس اليوم، والرحلة كلها تبدأ بخطوة.",
        statStreak: "أيام متتالية",
        subjectsProgress: "تقدمك في المواد",
        recentActivity: "آخر نشاطاتك",
        noActivity: "ابدأ أول درس لتظهر نشاطاتك هنا.",
        activityLesson: "أكملت درس",
        activityExam: "حللت اختبار",
        nextGoal: "هدفك القادم",
        nextGoalText: (target, left) => `باقي ${arCount(left, AR.lessons)} للوصول إلى ${target}%.`,
        allDone: "أكملت كل الدروس! 🎉",

        // Profile
        pageProfile: "الملف الشخصي",
        activeAccount: "حساب نشط",
        memberSince: (date) => `عضو منذ ${date}`,
        accountInfo: "بيانات الحساب",
        editProfile: "تعديل البيانات",
        save: "حفظ التغييرات",
        profileSaved: "تم حفظ بياناتك.",
        changePassword: "تغيير كلمة المرور",
        currentPassword: "كلمة المرور الحالية",
        newPassword: "كلمة المرور الجديدة",
        updatePassword: "تحديث كلمة المرور",
        passwordChanged: "تم تغيير كلمة المرور.",
        yourStats: "إحصائياتك",

        // Settings
        pageSettings: "الإعدادات",
        settingsEyebrow: "خصّص تجربتك",
        settingsTitle: "تفضيلاتك",
        languageSetting: "لغة المنصة",
        languageText: "اختر لغة واجهة المنصة.",
        themeSetting: "المظهر",
        themeText: "اختر الشكل المريح لعينيك.",
        light: "فاتح",
        dark: "داكن",
        notificationsSetting: "الإشعارات",
        notificationsText: "تنبيهات الدروس والاختبارات.",
        reminderSetting: "تذكير الدراسة",
        reminderText: "تذكيرك بمتابعة دروسك يوميًا.",
        resetSettings: "استعادة الافتراضي",
        settingsSaved: "تم حفظ الإعدادات ✦",
        resetConfirmTitle: "استعادة الإعدادات؟",
        resetConfirmText: "سيتم إرجاع جميع الإعدادات للوضع الافتراضي.",
        resetConfirm: "نعم، استعادة"
    },

    en: {
        brandName: "Itqan",
        brandIcon: "I",
        brandTagline: "Your path to excellence",
        menuMain: "Main menu",
        menuAccount: "My account",
        navHome: "Home",
        navExams: "Exams",
        navProgress: "My progress",
        navProfile: "Profile",
        navSettings: "Settings",
        navLogout: "Log out",
        helpTitle: "Need help?",
        helpText: "We're here for you",
        openMenu: "Open menu",
        switchLanguage: "العربية",
        toggleTheme: "Toggle theme",

        notifications: "Notifications",
        markAllRead: "Mark all as read",
        noNotifications: "No new notifications",
        notifWelcomeTitle: "Welcome to Itqan ✦",
        notifWelcomeText: "Start your first lesson today.",
        notifExamTitle: "Exams waiting for you",
        notifExamText: (n) => n === 1 ? "You have 1 exam you haven't taken yet." : `You have ${n} exams you haven't taken yet.`,
        notifLessonTitle: "Pick up where you left off",
        notifLessonText: (title) => `Next lesson: ${title}`,
        notifStreakTitle: "Great job! ✦",
        notifStreakText: (n) => `${n} days of learning in a row. Keep going!`,

        ok: "OK",
        cancel: "Cancel",
        logoutTitle: "Log out?",
        logoutText: "Do you want to log out of your account?",
        logoutConfirm: "Yes, log out",
        errorTitle: "Something went wrong",
        sessionExpired: "Your session has ended. Please log in again.",
        errors: {
            NETWORK: "Can't reach the server. Make sure the API is running and try again.",
            EMAIL_TAKEN: "This email is already registered.",
            INVALID_LOGIN: "Email or password is incorrect.",
            WRONG_PASSWORD: "The current password is incorrect.",
            EXAM_UNAVAILABLE: "This exam isn't available yet.",
            EXAM_NOT_FOUND: "Exam not found.",
            SUBJECT_NOT_FOUND: "Subject not found.",
            LESSON_NOT_FOUND: "Lesson not found.",
            VALIDATION: "Please check the information you entered.",
            DEFAULT: "Something unexpected happened. Please try again."
        },

        authHeadline1: "Your future",
        authHeadline2: "starts here",
        authText: "Learn differently, track your progress and build your skills with a learning experience designed to help you succeed.",
        feature1: "Clear, organized lessons",
        feature2: "Exams with instant grading",
        feature3: "Track your progress",
        authFooter: "Learn • Grow • Succeed",
        email: "Email",
        emailPlaceholder: "name@example.com",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        showPassword: "Show password",
        loginTitle: "Welcome back",
        loginSubtitle: "Log in to access your account.",
        login: "Log in",
        noAccount: "Don't have an account?",
        createAccount: "Create one",
        fillLogin: "Please enter your email and password.",
        registerTitle: "Create an account",
        registerSubtitle: "Sign up and start your learning journey.",
        fullName: "Name",
        fullNamePlaceholder: "Your full name",
        grade: "Grade",
        gradePlaceholder: "Choose your grade",
        grades: { "الأول الثانوي": "Grade 10", "الثاني الثانوي": "Grade 11", "الثالث الثانوي": "Grade 12" },
        confirmPassword: "Confirm password",
        confirmPasswordPlaceholder: "Type the password again",
        terms: "I agree to the terms of use",
        register: "Create account",
        haveAccount: "Already have an account?",
        signIn: "Log in",
        nameRequired: "Please enter your name.",
        emailInvalid: "Please enter a valid email address.",
        gradeRequired: "Please choose your grade.",
        passwordShort: "The password must be at least 6 characters.",
        passwordMismatch: "The passwords don't match.",
        termsRequired: "You need to accept the terms of use.",
        welcomeNew: "Your account is ready ✦",

        pageDashboard: "Home",
        welcomeBack: "Welcome back",
        greeting: (name) => `Hello, ${name}`,
        dashGreeting: (part, name) => `Good ${part}${name ? `, ${name}` : ""}`,
        dashSummary: (p) => {
            const lessons = `${p.completedLessons} of ${p.totalLessons} lessons`;
            const exams = `${p.examsTaken} exam${p.examsTaken === 1 ? "" : "s"}`;
            if (p.completedLessons === 0 && p.examsTaken === 0) return "Your account is ready. Pick a subject and start your first lesson. Lessons are short and focused.";
            if (p.completedLessons === 0) return `You average ${p.averageScore}% across ${exams}. Work through the lessons to lock in what you know and close any gaps.`;
            if (p.examsTaken === 0) return `You've completed ${lessons} so far. Try an exam to check your level.`;
            return `You've completed ${lessons} so far and average ${p.averageScore}% across ${exams}.`;
        },
        nextUp: "Next lesson",
        startHere: "Start here",
        resumeLesson: "Continue lesson",
        startLesson: "Start lesson",
        allDoneEyebrow: "Curriculum complete",
        kpiCompletion: "Completion",
        kpiLessons: "Lessons completed",
        kpiLessonsSub: (total) => `out of ${total}`,
        kpiAverage: "Average score",
        kpiAverageSub: (n) => n ? `across ${n} exam${n === 1 ? "" : "s"}` : "No results yet",
        kpiStreak: "Day streak",
        kpiStreakSub: (n) => n ? "Keep the streak going" : "Start your streak today",
        subjectsEyebrow: "Your subjects",
        subjectsTitle: "Progress by subject",
        viewDetails: "View details",
        viewAll: "View all",
        suggestedExams: "Suggested exams",
        newExam: "New",
        noExamsYet: "No exams are available right now.",
        activityEyebrow: "Your log",
        lessonsDone: (done, total) => `${done} of ${total} lessons`,
        statOverall: "Overall progress",
        statLessons: "Lessons completed",
        statExams: "Exams taken",
        statAverage: "Average score",

        pageCourse: "Subject",
        subjectProgress: "Your progress",
        unitsTitle: "Units",
        unitsCount: (n) => `${n} unit${n === 1 ? "" : "s"}`,
        unitLabel: (n) => `Unit ${n}`,
        minutes: (n) => `${n} min`,
        completed: "Done",
        pageLesson: "Lesson",
        markComplete: "Mark as complete",
        markIncomplete: "Mark as not complete",
        lessonDone: "Nice work! Lesson completed ✦",
        previousLesson: "Previous lesson",
        nextLesson: "Next lesson",
        backToSubject: "Back to subject",

        pageExams: "Exams",
        examsEyebrow: "Test yourself",
        examsSubtitle: "Check your level and follow your progress.",
        statTotalExams: "Total exams",
        statAvailable: "Available now",
        statAttempts: "Attempts",
        availableExams: "Available exams",
        questionsCount: (n) => `${n} question${n === 1 ? "" : "s"}`,
        startExam: "Start exam",
        retakeExam: "Try again",
        bestScore: (p) => `Best score ${p}%`,
        comingSoon: "Coming soon",
        historyTitle: "Your results",
        noAttempts: "You haven't taken an exam yet. Start your first one now!",
        gradeLabel: (p) => p >= 90 ? "Excellent" : p >= 80 ? "Very good" : p >= 65 ? "Good" : p >= 50 ? "Pass" : "Needs review",

        pageExam: "Exam",
        answered: (a, t) => `${a} of ${t} answered`,
        submitExam: "Submit exam",
        submitConfirmTitle: "Submit the exam?",
        submitConfirmText: (n) => n === 0 ? "You answered every question. Submit now?" : `${n} question${n === 1 ? " has" : "s have"} no answer. Submit anyway?`,
        submitConfirm: "Yes, submit",
        timeUp: "Time's up! Your answers were submitted automatically.",
        resultTitle: "Your result",
        resultText: (s, t) => `You answered ${s} of ${t} questions correctly.`,
        reviewTitle: "Review your answers",
        backToExams: "Back to exams",
        tryAgain: "Try again",
        notAnswered: "Not answered",

        pageProgress: "My progress",
        progressEyebrow: "Your learning journey",
        progressTitle: "Your progress",
        overall: "Overall",
        progressMessage: (p) => p >= 75 ? "Amazing! You're close to finishing the curriculum." : p >= 40 ? "Very good progress. Keep it up!" : p > 0 ? "A great start. Every lesson gets you closer." : "Start your first lesson today. Every journey begins with one step.",
        statStreak: "Day streak",
        subjectsProgress: "Progress by subject",
        recentActivity: "Recent activity",
        noActivity: "Complete your first lesson to see your activity here.",
        activityLesson: "Completed a lesson",
        activityExam: "Took an exam",
        nextGoal: "Your next goal",
        nextGoalText: (target, left) => `Complete ${left} more lesson${left === 1 ? "" : "s"} to reach ${target}%.`,
        allDone: "You've completed every lesson! 🎉",

        pageProfile: "Profile",
        activeAccount: "Active account",
        memberSince: (date) => `Member since ${date}`,
        accountInfo: "Account details",
        editProfile: "Edit details",
        save: "Save changes",
        profileSaved: "Your details were saved.",
        changePassword: "Change password",
        currentPassword: "Current password",
        newPassword: "New password",
        updatePassword: "Update password",
        passwordChanged: "Your password was changed.",
        yourStats: "Your stats",

        pageSettings: "Settings",
        settingsEyebrow: "Personalize your experience",
        settingsTitle: "Preferences",
        languageSetting: "Language",
        languageText: "Choose the interface language.",
        themeSetting: "Appearance",
        themeText: "Choose what's comfortable for your eyes.",
        light: "Light",
        dark: "Dark",
        notificationsSetting: "Notifications",
        notificationsText: "Alerts about lessons and exams.",
        reminderSetting: "Study reminder",
        reminderText: "A daily nudge to keep studying.",
        resetSettings: "Reset to default",
        settingsSaved: "Settings saved ✦",
        resetConfirmTitle: "Reset settings?",
        resetConfirmText: "All settings will go back to their defaults.",
        resetConfirm: "Yes, reset"
    }
};

const I18n = {
    get lang() {
        return document.documentElement.lang === "en" ? "en" : "ar";
    },

    // t("greeting", "Sara") → "مرحبًا، Sara"
    t(key, ...args) {
        const value = translations[this.lang][key] ?? translations.ar[key] ?? key;
        return typeof value === "function" ? value(...args) : value;
    },

    error(error) {
        const errors = translations[this.lang].errors;
        return errors[error?.code] || errors.DEFAULT;
    },

    grade(value) {
        return translations[this.lang].grades[value] || value;
    },

    date(value, options = { year: "numeric", month: "long", day: "numeric" }) {
        // Western digits in both languages, so numbers look the same everywhere
        return new Date(value).toLocaleDateString(this.lang === "en" ? "en-US" : "ar-EG-u-nu-latn", options);
    },

    // Fills every element marked with data-i18n, data-i18n-placeholder, etc.
    apply(root = document) {
        root.querySelectorAll("[data-i18n]").forEach((el) => {
            el.textContent = this.t(el.dataset.i18n);
        });
        root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });
        root.querySelectorAll("[data-i18n-label]").forEach((el) => {
            el.setAttribute("aria-label", this.t(el.dataset.i18nLabel));
            el.title = this.t(el.dataset.i18nLabel);
        });
    }
};
