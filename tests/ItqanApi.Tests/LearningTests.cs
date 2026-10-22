using System.Net;
using System.Net.Http.Json;
using ItqanApi.Dtos;

namespace ItqanApi.Tests;

public class LearningTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    [Fact]
    public async Task Exam_questions_never_reveal_the_correct_option()
    {
        var client = await factory.CreateStudentClientAsync();
        var exam = (await client.GetFromJsonAsync<List<ExamSummaryDto>>("/api/exams"))!.First(e => e.IsAvailable);

        var json = await client.GetStringAsync($"/api/exams/{exam.Id}");

        Assert.DoesNotContain("isCorrect", json, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Submitting_an_exam_is_graded_on_the_server()
    {
        var client = await factory.CreateStudentClientAsync();
        var summary = (await client.GetFromJsonAsync<List<ExamSummaryDto>>("/api/exams"))!.First(e => e.IsAvailable);
        var exam = await client.GetFromJsonAsync<ExamDetailDto>($"/api/exams/{summary.Id}");

        // No answers: everything is wrong, and the review tells us the right options
        var blank = await Submit(client, exam!.Id, new());
        Assert.Equal(0, blank.Score);
        Assert.All(blank.Review, r => Assert.Null(r.SelectedOptionId));

        // Answer every question with the option the review marked as correct
        var perfect = await Submit(client, exam.Id, blank.Review.ToDictionary(r => r.QuestionId, r => r.CorrectOptionId));
        Assert.Equal(exam.Questions.Count, perfect.Score);
        Assert.Equal(100, perfect.Percent);

        // The best result shows up in the exam list
        var updated = (await client.GetFromJsonAsync<List<ExamSummaryDto>>("/api/exams"))!.First(e => e.Id == exam.Id);
        Assert.Equal(100, updated.BestPercent);
        Assert.Equal(2, updated.AttemptsCount);
    }

    [Fact]
    public async Task Unavailable_exams_cannot_be_submitted()
    {
        var client = await factory.CreateStudentClientAsync();
        var locked = (await client.GetFromJsonAsync<List<ExamSummaryDto>>("/api/exams"))!.First(e => !e.IsAvailable);

        var response = await client.PostAsJsonAsync($"/api/exams/{locked.Id}/submit", new SubmitExamRequest(new()));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Completing_a_lesson_updates_progress_only_once()
    {
        var client = await factory.CreateStudentClientAsync();
        var math = await client.GetFromJsonAsync<SubjectDetailDto>("/api/subjects/math");
        var lesson = math!.Units[0].Lessons[0];

        (await client.PostAsync($"/api/lessons/{lesson.Id}/complete", null)).EnsureSuccessStatusCode();
        (await client.PostAsync($"/api/lessons/{lesson.Id}/complete", null)).EnsureSuccessStatusCode();

        var progress = await client.GetFromJsonAsync<ProgressDto>("/api/progress");
        Assert.Equal(1, progress!.CompletedLessons);
        Assert.Equal(1, progress.Subjects.Single(s => s.Slug == "math").CompletedLessons);
        Assert.Equal(1, progress.StreakDays);

        (await client.DeleteAsync($"/api/lessons/{lesson.Id}/complete")).EnsureSuccessStatusCode();
        progress = await client.GetFromJsonAsync<ProgressDto>("/api/progress");
        Assert.Equal(0, progress!.CompletedLessons);
    }

    [Fact]
    public async Task Students_only_see_their_own_results()
    {
        var first = await factory.CreateStudentClientAsync();
        var second = await factory.CreateStudentClientAsync();
        var exam = (await first.GetFromJsonAsync<List<ExamSummaryDto>>("/api/exams"))!.First(e => e.IsAvailable);

        await Submit(first, exam.Id, new());

        Assert.Single((await first.GetFromJsonAsync<List<AttemptDto>>("/api/exams/attempts"))!);
        Assert.Empty((await second.GetFromJsonAsync<List<AttemptDto>>("/api/exams/attempts"))!);
    }

    private static async Task<ExamResultDto> Submit(HttpClient client, int examId, Dictionary<int, int> answers)
    {
        var response = await client.PostAsJsonAsync($"/api/exams/{examId}/submit", new SubmitExamRequest(answers));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ExamResultDto>())!;
    }
}
