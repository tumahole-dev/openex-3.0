# OpenEx 3.0

A simulated crypto exchange built for the CAPACITI AI Bootcamp capstone — a Kotlin/Spring Boot matching engine with a double-entry ledger, a React trading terminal, and a local AI assistant that reads (never trades) your wallet.

## Architecture

| Service | Tech | Purpose |
|---|---|---|
| `backend` | Kotlin, Spring Boot, PostgreSQL, Flyway | Auth, ledger, matching engine, WebSocket order book |
| `frontend` | React, Vite | Trading terminal UI |
| `ai-agent` | Python, Flask, LangChain, Ollama | Market data simulator + wallet-reading chat assistant |

## Running the full stack (Docker)

```bash
docker compose up --build
```

First time only, pull an AI model into the running Ollama container:
```bash
docker compose exec ollama ollama pull llama3.2:3b
```
(or `llama3.1` on a machine with more RAM — see `ai-agent/agent.py`)

Then open http://localhost:5173

## Running natively (development)

**Backend** (needs a local Postgres — see `backend/src/main/resources/application.properties`):
```bash
cd backend
./gradlew bootRun
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**AI agent** (needs Ollama installed locally, and a model pulled — `ollama pull llama3.2:3b`):
```bash
cd ai-agent
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
python app.py
```

## Testing

```bash
cd backend
./gradlew test
```

## Known limitations

- Docker requires WSL2 and virtualization support enabled; confirmed working on Windows 11 with an Intel Celeron N4500, 8GB RAM, after running `wsl --install`.
- The in-memory order book resets on backend restart (orders persist in the database, but resting/unfilled orders won't re-populate the live book automatically).
- Local Postgres passwords and the Ollama model name in `ai-agent/agent.py` are machine-specific and intentionally not committed — see comments in `application.properties`.

## Project structure
