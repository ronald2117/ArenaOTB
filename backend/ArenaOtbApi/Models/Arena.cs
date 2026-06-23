using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ArenaOtbApi.Models;

public class Arena
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    [Required]
    [MaxLength(20)]
    public string RoomCode { get; set; } = default!;

    [Required]
    [MaxLength(20)]
    public string TimeControl { get; set; } = "5+0";

    public int DurationMinutes { get; set; }

    public int ExtendedMinutes { get; set; } = 0;

    public int BoardCount { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "WAITING";

    public Guid OrganizerId { get; set; }

    [ForeignKey(nameof(OrganizerId))]
    public User Organizer { get; set; } = default!;

    public DateTime? StartedAt { get; set; }

    public DateTime? EndedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ArenaPlayer> Players { get; set; } = new List<ArenaPlayer>();

    public ICollection<Board> Boards { get; set; } = new List<Board>();

    public ICollection<Match> Matches { get; set; } = new List<Match>();

    public ICollection<ArenaEvent> Events { get; set; } = new List<ArenaEvent>();
}