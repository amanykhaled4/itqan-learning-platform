(async () => {
    await App.init({ page: "dashboard", title: "pageCourse" });

    const slug = new URLSearchParams(location.search).get("subject") || "math";

    try {
        const subject = await Api.get(`/subjects/${encodeURIComponent(slug)}`);
        renderSubject(subject);
    } catch (err) {
        await App.error(err);
        location.href = "dashboard.html";
    }
})();

function renderSubject(subject) {
    const lessons = subject.units.flatMap((unit) => unit.lessons);
    const done = lessons.filter((lesson) => lesson.completed).length;

    document.getElementById("pageTitle").textContent = subject.name;
    document.getElementById("crumbSubject").textContent = subject.name;
    document.title = `${subject.name} | ${I18n.t("brandName")}`;
    document.getElementById("unitsCount").textContent = I18n.t("unitsCount", subject.units.length);

    document.getElementById("subjectHeader").innerHTML = `
        <span class="tile ${subject.slug}"><i class="fa-solid ${subject.icon}"></i></span>
        <div>
            <h2>${App.escape(subject.name)}</h2>
            <p>${App.escape(subject.description)}</p>
        </div>
        <div class="header-end">
            <div class="ring ring-sm" style="--p: ${subject.percent}">
                <div><b>${subject.percent}%</b></div>
            </div>
            <small class="muted">${I18n.t("lessonsDone", done, lessons.length)}</small>
        </div>`;

    document.getElementById("units").innerHTML = subject.units.map((unit) => `
        <div class="unit">
            <div class="unit-head">
                <span class="unit-number">${unit.order}</span>
                <div>
                    <span class="eyebrow">${I18n.t("unitLabel", unit.order)}</span>
                    <h3>${App.escape(unit.title)}</h3>
                    <small class="muted">${App.escape(unit.description)}</small>
                </div>
            </div>
            <div class="list">
                ${unit.lessons.map((lesson) => `
                    <a href="lesson.html?id=${lesson.id}" class="row ${lesson.completed ? "completed" : ""}">
                        <span class="lesson-check"><i class="fa-solid fa-check"></i></span>
                        <div class="row-body">
                            <strong>${App.escape(lesson.title)}</strong>
                            <small><i class="fa-regular fa-clock"></i> ${I18n.t("minutes", lesson.durationMinutes)}</small>
                        </div>
                        ${lesson.completed ? `<span class="pill green">${I18n.t("completed")}</span>` : ""}
                        <i class="fa-solid fa-arrow-left arrow row-end"></i>
                    </a>`).join("")}
            </div>
        </div>`).join("");
}
