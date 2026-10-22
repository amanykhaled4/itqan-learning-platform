// ======================================================
// SWEETALERT2 - تصميم منصة إتقان
// ======================================================

const itqanAlert = {

    base: {

        direction: "rtl",

        background: "#fffdf8",

        color: "#18212f",

        confirmButtonColor: "#18212f",

        cancelButtonColor: "#d8d0c2",

        buttonsStyling: true,

        customClass: {

            popup: "itqan-swal-popup",

            title: "itqan-swal-title",

            confirmButton: "itqan-swal-confirm",

            cancelButton: "itqan-swal-cancel"

        }

    },


    // ================================
    // رسالة النجاح
    // ================================

    success(title, text) {

        return Swal.fire({

            ...this.base,

            icon: "success",

            title: title,

            text: text,

            showConfirmButton: true,

            confirmButtonText: "حسنًا"

        });

    },


    // ================================
    // رسالة التحذير
    // ================================

    warning(title, text) {

        return Swal.fire({

            ...this.base,

            icon: "warning",

            title: title,

            text: text,

            confirmButtonText: "حسنًا"

        });

    },


    // ================================
    // رسالة الخطأ
    // ================================

    error(title, text) {

        return Swal.fire({

            ...this.base,

            icon: "error",

            title: title,

            text: text,

            confirmButtonText: "حسنًا"

        });

    }

};


// ======================================================
// تصميم SweetAlert
// ======================================================

const swalStyle = document.createElement("style");

swalStyle.textContent = `

.itqan-swal-popup {

    border-radius: 24px !important;

    border: 1px solid #eee9df !important;

    box-shadow:
        0 25px 70px rgba(24,33,47,0.18) !important;

    font-family: "Cairo", sans-serif !important;

}


.itqan-swal-title {

    font-family: "Cairo", sans-serif !important;

    font-size: 22px !important;

    font-weight: 800 !important;

    color: #18212f !important;

}


.itqan-swal-confirm {

    border-radius: 12px !important;

    padding: 11px 28px !important;

    font-family: "Cairo", sans-serif !important;

    font-weight: 700 !important;

}


.itqan-swal-cancel {

    border-radius: 12px !important;

    padding: 11px 24px !important;

    font-family: "Cairo", sans-serif !important;

    font-weight: 700 !important;

}


.swal2-html-container {

    font-family: "Cairo", sans-serif !important;

}

`;

document.head.appendChild(swalStyle);


// ======================================================
// تسجيل الدخول
// ======================================================

const loginButton =
    document.getElementById("loginBtn");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");


            const passwordInput =
                document.getElementById("password");


            const savedEmail =
                localStorage.getItem("studentEmail");


            const savedPassword =
                localStorage.getItem("studentPassword");


            // ================================
            // لا يوجد حساب
            // ================================

            if (!savedEmail || !savedPassword) {

                itqanAlert.warning(
                    "لا يوجد حساب",
                    "من فضلك أنشئي حسابًا أولاً."
                );

                return;
            }


            // ================================
            // البيانات ناقصة
            // ================================

            if (
                emailInput.value.trim() === "" ||
                passwordInput.value === ""
            ) {

                itqanAlert.warning(
                    "البيانات ناقصة",
                    "من فضلك أدخلي البريد الإلكتروني وكلمة المرور."
                );

                return;
            }


            // ================================
            // البيانات غير صحيحة
            // ================================

            if (
                emailInput.value.trim() !== savedEmail ||
                passwordInput.value !== savedPassword
            ) {

                itqanAlert.error(
                    "بيانات الدخول غير صحيحة",
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                );

                return;
            }


            // ================================
            // تسجيل الدخول بنجاح
            // ================================

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            itqanAlert.success(
                "تم تسجيل الدخول بنجاح ✦",
                "أهلاً بك في منصة إتقان"
            ).then(() => {

                window.location.href =
                    "dashboard.html";

            });

        }
    );

}


// ======================================================
// إظهار / إخفاء كلمة المرور - تسجيل الدخول
// ======================================================

const showPasswordButton =
    document.querySelector(".show-password");


