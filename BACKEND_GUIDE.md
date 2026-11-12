# AcademiaAI: Backend Server & Architecture

## Overview
The backend is written in pure **JavaScript** using the standard **Node.js runtime (`http`, `fs`, `path`, `url`)** without needing external dependencies (`npm install` is not required!).

It provides:
1. **RESTful APIs** for managing:
   - Study sessions (`/api/logs`)
   - Assignments & Deadlines (`/api/assignments`)
   - Subjects & Confidence ratings (`/api/subjects`)
   - Full state snapshot (`/api/state`)
2. **AI Blind Spot Cognitive Diagnostic Engine** (`/api/ai/diagnostics`):
   - Computes subject neglect indices, urgency mismatch (impending high-stakes exams vs prep time), knowledge decay curves (Ebbinghaus memory decay alerts), and comfort-zone monopolies.
3. **Static Web Server**:
   - Automatically serves `index.html`, `api-client.js`, and static assets directly at `http://localhost:3000`.
4. **Data Persistence**:
   - Saves all records into `data/academic_data.json` with automatic fallback and schema initialization.

---

## How to Start the JavaScript Backend

### If Node.js is installed on your system:
Open PowerShell or Command Prompt in this folder and run:
```powershell
node server.js
```
The server will start at:
```
http://localhost:3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser!

### Installing Node.js (If not already installed)
If running `node server.js` says *The term 'node' is not recognized*:
1. Download Node.js (LTS version) from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer (takes ~1 minute).
3. Open your terminal in this directory and run:
   ```powershell
   node server.js
   ```

---

## Dual-Mode Architecture (Client + Server Hybrid)
The web client (`api-client.js`) features **automatic dual-mode operation**:
- **With Backend Running (`node server.js`)**: Real-time HTTP REST calls write to `data/academic_data.json` on the server.
- **Without Backend / Standalone (`index.html` opened directly)**: Seamlessly operates offline using the browser's `localStorage` engine with zero errors or disruption.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/state` | Returns all subjects, study logs, assignments, and AI diagnostics |
| `GET` | `/api/ai/diagnostics` | Runs cognitive blind spot diagnostic analysis |
| `GET` | `/api/logs` | Fetch all logged study sessions |
| `POST` | `/api/logs` | Record a new study session (`subjectId`, `date`, `hours`, `topics`, `notes`) |
| `DELETE` | `/api/logs/:id` | Remove a study session |
| `GET` | `/api/assignments` | Fetch all due assignments |
| `POST` | `/api/assignments` | Create a new assignment (`title`, `subjectId`, `dueDate`, `estHours`, `priority`) |
| `PUT` | `/api/assignments/:id` | Update assignment details or toggle completion status |
| `DELETE` | `/api/assignments/:id` | Remove an assignment |
| `POST` | `/api/subjects` | Add a new academic subject |
| `PUT` | `/api/subjects/:id/confidence` | Update confidence rating (1 to 5) |
| `DELETE` | `/api/subjects/:id` | Delete a subject |
| `POST` | `/api/reset` | Restore demo dataset |
