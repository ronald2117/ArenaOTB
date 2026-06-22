import React from "react";
import { Moon, Sun, Monitor, LogIn, LogOut, Swords, User } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light" | "system";
  setTheme: (theme: "dark" | "light" | "system") => void;
  user: {
    username: string;
    isGuest: boolean;
    avatar?: string;
  } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  user,
  onLoginClick,
  onLogoutClick,
  setCurrentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 glass-panel transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <div 
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
          onClick={() => setCurrentView("join")}
        >
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-cyan-500 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200 dark:bg-cyan-600 dark:shadow-cyan-900/30">
            <Swords className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              OTB <span className="text-cyan-500 dark:text-cyan-400">ARENA</span>
            </h1>
            <div className="hidden sm:flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Local Matchmaker
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Selector Dropdown / Button group */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <button
              onClick={() => setTheme("light")}
              className={`p-1 sm:p-1.5 rounded-md transition-all ${
                theme === "light"
                  ? "bg-white text-cyan-600 shadow-sm dark:bg-slate-700 dark:text-cyan-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title="Light Mode"
            >
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1 sm:p-1.5 rounded-md transition-all ${
                theme === "dark"
                  ? "bg-white text-cyan-600 shadow-sm dark:bg-slate-700 dark:text-cyan-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title="Dark Mode"
            >
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-1 sm:p-1.5 rounded-md transition-all ${
                theme === "system"
                  ? "bg-white text-cyan-600 shadow-sm dark:bg-slate-700 dark:text-cyan-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title="System Default"
            >
              <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.username}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.isGuest ? "Guest Player" : "Organizer"}
                </span>
              </div>
              <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-200 border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                <User className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <button
                onClick={onLogoutClick}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Sign Out"
              >
                <LogOut className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:space-x-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/10 hover:shadow-cyan-600/20 active:scale-95 transition-all duration-150 dark:bg-cyan-700 dark:hover:bg-cyan-600"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Organizer Sign In</span>
              <span className="inline sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
