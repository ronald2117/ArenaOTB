import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LoginModal } from "./components/LoginModal";
import { JoinView } from "./components/JoinView";
import { PlayerConsole } from "./components/PlayerConsole";
import { OrganizerConsole } from "./components/OrganizerConsole";
import { SimControlPanel } from "./components/SimControlPanel";

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

interface PlayerState {
  status: "idle" | "waiting" | "matched" | "playing" | "submitting" | "confirmed" | "disputed";
  matchId: string | null;
  opponentName: string | null;
  boardNumber: number | null;
  color: "White" | "Black" | null;
  myReportedResult: "win" | "loss" | "draw" | null;
  opponentStatus: "pending" | "accepted" | "reported";
}

const MOCK_OPPONENTS = [
  "ChessNinja", "QueenGambit", "RookStar", "PawnStormer", 
  "GMCarlsen", "KnightRider", "CheckmatePro", "BishopBash"
];

// JWT Decoding Helper
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function App() {
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
    return (localStorage.getItem("theme") as "dark" | "light" | "system") || "system";
  });

  // Authentication state
  const [user, setUser] = useState<{ username: string; isGuest: boolean } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // View state: 'join' | 'player' | 'organizer'
  const [currentView, setCurrentView] = useState<string>("join");

  // Arena session state
  const [arenaName, setArenaName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [timeControl, setTimeControl] = useState("");
  const [totalBoards, setTotalBoards] = useState(4);
  const [arenaActive, setArenaActive] = useState(false);

  // Standings, Active Matches, Queues, etc.
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [activeMatches, setActiveMatches] = useState<ActiveMatch[]>([]);
  const [waitingQueue, setWaitingQueue] = useState<string[]>([]);
  const [offlinePlayers, setOfflinePlayers] = useState<string[]>([]);

  // Current Player's OTB matchmaking state
  const [playerName, setPlayerName] = useState("");
  const [playerState, setPlayerState] = useState<PlayerState>({
    status: "idle",
    matchId: null,
    opponentName: null,
    boardNumber: null,
    color: null,
    myReportedResult: null,
    opponentStatus: "pending"
  });

  // Apply dark mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem("theme", theme);

    const applyTheme = () => {
      if (
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme();
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  // Load token on init to auto-authenticate
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("playerName");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
        const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email;
        
        if (role === "guest") {
          setUser({ username: name || "Guest Player", isGuest: true });
          setPlayerName(name || "Guest Player");
          setRoomCode("CHESS9");
          setArenaName("Friday Blitz Showdown");
          setTimeControl("3+2");
          setTotalBoards(4);
          setArenaActive(true);
          setStandings([
            { name: "GMCarlsen", score: 6.5, played: 8, wins: 6, draws: 1, losses: 1 },
            { name: "QueenGambit", score: 5.0, played: 7, wins: 4, draws: 2, losses: 1 },
            { name: "RookStar", score: 4.5, played: 8, wins: 4, draws: 1, losses: 3 },
            { name: name || "Guest Player", score: 0.0, played: 0, wins: 0, draws: 0, losses: 0 }
          ]);
          setCurrentView("player");
        } else {
          const username = email && email !== "guest" ? email.split("@")[0] : "Organizer";
          const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
          setUser({ username: capitalized, isGuest: false });
          
          setRoomCode("CHESS9");
          setArenaName("OTB Rapid & Blitz");
          setTimeControl("5+3");
          setTotalBoards(4);
          setArenaActive(true);
          setStandings([
            { name: "GMCarlsen", score: 4.5, played: 5, wins: 4, draws: 1, losses: 0 },
            { name: "QueenGambit", score: 3.5, played: 5, wins: 3, draws: 1, losses: 1 },
            { name: "RookStar", score: 2.0, played: 4, wins: 2, draws: 0, losses: 2 },
            { name: "PawnStormer", score: 1.0, played: 4, wins: 1, draws: 0, losses: 3 },
          ]);
          setWaitingQueue(["GMCarlsen", "QueenGambit", "RookStar", "PawnStormer"]);
          setCurrentView("organizer");
        }
      }
    }
  }, []);

  // Handle URL join queries (e.g. http://localhost:8080/?join=CHESS9)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get("join");
    if (joinCode) {
      setRoomCode(joinCode.toUpperCase());
    }
  }, []);

  // --- ACTIONS ---

  // User logs in as Organizer
  const handleLoginSuccess = (username: string, token: string) => {
    localStorage.setItem("authToken", token);
    setUser({ username, isGuest: false });
    // Go to join view ready to create
    setCurrentView("join");
  };

  // User logs out
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("playerName");
    setUser(null);
    setCurrentView("join");
    // Clear arena if they created one
    handleEndArena();
  };

  // Player joins an arena
  const handleJoinArena = async (code: string, nickname: string) => {
    setRoomCode(code);
    setPlayerName(nickname);

    // Call guest auth endpoint on backend
    try {
      const response = await fetch("http://localhost:5195/api/Auth/guest", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("playerName", nickname);
      }
    } catch (e) {
      console.warn("Could not retrieve guest token from backend, falling back to client-only mode.");
    }

    setUser({ username: nickname, isGuest: true });
    
    // Set up mock details if arena isn't initialized yet
    if (!arenaName) {
      setArenaName("Friday Blitz Showdown");
      setTimeControl("3+2");
      setTotalBoards(4);
      setArenaActive(true);
      
      // Populate with some default players in standings
      setStandings([
        { name: "GMCarlsen", score: 6.5, played: 8, wins: 6, draws: 1, losses: 1 },
        { name: "QueenGambit", score: 5.0, played: 7, wins: 4, draws: 2, losses: 1 },
        { name: "RookStar", score: 4.5, played: 8, wins: 4, draws: 1, losses: 3 },
        { name: nickname, score: 0.0, played: 0, wins: 0, draws: 0, losses: 0 }
      ]);
    } else {
      // Add player to standings if they aren't there
      if (!standings.some((p) => p.name === nickname)) {
        setStandings((prev) => [
          ...prev,
          { name: nickname, score: 0, played: 0, wins: 0, draws: 0, losses: 0 }
        ]);
      }
    }

    setPlayerState({
      status: "idle",
      matchId: null,
      opponentName: null,
      boardNumber: null,
      color: null,
      myReportedResult: null,
      opponentStatus: "pending"
    });
    
    setCurrentView("player");
  };

  const handleEnterQueue = () => {
    if (!waitingQueue.includes(playerName)) {
      setWaitingQueue((prev) => [...prev, playerName]);
    }
    setPlayerState((prev) => ({ ...prev, status: "waiting" }));
  };

  const handleLeaveQueue = () => {
    setWaitingQueue((prev) => prev.filter((name) => name !== playerName));
    setPlayerState((prev) => ({ ...prev, status: "idle" }));
  };

  const handleLeaveArena = () => {
    handleLeaveQueue();
    // Remove from standings
    setStandings((prev) => prev.filter((p) => p.name !== playerName));
    setRoomCode("");
    setPlayerName("");
    setUser(null);
    setCurrentView("join");
  };

  // Player accepts match pairing
  const handleAcceptMatch = () => {
    if (!playerState.matchId) return;

    setActiveMatches((prev) =>
      prev.map((m) => {
        if (m.id === playerState.matchId) {
          const updated = {
            ...m,
            whiteAccepted: m.white === playerName ? true : m.whiteAccepted,
            blackAccepted: m.black === playerName ? true : m.blackAccepted,
          };
          // If both have accepted now, set status to playing
          if (updated.whiteAccepted && updated.blackAccepted) {
            updated.status = "playing";
            // Update player state to playing
            setTimeout(() => {
              setPlayerState((p) => ({ ...p, status: "playing" }));
            }, 100);
          }
          return updated;
        }
        return m;
      })
    );
  };

  // Player reports score result
  const handleReportResult = (result: "win" | "loss" | "draw") => {
    if (!playerState.matchId) return;

    setPlayerState((prev) => ({
      ...prev,
      status: "submitting",
      myReportedResult: result
    }));

    setActiveMatches((prev) =>
      prev.map((m) => {
        if (m.id === playerState.matchId) {
          const isWhite = m.white === playerName;
          const updated = {
            ...m,
            whiteReport: isWhite ? result : m.whiteReport,
            blackReport: !isWhite ? result : m.blackReport,
          };

          // Check if both players have reported
          if (updated.whiteReport && updated.blackReport) {
            processMatchReports(updated);
          }
          return updated;
        }
        return m;
      })
    );
  };

  // Internal: Evaluates reported match scores
  const processMatchReports = (match: ActiveMatch) => {
    const wReport = match.whiteReport;
    const bReport = match.blackReport;

    // Standard Alignment Check: 
    // White Win + Black Loss = OK
    // White Loss + Black Win = OK
    // White Draw + Black Draw = OK
    const aligns =
      (wReport === "win" && bReport === "loss") ||
      (wReport === "loss" && bReport === "win") ||
      (wReport === "draw" && bReport === "draw");

    if (aligns) {
      resolveMatch(match.id, wReport === "win" ? "white" : wReport === "loss" ? "black" : "draw");
    } else {
      // Conflict! Enter Disputed State
      setActiveMatches((prev) =>
        prev.map((m) => (m.id === match.id ? { ...m, status: "disputed" } : m))
      );
      // Update player state to disputed if involved
      if (match.white === playerName || match.black === playerName) {
        setPlayerState((p) => ({ ...p, status: "disputed" }));
      }
    }
  };

  // Internal / Admin: Resolves a match and updates scores
  const resolveMatch = (matchId: string, result: "white" | "black" | "draw") => {
    setActiveMatches((prev) => {
      const match = prev.find((m) => m.id === matchId);
      if (!match) return prev;

      // Update Standings
      setStandings((standingsPrev) =>
        standingsPrev.map((p) => {
          let scoreAdd = 0;
          let w = 0, d = 0, l = 0;

          if (p.name === match.white) {
            if (result === "white") { scoreAdd = 1.0; w = 1; }
            else if (result === "black") { scoreAdd = 0.0; l = 1; }
            else { scoreAdd = 0.5; d = 1; }
            return {
              ...p,
              score: p.score + scoreAdd,
              played: p.played + 1,
              wins: p.wins + w,
              draws: p.draws + d,
              losses: p.losses + l
            };
          }

          if (p.name === match.black) {
            if (result === "black") { scoreAdd = 1.0; w = 1; }
            else if (result === "white") { scoreAdd = 0.0; l = 1; }
            else { scoreAdd = 0.5; d = 1; }
            return {
              ...p,
              score: p.score + scoreAdd,
              played: p.played + 1,
              wins: p.wins + w,
              draws: p.draws + d,
              losses: p.losses + l
            };
          }

          return p;
        })
      );

      // Sort Standings by score descending
      setTimeout(() => {
        setStandings((s) => [...s].sort((a, b) => b.score - a.score));
      }, 50);

      // If current player was involved, send them back into queue automatically
      if (match.white === playerName || match.black === playerName) {
        setPlayerState({
          status: "waiting", // Continuous Matchmaking auto-re-queue
          matchId: null,
          opponentName: null,
          boardNumber: null,
          color: null,
          myReportedResult: null,
          opponentStatus: "pending"
        });
        // Put player back in queue array
        setWaitingQueue((wq) => [...wq.filter((n) => n !== playerName), playerName]);
      } else {
        // If opponent was in queue, put them back
        if (!offlinePlayers.includes(match.white)) {
          setWaitingQueue((wq) => [...wq.filter((n) => n !== match.white), match.white]);
        }
        if (!offlinePlayers.includes(match.black)) {
          setWaitingQueue((wq) => [...wq.filter((n) => n !== match.black), match.black]);
        }
      }

      // Remove match from active list
      return prev.filter((m) => m.id !== matchId);
    });
  };

  // --- ORGANIZER ACTIONS ---

  const handleCreateArena = (name: string, boards: number, tc: string) => {
    setArenaName(name);
    setTotalBoards(boards);
    setTimeControl(tc);
    setRoomCode("CHESS9");
    setArenaActive(true);

    // Initial mock standings
    setStandings([
      { name: "GMCarlsen", score: 4.5, played: 5, wins: 4, draws: 1, losses: 0 },
      { name: "QueenGambit", score: 3.5, played: 5, wins: 3, draws: 1, losses: 1 },
      { name: "RookStar", score: 2.0, played: 4, wins: 2, draws: 0, losses: 2 },
      { name: "PawnStormer", score: 1.0, played: 4, wins: 1, draws: 0, losses: 3 },
    ]);

    setWaitingQueue(["GMCarlsen", "QueenGambit", "RookStar", "PawnStormer"]);
    setCurrentView("organizer");
  };

  const handleToggleArenaActive = () => {
    setArenaActive(!arenaActive);
  };

  const handleAddOfflinePlayer = (name: string) => {
    if (offlinePlayers.includes(name) || standings.some((p) => p.name === name)) return;
    setOfflinePlayers((prev) => [...prev, name]);
    setStandings((prev) => [
      ...prev,
      { name, score: 0.0, played: 0, wins: 0, draws: 0, losses: 0 }
    ]);
    // Add to matchmaking waiting pool immediately
    setWaitingQueue((prev) => [...prev, name]);
  };

  const handleKickPlayer = (name: string) => {
    setStandings((prev) => prev.filter((p) => p.name !== name));
    setWaitingQueue((prev) => prev.filter((n) => n !== name));
    setOfflinePlayers((prev) => prev.filter((n) => n !== name));
    // If kicked player is playing, cancel match
    setActiveMatches((prev) => prev.filter((m) => m.white !== name && m.black !== name));

    if (name === playerName) {
      handleLeaveArena();
    }
  };

  const handleResolveDispute = (matchId: string, result: "white" | "black" | "draw") => {
    resolveMatch(matchId, result);
  };

  const handleForceReport = (matchId: string, result: "white" | "black" | "draw") => {
    resolveMatch(matchId, result);
  };

  const handleEndArena = () => {
    setArenaName("");
    setRoomCode("");
    setTimeControl("");
    setTotalBoards(4);
    setArenaActive(false);
    setStandings([]);
    setActiveMatches([]);
    setWaitingQueue([]);
    setOfflinePlayers([]);
    setPlayerState({
      status: "idle",
      matchId: null,
      opponentName: null,
      boardNumber: null,
      color: null,
      myReportedResult: null,
      opponentStatus: "pending"
    });
    setCurrentView("join");
  };

  // --- SIMULATION TRIGGERS ---

  // Simulator adds random players
  const handleSimulateOpponentJoin = () => {
    const available = MOCK_OPPONENTS.filter(
      (name) => !standings.some((p) => p.name === name) && name !== playerName
    );

    if (available.length === 0) return;

    const newOpp = available[Math.floor(Math.random() * available.length)];
    setStandings((prev) => [
      ...prev,
      { name: newOpp, score: 0.0, played: 0, wins: 0, draws: 0, losses: 0 }
    ]);
    if (arenaActive) {
      setWaitingQueue((prev) => [...prev, newOpp]);
    }
  };

  // Simulator forces matchmaking pairing
  const handleSimulatePairing = () => {
    if (playerState.status !== "waiting") return;

    // Pick opponent from waiting queue
    const pool = waitingQueue.filter((n) => n !== playerName);
    if (pool.length === 0) return;

    const opp = pool[0];
    
    // Find empty board
    const boardsInUse = activeMatches.map((m) => m.board);
    let boardNum = 1;
    while (boardsInUse.includes(boardNum) && boardNum <= totalBoards) {
      boardNum++;
    }

    if (boardNum > totalBoards) {
      alert("All physical boards are currently occupied!");
      return;
    }

    const matchId = `match_${Date.now()}`;
    const myColor = Math.random() > 0.5 ? "White" : "Black";
    
    const newMatch: ActiveMatch = {
      id: matchId,
      board: boardNum,
      white: myColor === "White" ? playerName : opp,
      black: myColor === "Black" ? playerName : opp,
      status: "pending",
      whiteAccepted: false,
      blackAccepted: false
    };

    // Remove both players from waiting queue
    setWaitingQueue((prev) => prev.filter((n) => n !== playerName && n !== opp));

    // Update state
    setActiveMatches((prev) => [...prev, newMatch]);
    setPlayerState({
      status: "matched",
      matchId,
      opponentName: opp,
      boardNumber: boardNum,
      color: myColor,
      myReportedResult: null,
      opponentStatus: "pending"
    });
  };

  // Simulator makes opponent accept
  const handleSimulateOpponentAccept = () => {
    if (playerState.status !== "matched" || !playerState.matchId) return;

    setPlayerState((prev) => ({ ...prev, opponentStatus: "accepted" }));

    setActiveMatches((prev) =>
      prev.map((m) => {
        if (m.id === playerState.matchId) {
          const isWhite = m.white === playerState.opponentName;
          const updated = {
            ...m,
            whiteAccepted: isWhite ? true : m.whiteAccepted,
            blackAccepted: !isWhite ? true : m.blackAccepted
          };
          if (updated.whiteAccepted && updated.blackAccepted) {
            updated.status = "playing";
            setTimeout(() => {
              setPlayerState((p) => ({ ...p, status: "playing" }));
            }, 100);
          }
          return updated;
        }
        return m;
      })
    );
  };

  // Simulator makes opponent report score
  const handleSimulateOpponentReport = (oppResult: "win" | "loss" | "draw") => {
    if (!playerState.matchId) return;

    setActiveMatches((prev) =>
      prev.map((m) => {
        if (m.id === playerState.matchId) {
          const isWhite = m.white === playerState.opponentName;
          const updated = {
            ...m,
            whiteReport: isWhite ? oppResult : m.whiteReport,
            blackReport: !isWhite ? oppResult : m.blackReport
          };

          // If current player has already reported, evaluate reports
          if (playerState.status === "submitting" && playerState.myReportedResult) {
            const wReport = updated.whiteReport;
            const bReport = updated.blackReport;

            const aligns =
              (wReport === "win" && bReport === "loss") ||
              (wReport === "loss" && bReport === "win") ||
              (wReport === "draw" && bReport === "draw");

            if (aligns) {
              resolveMatch(updated.id, wReport === "win" ? "white" : wReport === "loss" ? "black" : "draw");
            } else {
              updated.status = "disputed";
              setPlayerState((p) => ({ ...p, status: "disputed" }));
            }
          } else {
            setPlayerState((p) => ({ ...p, opponentStatus: "reported" }));
          }

          return updated;
        }
        return m;
      })
    );
  };

  // Simulator resolves dispute
  const handleSimulateOrganizerResolve = (winner: "player" | "opponent" | "draw") => {
    if (playerState.status !== "disputed" || !playerState.matchId) return;

    let res: "white" | "black" | "draw" = "draw";
    if (winner === "player") {
      res = playerState.color === "White" ? "white" : "black";
    } else if (winner === "opponent") {
      res = playerState.color === "White" ? "black" : "white";
    }

    resolveMatch(playerState.matchId, res);
  };

  // Simulator resets all variables
  const handleResetSimulation = () => {
    handleEndArena();
  };

  return (
    <div className="min-h-screen bg-grid transition-colors duration-300">
      <Navbar
        theme={theme}
        setTheme={setTheme}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        setCurrentView={setCurrentView}
      />

      <main className="pb-24">
        {currentView === "join" && (
          <JoinView
            user={user}
            onJoinArena={handleJoinArena}
            onLoginClick={() => setIsLoginOpen(true)}
            onCreateArenaClick={() => {
              if (user && !user.isGuest) {
                setCurrentView("organizer");
              } else {
                setIsLoginOpen(true);
              }
            }}
          />
        )}

        {currentView === "player" && (
          <PlayerConsole
            roomCode={roomCode}
            arenaName={arenaName}
            timeControl={timeControl}
            playerName={playerName}
            playerState={playerState}
            standings={standings}
            activeMatchesCount={activeMatches.length}
            totalBoards={totalBoards}
            onAcceptMatch={handleAcceptMatch}
            onReportResult={handleReportResult}
            onEnterQueue={handleEnterQueue}
            onLeaveQueue={handleLeaveQueue}
            onLeaveArena={handleLeaveArena}
          />
        )}

        {currentView === "organizer" && (
          <OrganizerConsole
            arenaName={arenaName}
            roomCode={roomCode}
            timeControl={timeControl}
            totalBoards={totalBoards}
            arenaActive={arenaActive}
            standings={standings}
            activeMatches={activeMatches}
            waitingQueue={waitingQueue}
            offlinePlayers={offlinePlayers}
            onCreateArena={handleCreateArena}
            onToggleArenaActive={handleToggleArenaActive}
            onAddOfflinePlayer={handleAddOfflinePlayer}
            onKickPlayer={handleKickPlayer}
            onResolveDispute={handleResolveDispute}
            onForceReport={handleForceReport}
            onEndArena={handleEndArena}
            onBackToHome={() => setCurrentView("join")}
          />
        )}
      </main>

      {/* Login Portal Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Interactive Simulation Engine Widget */}
      {roomCode && (
        <SimControlPanel
          playerState={playerState}
          arenaActive={arenaActive}
          onSimulateOpponentJoin={handleSimulateOpponentJoin}
          onSimulatePairing={handleSimulatePairing}
          onSimulateOpponentAccept={handleSimulateOpponentAccept}
          onSimulateOpponentReport={handleSimulateOpponentReport}
          onSimulateOrganizerResolve={handleSimulateOrganizerResolve}
          onResetSimulation={handleResetSimulation}
        />
      )}
    </div>
  );
}

export default App;
