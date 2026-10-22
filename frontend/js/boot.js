// Loaded in <head>: applies the saved theme and language before the page is drawn,
// so a dark-mode user never sees a white flash.
(function () {
    let settings = {};
    try {
        settings = JSON.parse(localStorage.getItem("itqan.settings")) || {};
    } catch {
        settings = {};
    }

    const language = settings.language === "en" ? "en" : "ar";
    document.documentElement.lang = language;
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.theme = settings.theme === "dark" ? "dark" : "light";
})();
