namespace ItqanApi.Models;

public class Subject
{
    public int Id { get; set; }

    // Used in URLs, e.g. course.html?subject=math
    public string Slug { get; set; } = "";
    public string Name { get; set; } = "";
    public string Tagline { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";

    public List<Unit> Units { get; set; } = [];
    public List<Exam> Exams { get; set; } = [];
}

public class Unit
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";

    public List<Lesson> Lessons { get; set; } = [];
}

public class Lesson
{
    public int Id { get; set; }
    public int UnitId { get; set; }
    public Unit? Unit { get; set; }

    public int Order { get; set; }
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public int DurationMinutes { get; set; }
}

public class LessonCompletion
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student? Student { get; set; }
    public int LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
