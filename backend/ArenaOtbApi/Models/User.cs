using System.ComponentModel.DataAnnotations;

namespace ArenaOtbApi.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [EmailAddress]
    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? GoogleId { get; set; }

    [Required]
    public string Role { get; set; } = "guest"; // "guest", "user", "admin"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}