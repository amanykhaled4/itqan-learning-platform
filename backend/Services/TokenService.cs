using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ItqanApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace ItqanApi.Services;

public class TokenService(IConfiguration config)
{
    public string CreateToken(Student student)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
            new Claim(ClaimTypes.Email, student.Email),
            new Claim(ClaimTypes.Name, student.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public static class ClaimsPrincipalExtensions
{
    // The id of the logged-in student, read from the JWT
    public static int GetStudentId(this ClaimsPrincipal user) =>
        int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
