(async () => {
    await App.init({ page: "exams", title: "pageExams" });

    try {
        const [exams, attempts, progress] = await Promise.all([
            Api.get("/exams"),
            Api.get("/exams/attempts"),
            Api.get("/progress")
        ]);

        renderStats(exams, attempts, progress);
        renderExams(exams);
        renderHistory(attempts);
    } catch (err) {
        App.error(err);
    }
})();

function scoreColor(percent) {
    return percent >= 80 ? "green" : percent >= 50 ? "gold" : "red";
}

function renderStats(exams, attempts, progress) {
    const stat = (icon, color, value, key) => `
        <div class="stat">
            <span class="tile ${color}"><i class="fa-solid ${icon}"></i></span>
            <div><b>${value}</b><span>${I18n.t(key)}</span></div>
        </div>`;

    document.getElementById("stats").innerHTML =
        stat("fa-layer-group", "blue", exams.length, "statTotalExams") +
        stat("fa-unlock", "green", exams.filter((e) => e.isAvailable).length, "statAvailable") +
        stat("fa-pen-to-square", "gold", attempts.length, "statAttempts") +
        stat("fa-star", "purple", `${progress.averageScore}%`, "statAverage");
}

function renderExams(exams) {
    document.getElementById("exams").innerHTML = exams.map((exam) => {
        const action = !exam.isAvailable
            ? `<span class="pill">${I18n.t("comingSoon")}</span>`
            : `<a href="exam.html?id=${exam.id}" class="btn btn-sm ${exam.attemptsCount ? "btn-outline" : "btn-primary"}">
                   ${I18n.t(exam.attemptsCount ? "retakeExam" : "startExam")}
               </a>`;

        return `
            <div class="row">
                <span class="tile ${exam.subjectSlug}"><i class="fa-solid ${exam.subjectIcon}"></i></span>
                <div class="row-body">
                    <strong>${App.escape(exam.title)}</strong>
                    <span>${App.escape(exam.subjectName)} · ${I18n.t("questionsCount", exam.questionCount)} · ${I18n.t("minutes", exam.durationMinutes)}</span>
                    ${exam.bestPercent !== null ? `<span class="pill mt-2 ${scoreColor(exam.bestPercent)}">${I18n.t("bestScore", exam.bestPercent)}</span>` : ""}
                </div>
                ${action}
            </div>`;
    }).join("");
}

function renderHistory(attempts) {
    const list = document.getElementById("history");

    if (attempts.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i>${I18n.t("noAttempts")}</div>`;
        return;
    }

    list.innerHTML = attempts.slice(0, 8).map((attempt) => `
        <div class="row">
            <span class="tile tile-sm ${scoreColor(attempt.percent)}"><i class="fa-solid fa-check"></i></span>
            <div class="row-body">
                <strong>${App.escape(attempt.examTitle)}</strong>
                <small>${I18n.date(attempt.submittedAt, { month: "short", day: "numeric" })} · ${I18n.t("gradeLabel", attempt.percent)}</small>
            </div>
            <span class="pill ${scoreColor(attempt.percent)}">${attempt.percent}%</span>
        </div>`).join("");
}
