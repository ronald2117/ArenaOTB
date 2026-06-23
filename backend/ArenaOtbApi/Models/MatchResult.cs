using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;
public enum MatchOutcome
{
    WHITE_WIN,
    BLACK_WIN,
    DRAW
}

public class MatchResult
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MatchId { get; set; }

    [ForeignKey(nameof(MatchId))]
    public Match Match { get; set; } = default!;

    public Guid SubmittedByPlayerId { get; set; }

    [ForeignKey(nameof(SubmittedByPlayerId))]
    public ArenaPlayer SubmittedByPlayer { get; set; } = default!;

    [Required]
    public MatchOutcome Result { get; set; }

    public bool OpponentConfirmed { get; set; } = false;

    public DateTime? ConfirmedAt { get; set; }

    public bool IsDisputed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}