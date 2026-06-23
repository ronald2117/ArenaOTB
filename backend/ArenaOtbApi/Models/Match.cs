using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;

public class Match
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ArenaId { get; set; }

    [ForeignKey(nameof(ArenaId))]
    public Arena Arena { get; set; } = default!;

    public Guid BoardId { get; set; }

    [ForeignKey(nameof(BoardId))]
    public Board Board { get; set; } = default!;

    public Guid WhitePlayerId { get; set; }

    [ForeignKey(nameof(WhitePlayerId))]
    public ArenaPlayer WhitePlayer { get; set; } = default!;

    public Guid BlackPlayerId { get; set; }

    [ForeignKey(nameof(BlackPlayerId))]
    public ArenaPlayer BlackPlayer { get; set; } = default!;

    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = "PENDING";

    public DateTime? AcceptanceDeadline { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MatchAcceptance> Acceptances { get; set; }
        = new List<MatchAcceptance>();

    public ICollection<MatchResult> Results { get; set; }
        = new List<MatchResult>();
}
