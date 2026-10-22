let exam;
const answers = {};          // question id → option id
let timerId = null;
let endsAt = 0;
let submitted = false;

(async () => {
    await App.init({ page: "exams", title: "pageExam" });

    const id = Number(new URLSearchParams(location.search).get("id"));

    try {
        exam = await Api.get(`/exams/${id}`);
        renderExam();
        startTimer();
    } catch (err) {
        await App.error(err);
        location.href = "exams.html";
    }
})();

function renderExam() {
    document.getElementById("pageTitle").textContent = exam.title;
    document.getElementById("crumbExam").textContent = exam.title;
    document.title = `${exam.title} | ${I18n.t("brandName")}`;

    document.getElementById("questions").innerHTML = exam.questions.map((question, index) => `
        <section class="card question" data-question="${question.id}">
            <h3><span class="question-number">${index + 1}</span><span>${App.escape(question.text)}</span></h3>
            <div class="options">
                ${question.options.map((option) => `
                    <button type="button" class="option" data-option="${option.id}">
                        <span class="dot"></span><span>${App.escape(option.text)}</span>
                    </button>`).join("")}
            </div>
        </section>`).join("");

    document.getElementById("examBar").classList.remove("hidden");
    document.getElementById("examActions").classList.remove("hidden");
    updateAnswered();
}

// Choosing an answer
document.getElementById("questions").addEventListener("click", (event) => {
    const option = event.target.closest(".option");
    if (!option || submitted) return;

    const card = option.closest(".question");
    card.querySelectorAll(".option").forEach((button) => button.classList.toggle("selected", button === option));
    answers[card.dataset.question] = Number(option.dataset.option);
    updateAnswered();
});

function updateAnswered() {
    const answered = Object.keys(answers).length;
    const total = exam.questions.length;

    document.getElementById("answeredText").textContent = I18n.t("answered", answered, total);
    document.getElementById("answeredBar").style.width = `${(answered / total) * 100}%`;
}

// ---------- Timer ----------

function startTimer() {
    endsAt = Date.now() + exam.durationMinutes * 60 * 1000;
    tick();
    timerId = setInterval(tick, 500);
}

function tick() {
    const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
    const minutes = String(Math.floor(left / 60)).padStart(2, "0");
    const seconds = String(left % 60).padStart(2, "0");

    document.getElementById("timerText").textContent = `${minutes}:${seconds}`;
    document.getElementById("timer").classList.toggle("warning", left <= 60);

    if (left === 0) submit(true);
}

// Warn before leaving the page in the middle of an exam
window.addEventListener("beforeunload", (event) => {
    if (exam && !submitted && Object.keys(answers).length > 0) event.preventDefault();
});

// ---------- Submit ----------

document.getElementById("submitBtn").addEventListener("click", async () => {
    const unanswered = exam.questions.length - Object.keys(answers).length;
    if (await App.confirm(I18n.t("submitConfirmTitle"), I18n.t("submitConfirmText", unanswered), I18n.t("submitConfirm"))) {
        submit(false);
    }
});

async function submit(timeUp) {
    if (submitted) return;
    submitted = true;
    clearInterval(timerId);
    document.getElementById("submitBtn").disabled = true;

    try {
        const result = await Api.post(`/exams/${exam.id}/submit`, { answers });
        showResult(result);
        if (timeUp) App.error(I18n.t("timeUp"));
        App.refreshNotifications();
    } catch (err) {
        submitted = false;
        document.getElementById("submitBtn").disabled = false;
        App.error(err);
    }
}

function showResult(result) {
    const color = result.percent >= 80 ? "green" : result.percent >= 50 ? "" : "red";

    const box = document.getElementById("result");
    box.innerHTML = `
        <div class="ring ${color}" style="--p: ${result.percent}">
            <div><b>${result.percent}%</b><small>${I18n.t("gradeLabel", result.percent)}</small></div>
        </div>
        <div>
            <span class="eyebrow">${I18n.t("resultTitle")}</span>
            <h2>${I18n.t("gradeLabel", result.percent)}</h2>
            <p class="muted">${I18n.t("resultText", result.score, result.total)}</p>
            <div class="actions mt-5">
                <a href="exams.html" class="btn btn-primary">${I18n.t("backToExams")}</a>
                <a href="exam.html?id=${exam.id}" class="btn btn-outline"><i class="fa-solid fa-rotate-right"></i>${I18n.t("tryAgain")}</a>
            </div>
        </div>`;
    box.classList.remove("hidden");

    document.getElementById("examBar").classList.add("hidden");
    document.getElementById("examActions").classList.add("hidden");

    // Show the right and wrong answers on every question
    result.review.forEach((item) => {
        const card = document.querySelector(`.question[data-question="${item.questionId}"]`);
        card.querySelectorAll(".option").forEach((button) => {
            const id = Number(button.dataset.option);
            button.disabled = true;
            button.classList.remove("selected");
            if (id === item.correctOptionId) button.classList.add("correct");
            else if (id === item.selectedOptionId) button.classList.add("wrong");
        });
        if (item.selectedOptionId === null) {
            card.querySelector("h3").insertAdjacentHTML("beforeend", `<span class="pill red">${I18n.t("notAnswered")}</span>`);
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}
