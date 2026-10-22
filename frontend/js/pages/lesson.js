let lesson;

(async () => {
    await App.init({ page: "dashboard", title: "pageLesson" });

    const id = Number(new URLSearchParams(location.search).get("id"));

    try {
        lesson = await Api.get(`/lessons/${id}`);
        renderLesson();
    } catch (err) {
        await App.error(err);
        location.href = "dashboard.html";
    }
})();

function renderLesson() {
    document.getElementById("pageTitle").textContent = lesson.title;
    document.title = `${lesson.title} | ${I18n.t("brandName")}`;

    const crumb = document.getElementById("crumbSubject");
    crumb.textContent = lesson.subjectName;
    crumb.href = `course.html?subject=${lesson.subjectSlug}`;
    document.getElementById("crumbUnit").textContent = lesson.unitTitle;

    document.getElementById("lesson").innerHTML = `
        <div class="page-header">
            <span class="tile ${lesson.subjectSlug}"><i class="fa-solid fa-book-open"></i></span>
            <div>
                <span class="eyebrow">${App.escape(lesson.unitTitle)}</span>
                <h2>${App.escape(lesson.title)}</h2>
                <p><i class="fa-regular fa-clock"></i> ${I18n.t("minutes", lesson.durationMinutes)}</p>
            </div>
            <div class="header-end">
                <button type="button" class="btn ${lesson.completed ? "btn-outline" : "btn-gold"}" id="completeBtn">
                    <i class="fa-solid ${lesson.completed ? "fa-rotate-left" : "fa-check"}"></i>
                    ${I18n.t(lesson.completed ? "markIncomplete" : "markComplete")}
                </button>
            </div>
        </div>

        <div class="lesson-content">
            <p>${App.escape(lesson.content)}</p>
        </div>

        <div class="lesson-footer">
            ${lesson.previousLessonId
                ? `<a href="lesson.html?id=${lesson.previousLessonId}" class="btn btn-outline"><i class="fa-solid fa-arrow-right flip-ltr"></i>${I18n.t("previousLesson")}</a>`
                : `<a href="course.html?subject=${lesson.subjectSlug}" class="btn btn-outline"><i class="fa-solid fa-arrow-right flip-ltr"></i>${I18n.t("backToSubject")}</a>`}
            ${lesson.nextLessonId
                ? `<a href="lesson.html?id=${lesson.nextLessonId}" class="btn btn-primary">${I18n.t("nextLesson")}<i class="fa-solid fa-arrow-left flip-ltr"></i></a>`
                : `<a href="course.html?subject=${lesson.subjectSlug}" class="btn btn-primary">${I18n.t("backToSubject")}<i class="fa-solid fa-arrow-left flip-ltr"></i></a>`}
        </div>`;

    document.getElementById("completeBtn").addEventListener("click", toggleComplete);
}

async function toggleComplete() {
    const button = document.getElementById("completeBtn");
    button.disabled = true;

    try {
        if (lesson.completed) {
            await Api.delete(`/lessons/${lesson.id}/complete`);
        } else {
            await Api.post(`/lessons/${lesson.id}/complete`);
            App.toast(I18n.t("lessonDone"));
        }

        lesson.completed = !lesson.completed;
        renderLesson();
        App.refreshNotifications();
    } catch (err) {
        App.error(err);
        button.disabled = false;
    }
}