if (showPasswordButton) {

    showPasswordButton.addEventListener(
        "click",
        function () {

            const passwordInput =
                document.getElementById("password");


            if (
                passwordInput.type === "password"
            ) {

                passwordInput.type = "text";

                this.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                this.textContent = "👁";

            }

        }
    );

}


// ======================================================
// إنشاء الحساب
// ======================================================

const registerButton =
    document.getElementById("registerBtn");


if (registerButton) {

    registerButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const grade =
                document
                    .getElementById("registerGrade")
                    .value;


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const terms =
                document.getElementById("terms");


            // ================================
            // الاسم
            // ================================

            if (name === "") {

                itqanAlert.warning(
                    "الاسم مطلوب",
                    "من فضلك أدخلي اسم الطالب."
                );

                return;
            }


            // ================================
            // البريد
            // ================================

            if (email === "") {

                itqanAlert.warning(
                    "البريد الإلكتروني مطلوب",
                    "من فضلك أدخلي البريد الإلكتروني."
                );

                return;
            }


            // ================================
            // الصف الدراسي
            // ================================

            if (grade === "") {

                itqanAlert.warning(
                    "الصف الدراسي مطلوب",
                    "من فضلك اختاري الصف الدراسي."
                );

                return;
            }


            // ================================
            // كلمة المرور
            // ================================

            if (password === "") {

                itqanAlert.warning(
                    "كلمة المرور مطلوبة",
                    "من فضلك أدخلي كلمة المرور."
                );

                return;
            }


            // ================================
            // تأكيد كلمة المرور
            // ================================

            if (confirmPassword === "") {

                itqanAlert.warning(
                    "تأكيد كلمة المرور",
                    "من فضلك أكدي كلمة المرور."
                );

                return;
            }


            // ================================
            // تطابق كلمة المرور
            // ================================

            if (password !== confirmPassword) {

                itqanAlert.error(
                    "كلمتا المرور غير متطابقتين",
                    "تأكدي من كتابة كلمة المرور نفسها في الحقلين."
                );

                return;
            }


            // ================================
            // الشروط
            // ================================

            if (
                terms &&
                !terms.checked
            ) {

                itqanAlert.warning(
                    "الموافقة مطلوبة",
                    "يجب الموافقة على شروط استخدام المنصة."
                );

                return;
            }


            // ==================================================
            // حفظ بيانات الطالب
            // ==================================================

            localStorage.setItem(
                "studentName",
                name
            );


            localStorage.setItem(
                "studentEmail",
                email
            );


            localStorage.setItem(
                "studentGrade",
                grade
            );


            localStorage.setItem(
                "studentPassword",
                password
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            // ==================================================
            // نجاح إنشاء الحساب
            // ==================================================

            itqanAlert.success(
                "تم إنشاء الحساب بنجاح ✦",
                "مرحبًا بك في منصة إتقان"
            ).then(() => {

                window.location.href =
                    "dashboard.html";

            });

        }
    );

}


// ======================================================
// اسم الطالب في Dashboard
// ======================================================

const studentWelcome =
    document.getElementById(
        "studentWelcome"
    );


if (studentWelcome) {

    const studentName =
        localStorage.getItem(
            "studentName"
        );


    if (studentName) {

        studentWelcome.textContent =
            "مرحباً يا " +
            studentName;

    }

}


// ======================================================
// اسم الطالب والصف في Dashboard
// ======================================================

const studentNameElement =
    document.getElementById(
        "studentName"
    );


const studentGradeElement =
    document.getElementById(
        "studentGrade"
    );


if (studentNameElement) {

    const savedName =
        localStorage.getItem(
            "studentName"
        );


    if (savedName) {

        studentNameElement.textContent =
            savedName;

    }

}


if (studentGradeElement) {

    const savedGrade =
        localStorage.getItem(
            "studentGrade"
        );


    if (savedGrade) {

        studentGradeElement.textContent =
            savedGrade;

    }

}


// ======================================================
// تحديد المادة داخل صفحة الكورس
// ======================================================

const courseTitle =
    document.getElementById(
        "courseTitle"
    );


