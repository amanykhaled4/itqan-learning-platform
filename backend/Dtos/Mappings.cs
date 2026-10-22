using ItqanApi.Models;

namespace ItqanApi.Dtos;

public static class Mappings
{
    public static StudentDto ToDto(this Student student) => new(
        student.Id,
        student.FullName,
        student.Email,
        student.Grade,
        student.CreatedAt,
        new SettingsDto(student.Language, student.Theme, student.NotificationsEnabled, student.StudyReminder));

    public static int PercentOf(int part, int total) =>
        total == 0 ? 0 : (int)Math.Round(part * 100.0 / total);
}
