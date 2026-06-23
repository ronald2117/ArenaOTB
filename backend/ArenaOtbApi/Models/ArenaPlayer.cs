using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;

public class ArenaPlayer
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ArenaId { get; set; }

    [ForeignKey(nameof(ArenaId))]
    public Arena Arena { get; set; } = default!;

    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = default!;

    public double Score { get; set; } = 0;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "WAITING";

    public bool HasDevice { get; set; } = true;

    public Guid? CurrentMatchId { get; set; }

    [ForeignKey(nameof(CurrentMatchId))]
    public Match? CurrentMatch { get; set; }

    public int TotalGames { get; set; } = 0;

    public int Wins { get; set; } = 0;

    public int Draws { get; set; } = 0;

    public int Losses { get; set; } = 0;

    public DateTime? LastMatchEndedAt { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MatchAcceptance> MatchAcceptances { get; set; }
        = new List<MatchAcceptance>();
}