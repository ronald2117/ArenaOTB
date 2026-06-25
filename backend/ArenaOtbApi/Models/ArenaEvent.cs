using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;
public class ArenaEvent
{
    [Key]
    public Guid Id { get; set; }

    public Guid ArenaId { get; set; }
    public Arena Arena { get; set; } = default!;
    
    [Required]
    [MaxLength(50)]
    public ArenaEventType EventType { get; set; } = default!;

    public Guid? ActorPlayerId { get; set; }
    public ArenaPlayer? ActorPlayer { get; set; }

    public Guid? MatchId { get; set; }
    public Match? Match { get; set; }

    public Guid? BoardId { get; set; }
    public Board? Board { get; set; }

    public string? MetadataJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}