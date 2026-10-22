# Itqan — Online Learning Platform

A bilingual (Arabic / English) learning platform for secondary-school students: lessons organised by subject and unit, timed exams graded on the server, and a personal dashboard that tracks progress.

Built with **ASP.NET Core 10** (REST API, JWT, EF Core + SQLite) and a **vanilla HTML / CSS / JavaScript** front end — no framework, no build step.

![Dashboard](docs/screenshots/dashboard.png)

## Features

**For students**
- Register and log in (JWT, hashed passwords); protected pages redirect to login when the session expires
- 4 subjects → 12 units → 48 lessons; mark lessons complete and move to the next one
- Timed multiple-choice exams with a progress bar and auto-submit when time runs out
- Answers are graded **on the server** — the correct option is never sent to the browser before submission
- Result screen with score and a per-question review of right and wrong answers
- Dashboard built around "what's next": the next unfinished lesson, key numbers, progress per subject, recent activity and suggested exams (untried first, then the weakest scores)
- Progress page: overall percentage, next milestone, per-subject progress, average score and day streak
- Profile editing and password change
- Notifications for completed lessons and exams

**Interface**
- Arabic (RTL) and English (LTR), switched instantly and saved to the account
- Light and dark themes
- Responsive layout: sidebar on desktop, slide-in drawer on phones
- One shared design system (`css/app.css`) used by every page

## Screenshots

| Dashboard — dark mode, English | Login |
|---|---|
| ![Dashboard in English, dark mode](docs/screenshots/dashboard-dark-en.png) | ![Login](docs/screenshots/login.png) |

| Course | Exams |
|---|---|
| ![Course](docs/screenshots/course.png) | ![Exams](docs/screenshots/exams.png) |

| Progress | Mobile |
|---|---|
| ![Progress](docs/screenshots/progress.png) | <img src="docs/screenshots/mobile.png" width="260" alt="Mobile view"> |

## Tech stack

| Layer | Technology |
|---|---|
| API | ASP.NET Core 10, controllers, minimal hosting |
| Auth | JWT bearer tokens, ASP.NET Identity `PasswordHasher` |
| Data | Entity Framework Core 10, SQLite, code-first migrations, seed data |
| Docs | Swagger / OpenAPI with an *Authorize* button for testing |
| Front end | HTML5, CSS3 (custom properties, grid, container queries), vanilla JavaScript (ES2020) |
| i18n | Custom dictionary with Arabic plural rules and RTL/LTR switching |

## Run it locally

Requirements: [.NET 10 SDK](https://dotnet.microsoft.com/download).

```bash
git clone <this-repo-url>
cd <repo-folder>
dotnet run --project backend
```

Open **http://localhost:5111** — the API serves the front end too, so that one command runs the whole platform. The SQLite database is created and filled with subjects, lessons and exams on first run. Create an account from the register page.

API documentation: **http://localhost:5111/swagger**

> Prefer VS Code Live Server for the front end? Open `frontend/` on port 5500; it will call the API on port 5111 automatically (CORS is already allowed in development).

## Project structure

```
backend/
  Controllers/    Auth, Me (profile & settings), Subjects & lessons, Exams, Progress
  Data/           AppDbContext and seed content
  Dtos/           Request / response records with validation attributes
  Models/         Student, Subject, Unit, Lesson, Exam, Question, Option, attempts
  Services/       TokenService (JWT), ProgressService (stats & streaks)
  Migrations/     EF Core migrations
frontend/
  *.html          One page per screen
  css/app.css     Shared design system (tokens, components, dark mode, RTL)
  js/api.js       Fetch wrapper: token handling, errors, expired sessions
  js/i18n.js      Arabic / English dictionary
  js/app.js       Layout, sidebar, notifications, toasts, dialogs
  js/pages/       Page-specific scripts
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns a token |
| POST | `/api/auth/login` | Log in, returns a token |
| GET / PUT | `/api/me` | Read or update the profile |
| PUT | `/api/me/settings` | Language, theme, notification preferences |
| PUT | `/api/me/password` | Change password |
| GET | `/api/subjects` | Subjects with the student's progress |
| GET | `/api/subjects/{slug}` | Units and lessons of a subject |
| GET | `/api/lessons/{id}` | Lesson content with previous / next links |
| POST / DELETE | `/api/lessons/{id}/complete` | Mark or unmark a lesson as complete |
| GET | `/api/exams` | Exams with best score and attempt count |
| GET | `/api/exams/{id}` | Questions and options (without answers) |
| POST | `/api/exams/{id}/submit` | Grade answers and return the review |
| GET | `/api/exams/attempts` | Past results |
| GET | `/api/progress` | Overall stats, per-subject progress, recent activity |

All endpoints except register and login need an `Authorization: Bearer <token>` header.

## Configuration

`backend/appsettings.Development.json` contains a development-only JWT key. For any real deployment, set your own secret with an environment variable:

```bash
Jwt__Key="a-long-random-secret"
```

## Notes

- Course content (lessons and exams) is written in Arabic; the interface itself is fully translated.

---

## بالعربي

**إتقان** منصة تعليمية لطلاب المرحلة الثانوية: دروس مقسّمة إلى مواد ووحدات، واختبارات بوقت محدد تُصحَّح على السيرفر، ولوحة تحكم تتابع تقدّم الطالب. الواجهة تدعم العربية والإنجليزية والوضع الليلي وتعمل على الموبايل.

للتشغيل: ثبّت ‎.NET 10 SDK ثم نفّذ `dotnet run --project backend` وافتح http://localhost:5111.
