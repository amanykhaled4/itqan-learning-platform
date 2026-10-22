(async () => {
    const student = await App.init({ page: "dashboard", title: "pageDashboard" });

    renderWelcome(student);

    try {
        const [progress, exams] = await Promise.all([Api.get("/progress"), Api.get("/exams")]);
        document.getElementById("summary").textContent = I18n.t("dashSummary", progress);
        renderStats(progress);
        renderSubjects(progress.subjects);
        renderExams(exams);
        renderActivity(progress.recentActivity);
        await renderNextLesson(progress.subjects);
    } catch (err) {
        App.error(err);
    }
})();

// ---------- Welcome ----------

function renderWelcome(student) {
    const hour = new Date().getHours();
    const firstName = (student?.fullName || "").trim().split(/\s+/)[0];

    document.getElementById("today").textContent = I18n.date(new Date(), { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("greeting").textContent = I18n.t("dashGreeting", hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening", firstName);
}

// "Next lesson": the first unfinished lesson, preferring a subject already started
async function renderNextLesson(subjects) {
    const box = document.getElementById("nextLesson");
    const subject = subjects.find((s) => s.completedLessons > 0 && s.completedLessons < s.totalLessons)
        || subjects.find((s) => s.completedLessons < s.totalLessons);

    if (!subject) {
        box.innerHTML = `
            <span class="eyebrow">${I18n.t("allDoneEyebrow")}</span>
            <strong class="next-title">${I18n.t("allDone")}</strong>
            <a href="progress.html" class="btn btn-gold mt-4">${I18n.t("viewDetails")}</a>`;
        return;
    }

    const detail = await Api.get(`/subjects/${subject.slug}`);
    const unit = detail.units.find((u) => u.lessons.some((l) => !l.completed));
    const lesson = unit.lessons.find((l) => !l.completed);
    const fresh = subjects.every((s) => s.completedLessons === 0);

    box.innerHTML = `
        <span class="eyebrow">${I18n.t(fresh ? "startHere" : "nextUp")}</span>
        <div class="next-body">
            <span class="tile ${subject.slug}"><i class="fa-solid ${subject.icon}"></i></span>
            <div>
                <strong class="next-title">${App.escape(lesson.title)}</strong>
                <small>${App.escape(subject.name)} · ${App.escape(unit.title)} · ${I18n.t("minutes", lesson.durationMinutes)}</small>
            </div>
        </div>
        <a href="lesson.html?id=${lesson.id}" class="btn btn-gold">
            <i class="fa-solid fa-play"></i>${I18n.t(fresh ? "startLesson" : "resumeLesson")}
        </a>`;
}

// ---------- Key numbers ----------

function kpi(icon, color, label, value, sub, bar) {
    return `
        <div class="stat kpi">
            <div class="kpi-head">
                <span>${label}</span>
                <span class="tile tile-sm ${color}"><i class="fa-solid ${icon}"></i></span>
            </div>
            <b>${value}</b>
            ${bar === undefined ? `<small>${sub}</small>` : `<div class="progress"><span data-width="${bar}"></span></div>`}
        </div>`;
}

function renderStats(progress) {
    document.getElementById("stats").innerHTML =
        kpi("fa-chart-pie", "gold", I18n.t("kpiCompletion"), `${progress.overallPercent}%`, "", progress.overallPercent) +
        kpi("fa-book-open", "blue", I18n.t("kpiLessons"), progress.completedLessons, I18n.t("kpiLessonsSub", progress.totalLessons)) +
        kpi("fa-star", "purple", I18n.t("kpiAverage"), progress.examsTaken ? `${progress.averageScore}%` : "—", I18n.t("kpiAverageSub", progress.examsTaken)) +
        kpi("fa-fire", "red", I18n.t("kpiStreak"), progress.streakDays, I18n.t("kpiStreakSub", progress.streakDays));
    animateBars();
}

// ---------- Subjects ----------

function renderSubjects(subjects) {
    document.getElementById("subjects").innerHTML = subjects.map((subject) => `
        <a href="course.html?subject=${subject.slug}" class="subject-card">
            <div class="subject-card-head">
                <span class="tile ${subject.slug}"><i class="fa-solid ${subject.icon}"></i></span>
                <span class="pill ${subject.percent > 0 ? "gold" : ""}">${subject.percent}%</span>
            </div>
            <strong>${App.escape(subject.name)}</strong>
            <small>${App.escape(subject.tagline)}</small>
            <div class="progress"><span data-width="${subject.percent}"></span></div>
            <div class="subject-card-foot">
                <small>${I18n.t("lessonsDone", subject.completedLessons, subject.totalLessons)}</small>
                <i class="fa-solid fa-arrow-left arrow"></i>
            </div>
        </a>`).join("");
    animateBars();
}

// ---------- Suggested exams: untried first, then the lowest best score ----------

function renderExams(exams) {
    const list = document.getElementById("exams");
    const suggested = exams
        .filter((exam) => exam.isAvailable)
        .sort((a, b) => (a.bestPercent ?? -1) - (b.bestPercent ?? -1))
        .slice(0, 3);

    if (suggested.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard-check"></i>${I18n.t("noExamsYet")}</div>`;
        return;
    }

    list.innerHTML = suggested.map((exam) => `
        <a href="exam.html?id=${exam.id}" class="row">
            <span class="tile tile-sm ${exam.subjectSlug}"><i class="fa-solid ${exam.subjectIcon}"></i></span>
            <div class="row-body">
                <strong>${App.escape(exam.title)}</strong>
                <small>${I18n.t("questionsCount", exam.questionCount)} · ${I18n.t("minutes", exam.durationMinutes)}</small>
            </div>
            ${exam.bestPercent === null
                ? `<span class="pill gold">${I18n.t("newExam")}</span>`
                : `<span class="pill ${exam.bestPercent >= 80 ? "green" : exam.bestPercent >= 50 ? "" : "red"}">${exam.bestPercent}%</span>`}
        </a>`).join("");
}

// ---------- Recent activity ----------

function renderActivity(items) {
    const list = document.getElementById("activity");

    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-seedling"></i>${I18n.t("noActivity")}</div>`;
        return;
    }

    list.innerHTML = items.slice(0, 5).map((item) => `
        <div class="row">
            <span class="tile tile-sm ${item.type === "exam" ? "green" : "blue"}">
                <i class="fa-solid ${item.type === "exam" ? "fa-clipboard-check" : "fa-book-open"}"></i>
            </span>
            <div class="row-body">
                <strong>${App.escape(item.title)}</strong>
                <small>${I18n.t(item.type === "exam" ? "activityExam" : "activityLesson")} · ${App.escape(item.detail)}</small>
            </div>
            <small class="muted">${I18n.date(item.date, { month: "short", day: "numeric" })}</small>
        </div>`).join("");
}

function animateBars() {
    requestAnimationFrame(() => {
        document.querySelectorAll(".progress span[data-width]").forEach((bar) => { bar.style.width = `${bar.dataset.width}%`; });
    });
}
