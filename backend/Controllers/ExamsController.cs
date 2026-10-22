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
[Route("api/exams")]
public class ExamsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<List<ExamSummaryDto>> GetAll()
    {
        var studentId = User.GetStudentId();

        return await db.Exams
            .OrderBy(e => e.SubjectId).ThenBy(e => e.Id)
            .Select(e => new ExamSummaryDto(
                e.Id, e.Title, e.Description,
                e.Subject!.Slug, e.Subject.Name, e.Subject.Icon,
                e.Questions.Count, e.DurationMinutes, e.IsAvailable,
                db.ExamAttempts.Where(a => a.ExamId == e.Id && a.StudentId == studentId).Max(a => (int?)a.Percent),
                db.ExamAttempts.Count(a => a.ExamId == e.Id && a.StudentId == studentId)))
            .ToListAsync();
    }

    // Questions and options, without revealing which option is correct
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExamDetailDto>> GetOne(int id)
    {
        var exam = await db.Exams
            .Include(e => e.Subject)
            .Include(e => e.Questions).ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam == null)
            return NotFound(new ApiError("EXAM_NOT_FOUND", "Exam not found."));
        if (!exam.IsAvailable)
            return BadRequest(new ApiError("EXAM_UNAVAILABLE", "This exam is not available yet."));

        return new ExamDetailDto(exam.Id, exam.Title, exam.Subject!.Name, exam.DurationMinutes,
            exam.Questions
                .OrderBy(q => q.Order)
                .Select(q => new QuestionDto(q.Id, q.Text,
                    q.Options.OrderBy(o => o.Id).Select(o => new OptionDto(o.Id, o.Text)).ToList()))
                .ToList());
    }

    // The score is calculated on the server, so it can't be faked from the browser
    [HttpPost("{id:int}/submit")]
    public async Task<ActionResult<ExamResultDto>> Submit(int id, SubmitExamRequest request)
    {
        var exam = await db.Exams
            .Include(e => e.Questions).ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam == null)
            return NotFound(new ApiError("EXAM_NOT_FOUND", "Exam not found."));
        if (!exam.IsAvailable)
            return BadRequest(new ApiError("EXAM_UNAVAILABLE", "This exam is not available yet."));

        var review = exam.Questions
            .OrderBy(q => q.Order)
            .Select(q =>
            {
                var correct = q.Options.First(o => o.IsCorrect).Id;
                int? selected = request.Answers.TryGetValue(q.Id, out var answer) ? answer : null;
                return new QuestionReviewDto(q.Id, selected, correct, selected == correct);
            })
            .ToList();

        var attempt = new ExamAttempt
        {
            StudentId = User.GetStudentId(),
            ExamId = exam.Id,
            Score = review.Count(r => r.IsCorrect),
            TotalQuestions = review.Count,
            Percent = Mappings.PercentOf(review.Count(r => r.IsCorrect), review.Count)
        };

        db.ExamAttempts.Add(attempt);
        await db.SaveChangesAsync();

        return new ExamResultDto(attempt.Id, attempt.Score, attempt.TotalQuestions, attempt.Percent, review);
    }

    [HttpGet("attempts")]
    public async Task<List<AttemptDto>> MyAttempts()
    {
        var studentId = User.GetStudentId();

        return await db.ExamAttempts
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new AttemptDto(a.Id, a.ExamId, a.Exam!.Title, a.Exam.Subject!.Name,
                a.Score, a.TotalQuestions, a.Percent, a.SubmittedAt))
            .ToListAsync();
    }
}
