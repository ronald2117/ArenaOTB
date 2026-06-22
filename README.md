# OTB Arena

OTB Arena is a real-time management system for physical chess arenas. The platform is designed for organizers running local blitz and rapid events, and it supports live pairing, board management, score tracking, and phone-optional player participation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Design Notes](#design-notes)
- [MVP Scope](#mvp-scope)

## Features

- Continuous arena matchmaking with score-based pairings
- Physical board state management and limited-board handling
- Live updates via SignalR for standings, matches, and queue state
- Organizer controls for pause/resume, manual results, and dispute resolution
- Player support for phone-based join plus organizer-managed offline players
- Responsive UI for desktop, tablet, and mobile

## Tech Stack

- Frontend: React + Tailwind CSS
- Backend: ASP.NET Core Web API
- Realtime: SignalR
- Database: SQLite / LocalDB for MVP

## Getting Started

### Backend

```powershell
cd backend\ArenaOtbApi
dotnet run
```

### Frontend

```powershell
cd frontend\ArenaOtbFrontend
npm install
npm run dev
```

### Configuration

If needed, update the backend settings in `backend/ArenaOtbApi/appsettings.json` or `appsettings.Development.json`.

## Usage

- Organizers create and manage arenas, boards, and player flow.
- Players join using a room code or QR code.
- Matches require acceptance by both players; the organizer can accept for offline participants.
- Results are confirmed by both players, with manual dispute resolution available.

## Project Structure

- `backend/ArenaOtbApi`: ASP.NET Core Web API project
- `frontend/ArenaOtbFrontend`: React front-end application

## Design Notes

- Arena sessions are continuous, not Swiss-style tournaments.
- Boards are treated as limited physical resources with defined states.
- Player states include waiting, matched, playing, paused, and offline.
- Matches progress through pending, active, confirmed, and disputed states.

## MVP Scope

This repository focuses on an MVP for local chess arenas. The MVP excludes:

- Swiss pairing
- online gameplay
- engine integration
- advanced ratings
- anti-cheat systems
- cloud scaling

The goal is a usable organizer-driven arena system for local events with practical offline-friendly deployment.
