(async () => {
    const student = await App.init({ page: "profile", title: "pageProfile" });

    renderHead(student);
    fillForm(student);

    try {
        renderStats(await Api.get("/progress"));
    } catch (err) {
        App.error(err);
    }
})();

function renderHead(student) {
    document.getElementById("profileHead").innerHTML = `
        <span class="avatar">${App.escape(App.initial(student.fullName))}</span>
        <div>
            <span class="pill green"><i class="fa-solid fa-circle-check"></i>${I18n.t("activeAccount")}</span>
            <h2>${App.escape(student.fullName)}</h2>
            <p class="muted">${App.escape(I18n.grade(student.grade))} · <span dir="ltr">${App.escape(student.email)}</span></p>
            <small class="muted">${I18n.t("memberSince", I18n.date(student.createdAt, { year: "numeric", month: "long" }))}</small>
        </div>`;
}

function fillForm(student) {
    document.getElementById("fullName").value = student.fullName;
    document.getElementById("email").value = student.email;

    const grade = document.getElementById("grade");
    grade.querySelectorAll("option").forEach((option) => { option.textContent = I18n.grade(option.value); });
    grade.value = student.grade;
}

function renderStats(progress) {
    const stat = (icon, color, value, key) => `
        <div class="stat">
            <span class="tile ${color}"><i class="fa-solid ${icon}"></i></span>
            <div><b>${value}</b><span>${I18n.t(key)}</span></div>
        </div>`;

    document.getElementById("stats").innerHTML =
        stat("fa-chart-pie", "gold", `${progress.overallPercent}%`, "statOverall") +
        stat("fa-book-open", "blue", progress.completedLessons, "statLessons") +
        stat("fa-clipboard-check", "green", progress.examsTaken, "statExams") +
        stat("fa-fire", "red", progress.streakDays, "statStreak");
}

function showError(id, message) {
    const box = document.getElementById(id);
    box.textContent = message;
    box.classList.toggle("show", Boolean(message));
}

document.getElementById("profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("profileError", "");

    const fullName = document.getElementById("fullName").value.trim();
    if (!fullName) return showError("profileError", I18n.t("nameRequired"));

    const button = event.submitter;
    button.disabled = true;
    try {
        const student = await Api.put("/me", { fullName, grade: document.getElementById("grade").value });
        App.student = student;
        renderHead(student);
        document.querySelector(".topbar .avatar").textContent = App.initial(student.fullName);
        document.querySelector(".topbar-title small").textContent = `${I18n.t("welcomeBack")} · ${student.fullName}`;
        App.toast(I18n.t("profileSaved"));
    } catch (err) {
        showError("profileError", I18n.error(err));
    } finally {
        button.disabled = false;
    }
});

document.getElementById("passwordForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("passwordError", "");

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!currentPassword) return showError("passwordError", I18n.t("fillLogin"));
    if (newPassword.length < 6) return showError("passwordError", I18n.t("passwordShort"));
    if (newPassword !== document.getElementById("confirmPassword").value) return showError("passwordError", I18n.t("passwordMismatch"));

    const button = event.submitter;
    button.disabled = true;
    try {
        await Api.put("/me/password", { currentPassword, newPassword });
        event.target.reset();
        App.toast(I18n.t("passwordChanged"));
    } catch (err) {
        showError("passwordError", I18n.error(err));
    } finally {
        button.disabled = false;
    }
});
