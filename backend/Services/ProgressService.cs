using ItqanApi.Data;
using ItqanApi.Dtos;
using Microsoft.EntityFrameworkCore;

namespace ItqanApi.Services;

// Calculations shared by the subjects and progress endpoints
public class ProgressService(AppDbContext db)
{
    public async Task<HashSet<int>> CompletedLessonIds(int studentId) =>
        (await db.LessonCompletions
            .Where(c => c.StudentId == studentId)
            .Select(c => c.LessonId)
            .ToListAsync())
        .ToHashSet();

    public async Task<List<SubjectSummaryDto>> SubjectSummaries(int studentId)
    {
        var completed = await CompletedLessonIds(studentId);

        var subjects = await db.Subjects
            .OrderBy(s => s.Id)
            .Select(s => new
            {
                s.Slug, s.Name, s.Tagline, s.Description, s.Icon,
                LessonIds = s.Units.SelectMany(u => u.Lessons).Select(l => l.Id).ToList()
            })
            .ToListAsync();

        return subjects.Select(s =>
        {
            var done = s.LessonIds.Count(completed.Contains);
            return new SubjectSummaryDto(s.Slug, s.Name, s.Tagline, s.Description, s.Icon,
                s.LessonIds.Count, done, Mappings.PercentOf(done, s.LessonIds.Count));
        }).ToList();
    }

    // Number of days in a row (ending today or yesterday) with at least one lesson or exam
    public static int Streak(IEnumerable<DateTime> activityDates)
    {
        var days = activityDates.Select(d => d.ToLocalTime().Date).ToHashSet();
        var day = DateTime.Now.Date;
        if (!days.Contains(day)) day = day.AddDays(-1);

        var streak = 0;
        while (days.Contains(day))
        {
            streak++;
            day = day.AddDays(-1);
        }
        return streak;
    }
}