const courseDescription =
    document.getElementById(
        "courseDescription"
    );


const subjectMark =
    document.getElementById(
        "subjectMark"
    );


if (courseTitle) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const subject =
        params.get("subject");


    const subjects = {

        math: {

            title: "الرياضيات",

            description:
                "ابدئي رحلتك في عالم الرياضيات وتعلمي المفاهيم خطوة بخطوة.",

            icon: "fa-calculator"

        },


        physics: {

            title: "الفيزياء",

            description:
                "اكتشفي القوانين والمفاهيم الفيزيائية من خلال الشرح والتطبيق.",

            icon: "fa-bolt"

        },


        chemistry: {

            title: "الكيمياء",

            description:
                "تعلمي المفاهيم والتفاعلات الكيميائية بطريقة بسيطة ومنظمة.",

            icon: "fa-flask"

        },


        arabic: {

            title: "اللغة العربية",

            description:
                "تعلمي النحو والبلاغة والأدب وطوري مهاراتك في اللغة العربية.",

            icon: "fa-book-open"

        }

    };


    if (subjects[subject]) {

        courseTitle.textContent =
            subjects[subject].title;


        if (courseDescription) {

            courseDescription.textContent =
                subjects[subject].description;

        }


        if (subjectMark) {

            subjectMark.innerHTML =
                `<i class="fa-solid ${subjects[subject].icon}"></i>`;

        }

    }

}


// ======================================================
// بيانات الوحدات
// ======================================================

const unitsTitle =
    document.getElementById(
        "unitsTitle"
    );


const unitsDescription =
    document.getElementById(
        "unitsDescription"
    );


if (
    unitsTitle &&
    unitsDescription
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const subject =
        params.get("subject");


    const courseData = {

        math: {

            title: "وحدات الرياضيات",

            description:
                "كل وحدة تحتوي على أربعة دروس واختبار لكل درس واختبار شامل للوحدة."

        },


        physics: {

            title: "وحدات الفيزياء",

            description:
                "تعلم القوانين والمفاهيم الفيزيائية من خلال الدروس والتطبيقات والاختبارات."

        },


        chemistry: {

            title: "وحدات الكيمياء",

            description:
                "تعلم المفاهيم والتفاعلات الكيميائية من خلال شرح مبسط وتدريبات متنوعة."

        },


        arabic: {

            title: "وحدات اللغة العربية",

            description:
                "تعلم النحو والبلاغة والأدب من خلال دروس منظمة وتدريبات واختبارات."

        }

    };


    if (courseData[subject]) {

        unitsTitle.textContent =
            courseData[subject].title;


        unitsDescription.textContent =
            courseData[subject].description;

    }

}


// ======================================================
// عناصر صفحة الإعدادات
// ======================================================

const language =
    document.getElementById(
        "language"
    );


const notifications =
    document.getElementById(
        "notifications"
    );


const reminder =
    document.getElementById(
        "reminder"
    );


const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const resetBtn =
    document.getElementById(
        "resetBtn"
    );


const message =
    document.getElementById(
        "message"
    );


const themeButtons =
    document.querySelectorAll(
        ".theme"
    );


// ======================================================
// صفحة الإعدادات
// ======================================================

