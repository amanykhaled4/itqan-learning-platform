(async () => {
    await App.init({ page: "progress", title: "pageProgress" });

    try {
        const progress = await Api.get("/progress");
        renderOverview(progress);
        renderGoal(progress);
        renderStats(progress);
        renderSubjects(progress.subjects);
        renderActivity(progress.recentActivity);
    } catch (err) {
        App.error(err);
    }
})();

function renderOverview(progress) {
    document.getElementById("overview").innerHTML = `
        <div class="ring" id="overallRing">
            <div><b>${progress.overallPercent}%</b><small>${I18n.t("overall")}</small></div>
        </div>
        <div>
            <span class="eyebrow">${I18n.t("progressEyebrow")}</span>
            <h2 class="section-title">${I18n.t("progressTitle")}</h2>
            <p class="muted">${I18n.t("progressMessage", progress.overallPercent)}</p>
        </div>`;

    requestAnimationFrame(() => document.getElementById("overallRing").style.setProperty("--p", progress.overallPercent));
}

// Next goal: the next multiple of 10% (or "all done")
function renderGoal(progress) {
    const box = document.getElementById("goal");

    if (progress.completedLessons >= progress.totalLessons) {
        box.innerHTML = `<div class="empty-state"><i class="fa-solid fa-trophy"></i>${I18n.t("allDone")}</div>`;
        return;
    }

    const target = Math.min(100, (Math.floor(progress.overallPercent / 10) + 1) * 10);
    const lessonsNeeded = Math.ceil((target / 100) * progress.totalLessons) - progress.completedLessons;

    box.innerHTML = `
        <div class="card-head">
            <div>
                <span class="eyebrow">${I18n.t("nextGoal")}</span>
                <h2>${target}%</h2>
            </div>
            <span class="tile gold"><i class="fa-solid fa-bullseye"></i></span>
        </div>
        <p class="muted">${I18n.t("nextGoalText", target, Math.max(1, lessonsNeeded))}</p>
        <div class="progress mt-4"><span data-width="${(progress.overallPercent / target) * 100}"></span></div>`;

    animateBars();
}

function renderStats(progress) {
    const stat = (icon, color, value, key) => `
        <div class="stat">
            <span class="tile ${color}"><i class="fa-solid ${icon}"></i></span>
            <div><b>${value}</b><span>${I18n.t(key)}</span></div>
        </div>`;

    document.getElementById("stats").innerHTML =
        stat("fa-book-open", "blue", `${progress.completedLessons}/${progress.totalLessons}`, "statLessons") +
        stat("fa-clipboard-check", "green", progress.examsTaken, "statExams") +
        stat("fa-star", "purple", progress.examsTaken ? `${progress.averageScore}%` : "—", "statAverage") +
        stat("fa-fire", "red", progress.streakDays, "statStreak");
}

function renderSubjects(subjects) {
    document.getElementById("subjects").innerHTML = subjects.map((subject) => `
        <a href="course.html?subject=${subject.slug}" class="row">
            <span class="tile ${subject.slug}"><i class="fa-solid ${subject.icon}"></i></span>
            <div class="row-body">
                <strong>${App.escape(subject.name)}</strong>
                <small>${I18n.t("lessonsDone", subject.completedLessons, subject.totalLessons)}</small>
                <div class="progress"><span data-width="${subject.percent}"></span></div>
            </div>
            <span class="pill gold">${subject.percent}%</span>
        </a>`).join("");

    animateBars();
}

function renderActivity(items) {
    const list = document.getElementById("activity");

    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-seedling"></i>${I18n.t("noActivity")}</div>`;
        return;
    }

    list.innerHTML = items.map((item) => `
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
