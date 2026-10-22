using ItqanApi.Data;
using ItqanApi.Dtos;
using ItqanApi.Models;
using ItqanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ItqanApi.Controllers;

// Everything about the logged-in student's own account
[ApiController]
[Authorize]
[Route("api/me")]
public class MeController(AppDbContext db, IPasswordHasher<Student> hasher) : ControllerBase
{
    private async Task<Student?> CurrentStudent() => await db.Students.FindAsync(User.GetStudentId());

    [HttpGet]
    public async Task<ActionResult<StudentDto>> Get()
    {
        var student = await CurrentStudent();
        if (student == null) return Unauthorized();

        return student.ToDto();
    }

    [HttpPut]
    public async Task<ActionResult<StudentDto>> UpdateProfile(UpdateProfileRequest request)
    {
        var student = await CurrentStudent();
        if (student == null) return Unauthorized();

        student.FullName = request.FullName.Trim();
        student.Grade = request.Grade.Trim();
        await db.SaveChangesAsync();

        return student.ToDto();
    }

    [HttpPut("settings")]
    public async Task<ActionResult<StudentDto>> UpdateSettings(UpdateSettingsRequest request)
    {
        var student = await CurrentStudent();
        if (student == null) return Unauthorized();

        student.Language = request.Language;
        student.Theme = request.Theme;
        student.NotificationsEnabled = request.NotificationsEnabled;
        student.StudyReminder = request.StudyReminder;
        await db.SaveChangesAsync();

        return student.ToDto();
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var student = await CurrentStudent();
        if (student == null) return Unauthorized();

        if (hasher.VerifyHashedPassword(student, student.PasswordHash, request.CurrentPassword) == PasswordVerificationResult.Failed)
            return BadRequest(new ApiError("WRONG_PASSWORD", "The current password is incorrect."));

        student.PasswordHash = hasher.HashPassword(student, request.NewPassword);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
