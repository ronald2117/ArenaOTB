import React, { useState, useEffect } from "react";
import { PlayCircle, ShieldAlert, Swords, Trophy, Clock, Pause, CheckCircle2 } from "lucide-react";

interface StandingsRow {
  name: string;
  score: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
}

interface PlayerConsoleProps {
  roomCode: string;
  arenaName: string;
  timeControl: string;
  playerState: {
    status: "idle" | "waiting" | "matched" | "playing" | "submitting" | "confirmed" | "disputed";
    opponentName: string | null;
    boardNumber: number | null;
    color: "White" | "Black" | null;
    myReportedResult: "win" | "loss" | "draw" | null;
    opponentStatus: "pending" | "accepted" | "reported";
  };
  playerName: string;
  standings: StandingsRow[];
  activeMatchesCount: number;
  totalBoards: number;
  onAcceptMatch: () => void;
  onReportResult: (result: "win" | "loss" | "draw") => void;
  onEnterQueue: () => void;
  onLeaveQueue: () => void;
  onLeaveArena: () => void;
}

export const PlayerConsole: React.FC<PlayerConsoleProps> = ({
  roomCode,
  arenaName,
  timeControl,
  playerState,
  playerName,
  standings,
  activeMatchesCount,
  totalBoards,
  onAcceptMatch,
  onReportResult,
  onEnterQueue,
  onLeaveQueue,
  onLeaveArena,
}) => {
  // Companion Clock State (for Playing mode)
  const [whiteTime, setWhiteTime] = useState(180); // Default 3 min
  const [blackTime, setBlackTime] = useState(180);
  const [activeClock, setActiveClock] = useState<"White" | "Black" | null>(null);

  // Parse time control (e.g. "3+2", "5+0")
  useEffect(() => {
    if (playerState.status === "playing") {
      const minutes = parseInt(timeControl.split("+")[0]) || 5;
      setWhiteTime(minutes * 60);
      setBlackTime(minutes * 60);
      setActiveClock("White"); // White starts first in chess
    } else {
      setActiveClock(null);
    }
  }, [playerState.status, timeControl]);

  // Chess clock timer loop
  useEffect(() => {
    if (playerState.status !== "playing" || !activeClock) return;

    const timer = setInterval(() => {
      if (activeClock === "White") {
        setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [playerState.status, activeClock]);

  // Tap Clock Handler
  const handleClockTap = (color: "White" | "Black") => {
    if (playerState.status !== "playing") return;
    
    // Add increment (e.g. "3+2" means +2s increment)
    const increment = parseInt(timeControl.split("+")[1]) || 0;
    
    if (color === "White" && activeClock === "White") {
      setWhiteTime((prev) => prev + increment);
      setActiveClock("Black");
    } else if (color === "Black" && activeClock === "Black") {
      setBlackTime((prev) => prev + increment);
      setActiveClock("White");
    }
  };

  const formatClockTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner Summary */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 glass-panel">
        <div>
          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            Connected to Arena Code: <span className="font-extrabold">{roomCode}</span>
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {arenaName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Time Control: <span className="font-semibold text-slate-700 dark:text-slate-300">{timeControl}</span> | Active Boards: {activeMatchesCount}/{totalBoards}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={onLeaveArena}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-red-500 dark:text-slate-400 transition-colors"
          >
            Leave Arena
          </button>
        </div>
      </div>

      {/* Main Grid: Control Area vs Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Player Matching Console */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* State 1: Idle (Not in Queue) */}
          {playerState.status === "idle" && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg flex flex-col items-center justify-center">
              <Swords className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Ready to Join Arena?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm">
                Enter the pairing pool to match with other players. Pairings are generated continuously based on standings.
              </p>
              <button
                onClick={onEnterQueue}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20 active:scale-95 transition-all text-sm flex items-center gap-2 dark:bg-cyan-700 dark:hover:bg-cyan-600 glow-cyan"
              >
                <PlayCircle className="h-5 w-5" />
                <span>Enter Pairing Queue</span>
              </button>
            </div>
          )}

          {/* State 2: Waiting in Queue */}
          {playerState.status === "waiting" && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
              {/* Spinning Radar Scan Animation */}
              <div className="relative w-40 h-40 border border-cyan-500/30 rounded-full flex items-center justify-center mb-6">
                {/* Radar Grid circles */}
                <div className="absolute inset-4 border border-dashed border-cyan-500/20 rounded-full" />
                <div className="absolute inset-10 border border-cyan-500/10 rounded-full" />
                
                {/* Radar Sweep Line */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/20 rounded-full animate-radar origin-center" />
                
                {/* Glowing Swords icon */}
                <Swords className="h-12 w-12 text-cyan-500 dark:text-cyan-400 text-glow-cyan animate-pulse" />
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide animate-pulse">
                Looking For Opponent...
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm">
                Stand by, the system will pair you as soon as a board and a compatible opponent become available.
              </p>

              <button
                onClick={onLeaveQueue}
                className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950 font-bold uppercase tracking-wider text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-all"
              >
                <Pause className="h-4 w-4" />
                <span>Pause Matchmaking</span>
              </button>
            </div>
          )}

          {/* State 3: Matched */}
          {playerState.status === "matched" && (
            <div className="p-6 sm:p-8 rounded-2xl border border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-xl relative overflow-hidden glow-cyan">
              {/* Highlight header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center h-16 w-16 bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/30 mb-4 animate-bounce">
                  <Swords className="h-8 w-8" />
                </div>
                
                <h3 className="font-display text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider text-glow-cyan">
                  Match Found!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                  Report immediately to the physical board
                </p>

                {/* Match Details Box */}
                <div className="w-full max-w-md bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 rounded-xl p-5 my-6 grid grid-cols-3 items-center shadow-md">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">You</span>
                    <p className="font-display font-bold text-slate-900 dark:text-white mt-1 text-sm truncate">{playerName}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      playerState.color === "White" ? "bg-slate-100 text-slate-800" : "bg-slate-950 text-white border border-slate-800"
                    }`}>
                      {playerState.color}
                    </span>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 px-3 py-1 bg-cyan-500/10 dark:bg-cyan-950 rounded-full border border-cyan-500/20">
                      Board {playerState.boardNumber}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 text-xs mt-2 font-display">VS</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Opponent</span>
                    <p className="font-display font-bold text-slate-900 dark:text-white mt-1 text-sm truncate">{playerState.opponentName}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      playerState.color === "Black" ? "bg-slate-100 text-slate-800" : "bg-slate-950 text-white border border-slate-800"
                    }`}>
                      {playerState.color === "White" ? "Black" : "White"}
                    </span>
                  </div>
                </div>

                {/* Acceptance Buttons */}
                {playerState.opponentStatus === "accepted" ? (
                  <div className="w-full max-w-xs space-y-4">
                    <button
                      onClick={onAcceptMatch}
                      className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all dark:bg-cyan-700 dark:hover:bg-cyan-600 text-sm"
                    >
                      Accept & Start Match
                    </button>
                    <p className="text-xs text-emerald-500 font-bold uppercase flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Opponent Accepted!
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-xs space-y-3">
                    <button
                      onClick={onAcceptMatch}
                      className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-all dark:bg-cyan-700 dark:hover:bg-cyan-600 text-sm"
                    >
                      Accept Match
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 animate-pulse font-semibold">
                      Waiting for opponent to accept...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* State 4: Playing Game Screen */}
          {playerState.status === "playing" && (
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 shadow-xl relative">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    Live Playing (Board {playerState.boardNumber})
                  </span>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg mt-1">
                    Playing vs {playerState.opponentName}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  <span>Companion Clock</span>
                </div>
              </div>

              {/* COMPANION CHESS CLOCK VIEW */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* White Clock */}
                <div
                  onClick={() => handleClockTap("White")}
                  className={`cursor-pointer select-none py-6 sm:py-10 px-2 sm:px-4 rounded-2xl text-center border-2 transition-all ${
                    activeClock === "White"
                      ? "border-cyan-500 bg-cyan-500/5 glow-cyan scale-[1.02]"
                      : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 opacity-60"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                    White ({playerState.color === "White" ? "You" : playerState.opponentName})
                  </span>
                  <span className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {formatClockTime(whiteTime)}
                  </span>
                  {activeClock === "White" && (
                    <span className="block mt-2 text-[9px] sm:text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400 animate-pulse tracking-widest">
                      TAP TO PASS
                    </span>
                  )}
                </div>

                {/* Black Clock */}
                <div
                  onClick={() => handleClockTap("Black")}
                  className={`cursor-pointer select-none py-6 sm:py-10 px-2 sm:px-4 rounded-2xl text-center border-2 transition-all ${
                    activeClock === "Black"
                      ? "border-cyan-500 bg-cyan-500/5 glow-cyan scale-[1.02]"
                      : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 opacity-60"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                    Black ({playerState.color === "Black" ? "You" : playerState.opponentName})
                  </span>
                  <span className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {formatClockTime(blackTime)}
                  </span>
                  {activeClock === "Black" && (
                    <span className="block mt-2 text-[9px] sm:text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400 animate-pulse tracking-widest">
                      TAP TO PASS
                    </span>
                  )}
                </div>
              </div>

              {/* REPORT SCORE BOX */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 text-center">
                  Select Game Result
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center max-w-sm mx-auto">
                  Over-The-Board games require results input from players. Declare the outcome honestly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => onReportResult("win")}
                    className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider shadow-sm transition-all"
                  >
                    I Won
                  </button>
                  <button
                    onClick={() => onReportResult("loss")}
                    className="py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm uppercase tracking-wider shadow-sm transition-all"
                  >
                    I Lost
                  </button>
                  <button
                    onClick={() => onReportResult("draw")}
                    className="py-2.5 px-4 rounded-lg bg-slate-500 hover:bg-slate-400 text-white font-bold text-sm uppercase tracking-wider shadow-sm transition-all"
                  >
                    Draw
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State 5: Result reported, awaiting confirmation */}
          {playerState.status === "submitting" && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg flex flex-col items-center justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 dark:text-emerald-400 text-glow-emerald mb-4 animate-pulse" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Result Submitted
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4">
                You reported a <span className="font-bold text-emerald-500">{playerState.myReportedResult === "win" ? "Win" : playerState.myReportedResult === "loss" ? "Loss" : "Draw"}</span>.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg max-w-xs w-full mb-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold animate-pulse uppercase tracking-wider">
                  Awaiting Opponent Confirmation...
                </p>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Pairings will update instantly once your opponent submits their confirmation.
              </p>
            </div>
          )}

          {/* State 6: Disputed Result */}
          {playerState.status === "disputed" && (
            <div className="p-8 text-center rounded-2xl border border-rose-500 bg-rose-500/5 dark:bg-rose-950/20 shadow-xl flex flex-col items-center justify-center glow-crimson">
              <ShieldAlert className="h-16 w-16 text-rose-500 dark:text-rose-400 text-glow-crimson mb-4 animate-bounce" />
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Result Discrepancy
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-4 max-w-sm">
                You reported a <span className="font-bold text-slate-800 dark:text-white">{playerState.myReportedResult}</span>, but your opponent reported a different result.
              </p>
              <div className="p-4 bg-white border border-rose-200 dark:border-rose-950 dark:bg-slate-900 rounded-xl max-w-md w-full mb-6">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
                  Organizer Referee In Progress
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please remain at the board. The tournament organizer has been alerted and will manually resolve the score.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Standings / Leaderboard */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span>Arena Standings</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
              {standings.map((player, idx) => {
                const isCurrent = player.name === playerName;
                return (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "bg-cyan-500/10 dark:bg-cyan-950/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      {/* Rank badge */}
                      <span className={`flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold ${
                        idx === 0
                          ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900"
                          : idx === 1
                          ? "bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300"
                          : idx === 2
                          ? "bg-amber-600/10 text-amber-700 border border-amber-600/20 dark:bg-amber-700/20 dark:text-amber-500"
                          : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className={`text-sm font-semibold truncate ${
                          isCurrent ? "text-cyan-600 dark:text-cyan-400" : "text-slate-950 dark:text-slate-200"
                        }`}>
                          {player.name} {isCurrent && "(You)"}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {player.wins}W {player.draws}D {player.losses}L
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-center items-end shrink-0">
                      <span className="font-display font-extrabold text-base text-slate-950 dark:text-white">
                        {player.score.toFixed(1)}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                        {player.played} games
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
