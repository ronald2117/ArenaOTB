import React, { useState } from "react";
import { Sliders, UserPlus, Play, AlertCircle, PlayCircle, RefreshCw } from "lucide-react";

interface SimControlPanelProps {
  playerState: {
    status: "idle" | "waiting" | "matched" | "playing" | "submitting" | "confirmed" | "disputed";
    opponentName: string | null;
    boardNumber: number | null;
    color: "White" | "Black" | null;
    myReportedResult: "win" | "loss" | "draw" | null;
  };
  arenaActive: boolean;
  onSimulateOpponentJoin: () => void;
  onSimulatePairing: () => void;
  onSimulateOpponentAccept: () => void;
  onSimulateOpponentReport: (result: "win" | "loss" | "draw") => void;
  onSimulateOrganizerResolve: (winner: "player" | "opponent" | "draw") => void;
  onResetSimulation: () => void;
}

export const SimControlPanel: React.FC<SimControlPanelProps> = ({
  playerState,
  arenaActive,
  onSimulateOpponentJoin,
  onSimulatePairing,
  onSimulateOpponentAccept,
  onSimulateOpponentReport,
  onSimulateOrganizerResolve,
  onResetSimulation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg glow-gold transition-all duration-150"
      >
        <Sliders className="h-4 w-4" />
        <span>SIM CONTROL PANEL</span>
      </button>

      {/* Floating Card */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl overflow-hidden glow-gold p-4 mt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h3 className="font-display font-bold text-amber-400 text-sm tracking-wider uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4" /> Simulation Engine
            </h3>
            <button
              onClick={onResetSimulation}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset All Arena Data"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Arena Status */}
            <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg">
              <span className="text-slate-400 font-semibold">Arena State:</span>
              <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                arenaActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {arenaActive ? "Active" : "Paused"}
              </span>
            </div>

            {/* Player Status */}
            <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg">
              <span className="text-slate-400 font-semibold">Player State:</span>
              <span className="text-cyan-400 font-bold uppercase">{playerState.status}</span>
            </div>

            <div className="border-t border-slate-800 my-2 pt-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Available Actions
            </div>

            {/* Step 1: Add Opponent */}
            <button
              onClick={onSimulateOpponentJoin}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="h-3.5 w-3.5 text-amber-400" />
                Simulate Player Joining
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Add players</span>
            </button>

            {/* Step 2: Trigger Pairing */}
            <button
              onClick={onSimulatePairing}
              disabled={playerState.status !== "waiting"}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5 text-cyan-400" />
                Find Match Pairing
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Needs "waiting"</span>
            </button>

            {/* Step 3: Simulate Opponent Accepting */}
            <button
              onClick={onSimulateOpponentAccept}
              disabled={playerState.status !== "matched"}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                Opponent Accepts Match
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Needs "matched"</span>
            </button>

            {/* Step 4: Opponent Reports Scores */}
            <div className="p-2.5 bg-slate-950 rounded-lg space-y-2">
              <span className="block text-slate-400 font-semibold mb-1">Simulate Opponent Reports:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onSimulateOpponentReport("win")}
                  disabled={playerState.status !== "playing" && playerState.status !== "submitting"}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                >
                  Win (White)
                </button>
                <button
                  onClick={() => onSimulateOpponentReport("loss")}
                  disabled={playerState.status !== "playing" && playerState.status !== "submitting"}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                >
                  Loss (Black)
                </button>
                <button
                  onClick={() => onSimulateOpponentReport("draw")}
                  disabled={playerState.status !== "playing" && playerState.status !== "submitting"}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                >
                  Draw
                </button>
              </div>
              <span className="block text-[9px] text-slate-500">
                Tip: Report a result on opponent that disagrees with the player's reported result to trigger a Dispute!
              </span>
            </div>

            {/* Step 5: Organizer Resolves Dispute */}
            <div className="p-2.5 bg-slate-950 rounded-lg space-y-2">
              <span className="block text-slate-400 font-semibold mb-1 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Dispute Resolution:
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onSimulateOrganizerResolve("player")}
                  disabled={playerState.status !== "disputed"}
                  className="py-1.5 px-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                  title="Award point to player"
                >
                  Player Win
                </button>
                <button
                  onClick={() => onSimulateOrganizerResolve("opponent")}
                  disabled={playerState.status !== "disputed"}
                  className="py-1.5 px-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                  title="Award point to opponent"
                >
                  Opponent Win
                </button>
                <button
                  onClick={() => onSimulateOrganizerResolve("draw")}
                  disabled={playerState.status !== "disputed"}
                  className="py-1.5 px-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-center hover:text-white"
                  title="Declare Draw"
                >
                  Draw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
