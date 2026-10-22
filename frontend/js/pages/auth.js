// Login (index.html) and register (register.html)

if (Api.isLoggedIn()) location.replace("dashboard.html");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

function render() {
    I18n.apply();
    document.title = `${I18n.t(loginForm ? "login" : "registerTitle")} | ${I18n.t("brandName")}`;
    document.querySelector("#themeBtn i").className = `fa-solid ${document.documentElement.dataset.theme === "dark" ? "fa-sun" : "fa-moon"}`;

    document.querySelectorAll("#grade option[value]:not([value=''])").forEach((option) => {
        option.textContent = I18n.grade(option.value);
    });
}

function showError(message) {
    formError.textContent = message;
    formError.classList.add("show");
}

function setBusy(busy) {
    submitBtn.disabled = busy;
    if (!busy) return;
    formError.classList.remove("show");
}

// Before logging in, language and theme are only saved on this device
document.getElementById("langBtn").addEventListener("click", () => {
    App.applySettings({ language: I18n.lang === "ar" ? "en" : "ar", theme: document.documentElement.dataset.theme });
    render();
});

document.getElementById("themeBtn").addEventListener("click", () => {
    App.applySettings({ language: I18n.lang, theme: document.documentElement.dataset.theme === "dark" ? "light" : "dark" });
    render();
});

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.querySelector("i").className = `fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`;
    });
});

function startSession({ token, student }) {
    Api.setToken(token);
    App.applySettings(student.settings);
}

// ---------- Login ----------

// Public demo account created by the API's seed data (see README)
const DEMO = { email: "demo@itqan.app", password: "demo1234" };

async function logIn(email, password) {
    setBusy(true);
    try {
        startSession(await Api.post("/auth/login", { email, password }));
        location.href = "dashboard.html";
    } catch (err) {
        showError(I18n.error(err));
        setBusy(false);
    }
}

loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return showError(I18n.t("fillLogin"));
    logIn(email, password);
});

document.getElementById("demoBtn")?.addEventListener("click", () => {
    document.getElementById("email").value = DEMO.email;
    document.getElementById("password").value = DEMO.password;
    logIn(DEMO.email, DEMO.password);
});

document.getElementById("termsLink")?.addEventListener("click", (event) => {
    event.preventDefault();
    App.infoDialog(I18n.t("termsTitle"), I18n.t("termsItems"));
});

// ---------- Register ----------

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const grade = document.getElementById("grade").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!fullName) return showError(I18n.t("nameRequired"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(I18n.t("emailInvalid"));
    if (!grade) return showError(I18n.t("gradeRequired"));
    if (password.length < 6) return showError(I18n.t("passwordShort"));
    if (password !== confirmPassword) return showError(I18n.t("passwordMismatch"));
    if (!document.getElementById("terms").checked) return showError(I18n.t("termsRequired"));

    setBusy(true);
    try {
        // Keep the language/theme chosen before signing up
        const session = await Api.post("/auth/register", { fullName, email, grade, password });
        Api.setToken(session.token);
        const local = { language: I18n.lang, theme: document.documentElement.dataset.theme };
        const student = await Api.put("/me/settings", { ...session.student.settings, ...local });
        App.applySettings(student.settings);

        await App.success(I18n.t("welcomeNew"));
        location.href = "dashboard.html";
    } catch (err) {
        showError(I18n.error(err));
        setBusy(false);
    }
});

render();

if (new URLSearchParams(location.search).has("expired")) showError(I18n.t("sessionExpired"));
