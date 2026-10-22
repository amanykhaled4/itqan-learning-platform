using System.ComponentModel.DataAnnotations;

namespace ItqanApi.Dtos;

public record RegisterRequest(
    [Required, MaxLength(80)] string FullName,
    [Required, EmailAddress, MaxLength(120)] string Email,
    [Required, MaxLength(40)] string Grade,
    [Required, MinLength(6), MaxLength(100)] string Password);

public record LoginRequest(
    [Required] string Email,
    [Required] string Password);

public record AuthResponse(string Token, StudentDto Student);

public record SettingsDto(string Language, string Theme, bool NotificationsEnabled, bool StudyReminder);

public record StudentDto(int Id, string FullName, string Email, string Grade, DateTime CreatedAt, SettingsDto Settings);

public record UpdateProfileRequest(
    [Required, MaxLength(80)] string FullName,
    [Required, MaxLength(40)] string Grade);

public record UpdateSettingsRequest(
    [Required, RegularExpression("^(ar|en)$")] string Language,
    [Required, RegularExpression("^(light|dark)$")] string Theme,
    bool NotificationsEnabled,
    bool StudyReminder);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required, MinLength(6), MaxLength(100)] string NewPassword);

// Errors carry a code so the front end can show the message in the user's language
public record ApiError(string Code, string Message);
