using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArenaOtbApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GoogleId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Role = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Arenas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoomCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TimeControl = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    ExtendedMinutes = table.Column<int>(type: "int", nullable: false),
                    BoardCount = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    OrganizerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Arenas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Arenas_Users_OrganizerId",
                        column: x => x.OrganizerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArenaEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ArenaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ActorPlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    BoardId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MetadataJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArenaEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArenaEvents_Arenas_ArenaId",
                        column: x => x.ArenaId,
                        principalTable: "Arenas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArenaPlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ArenaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Score = table.Column<double>(type: "float", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HasDevice = table.Column<bool>(type: "bit", nullable: false),
                    CurrentMatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TotalGames = table.Column<int>(type: "int", nullable: false),
                    Wins = table.Column<int>(type: "int", nullable: false),
                    Draws = table.Column<int>(type: "int", nullable: false),
                    Losses = table.Column<int>(type: "int", nullable: false),
                    LastMatchEndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArenaPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArenaPlayers_Arenas_ArenaId",
                        column: x => x.ArenaId,
                        principalTable: "Arenas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Boards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    ArenaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CurrentMatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Boards_Arenas_ArenaId",
                        column: x => x.ArenaId,
                        principalTable: "Arenas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ArenaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BoardId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WhitePlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlackPlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    AcceptanceDeadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Matches_ArenaPlayers_BlackPlayerId",
                        column: x => x.BlackPlayerId,
                        principalTable: "ArenaPlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_ArenaPlayers_WhitePlayerId",
                        column: x => x.WhitePlayerId,
                        principalTable: "ArenaPlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Arenas_ArenaId",
                        column: x => x.ArenaId,
                        principalTable: "Arenas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matches_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MatchAcceptances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Accepted = table.Column<bool>(type: "bit", nullable: false),
                    AcceptedByOrganizer = table.Column<bool>(type: "bit", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchAcceptances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchAcceptances_ArenaPlayers_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "ArenaPlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchAcceptances_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MatchId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubmittedByPlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Result = table.Column<int>(type: "int", nullable: false),
                    OpponentConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDisputed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchResults_ArenaPlayers_SubmittedByPlayerId",
                        column: x => x.SubmittedByPlayerId,
                        principalTable: "ArenaPlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchResults_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArenaEvents_ActorPlayerId",
                table: "ArenaEvents",
                column: "ActorPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_ArenaEvents_ArenaId",
                table: "ArenaEvents",
                column: "ArenaId");

            migrationBuilder.CreateIndex(
                name: "IX_ArenaEvents_BoardId",
                table: "ArenaEvents",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_ArenaEvents_MatchId",
                table: "ArenaEvents",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ArenaPlayers_ArenaId",
                table: "ArenaPlayers",
                column: "ArenaId");

            migrationBuilder.CreateIndex(
                name: "IX_ArenaPlayers_CurrentMatchId",
                table: "ArenaPlayers",
                column: "CurrentMatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Arenas_OrganizerId",
                table: "Arenas",
                column: "OrganizerId");

            migrationBuilder.CreateIndex(
                name: "IX_Arenas_RoomCode",
                table: "Arenas",
                column: "RoomCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Boards_ArenaId",
                table: "Boards",
                column: "ArenaId");

            migrationBuilder.CreateIndex(
                name: "IX_Boards_CurrentMatchId",
                table: "Boards",
                column: "CurrentMatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchAcceptances_MatchId",
                table: "MatchAcceptances",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchAcceptances_PlayerId",
                table: "MatchAcceptances",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ArenaId",
                table: "Matches",
                column: "ArenaId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_BlackPlayerId",
                table: "Matches",
                column: "BlackPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_BoardId",
                table: "Matches",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_WhitePlayerId",
                table: "Matches",
                column: "WhitePlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_SubmittedByPlayerId",
                table: "MatchResults",
                column: "SubmittedByPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_ArenaEvents_ArenaPlayers_ActorPlayerId",
                table: "ArenaEvents",
                column: "ActorPlayerId",
                principalTable: "ArenaPlayers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArenaEvents_Boards_BoardId",
                table: "ArenaEvents",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArenaEvents_Matches_MatchId",
                table: "ArenaEvents",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArenaPlayers_Matches_CurrentMatchId",
                table: "ArenaPlayers",
                column: "CurrentMatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Boards_Matches_CurrentMatchId",
                table: "Boards",
                column: "CurrentMatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_ArenaPlayers_BlackPlayerId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_ArenaPlayers_WhitePlayerId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Boards_Arenas_ArenaId",
                table: "Boards");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Arenas_ArenaId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Boards_BoardId",
                table: "Matches");

            migrationBuilder.DropTable(
                name: "ArenaEvents");

            migrationBuilder.DropTable(
                name: "MatchAcceptances");

            migrationBuilder.DropTable(
                name: "MatchResults");

            migrationBuilder.DropTable(
                name: "ArenaPlayers");

            migrationBuilder.DropTable(
                name: "Arenas");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Boards");

            migrationBuilder.DropTable(
                name: "Matches");
        }
    }
}
