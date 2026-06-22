import React, { useState } from "react";
import { QrCode, Keyboard, Play, Sparkles, AlertCircle } from "lucide-react";

interface JoinViewProps {
  user: { username: string; isGuest: boolean } | null;
  onJoinArena: (roomCode: string, nickname: string) => void;
  onLoginClick: () => void;
  onCreateArenaClick: () => void;
}

export const JoinView: React.FC<JoinViewProps> = ({
  user,
  onJoinArena,
  onLoginClick,
  onCreateArenaClick,
}) => {
  const [joinMode, setJoinMode] = useState<"code" | "qr">("code");
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState(user?.isGuest ? user.username : "");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomCode || roomCode.trim().length < 4) {
      setError("Please enter a valid room code (at least 4 characters).");
      return;
    }

    const finalNickname = nickname.trim() || `Player_${Math.floor(1000 + Math.random() * 9000)}`;
    onJoinArena(roomCode.toUpperCase().trim(), finalNickname);
  };

  const simulateQRScan = () => {
    setIsScanning(true);
    setError("");
    
    // Simulate a scanner taking 2 seconds to find a code
    setTimeout(() => {
      setIsScanning(false);
      setRoomCode("CHESS9");
      setJoinMode("code");
      
      const finalNickname = nickname.trim() || `Player_${Math.floor(1000 + Math.random() * 9000)}`;
      onJoinArena("CHESS9", finalNickname);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/5">
          <Sparkles className="h-3.5 w-3.5" />
          Play chess in a physical arena
        </span>
        <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl uppercase">
          Enter The <span className="text-cyan-500 dark:text-cyan-400">OTB Arena</span>
        </h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Scan the projector's QR code or enter the invite room code to join the live matchmaking queue.
        </p>
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90 glass-panel">
        {/* Toggle Mode */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setJoinMode("code");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
              joinMode === "code"
                ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            <Keyboard className="h-4.5 w-4.5" />
            <span>Enter Room Code</span>
          </button>
          <button
            onClick={() => {
              setJoinMode("qr");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all ${
              joinMode === "qr"
                ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            <QrCode className="h-4.5 w-4.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {joinMode === "code" ? (
            <form onSubmit={handleJoin} className="space-y-6">
              {/* Nickname */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1. Pick a Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GarryKasparov"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-base text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                />
              </div>

              {/* Room Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  2. Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  placeholder="CHESS9"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-4 px-4 text-center text-2xl font-extrabold tracking-widest text-slate-900 uppercase outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all placeholder:opacity-30 placeholder:tracking-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-base font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-600/10 hover:bg-cyan-500 hover:shadow-cyan-600/20 active:scale-[0.98] transition-all dark:bg-cyan-700 dark:hover:bg-cyan-600"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Join Matchmaking</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Nickname input in QR mode too */}
              <div className="w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1. Pick a Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GarryKasparov"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-base text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400 transition-all font-semibold"
                />
              </div>

              {/* QR scanner simulation */}
              <div className="relative w-64 h-64 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center">
                {/* Laser scan line */}
                {isScanning && (
                  <div className="absolute left-0 right-0 h-1 bg-cyan-500 dark:bg-cyan-400 shadow-md shadow-cyan-500/50 animate-scan-line z-10" />
                )}

                {/* Cyber corner marks */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

                {isScanning ? (
                  <div className="text-center text-xs font-semibold text-cyan-600 dark:text-cyan-400 space-y-3">
                    <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto" />
                    <p className="animate-pulse tracking-wide">SCANNING STREAM...</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <QrCode className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-700 animate-pulse" />
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Position QR code on screen
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={simulateQRScan}
                disabled={isScanning}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-base font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-600/10 hover:bg-cyan-500 hover:shadow-cyan-600/20 disabled:bg-slate-400 disabled:shadow-none dark:bg-cyan-700 dark:hover:bg-cyan-600 transition-all"
              >
                <span>{isScanning ? "Scanning..." : "Simulate QR Scan"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        {user && !user.isGuest ? (
          <button
            onClick={onCreateArenaClick}
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
          >
            Go to Organizer Console →
          </button>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Are you a tournament director?{" "}
            <button
              onClick={onLoginClick}
              className="font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
            >
              Sign In
            </button>{" "}
            to create a new arena session.
          </p>
        )}
      </div>
    </div>
  );
};
