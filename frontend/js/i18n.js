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
        brandTagline: "ذاكر بذكاء، وتقدّم بثقة",
        menuMain: "التعلّم",
        menuAccount: "الحساب",
        navHome: "الرئيسية",
        navExams: "الاختبارات",
        navProgress: "تقدمي",
        navProfile: "الملف الشخصي",
        navSettings: "الإعدادات",
        navLogout: "تسجيل الخروج",
        helpTitle: "لديك سؤال؟",
        helpText: "راسلنا في أي وقت",
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
        authHeadline1: "تعلّم بهدوء،",
        authHeadline2: "وتقدّم بثبات",
        authText: "دروس قصيرة وواضحة، واختبارات تُصحَّح فورًا، وتقرير يوضّح لك أين وصلت وماذا تراجع بعد ذلك.",
        feature1: "دروس قصيرة مرتّبة حسب الوحدات",
        feature2: "تصحيح فوري مع مراجعة للإجابات",
        feature3: "تقرير تقدّم لكل مادة",
        authFooter: "إتقان · منصة تعليمية للمرحلة الثانوية",
        email: "البريد الإلكتروني",
        emailPlaceholder: "name@example.com",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        showPassword: "إظهار كلمة المرور",
        loginTitle: "أهلًا من جديد",
        loginSubtitle: "سجّل الدخول لتكمل من حيث توقفت.",
        login: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟",
        createAccount: "أنشئ حسابًا جديدًا",
        fillLogin: "من فضلك أدخل البريد الإلكتروني وكلمة المرور.",
        registerTitle: "حساب جديد",
        registerSubtitle: "دقيقة واحدة، ثم تبدأ أول درس.",
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
        dashGreeting: (part, name) => `${part === "morning" ? "صباح الخير" : "مساء الخير"}${name ? `، ${name}` : ""}`,
        dashSummary: (p) => {
            const lessons = `${p.completedLessons} من ${p.totalLessons} ${arNoun(p.totalLessons, AR.lessons)}`;
            if (p.completedLessons === 0 && p.examsTaken === 0) return "هذه بداية رحلتك. اختر مادة من الأسفل وابدأ بأول درس، فهو لا يستغرق أكثر من ربع ساعة.";
            if (p.completedLessons === 0) return `جرّبت ${arCount(p.examsTaken, AR.exams)} بمتوسط ${p.averageScore}%. الدروس ستساعدك على تثبيت ما تعرفه.`;
            if (p.examsTaken === 0) return `أنهيت ${lessons}. حان وقت اختبار قصير لتعرف مستواك.`;
            return `أنهيت ${lessons}، ومتوسطك في الاختبارات ${p.averageScore}%. استمر على نفس الإيقاع.`;
        },
        nextUp: "درسك التالي",
        startHere: "أول درس لك",
        resumeLesson: "أكمل الدرس",
        startLesson: "ابدأ الآن",
        allDoneEyebrow: "أحسنت",
        seeReport: "عرض التقرير",
        subjectsEyebrow: "المنهج",
        subjectsTitle: "اختر مادة",
        openSubject: "متابعة المادة",
        beginSubject: "ابدأ المادة",
        examPickNew: "اختبار اليوم",
        examPickRetry: "جرّب مرة أخرى",
        examPickNewText: "لم تجرّبه بعد، وهو طريقة سريعة لتعرف مستواك في هذه المادة.",
        examPickRetryText: (p) => `أفضل نتيجة لك ${p}%، ومحاولة جديدة قد ترفعها.`,
        allExams: "كل الاختبارات",
        noExamsYet: "لا توجد اختبارات متاحة حاليًا.",
        tipEyebrow: "نصيحة اليوم",
        tips: [
            "ذاكر في جلسات قصيرة من 25 دقيقة، ثم خذ استراحة لخمس دقائق.",
            "اشرح الدرس بصوت عالٍ كأنك تعلّمه لصديق، وستكتشف ما لم تفهمه بعد.",
            "راجع درس الأمس في دقيقتين قبل أن تبدأ درسًا جديدًا.",
            "حل اختبار بعد الدرس مباشرة يثبّت المعلومة أكثر من إعادة القراءة.",
            "اكتب ملخصًا من ثلاثة أسطر في نهاية كل درس.",
            "الأخطاء في الاختبار ليست فشلًا، بل قائمة بما تحتاج مراجعته.",
            "النوم الجيد جزء من المذاكرة، فالذاكرة تثبّت ما تعلّمته أثناء النوم."
        ],
        lessonsDone: (done, total) => `${done} من ${total} ${arNoun(total, AR.lessons)}`,
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
        examsEyebrow: "قِس مستواك",
        examsSubtitle: "كل محاولاتك محفوظة هنا",
        statTotalExams: "إجمالي الاختبارات",
        statAvailable: "متاحة الآن",
        statAttempts: "مرات الحل",
        availableExams: "اختبارات المواد",
        questionsCount: (n) => arCount(n, AR.questions),
        startExam: "ابدأ الاختبار",
        retakeExam: "أعد المحاولة",
        bestScore: (p) => `أفضل نتيجة ${p}%`,
        comingSoon: "قريبًا",
        historyTitle: "سجل النتائج",
        noAttempts: "لا توجد نتائج بعد. ابدأ بأي اختبار من القائمة.",
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
        progressEyebrow: "نظرة عامة",
        progressTitle: "أين وصلت",
        overall: "من المنهج",
        progressMessage: (p) => p >= 75 ? "اقتربت من نهاية المنهج، بقيت خطوات قليلة." : p >= 40 ? "قطعت جزءًا كبيرًا من الطريق، حافظ على الإيقاع." : p > 0 ? "بداية جيدة. كل درس تنهيه يظهر هنا." : "لم تبدأ بعد. أول درس سيحرّك هذا المؤشر.",
        statStreak: "أيام متتالية",
        reportEyebrow: "حسب المادة",
        reportTitle: "تقرير المواد",
        reportSubject: "المادة",
        reportLessons: "الدروس",
        reportCompletion: "الإنجاز",
        reportBestExam: "أفضل اختبار",
        reportNoExam: "لم يُحل",
        activityEyebrow: "آخر ما أنجزته",
        recentActivity: "سجل النشاط",
        noActivity: "سيظهر هنا كل درس تنهيه وكل اختبار تحله.",
        activityLesson: "أكملت درس",
        activityExam: "حللت اختبار",
        nextGoal: "المحطة التالية",
        nextGoalText: (target, left) => `باقي ${arCount(left, AR.lessons)} للوصول إلى ${target}%.`,
        allDone: "أكملت كل الدروس! 🎉",

        // Profile
        pageProfile: "الملف الشخصي",
        activeAccount: "حساب نشط",
        memberSince: (date) => `عضو منذ ${date}`,
        accountInfo: "حسابك",
        editProfile: "بياناتك الشخصية",
        save: "حفظ التغييرات",
        profileSaved: "تم حفظ بياناتك.",
        changePassword: "تغيير كلمة المرور",
        currentPassword: "كلمة المرور الحالية",
        newPassword: "كلمة المرور الجديدة",
        updatePassword: "تحديث كلمة المرور",
        passwordChanged: "تم تغيير كلمة المرور.",

        // Settings
        pageSettings: "الإعدادات",
        settingsEyebrow: "التخصيص",
        settingsTitle: "إعدادات المنصة",
        languageSetting: "لغة الواجهة",
        languageText: "العربية أو الإنجليزية، ويمكنك التبديل في أي وقت.",
        themeSetting: "المظهر",
        themeText: "فاتح للنهار، وداكن للمذاكرة ليلًا.",
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
        brandTagline: "Study smart, grow steady",
        menuMain: "Learning",
        menuAccount: "Account",
        navHome: "Home",
        navExams: "Exams",
        navProgress: "My progress",
        navProfile: "Profile",
        navSettings: "Settings",
        navLogout: "Log out",
        helpTitle: "Got a question?",
        helpText: "Message us anytime",
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

        authHeadline1: "Learn calmly,",
        authHeadline2: "grow steadily",
        authText: "Short, clear lessons, exams graded instantly, and a report that shows where you are and what to review next.",
        feature1: "Short lessons organised by unit",
        feature2: "Instant grading with answer review",
        feature3: "A progress report for every subject",
        authFooter: "Itqan · A learning platform for secondary school",
        email: "Email",
        emailPlaceholder: "name@example.com",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        showPassword: "Show password",
        loginTitle: "Welcome back",
        loginSubtitle: "Log in to pick up where you left off.",
        login: "Log in",
        noAccount: "Don't have an account?",
        createAccount: "Create one",
        fillLogin: "Please enter your email and password.",
        registerTitle: "New account",
        registerSubtitle: "It takes a minute, then your first lesson.",
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
        dashGreeting: (part, name) => `Good ${part}${name ? `, ${name}` : ""}`,
        dashSummary: (p) => {
            const lessons = `${p.completedLessons} of ${p.totalLessons} lessons`;
            const exams = `${p.examsTaken} exam${p.examsTaken === 1 ? "" : "s"}`;
            if (p.completedLessons === 0 && p.examsTaken === 0) return "This is where your journey starts. Pick a subject below and begin with the first lesson; it takes about fifteen minutes.";
            if (p.completedLessons === 0) return `You've tried ${exams} with an average of ${p.averageScore}%. The lessons will help you lock that in.`;
            if (p.examsTaken === 0) return `You've finished ${lessons}. Time for a short exam to see where you stand.`;
            return `You've finished ${lessons} and average ${p.averageScore}% on exams. Keep the same pace.`;
        },
        nextUp: "Your next lesson",
        startHere: "Your first lesson",
        resumeLesson: "Continue lesson",
        startLesson: "Start now",
        allDoneEyebrow: "Well done",
        seeReport: "View report",
        subjectsEyebrow: "Curriculum",
        subjectsTitle: "Pick a subject",
        openSubject: "Continue subject",
        beginSubject: "Start subject",
        examPickNew: "Exam of the day",
        examPickRetry: "Give it another go",
        examPickNewText: "You haven't tried it yet. It's a quick way to check your level in this subject.",
        examPickRetryText: (p) => `Your best so far is ${p}%. Another try could lift it.`,
        allExams: "All exams",
        noExamsYet: "No exams are available right now.",
        tipEyebrow: "Tip of the day",
        tips: [
            "Study in 25-minute sessions, then take a five-minute break.",
            "Explain the lesson out loud as if teaching a friend; you'll spot what you haven't understood yet.",
            "Spend two minutes on yesterday's lesson before starting a new one.",
            "Taking an exam right after a lesson fixes it in memory better than re-reading.",
            "Write a three-line summary at the end of every lesson.",
            "Mistakes in an exam aren't failure, they're a list of what to review.",
            "Good sleep is part of studying: memory locks in what you learned while you sleep."
        ],
        lessonsDone: (done, total) => `${done} of ${total} lessons`,
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
        examsEyebrow: "Check your level",
        examsSubtitle: "Every attempt is saved here",
        statTotalExams: "Total exams",
        statAvailable: "Available now",
        statAttempts: "Attempts",
        availableExams: "Subject exams",
        questionsCount: (n) => `${n} question${n === 1 ? "" : "s"}`,
        startExam: "Start exam",
        retakeExam: "Try again",
        bestScore: (p) => `Best score ${p}%`,
        comingSoon: "Coming soon",
        historyTitle: "Results history",
        noAttempts: "No results yet. Start with any exam from the list.",
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
        progressEyebrow: "Overview",
        progressTitle: "Where you are",
        overall: "of the curriculum",
        progressMessage: (p) => p >= 75 ? "You're near the end of the curriculum, just a few steps left." : p >= 40 ? "You've covered a good stretch. Keep the rhythm." : p > 0 ? "A good start. Every lesson you finish shows up here." : "You haven't started yet. Your first lesson will move this needle.",
        statStreak: "Day streak",
        reportEyebrow: "By subject",
        reportTitle: "Subject report",
        reportSubject: "Subject",
        reportLessons: "Lessons",
        reportCompletion: "Completion",
        reportBestExam: "Best exam",
        reportNoExam: "Not taken",
        activityEyebrow: "Latest",
        recentActivity: "Activity log",
        noActivity: "Every lesson you finish and exam you take will appear here.",
        activityLesson: "Completed a lesson",
        activityExam: "Took an exam",
        nextGoal: "Next milestone",
        nextGoalText: (target, left) => `Complete ${left} more lesson${left === 1 ? "" : "s"} to reach ${target}%.`,
        allDone: "You've completed every lesson! 🎉",

        pageProfile: "Profile",
        activeAccount: "Active account",
        memberSince: (date) => `Member since ${date}`,
        accountInfo: "Your account",
        editProfile: "Personal details",
        save: "Save changes",
        profileSaved: "Your details were saved.",
        changePassword: "Change password",
        currentPassword: "Current password",
        newPassword: "New password",
        updatePassword: "Update password",
        passwordChanged: "Your password was changed.",

        pageSettings: "Settings",
        settingsEyebrow: "Customise",
        settingsTitle: "Platform settings",
        languageSetting: "Interface language",
        languageText: "Arabic or English. You can switch anytime.",
        themeSetting: "Appearance",
        themeText: "Light for the day, dark for late-night study.",
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
