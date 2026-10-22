// Home: what to study now. Numbers and history live on the progress page.

(async () => {
    const student = await App.init({ page: "dashboard", title: "pageDashboard" });

    renderWelcome(student);
    renderTip();

    try {
        const [progress, exams] = await Promise.all([Api.get("/progress"), Api.get("/exams")]);
        document.getElementById("summary").textContent = I18n.t("dashSummary", progress);
        renderSubjects(progress.subjects);
        renderExamPick(exams);
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
            <a href="progress.html" class="btn btn-gold mt-4">${I18n.t("seeReport")}</a>`;
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
                <small>${I18n.t(subject.completedLessons ? "openSubject" : "beginSubject")}</small>
                <i class="fa-solid fa-arrow-left arrow"></i>
            </div>
        </a>`).join("");

    requestAnimationFrame(() => {
        document.querySelectorAll(".progress span[data-width]").forEach((bar) => { bar.style.width = `${bar.dataset.width}%`; });
    });
}

// ---------- Exam of the day: an untried one first, otherwise the weakest result ----------

function renderExamPick(exams) {
    const box = document.getElementById("examPick");
    const exam = exams
        .filter((e) => e.isAvailable)
        .sort((a, b) => (a.bestPercent ?? -1) - (b.bestPercent ?? -1))[0];

    if (!exam) {
        box.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard-check"></i>${I18n.t("noExamsYet")}</div>`;
        return;
    }

    box.innerHTML = `
        <span class="eyebrow">${I18n.t(exam.bestPercent === null ? "examPickNew" : "examPickRetry")}</span>
        <div class="next-body">
            <span class="tile ${exam.subjectSlug}"><i class="fa-solid ${exam.subjectIcon}"></i></span>
            <div>
                <strong class="next-title">${App.escape(exam.title)}</strong>
                <small>${I18n.t("questionsCount", exam.questionCount)} · ${I18n.t("minutes", exam.durationMinutes)}</small>
            </div>
        </div>
        <p class="muted">${exam.bestPercent === null ? I18n.t("examPickNewText") : I18n.t("examPickRetryText", exam.bestPercent)}</p>
        <div class="actions">
            <a href="exam.html?id=${exam.id}" class="btn btn-primary"><i class="fa-solid fa-pen"></i>${I18n.t("startExam")}</a>
            <a href="exams.html" class="link">${I18n.t("allExams")}</a>
        </div>`;
}

// ---------- Study tip: a different one each day ----------

function renderTip() {
    const tips = I18n.t("tips");
    const day = Math.floor(Date.now() / 86400000);
    document.getElementById("tip").textContent = tips[day % tips.length];
}