if (
    language &&
    notifications &&
    reminder &&
    saveBtn &&
    resetBtn &&
    message
) {

    const savedSettings =
        JSON.parse(
            localStorage.getItem(
                "platformSettings"
            )
        );


    if (savedSettings) {

        language.value =
            savedSettings.language ||
            "ar";


        notifications.checked =
            savedSettings.notifications ??
            true;


        reminder.checked =
            savedSettings.reminder ??
            true;


        const savedTheme =
            savedSettings.theme ||
            "light";


        if (
            savedTheme === "dark"
        ) {

            document.body.classList.add(
                "dark"
            );

        } else {

            document.body.classList.remove(
                "dark"
            );

        }


        themeButtons.forEach(
            button => {

                button.classList.remove(
                    "active"
                );


                if (
                    button.dataset.theme ===
                    savedTheme
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


        changeLanguage(
            language.value
        );

    }


    // ==================================================
    // تغيير اللغة
    // ==================================================

    language.addEventListener(
        "change",
        function () {

            changeLanguage(
                this.value
            );

        }
    );


    function changeLanguage(lang) {

        const elements =
            document.querySelectorAll(
                "[data-ar]"
            );


        elements.forEach(
            element => {

                if (
                    lang === "ar"
                ) {

                    element.textContent =
                        element.dataset.ar;

                } else {

                    element.textContent =
                        element.dataset.en;

                }

            }
        );


        if (
            lang === "en"
        ) {

            document.documentElement.dir =
                "ltr";

            document.documentElement.lang =
                "en";

        } else {

            document.documentElement.dir =
                "rtl";

            document.documentElement.lang =
                "ar";

        }


        const logoLetter =
            document.getElementById(
                "logoLetter"
            );


        if (logoLetter) {

            logoLetter.textContent =
                lang === "en"
                    ? "I"
                    : "إ";

        }

    }


    // ==================================================
    // تغيير المظهر
    // ==================================================

    themeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const selectedTheme =
                        this.dataset.theme;


                    themeButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    if (
                        selectedTheme === "dark"
                    ) {

                        document.body.classList.add(
                            "dark"
                        );

                    } else {

                        document.body.classList.remove(
                            "dark"
                        );

                    }

                }
            );

        }
    );


    // ==================================================
    // حفظ الإعدادات
    // ==================================================

    saveBtn.addEventListener(
        "click",
        function () {

            let selectedTheme =
                "light";


            themeButtons.forEach(
                button => {

                    if (
                        button.classList.contains(
                            "active"
                        )
                    ) {

                        selectedTheme =
                            button.dataset.theme;

                    }

                }
            );


            const settings = {

                language:
                    language.value,

                notifications:
                    notifications.checked,

                reminder:
                    reminder.checked,

                theme:
                    selectedTheme

            };


            localStorage.setItem(
                "platformSettings",
                JSON.stringify(settings)
            );


            // رسالة نجاح

            itqanAlert.success(
                "تم حفظ الإعدادات ✦",
                "تم حفظ تغييراتك بنجاح."
            );

        }
    );


    // ==================================================
    // استعادة الإعدادات
    // ==================================================

    resetBtn.addEventListener(
        "click",
        function () {

            Swal.fire({

                ...itqanAlert.base,

                icon: "question",

                title:
                    "استعادة الإعدادات؟",

                text:
                    "سيتم إرجاع جميع الإعدادات للوضع الافتراضي.",

                showCancelButton: true,

                confirmButtonText:
                    "نعم، استعادة",

                cancelButtonText:
                    "إلغاء",

                reverseButtons: true

            }).then(
                result => {

                    if (
                        !result.isConfirmed
                    ) {

                        return;

                    }


                    language.value =
                        "ar";


                    notifications.checked =
                        true;


                    reminder.checked =
                        true;


                    document.body.classList.remove(
                        "dark"
                    );


                    themeButtons.forEach(
                        button => {

                            button.classList.remove(
                                "active"
                            );


                            if (
                                button.dataset.theme ===
                                "light"
                            ) {

                                button.classList.add(
                                    "active"
                                );

                            }

                        }
                    );


                    changeLanguage(
                        "ar"
                    );


                    localStorage.removeItem(
                        "platformSettings"
                    );


                    itqanAlert.success(
                        "تمت استعادة الإعدادات",
                        "تم إرجاع الإعدادات للوضع الافتراضي."
                    );

                }
            );

        }
    );

}


// ======================================================
// بيانات الطالب في صفحة الإعدادات
// ======================================================

const settingsStudentName =
    document.getElementById(
        "settingsStudentName"
    );


const settingsStudentEmail =
    document.getElementById(
        "settingsStudentEmail"
    );


const settingsStudentGrade =
    document.getElementById(
        "settingsStudentGrade"
    );


const settingsAvatar =
    document.getElementById(
        "settingsAvatar"
    );


const savedStudentName =
    localStorage.getItem(
        "studentName"
    );


const savedStudentEmail =
    localStorage.getItem(
        "studentEmail"
    );


