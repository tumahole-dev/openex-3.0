# OpenEX 3.0

OpenEX 3.0 is a web-based trading/exchange prototype with a React + Vite frontend and a Kotlin/Gradle backend. It provides user registration, login, a simple trading page and an order book UI. The project is organized as a two-part application so you can develop and run the front and back ends independently.

## Key features
- React + Vite single-page frontend with pages for Login, Register, Dashboard, Trading, and an Order Book.
- Kotlin + Gradle backend (JVM) with an application.properties configuration (typical Spring Boot-style layout).
- Simple API client module in the frontend for calling backend endpoints.

## Stack
- Language(s): Kotlin (backend), JavaScript (frontend; React)
- Framework / runtime:
  - Frontend: React (Vite)
  - Backend: Kotlin on the JVM (Gradle build; application.properties present)
- Notable libraries/tools:
  - Vite, React (frontend)
  - Gradle / Kotlin JVM (backend)
  - Typical web tooling: ESLint, npm / package-lock.json

## Repository layout
```
backend/                 Kotlin/JVM backend (Gradle project)
  build.gradle.kts       Gradle Kotlin DSL build file
  gradle/                Gradle wrapper support
  gradlew                Gradle wrapper (UNIX)
  gradlew.bat            Gradle wrapper (Windows)
  src/
    main/
      kotlin/            Kotlin source (application code)
      resources/
        application.properties  App configuration (DB, ports, etc.)
frontend/                React + Vite frontend
  package.json           npm scripts and dependencies
  vite.config.js         Vite configuration
  src/
    main.jsx             Frontend entry
    App.jsx              Top-level React app
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Trading.jsx
    OrderBook.jsx
    api.js               Frontend API helper
  public/                Static assets
README.md                This file
```

How it fits together:
- The frontend (Vite + React) serves the UI and uses the api.js module to call HTTP endpoints exposed by the backend.
- The backend is a Gradle-managed Kotlin application with configuration under src/main/resources/application.properties. In development each part can be started separately; the frontend talks to the backend over HTTP (localhost ports).

## Quick start — development

Prerequisites:
- Node.js + npm (for frontend)
- JDK 11+ (or matching project JDK) and Gradle (the project includes the Gradle wrapper)
- Git

1) Start the backend
- From repository root:
```bash
cd backend
# make executable if necessary
./gradlew build
# run the app (common for Spring Boot-style Gradle projects)
./gradlew bootRun
```
If the project does not use the Spring Boot plugin, use `./gradlew run` or the appropriate task defined in `build.gradle.kts`.

2) Start the frontend
```bash
cd frontend
npm install
npm run dev
```
- Vite's dev server typically runs on http://localhost:5173
- Backend commonly runs on http://localhost:8080 — adjust frontend API base URL in `frontend/src/api.js` if different.

3) Build for production
- Backend:
```bash
cd backend
./gradlew build
# produced artifact in build/libs/
```
- Frontend:
```bash
cd frontend
npm run build
# serve with your preferred static server or integrate with backend
```

## Configuration / environment
- Backend configuration lives in `backend/src/main/resources/application.properties`. Common entries to provide or override:
  - Server port (e.g., `server.port=8080`)
  - Database connection (e.g., `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`) if a DB is used
  - JWT / auth secrets (if implemented)
- Frontend API base URL is controlled in `frontend/src/api.js` — set it to point at your running backend (http://localhost:8080 or similar).

## Development notes
- Frontend files of interest: `src/main.jsx`, `src/App.jsx`, `src/Trading.jsx`, `src/OrderBook.jsx`, `src/api.js`.
- Backend entrypoints and service code are under `backend/src/main/kotlin` (package layout). `application.properties` holds configuration.
- ESLint config is present at `frontend/eslint.config.js`.

## Testing
- Backend tests (if present) can be run with:
```bash
cd backend
./gradlew test
```
- Frontend tests (if configured) are run via npm scripts in `frontend/package.json`:
```bash
cd frontend
npm test
```

## Contributing
- Open issues and PRs are welcome. Please:
  - Add a clear description of the change and why it is needed.
  - Run linters and existing tests before submitting.
  - Provide small, focused commits.

## Missing / recommended improvements
- Add a top-level LICENSE file (none detected in the repository root).
- Add a root-level README in the backend with exact run/build instructions if the Gradle tasks differ from the common ones.
- Provide a `.env.example` or docs describing required environment variables for production.

## Questions (help me prioritize)
- Should the backend expose CORS and an API base path that the frontend will use in production (e.g., `/api`)? See `frontend/src/api.js`.
- Which database and migrations (if any) should the backend use? Check `backend/src/main/resources/application.properties`.
- Do you want a combined Docker Compose to run frontend + backend together for local development?

---
If you’d like, I can open a branch and add this README.md to the repo with the standard license and a simple docker-compose to run both services together.
```
