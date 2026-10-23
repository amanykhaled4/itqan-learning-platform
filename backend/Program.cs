using System.Text;
using ItqanApi.Data;
using ItqanApi.Models;
using ItqanApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ---------- Database ----------
// A relative SQLite path is placed next to the app, so it works the same under IIS, Docker and dotnet run
var sqlite = new SqliteConnectionStringBuilder(builder.Configuration.GetConnectionString("Default"));
if (!string.IsNullOrEmpty(sqlite.DataSource) && sqlite.DataSource != ":memory:" && !Path.IsPathRooted(sqlite.DataSource))
    sqlite.DataSource = Path.Combine(builder.Environment.ContentRootPath, sqlite.DataSource);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(sqlite.ToString()));

// ---------- Services ----------
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<ProgressService>();
builder.Services.AddScoped<IPasswordHasher<Student>, PasswordHasher<Student>>();

// ---------- JWT authentication ----------
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

// ---------- CORS (only needed when the front end is hosted somewhere else) ----------
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? [])
        .AllowAnyHeader()
        .AllowAnyMethod()));

// ---------- Controllers & Swagger ----------
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Itqan API", Version = "v1" });

    // Adds the "Authorize" button in Swagger to test protected endpoints with a token
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste the token from /api/auth/login"
    });
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

var app = builder.Build();

// Never sign tokens with the placeholder key from appsettings.json. Without a real Jwt__Key,
// a random key is made at startup: secure, but everyone is logged out when the server restarts.
var jwtKey = app.Configuration["Jwt:Key"] ?? "";
if (!app.Environment.IsDevelopment() && (jwtKey.Length < 32 || jwtKey.StartsWith("set-a-real-secret")))
{
    app.Configuration["Jwt:Key"] = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(48));
    app.Logger.LogWarning("Jwt__Key is not set; using a random key for this run. Set Jwt__Key to keep logins across restarts.");
}

// ---------- Create / update the database and add the starting content ----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    SeedData.Seed(db);
}

app.UseSwagger();
app.UseSwaggerUI();

// ---------- Serve the front end from ../frontend, so one command runs the whole platform ----------
var frontendPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, builder.Configuration["FrontendPath"] ?? "../frontend"));
// A published build (dotnet publish / Visual Studio Publish) carries the front end in its own "frontend" folder
if (!Directory.Exists(frontendPath))
    frontendPath = Path.Combine(builder.Environment.ContentRootPath, "frontend");
if (Directory.Exists(frontendPath))
{
    var files = new PhysicalFileProvider(frontendPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = files });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = files });
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// Lets the integration tests start the API in memory
public partial class Program;
