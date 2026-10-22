(async () => {
    await App.init({ page: "dashboard", title: "pageDashboard" });

    try {
        const progress = await Api.get("/progress");
        renderStats(progress);
        renderSubjects(progress.subjects);
        await setContinueLink(progress.subjects);
    } catch (err) {
        App.error(err);
    }
})();

function statCard(icon, color, value, labelKey) {
    return `
        <div class="stat">
            <span class="tile ${color}"><i class="fa-solid ${icon}"></i></span>
            <div><b>${value}</b><span>${I18n.t(labelKey)}</span></div>
        </div>`;
}

function renderStats(progress) {
    document.getElementById("stats").innerHTML =
        statCard("fa-chart-pie", "gold", `${progress.overallPercent}%`, "statOverall") +
        statCard("fa-book-open", "blue", progress.completedLessons, "statLessons") +
        statCard("fa-clipboard-check", "green", progress.examsTaken, "statExams") +
        statCard("fa-star", "purple", `${progress.averageScore}%`, "statAverage");
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
            <i class="fa-solid fa-arrow-left arrow row-end"></i>
        </a>`).join("");

    requestAnimationFrame(() => {
        document.querySelectorAll(".progress span").forEach((bar) => { bar.style.width = `${bar.dataset.width}%`; });
    });
}

// "Continue learning" opens the first lesson that isn't finished yet
async function setContinueLink(subjects) {
    const button = document.getElementById("continueBtn");
    const subject = subjects.find((s) => s.completedLessons > 0 && s.completedLessons < s.totalLessons)
        || subjects.find((s) => s.completedLessons < s.totalLessons);

    if (!subject) {
        button.href = "progress.html";
        return;
    }

    if (subjects.every((s) => s.completedLessons === 0)) {
        button.querySelector("span").textContent = I18n.t("startLearning");
    }

    const detail = await Api.get(`/subjects/${subject.slug}`);
    const lesson = detail.units.flatMap((unit) => unit.lessons).find((l) => !l.completed);
    button.href = lesson ? `lesson.html?id=${lesson.id}` : `course.html?subject=${subject.slug}`;
}
