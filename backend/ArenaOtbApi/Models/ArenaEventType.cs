namespace ArenaOtbApi.Models;

public enum ArenaEventType
{
    ArenaStarted,
    ArenaPaused,
    ArenaFinished,

    PlayerJoined,
    PlayerPaused,
    PlayerResumed,

    MatchCreated,
    MatchAccepted,
    MatchStarted,
    MatchFinished,

    ResultSubmitted,
    ResultConfirmed,
    ResultDisputed
}