using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;
public class ArenaEvent
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ArenaId { get; set; }

    [ForeignKey(nameof(ArenaId))]
    public Arena Arena { get; set; } = default!;

    [Required]
    [MaxLength(50)]
    public string EventType { get; set; } = default!;

    public string? Metadata { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}