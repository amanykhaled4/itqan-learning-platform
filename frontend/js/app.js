// Shared by every page: page protection, sidebar, top bar,
// notifications, theme, language and alert dialogs.

const App = (() => {
    const SETTINGS_KEY = "itqan.settings";
    let student = null;

    const NAV = [
        { section: "menuMain" },
        { page: "dashboard", href: "dashboard.html", icon: "fa-house", key: "navHome" },
        { page: "exams", href: "exams.html", icon: "fa-clipboard-check", key: "navExams" },
        { page: "progress", href: "progress.html", icon: "fa-chart-line", key: "navProgress" },
        { section: "menuAccount" },
        { page: "profile", href: "profile.html", icon: "fa-user", key: "navProfile" },
        { page: "settings", href: "settings.html", icon: "fa-gear", key: "navSettings" }
    ];

    // ---------- Helpers ----------

    function escape(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function initial(name) {
        return (name || "?").trim().charAt(0).toUpperCase();
    }

    // ---------- Theme & language ----------

    function cachedSettings() {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
        } catch {
            return {};
        }
    }

    // Returns true when the language changed (the page text must be redrawn)
    function applySettings(settings) {
        const old = cachedSettings();
        const language = settings.language === "en" ? "en" : "ar";
        const theme = settings.theme === "dark" ? "dark" : "light";

        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...old, ...settings, language, theme }));
        document.documentElement.lang = language;
        document.documentElement.dir = language === "en" ? "ltr" : "rtl";
        document.documentElement.dataset.theme = theme;

        return old.language !== undefined && old.language !== language;
    }

    // ---------- Alerts (SweetAlert2) ----------

    const alertBase = () => ({
        customClass: { popup: "itqan-alert" },
        confirmButtonColor: document.documentElement.dataset.theme === "dark" ? "#c38a3a" : "#18212f",
        cancelButtonColor: "#9aa2ad",
        confirmButtonText: I18n.t("ok"),
        cancelButtonText: I18n.t("cancel"),
        reverseButtons: I18n.lang === "ar"
    });

    function success(title, text) {
        return Swal.fire({ ...alertBase(), icon: "success", title, text });
    }

    function error(err) {
        return Swal.fire({ ...alertBase(), icon: "error", title: I18n.t("errorTitle"), text: typeof err === "string" ? err : I18n.error(err) });
    }

    async function confirm(title, text, confirmText) {
        const result = await Swal.fire({ ...alertBase(), icon: "question", title, text, showCancelButton: true, confirmButtonText: confirmText });
        return result.isConfirmed;
    }

    function toast(title) {
        return Swal.fire({
            ...alertBase(),
            toast: true,
            position: I18n.lang === "ar" ? "bottom-start" : "bottom-end",
            icon: "success",
            title,
            showConfirmButton: false,
            timer: 2200,
            timerProgressBar: true
        });
    }

    // ---------- Sidebar ----------

    function renderSidebar(activePage) {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;

        const items = NAV.map((item) => item.section
            ? `<div class="menu-title">${I18n.t(item.section)}</div>`
            : `<a href="${item.href}" class="menu-item ${item.page === activePage ? "active" : ""}" ${item.page === activePage ? 'aria-current="page"' : ""}>
                   <i class="fa-solid ${item.icon}"></i>${I18n.t(item.key)}
               </a>`).join("");

        sidebar.innerHTML = `
            <a href="dashboard.html" class="brand">
                <span class="brand-icon">${I18n.lang === "en" ? "I" : "إ"}</span>
                <span><strong>${I18n.t("brandName")}</strong><small>${I18n.t("brandTagline")}</small></span>
            </a>
            <nav>
                ${items}
                <button type="button" class="menu-item logout" id="logoutBtn">
                    <i class="fa-solid fa-right-from-bracket"></i>${I18n.t("navLogout")}
                </button>
            </nav>
            <div class="sidebar-footer">
                <div class="help-box">
                    <span class="help-icon"><i class="fa-solid fa-circle-question"></i></span>
                    <span><strong>${I18n.t("helpTitle")}</strong><span>${I18n.t("helpText")}</span></span>
                </div>
            </div>`;

        document.getElementById("logoutBtn").addEventListener("click", logout);
    }

    // ---------- Top bar ----------

    function renderTopbar(titleKey) {
        const topbar = document.getElementById("topbar");
        if (!topbar) return;

        const name = student?.fullName || "";

        topbar.innerHTML = `
            <div class="topbar-title">
                <button type="button" class="icon-btn menu-toggle" id="menuToggle" aria-label="${I18n.t("openMenu")}">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div>
                    <small>${I18n.t("welcomeBack")}${name ? " · " + escape(name) : ""}</small>
                    <h1 id="pageTitle">${I18n.t(titleKey)}</h1>
                </div>
            </div>
            <div class="topbar-actions">
                <div class="notifications-wrap" id="notificationsWrap">
                    <button type="button" class="icon-btn" id="bellBtn" aria-label="${I18n.t("notifications")}" title="${I18n.t("notifications")}">
                        <i class="fa-solid fa-bell"></i>
                        <span class="badge-count hidden" id="bellCount"></span>
                    </button>
                    <div class="notifications" id="notificationsPanel" role="dialog" aria-label="${I18n.t("notifications")}">
                        <div class="notifications-head">
                            <strong>${I18n.t("notifications")}</strong>
                            <button type="button" class="btn btn-sm btn-outline" id="markRead">${I18n.t("markAllRead")}</button>
                        </div>
                        <div class="list" id="notificationsList">
                            <div class="skeleton row"></div>
                        </div>
                    </div>
                </div>
                <a href="profile.html" class="avatar" title="${I18n.t("navProfile")}">${escape(initial(name))}</a>
            </div>`;

        document.getElementById("menuToggle").addEventListener("click", () => document.body.classList.toggle("sidebar-open"));

        const panel = document.getElementById("notificationsPanel");
        document.getElementById("bellBtn").addEventListener("click", (event) => {
            event.stopPropagation();
            panel.classList.toggle("show");
        });
        document.getElementById("markRead").addEventListener("click", markNotificationsRead);
        panel.addEventListener("click", (event) => event.stopPropagation());

        if (student && !student.settings.notificationsEnabled) {
            document.getElementById("notificationsWrap").classList.add("hidden");
        }
    }

    // Close the drawer / panel when clicking outside
    document.addEventListener("click", (event) => {
        document.getElementById("notificationsPanel")?.classList.remove("show");
        if (event.target.classList.contains("sidebar-backdrop")) document.body.classList.remove("sidebar-open");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document.getElementById("notificationsPanel")?.classList.remove("show");
        document.body.classList.remove("sidebar-open");
    });

    // ---------- Notifications (built from the student's real data) ----------

    let notificationItems = [];

    function readKey() {
        return `itqan.read.${student?.id}`;
    }

    function readIds() {
        try {
            return JSON.parse(localStorage.getItem(readKey())) || [];
        } catch {
            return [];
        }
    }

    async function loadNotifications() {
        if (!student?.settings.notificationsEnabled) return;

        try {
            const [progress, exams] = await Promise.all([Api.get("/progress"), Api.get("/exams")]);
            const items = [];

            const notTaken = exams.filter((exam) => exam.isAvailable && exam.attemptsCount === 0).length;
            if (notTaken > 0) {
                items.push({ id: `exams-${notTaken}`, icon: "fa-clipboard-check", color: "gold", title: I18n.t("notifExamTitle"), text: I18n.t("notifExamText", notTaken), href: "exams.html" });
            }

            if (progress.streakDays >= 2) {
                items.push({ id: `streak-${progress.streakDays}`, icon: "fa-fire", color: "red", title: I18n.t("notifStreakTitle"), text: I18n.t("notifStreakText", progress.streakDays), href: "progress.html" });
            }

            const nextSubject = progress.subjects.find((s) => s.completedLessons > 0 && s.completedLessons < s.totalLessons);
            if (nextSubject) {
                items.push({ id: `continue-${nextSubject.slug}-${nextSubject.completedLessons}`, icon: "fa-book-open", color: "blue", title: I18n.t("notifLessonTitle"), text: nextSubject.name, href: `course.html?subject=${nextSubject.slug}` });
            }

            if (progress.completedLessons === 0) {
                items.push({ id: "welcome", icon: "fa-star", color: "green", title: I18n.t("notifWelcomeTitle"), text: I18n.t("notifWelcomeText"), href: "dashboard.html" });
            }

            notificationItems = items;
            renderNotifications();
        } catch {
            // Notifications are optional; the page keeps working without them
        }
    }

    function renderNotifications() {
        const list = document.getElementById("notificationsList");
        const count = document.getElementById("bellCount");
        if (!list) return;

        const read = readIds();
        const unread = notificationItems.filter((item) => !read.includes(item.id)).length;

        count.textContent = unread;
        count.classList.toggle("hidden", unread === 0);

        list.innerHTML = notificationItems.length === 0
            ? `<div class="empty-state"><i class="fa-regular fa-bell"></i>${I18n.t("noNotifications")}</div>`
            : notificationItems.map((item) => `
                <a href="${item.href}" class="notification ${read.includes(item.id) ? "" : "unread"}">
                    <span class="tile tile-sm ${item.color}"><i class="fa-solid ${item.icon}"></i></span>
                    <span><strong>${escape(item.title)}</strong><p>${escape(item.text)}</p></span>
                </a>`).join("");
    }

    function markNotificationsRead() {
        localStorage.setItem(readKey(), JSON.stringify(notificationItems.map((item) => item.id)));
        renderNotifications();
    }

    // ---------- Logout ----------

    async function logout() {
        if (!(await confirm(I18n.t("logoutTitle"), I18n.t("logoutText"), I18n.t("logoutConfirm")))) return;
        Api.clearToken();
        location.href = "index.html";
    }

    // ---------- Start ----------

    // Every protected page calls: const student = await App.init({ page: "exams", title: "pageExams" });
    async function init({ page, title }) {
        if (!Api.isLoggedIn()) {
            location.replace("index.html");
            return new Promise(() => {});
        }

        // Draw the frame right away with the cached language, then refresh it with the server data
        if (!document.querySelector(".sidebar-backdrop")) {
            document.body.insertAdjacentHTML("beforeend", '<div class="sidebar-backdrop"></div>');
        }
        renderSidebar(page);
        renderTopbar(title);
        I18n.apply();

        try {
            student = await Api.get("/me");
        } catch (err) {
            error(err);
            throw err;
        }

        applySettings(student.settings);
        renderSidebar(page);
        renderTopbar(title);
        I18n.apply();
        document.title = `${I18n.t(title)} | ${I18n.t("brandName")}`;

        loadNotifications();
        return student;
    }

    return {
        init,
        escape,
        initial,
        applySettings,
        success,
        error,
        confirm,
        toast,
        refreshNotifications: loadNotifications,
        get student() {
            return student;
        },
        set student(value) {
            student = value;
        }
    };
})();
