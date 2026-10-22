namespace ItqanApi.Dtos;

// ---------- Subjects & lessons ----------

public record SubjectSummaryDto(
    string Slug, string Name, string Tagline, string Description, string Icon,
    int TotalLessons, int CompletedLessons, int Percent);

public record LessonDto(int Id, int Order, string Title, int DurationMinutes, bool Completed);

public record UnitDto(int Id, int Order, string Title, string Description, List<LessonDto> Lessons);

public record SubjectDetailDto(
    string Slug, string Name, string Description, string Icon, int Percent, List<UnitDto> Units);

public record LessonDetailDto(
    int Id, string Title, string Content, int DurationMinutes, bool Completed,
    string SubjectSlug, string SubjectName, string UnitTitle,
    int? PreviousLessonId, int? NextLessonId);

// ---------- Exams ----------

public record ExamSummaryDto(
    int Id, string Title, string Description,
    string SubjectSlug, string SubjectName, string SubjectIcon,
    int QuestionCount, int DurationMinutes, bool IsAvailable,
    int? BestPercent, int AttemptsCount);

public record OptionDto(int Id, string Text);

public record QuestionDto(int Id, string Text, List<OptionDto> Options);

public record ExamDetailDto(int Id, string Title, string SubjectName, int DurationMinutes, List<QuestionDto> Questions);

// Answers: question id → chosen option id
public record SubmitExamRequest(Dictionary<int, int> Answers);

public record QuestionReviewDto(int QuestionId, int? SelectedOptionId, int CorrectOptionId, bool IsCorrect);

public record ExamResultDto(int AttemptId, int Score, int Total, int Percent, List<QuestionReviewDto> Review);

public record AttemptDto(int Id, int ExamId, string ExamTitle, string SubjectName, int Score, int Total, int Percent, DateTime SubmittedAt);

// ---------- Progress ----------

public record ActivityDto(string Type, string Title, string Detail, DateTime Date);

public record ProgressDto(
    int OverallPercent,
    int CompletedLessons,
    int TotalLessons,
    int ExamsTaken,
    int AverageScore,
    int StreakDays,
    List<SubjectSummaryDto> Subjects,
    List<ActivityDto> RecentActivity);
