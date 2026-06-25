using System.ComponentModel.DataAnnotations;

namespace ArenaOtbApi.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [EmailAddress]
    [MaxLength(255)]
    public string? Email { get; set; }
    
    public string? PasswordHash { get; set; }

    [MaxLength(100)]
    public string? DisplayName { get; set; }

    [MaxLength(255)]
    public string? GoogleId { get; set; }

    [Required]
    public UserRole Role { get; set; } = UserRole.Guest; 

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Arena> OrganizedArenas { get; set; } = new List<Arena>();
}