using ItqanApi.Data;
using ItqanApi.Dtos;
using ItqanApi.Models;
using ItqanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ItqanApi.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class SubjectsController(AppDbContext db, ProgressService progress) : ControllerBase
{
    [HttpGet("subjects")]
    public async Task<List<SubjectSummaryDto>> GetAll() =>
        await progress.SubjectSummaries(User.GetStudentId());

    [HttpGet("subjects/{slug}")]
    public async Task<ActionResult<SubjectDetailDto>> GetOne(string slug)
    {
        var subject = await db.Subjects
            .Include(s => s.Units).ThenInclude(u => u.Lessons)
            .FirstOrDefaultAsync(s => s.Slug == slug);

        if (subject == null)
            return NotFound(new ApiError("SUBJECT_NOT_FOUND", "Subject not found."));

        var completed = await progress.CompletedLessonIds(User.GetStudentId());
        var lessons = subject.Units.SelectMany(u => u.Lessons).ToList();

        var units = subject.Units
            .OrderBy(u => u.Order)
            .Select(u => new UnitDto(u.Id, u.Order, u.Title, u.Description,
                u.Lessons
                    .OrderBy(l => l.Order)
                    .Select(l => new LessonDto(l.Id, l.Order, l.Title, l.DurationMinutes, completed.Contains(l.Id)))
                    .ToList()))
            .ToList();

        return new SubjectDetailDto(subject.Slug, subject.Name, subject.Description, subject.Icon,
            Mappings.PercentOf(lessons.Count(l => completed.Contains(l.Id)), lessons.Count), units);
    }

    [HttpGet("lessons/{id:int}")]
    public async Task<ActionResult<LessonDetailDto>> GetLesson(int id)
    {
        var lesson = await db.Lessons
            .Include(l => l.Unit).ThenInclude(u => u!.Subject)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (lesson == null)
            return NotFound(new ApiError("LESSON_NOT_FOUND", "Lesson not found."));

        // Lessons of the whole subject in reading order, to find the previous and next lesson
        var ordered = await db.Lessons
            .Where(l => l.Unit!.SubjectId == lesson.Unit!.SubjectId)
            .OrderBy(l => l.Unit!.Order).ThenBy(l => l.Order)
            .Select(l => l.Id)
            .ToListAsync();

        var index = ordered.IndexOf(lesson.Id);
        var completed = await db.LessonCompletions
            .AnyAsync(c => c.StudentId == User.GetStudentId() && c.LessonId == id);

        return new LessonDetailDto(
            lesson.Id, lesson.Title, lesson.Content, lesson.DurationMinutes, completed,
            lesson.Unit!.Subject!.Slug, lesson.Unit.Subject.Name, lesson.Unit.Title,
            index > 0 ? ordered[index - 1] : null,
            index < ordered.Count - 1 ? ordered[index + 1] : null);
    }

    [HttpPost("lessons/{id:int}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        if (!await db.Lessons.AnyAsync(l => l.Id == id))
            return NotFound(new ApiError("LESSON_NOT_FOUND", "Lesson not found."));

        var studentId = User.GetStudentId();
        if (!await db.LessonCompletions.AnyAsync(c => c.StudentId == studentId && c.LessonId == id))
        {
            db.LessonCompletions.Add(new LessonCompletion { StudentId = studentId, LessonId = id });
            await db.SaveChangesAsync();
        }

        return NoContent();
    }

    [HttpDelete("lessons/{id:int}/complete")]
    public async Task<IActionResult> Uncomplete(int id)
    {
        var studentId = User.GetStudentId();
        await db.LessonCompletions
            .Where(c => c.StudentId == studentId && c.LessonId == id)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}
