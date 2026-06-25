using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;

public class Board
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public BoardState State { get; set; } = BoardState.Free;

    public Guid ArenaId { get; set; }

    [ForeignKey(nameof(ArenaId))]
    public Arena Arena { get; set; } = default!;

    [Required]
    [MaxLength(50)]
    public string Label { get; set; } = default!;

    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = "FREE";

    public Guid? CurrentMatchId { get; set; }

    [ForeignKey(nameof(CurrentMatchId))]
    public Match? CurrentMatch { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}