using System.Net;
using System.Net.Http.Json;
using ItqanApi.Data;
using ItqanApi.Dtos;

namespace ItqanApi.Tests;

public class AuthTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    [Fact]
    public async Task Register_then_login_returns_a_token_for_the_same_student()
    {
        var client = factory.CreateClient();
        var email = $"new-{Guid.NewGuid():N}@itqan.test";

        var register = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("Sara", email, "الأول الثانوي", "secret123"));
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email.ToUpperInvariant(), "secret123"));
        var auth = await login.Content.ReadFromJsonAsync<AuthResponse>();

        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        Assert.False(string.IsNullOrEmpty(auth!.Token));
        Assert.Equal(email, auth.Student.Email);
    }

    [Fact]
    public async Task Registering_the_same_email_twice_is_rejected()
    {
        var client = factory.CreateClient();
        var request = new RegisterRequest("Sara", $"twice-{Guid.NewGuid():N}@itqan.test", "الأول الثانوي", "secret123");

        await client.PostAsJsonAsync("/api/auth/register", request);
        var second = await client.PostAsJsonAsync("/api/auth/register", request);
        var error = await second.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("EMAIL_TAKEN", error!.Code);
    }

    [Fact]
    public async Task Wrong_password_is_rejected_with_the_same_message_as_an_unknown_email()
    {
        var client = factory.CreateClient();

        var wrongPassword = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(SeedData.DemoEmail, "not-the-password"));
        var unknownEmail = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest("nobody@itqan.test", "whatever"));

        Assert.Equal(HttpStatusCode.Unauthorized, wrongPassword.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, unknownEmail.StatusCode);
        Assert.Equal((await wrongPassword.Content.ReadFromJsonAsync<ApiError>())!.Code, (await unknownEmail.Content.ReadFromJsonAsync<ApiError>())!.Code);
    }

    [Fact]
    public async Task Short_passwords_fail_validation()
    {
        var response = await factory.CreateClient().PostAsJsonAsync("/api/auth/register",
            new RegisterRequest("Sara", "short@itqan.test", "الأول الثانوي", "123"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/me")]
    [InlineData("/api/progress")]
    [InlineData("/api/exams")]
    public async Task Protected_endpoints_need_a_token(string url)
    {
        var response = await factory.CreateClient().GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task The_seeded_demo_account_can_log_in_and_already_has_progress()
    {
        var client = factory.CreateClient();
        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(SeedData.DemoEmail, SeedData.DemoPassword));
        var auth = await login.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new("Bearer", auth!.Token);

        var progress = await client.GetFromJsonAsync<ProgressDto>("/api/progress");

        Assert.True(progress!.CompletedLessons > 0);
        Assert.True(progress.ExamsTaken > 0);
    }
}
