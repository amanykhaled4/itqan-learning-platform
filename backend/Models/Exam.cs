namespace ItqanApi.Models;

public class Exam
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public int DurationMinutes { get; set; }
    public bool IsAvailable { get; set; } = true;

    public List<Question> Questions { get; set; } = [];
}

public class Question
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public Exam? Exam { get; set; }

    public int Order { get; set; }
    public string Text { get; set; } = "";

    public List<Option> Options { get; set; } = [];
}

public class Option
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question? Question { get; set; }

    public string Text { get; set; } = "";
    public bool IsCorrect { get; set; }
}

public class ExamAttempt
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student? Student { get; set; }
    public int ExamId { get; set; }
    public Exam? Exam { get; set; }

    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int Percent { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
