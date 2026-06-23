using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using ArenaOtbApi.Data;
using ArenaOtbApi.Models;
using ArenaOtbApi.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace ArenaOtbApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext context, ITokenService tokenService, IConfiguration config)
    {
        _context = context;
        _tokenService = tokenService;
        _config = config;
    }

    // 1. GUEST MODE
    [HttpPost("guest")]
    public async Task<IActionResult> GuestLogin()
    {
        var guestUser = new User { Role = "guest" };
        _context.Users.Add(guestUser);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(guestUser);
        return Ok(new { token });
    }

    // 2. USERNAME/PASSWORD REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already registered.");

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "user"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token });
    }

    // 3. USERNAME/PASSWORD LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token });
    }

    // 4. GOOGLE LOGIN
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            // Validate the Google token sent from frontend
            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"] }
            });

            // Check if user already exists via Google ID or Email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject || u.Email == payload.Email);

            if (user == null)
            {
                // Create a new user if they don't exist
                user = new User
                {
                    Email = payload.Email,
                    GoogleId = payload.Subject,
                    Role = "user"
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else if (string.IsNullOrEmpty(user.GoogleId))
            {
                // Link Google ID if they registered with password previously
                user.GoogleId = payload.Subject;
                await _context.SaveChangesAsync();
            }

            var token = _tokenService.GenerateToken(user);
            return Ok(new { token });
        }
        catch (InvalidJwtException)
        {
            return BadRequest("Invalid Google token.");
        }
    }
}

// Data Transfer Objects (DTOs)
public record RegisterDto(string Email, string Password);
public record LoginDto(string Email, string Password);
public record GoogleLoginDto(string IdToken);