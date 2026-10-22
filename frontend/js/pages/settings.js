const DEFAULTS = { language: "ar", theme: "light", notificationsEnabled: true, studyReminder: true };
let current;

(async () => {
    const student = await App.init({ page: "settings", title: "pageSettings" });
    current = { ...student.settings };
    render();
})();

function render() {
    document.querySelectorAll("#languageChoice button").forEach((b) => b.classList.toggle("active", b.dataset.value === current.language));
    document.querySelectorAll("#themeChoice button").forEach((b) => b.classList.toggle("active", b.dataset.value === current.theme));
    document.getElementById("notifications").checked = current.notificationsEnabled;
    document.getElementById("reminder").checked = current.studyReminder;
}

// The theme is previewed instantly; the language switches when "Save" reloads the page
function preview() {
    document.documentElement.dataset.theme = current.theme;
}

document.getElementById("languageChoice").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    current.language = button.dataset.value;
    render();
});

document.getElementById("themeChoice").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    current.theme = button.dataset.value;
    render();
    preview();
});

document.getElementById("notifications").addEventListener("change", (e) => { current.notificationsEnabled = e.target.checked; });
document.getElementById("reminder").addEventListener("change", (e) => { current.studyReminder = e.target.checked; });

async function save(settings) {
    try {
        App.student = await Api.put("/me/settings", settings);
        App.applySettings(App.student.settings);
        await App.success(I18n.t("settingsSaved"));   // shown in the newly chosen language
        location.reload();   // redraw the sidebar and header in the new language
    } catch (err) {
        App.error(err);
    }
}

document.getElementById("saveBtn").addEventListener("click", () => save(current));

document.getElementById("resetBtn").addEventListener("click", async () => {
    if (!(await App.confirm(I18n.t("resetConfirmTitle"), I18n.t("resetConfirmText"), I18n.t("resetConfirm")))) return;
    current = { ...DEFAULTS };
    render();
    preview();
    save(current);
});

// Leaving without saving: the next page uses the saved theme again (boot.js reads the cache)
