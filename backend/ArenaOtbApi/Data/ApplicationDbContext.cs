using Microsoft.EntityFrameworkCore;
using ArenaOtbApi.Models;

namespace ArenaOtbApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Arena> Arenas { get; set; }
    public DbSet<ArenaEvent> ArenaEvents { get; set; }
    public DbSet<ArenaPlayer> ArenaPlayers { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<MatchAcceptance> MatchAcceptances { get; set; }
    public DbSet<MatchResult> MatchResults { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique()
            .HasFilter("[Email] IS NOT NULL");

        // Arena Configuration
        modelBuilder.Entity<Arena>()
            .HasIndex(a => a.RoomCode)
            .IsUnique();

        modelBuilder.Entity<Arena>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Arena>()
            .HasOne(a => a.Organizer)
            .WithMany(u => u.OrganizedArenas)
            .HasForeignKey(a => a.OrganizerId)
            .OnDelete(DeleteBehavior.Cascade);

        // ArenaPlayer Configuration
        modelBuilder.Entity<ArenaPlayer>()
            .HasOne(ap => ap.Arena)
            .WithMany(a => a.Players)
            .HasForeignKey(ap => ap.ArenaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ArenaPlayer>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<ArenaPlayer>()
            .HasOne(ap => ap.CurrentMatch)
            .WithMany()
            .HasForeignKey(ap => ap.CurrentMatchId)
            .OnDelete(DeleteBehavior.Restrict);

        // Board Configuration
        modelBuilder.Entity<Board>()
            .HasOne(b => b.Arena)
            .WithMany(a => a.Boards)
            .HasForeignKey(b => b.ArenaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Board>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Board>()
            .HasOne(b => b.CurrentMatch)
            .WithMany()
            .HasForeignKey(b => b.CurrentMatchId)
            .OnDelete(DeleteBehavior.Restrict);

        // ArenaEvent Configuration
        modelBuilder.Entity<ArenaEvent>()
            .HasOne(ae => ae.Arena)
            .WithMany(a => a.Events)
            .HasForeignKey(ae => ae.ArenaId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<ArenaEvent>()
            .Property(x => x.EventType)
            .HasConversion<string>();

        // Match Configuration
        modelBuilder.Entity<Match>()
            .HasOne(m => m.Arena)
            .WithMany(a => a.Matches)
            .HasForeignKey(m => m.ArenaId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Match>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Board)
            .WithMany()
            .HasForeignKey(m => m.BoardId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.WhitePlayer)
            .WithMany()
            .HasForeignKey(m => m.WhitePlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.BlackPlayer)
            .WithMany()
            .HasForeignKey(m => m.BlackPlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        // MatchAcceptance Configuration
        modelBuilder.Entity<MatchAcceptance>()
            .HasOne(ma => ma.Match)
            .WithMany(m => m.Acceptances)
            .HasForeignKey(ma => ma.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchAcceptance>()
            .HasOne(ma => ma.Player)
            .WithMany(p => p.MatchAcceptances)
            .HasForeignKey(ma => ma.PlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        // MatchResult Configuration
        modelBuilder.Entity<MatchResult>()
            .HasOne(mr => mr.Match)
            .WithMany(m => m.Results)
            .HasForeignKey(mr => mr.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchResult>()
            .HasOne(mr => mr.SubmittedByPlayer)
            .WithMany()
            .HasForeignKey(mr => mr.SubmittedByPlayerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}