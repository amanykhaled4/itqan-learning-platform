using ItqanApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ItqanApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<LessonCompletion> LessonCompletions => Set<LessonCompletion>();
    public DbSet<Exam> Exams => Set<Exam>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Option> Options => Set<Option>();
    public DbSet<ExamAttempt> ExamAttempts => Set<ExamAttempt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>().HasIndex(s => s.Email).IsUnique();
        modelBuilder.Entity<Subject>().HasIndex(s => s.Slug).IsUnique();

        // A student can complete each lesson only once
        modelBuilder.Entity<LessonCompletion>()
            .HasIndex(c => new { c.StudentId, c.LessonId })
            .IsUnique();
    }
}