const savedStudentGrade =
    localStorage.getItem(
        "studentGrade"
    );


if (
    settingsStudentName &&
    savedStudentName
) {

    settingsStudentName.textContent =
        savedStudentName;

}


if (
    settingsStudentEmail &&
    savedStudentEmail
) {

    settingsStudentEmail.textContent =
        savedStudentEmail;

}


if (
    settingsStudentGrade &&
    savedStudentGrade
) {

    settingsStudentGrade.textContent =
        savedStudentGrade;

}


if (
    settingsAvatar &&
    savedStudentName
) {

    settingsAvatar.textContent =
        savedStudentName.charAt(0);

}


// ======================================================
// تسجيل الخروج
// ======================================================

const logoutButton =
    document.getElementById(
        "logoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            Swal.fire({

                ...itqanAlert.base,

                icon: "question",

                title:
                    "هل تريدين تسجيل الخروج؟",

                text:
                    "سيتم تسجيل خروجك من حسابك.",

                showCancelButton: true,

                confirmButtonText:
                    "نعم، تسجيل الخروج",

                cancelButtonText:
                    "إلغاء",

                reverseButtons: true

            }).then(
                result => {

                    if (
                        !result.isConfirmed
                    ) {

                        return;

                    }


                    localStorage.removeItem(
                        "isLoggedIn"
                    );


                    Swal.fire({

                        ...itqanAlert.base,

                        icon: "success",

                        title:
                            "تم تسجيل الخروج",

                        text:
                            "نتمنى رؤيتك مرة أخرى ✦",

                        showConfirmButton: true,

                        confirmButtonText:
                            "حسنًا"

                    }).then(() => {

                        window.location.href =
                            "index.html";

                    });

                }
            );

        }
    );

}


// ======================================================
// بيانات الطالب في الملف الشخصي
// ======================================================

const profileName =
    document.getElementById(
        "profileName"
    );


const profileEmail =
    document.getElementById(
        "profileEmail"
    );


const profileInfoEmail =
    document.getElementById(
        "profileInfoEmail"
    );


const profileGrade =
    document.getElementById(
        "profileGrade"
    );


const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );


const profileStudentName =
    localStorage.getItem(
        "studentName"
    );


const profileStudentEmail =
    localStorage.getItem(
        "studentEmail"
    );


const profileStudentGrade =
    localStorage.getItem(
        "studentGrade"
    );


if (
    profileName &&
    profileStudentName
) {

    profileName.textContent =
        profileStudentName;

}


if (
    profileEmail &&
    profileStudentEmail
) {

    profileEmail.textContent =
        profileStudentEmail;

}


if (
    profileInfoEmail &&
    profileStudentEmail
) {

    profileInfoEmail.textContent =
        profileStudentEmail;

}


if (
    profileGrade &&
    profileStudentGrade
) {

    profileGrade.textContent =
        profileStudentGrade;

}


if (
    profileAvatar &&
    profileStudentName
) {

    profileAvatar.textContent =
        profileStudentName.charAt(0);

}

// ================================
// مركز التنبيهات
// ================================

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const closeNotifications = document.getElementById("closeNotifications");
const clearNotifications = document.getElementById("clearNotifications");


// فتح / إغلاق الإشعارات
notificationBtn.addEventListener("click", function () {
    notificationPanel.classList.toggle("show");
});


// زر X
closeNotifications.addEventListener("click", function () {
    notificationPanel.classList.remove("show");
});


// تحديد الكل كمقروء
clearNotifications.addEventListener("click", function () {

    const unreadNotifications =
        document.querySelectorAll(".notification-item.unread");

    unreadNotifications.forEach(function (notification) {
        notification.classList.remove("unread");
    });

    // إزالة رقم الإشعارات
    const notificationCount =
        document.querySelector(".notification-count");

    notificationCount.style.display = "none";
});


// إغلاق الإشعارات عند الضغط خارج الصندوق
document.addEventListener("click", function (event) {

    if (
        !notificationPanel.contains(event.target) &&
        !notificationBtn.contains(event.target)
    ) {
        notificationPanel.classList.remove("show");
    }

});