namespace ItqanApi.Models;

public class Student
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Grade { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Settings
    public string Language { get; set; } = "ar";
    public string Theme { get; set; } = "light";
    public bool NotificationsEnabled { get; set; } = true;
    public bool StudyReminder { get; set; } = true;

    public List<LessonCompletion> CompletedLessons { get; set; } = [];
    public List<ExamAttempt> ExamAttempts { get; set; } = [];
}
