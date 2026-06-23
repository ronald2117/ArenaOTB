using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArenaOtbApi.Models;
public class MatchAcceptance
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MatchId { get; set; }

    [ForeignKey(nameof(MatchId))]
    public Match Match { get; set; } = default!;

    public Guid PlayerId { get; set; }

    [ForeignKey(nameof(PlayerId))]
    public ArenaPlayer Player { get; set; } = default!;

    public bool Accepted { get; set; } = false;

    public bool AcceptedByOrganizer { get; set; } = false;

    public DateTime? AcceptedAt { get; set; }
}