import React, { useState } from "react";
import { Play, Pause, AlertTriangle, Trophy, UserPlus, Swords, Monitor } from "lucide-react";

interface StandingsRow {
  name: string;
  score: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
}

interface ActiveMatch {
  id: string;
  board: number;
  white: string;
  black: string;
  status: "pending" | "playing" | "confirmed" | "disputed";
  whiteAccepted: boolean;
  blackAccepted: boolean;
  whiteReport?: string;
  blackReport?: string;
}

interface OrganizerConsoleProps {
  arenaName: string;
  roomCode: string;
  timeControl: string;
  totalBoards: number;
  arenaActive: boolean;
  standings: StandingsRow[];
  activeMatches: ActiveMatch[];
  waitingQueue: string[];
  offlinePlayers: string[];
  onCreateArena: (name: string, boards: number, timeControl: string) => void;
  onToggleArenaActive: () => void;
  onAddOfflinePlayer: (name: string) => void;
  onKickPlayer: (name: string) => void;
  onResolveDispute: (matchId: string, result: "white" | "black" | "draw") => void;
  onForceReport: (matchId: string, result: "white" | "black" | "draw") => void;
  onEndArena: () => void;
  onBackToHome: () => void;
}

export const OrganizerConsole: React.FC<OrganizerConsoleProps> = ({
  arenaName,
  roomCode,
  timeControl,
  totalBoards,
  arenaActive,
  standings,
  activeMatches,
  waitingQueue,
  offlinePlayers,
  onCreateArena,
  onToggleArenaActive,
  onAddOfflinePlayer,
  onKickPlayer,
  onResolveDispute,
  onForceReport,
  onEndArena,
  onBackToHome,
}) => {
  // Arena creation state
  const [formName, setFormName] = useState("OTB Rapid & Blitz");
  const [formBoards, setFormBoards] = useState(4);
  const [formTimeControl, setFormTimeControl] = useState("5+3");

  // Offline player state
  const [offlineName, setOfflineName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    onCreateArena(formName.trim(), formBoards, formTimeControl);
  };

  const handleAddOffline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName.trim()) return;
    onAddOfflinePlayer(offlineName.trim());
    setOfflineName("");
  };

  // If no room is active, render setup view
  if (!roomCode) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl uppercase">
            Initialize New <span className="text-cyan-500 dark:text-cyan-400">Arena</span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Configure your physical boards and parameters to start continuous matchmaking.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Arena Session Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Physical Boards Available
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={formBoards}
                  onChange={(e) => setFormBoards(Math.max(1, parseInt(e.target.value) || 1))}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Time Control
                </label>
                <select
                  value={formTimeControl}
                  onChange={(e) => setFormTimeControl(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                >
                  <option value="3+0">3 + 0 (Blitz)</option>
                  <option value="3+2">3 + 2 (Blitz)</option>
                  <option value="5+0">5 + 0 (Blitz)</option>
                  <option value="5+3">5 + 3 (Blitz)</option>
                  <option value="10+0">10 + 0 (Rapid)</option>
                  <option value="10+5">10 + 5 (Rapid)</option>
                  <option value="15+10">15 + 10 (Rapid)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-base font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-600/10 hover:bg-cyan-500 hover:shadow-cyan-600/20 active:scale-[0.98] transition-all dark:bg-cyan-700 dark:hover:bg-cyan-600"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Launch Arena Session</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner Control Area */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg gap-6">
        <div>
          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 dark:bg-cyan-500/5 px-2 py-1 rounded-md border border-cyan-500/20">
            ORGANIZER MODE
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white mt-2 uppercase tracking-wide">
            {arenaName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Room Invite Code: <span className="font-extrabold text-cyan-600 dark:text-cyan-400 text-lg tracking-widest">{roomCode}</span> | {timeControl} Matchmaking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 font-bold uppercase tracking-wider text-xs transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={onToggleArenaActive}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all ${
              arenaActive
                ? "bg-amber-600 text-white hover:bg-amber-500"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {arenaActive ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Matchmaking</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Resume Matchmaking</span>
              </>
            )}
          </button>
          <button
            onClick={onEndArena}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 dark:border-slate-800 dark:text-slate-400 hover:bg-red-500/5 dark:hover:bg-red-950/15 font-bold uppercase tracking-wider text-xs transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Grid: Boards & QR Projection vs Leaderboard/Offline Players */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Col Span 2): Projector Box & Board Grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Projection Area */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 shadow-inner">
            <div className="sm:col-span-2 text-center sm:text-left">
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg flex items-center justify-center sm:justify-start gap-1.5 uppercase">
                <Monitor className="h-5 w-5 text-cyan-500 animate-pulse" />
                Projection QR Board
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Project this room details on the lobby wall. Players can open their cameras and join in 2 seconds.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Invite Code:</span>
                <span className="font-mono text-xl font-black text-cyan-600 dark:text-cyan-400 tracking-wider">
                  {roomCode}
                </span>
              </div>
            </div>
            {/* Mock QR code vector rendering */}
            <div className="flex justify-center">
              <div className="h-28 w-28 p-2 rounded-xl bg-white border border-slate-200 shadow-md flex flex-col justify-between items-center">
                <svg className="h-24 w-24 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                  {/* Outer Frame chess look QR Mock */}
                  <rect x="0" y="0" width="6" height="6" />
                  <rect x="18" y="0" width="6" height="6" />
                  <rect x="0" y="18" width="6" height="6" />
                  <rect x="2" y="2" width="2" height="2" fill="white" />
                  <rect x="20" y="2" width="2" height="2" fill="white" />
                  <rect x="2" y="20" width="2" height="2" fill="white" />
                  {/* Inner scattered blocks */}
                  <rect x="8" y="2" width="2" height="2" />
                  <rect x="12" y="4" width="3" height="2" />
                  <rect x="10" y="8" width="4" height="4" />
                  <rect x="3" y="9" width="3" height="3" />
                  <rect x="18" y="10" width="4" height="2" />
                  <rect x="8" y="16" width="3" height="3" />
                  <rect x="14" y="18" width="2" height="4" />
                  <rect x="20" y="16" width="3" height="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Physical Boards Grid */}
          <div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Physical Boards Management
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: totalBoards }).map((_, idx) => {
                const boardNum = idx + 1;
                const match = activeMatches.find((m) => m.board === boardNum);

                if (!match) {
                  return (
                    <div
                      key={boardNum}
                      className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between shadow-sm opacity-60 hover:opacity-90 transition-opacity"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-400">Board {boardNum}</span>
                        <p className="font-display font-bold text-slate-500 uppercase mt-1">EMPTY / AVAILABLE</p>
                      </div>
                      <Swords className="h-6 w-6 text-slate-200 dark:text-slate-800" />
                    </div>
                  );
                }

                // If match is active, render active board container
                const isPending = match.status === "pending";
                const isDisputed = match.status === "disputed";

                return (
                  <div
                    key={boardNum}
                    className={`p-5 rounded-xl border-2 shadow-md relative overflow-hidden transition-all ${
                      isDisputed
                        ? "border-rose-500 bg-rose-500/5 glow-crimson"
                        : isPending
                        ? "border-amber-500 bg-amber-500/5 glow-gold"
                        : "border-emerald-500 bg-emerald-500/5 glow-emerald"
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                        isDisputed ? "bg-rose-500 text-white" : isPending ? "bg-amber-500 text-slate-950" : "bg-emerald-500 text-white"
                      }`}>
                        Board {boardNum}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {match.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {match.white}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">White</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {match.black}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 dark:bg-slate-950 dark:border dark:border-slate-800 text-slate-400">Black</span>
                      </div>
                    </div>

                    {/* Pending accept status indicators */}
                    {isPending && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Acceptance Check:
                        <div className="flex justify-between mt-1">
                          <span>{match.white}: {match.whiteAccepted ? "✅ Accepted" : "⏳ Pending"}</span>
                          <span>{match.black}: {match.blackAccepted ? "✅ Accepted" : "⏳ Pending"}</span>
                        </div>
                      </div>
                    )}

                    {/* Dispute Center */}
                    {isDisputed && (
                      <div className="mt-3.5 pt-3 border-t border-rose-200 dark:border-rose-950/80">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wide">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                          <span>Discrepancy Reported</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Reports: {match.white} ({match.whiteReport}) vs {match.black} ({match.blackReport})
                        </div>
                        
                        {/* Resolve controls */}
                        <div className="grid grid-cols-3 gap-1 mt-3">
                          <button
                            onClick={() => onResolveDispute(match.id, "white")}
                            className="py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase transition-all"
                            title={`Award win to White (${match.white})`}
                          >
                            White Win
                          </button>
                          <button
                            onClick={() => onResolveDispute(match.id, "black")}
                            className="py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase transition-all"
                            title={`Award win to Black (${match.black})`}
                          >
                            Black Win
                          </button>
                          <button
                            onClick={() => onResolveDispute(match.id, "draw")}
                            className="py-1 rounded bg-slate-600 hover:bg-slate-500 text-white font-bold text-[10px] uppercase transition-all"
                            title="Declare Draw"
                          >
                            Draw
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Force score reporting option for organizers (if playing) */}
                    {!isPending && !isDisputed && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Admin Result override:
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onForceReport(match.id, "white")}
                            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-cyan-500/20"
                            title="Force White Win"
                          >
                            W Win
                          </button>
                          <button
                            onClick={() => onForceReport(match.id, "black")}
                            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-cyan-500/20"
                            title="Force Black Win"
                          >
                            B Win
                          </button>
                          <button
                            onClick={() => onForceReport(match.id, "draw")}
                            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-cyan-500/20"
                            title="Force Draw"
                          >
                            Draw
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Standings scoreboard + Offline enrollment */}
        <div className="space-y-6">
          {/* Standings list */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm uppercase">
                <Trophy className="h-4.5 w-4.5 text-amber-500" />
                <span>Arena Standings</span>
              </h3>
              <span className="text-[9px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded uppercase">
                {standings.length} Players
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
              {standings.map((player, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {player.name}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {player.wins}W / {player.draws}D / {player.losses}L
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {player.score.toFixed(1)}
                    </span>
                    <button
                      onClick={() => onKickPlayer(player.name)}
                      className="text-[10px] text-slate-400 hover:text-red-500 font-bold transition-colors"
                      title="Kick from Arena"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {standings.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  No players joined yet
                </div>
              )}
            </div>
          </div>

          {/* Add Offline Player Form */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase flex items-center gap-1.5 mb-3">
              <UserPlus className="h-4.5 w-4.5 text-cyan-500" />
              Enroll Offline Player
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Add players physically present who don't have a phone (e.g. guest, kid). You can referee their results.
            </p>
            <form onSubmit={handleAddOffline} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={offlineName}
                onChange={(e) => setOfflineName(e.target.value)}
                maxLength={15}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                required
              />
              <button
                type="submit"
                className="px-3.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Add
              </button>
            </form>

            {offlinePlayers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  Enrolled Offline:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {offlinePlayers.map((player, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      {player}
                      <button
                        onClick={() => onKickPlayer(player)}
                        className="hover:text-red-500 text-[9px] font-black"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Queue State */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase flex items-center gap-1.5 mb-2">
              <Swords className="h-4.5 w-4.5 text-cyan-500" />
              Queue Match Pool
            </h3>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">
              Currently waiting ({waitingQueue.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {waitingQueue.map((player, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/5 text-xs font-bold animate-pulse"
                >
                  {player}
                </span>
              ))}
              {waitingQueue.length === 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">Queue is empty</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
