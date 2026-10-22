using ItqanApi.Data;
using ItqanApi.Dtos;
using ItqanApi.Models;
using ItqanApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ItqanApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens, IPasswordHasher<Student> hasher) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await db.Students.AnyAsync(s => s.Email == email))
            return Conflict(new ApiError("EMAIL_TAKEN", "This email is already registered."));

        var student = new Student
        {
            FullName = request.FullName.Trim(),
            Email = email,
            Grade = request.Grade.Trim()
        };

        // Never store the password itself, only a salted hash
        student.PasswordHash = hasher.HashPassword(student, request.Password);

        db.Students.Add(student);
        await db.SaveChangesAsync();

        return new AuthResponse(tokens.CreateToken(student), student.ToDto());
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var student = await db.Students.FirstOrDefaultAsync(s => s.Email == email);

        // Same answer for "no account" and "wrong password", so emails can't be guessed
        if (student == null || hasher.VerifyHashedPassword(student, student.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            return Unauthorized(new ApiError("INVALID_LOGIN", "Email or password is incorrect."));

        return new AuthResponse(tokens.CreateToken(student), student.ToDto());
    }
}
