using ItqanApi.Data;
using ItqanApi.Dtos;
using ItqanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ItqanApi.Controllers;

[ApiController]
[Authorize]
[Route("api/progress")]
public class ProgressController(AppDbContext db, ProgressService progress) : ControllerBase
{
    [HttpGet]
    public async Task<ProgressDto> Get()
    {
        var studentId = User.GetStudentId();
        var subjects = await progress.SubjectSummaries(studentId);

        var lessons = await db.LessonCompletions
            .Where(c => c.StudentId == studentId)
            .Select(c => new { c.CompletedAt, c.Lesson!.Title, Subject = c.Lesson.Unit!.Subject!.Name })
            .ToListAsync();

        var attempts = await db.ExamAttempts
            .Where(a => a.StudentId == studentId)
            .Select(a => new { a.SubmittedAt, a.Exam!.Title, a.Percent })
            .ToListAsync();

        var completedLessons = subjects.Sum(s => s.CompletedLessons);
        var totalLessons = subjects.Sum(s => s.TotalLessons);

        var recent = lessons
            .Select(l => new ActivityDto("lesson", l.Title, l.Subject, l.CompletedAt))
            .Concat(attempts.Select(a => new ActivityDto("exam", a.Title, $"{a.Percent}%", a.SubmittedAt)))
            .OrderByDescending(a => a.Date)
            .Take(6)
            .ToList();

        return new ProgressDto(
            OverallPercent: Mappings.PercentOf(completedLessons, totalLessons),
            CompletedLessons: completedLessons,
            TotalLessons: totalLessons,
            ExamsTaken: attempts.Count,
            AverageScore: attempts.Count == 0 ? 0 : (int)Math.Round(attempts.Average(a => a.Percent)),
            StreakDays: ProgressService.Streak(lessons.Select(l => l.CompletedAt).Concat(attempts.Select(a => a.SubmittedAt))),
            Subjects: subjects,
            RecentActivity: recent);
    }
}
