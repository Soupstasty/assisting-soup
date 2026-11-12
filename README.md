# AcademiaAI: Academic Tracker & AI Blind Spot Intelligence

An academic tracking web application designed to track hours studied per subject per day, monitor due assignments, and deploy cognitive AI diagnostics to detect learning blind spots, retention decay, and deadline cramming risks.

## Features

1. **Hours Studied per Subject per Day**
   - Interactive 7-day stacked study bar chart visualizing subject time distributions.
   - Comprehensive study logging with subjects, hours, topics covered, and difficulty notes.
   - Built-in Pomodoro/Stopwatch focus timer with direct 1-click log recording.
   - Dynamic subject breakdown doughnut chart.

2. **Due Assignments & Deadlines**
   - Filter by pending and completed assignments.
   - Dynamic countdown indicators (`Due Today`, `Due Tomorrow`, `Due in X days`, `Overdue`).
   - Priority tagging (`High`, `Medium`, `Low`) and estimated preparation hours.

3. **AI Learning Blind Spot Intelligence**
   - **Algorithmic Cognitive Diagnostics** (Runs locally, zero setup needed):
     - **Deadline Collision & Cramming Risk**: Detects impending assignments/exams with zero recent study.
     - **Chronic Neglect Detection**: Compares subject velocity against peer expectations.
     - **High Anxiety & Confidence Mismatches**: Cross-checks student self-confidence ratings against study allocation.
     - **Memory Decay (Ebbinghaus Curve)**: Flags topics without retrieval practice in over 5 days.
     - **Comfort-Zone Trap**: Detects over-indexing (>55% of time) on one favorite subject while starving difficult subjects.
   - **Gemini API Integration (Optional)**: Connect your Gemini API Key directly in the UI for LLM-powered strategic academic coaching and tailored 48-hour battle plans.

4. **Persistence & Portability**
   - Automatic `localStorage` saving.
   - Full JSON Export and Import capabilities.
   - Pre-loaded with realistic demo data for immediate testing.
   - Responsive design with Dark Mode & Light Mode support.

## How to Run

Simply open `index.html` in your web browser (double-click `index.html` or drag it into Chrome/Edge/Firefox).
