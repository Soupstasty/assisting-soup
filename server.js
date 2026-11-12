const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'academic_data.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default initial dataset
const DEFAULT_DATA = {
  subjects: [
    { id: 'sub-1', name: 'Mathematics (Calculus III)', color: '#3b82f6', confidence: 2 },
    { id: 'sub-2', name: 'Computer Science (Algorithms)', color: '#8b5cf6', confidence: 4 },
    { id: 'sub-3', name: 'Physics (Electromagnetism)', color: '#f59e0b', confidence: 2 },
    { id: 'sub-4', name: 'Organic Chemistry', color: '#10b981', confidence: 1 },
    { id: 'sub-5', name: 'Academic Writing & History', color: '#ec4899', confidence: 5 }
  ],
  studyLogs: [
    { id: 'log-1', subjectId: 'sub-2', date: getDateOffset(-6), hours: 3.5, topics: 'Graph Theory & Dijkstra', notes: 'Mastered shortest paths' },
    { id: 'log-2', subjectId: 'sub-5', date: getDateOffset(-5), hours: 2.0, topics: 'Essay Draft Revision', notes: 'Drafted introduction' },
    { id: 'log-3', subjectId: 'sub-2', date: getDateOffset(-4), hours: 4.0, topics: 'Dynamic Programming (Knapsack)', notes: 'Solved 4 problems' },
    { id: 'log-4', subjectId: 'sub-1', date: getDateOffset(-3), hours: 1.0, topics: 'Multiple Integrals intro', notes: 'Found spherical coords confusing' },
    { id: 'log-5', subjectId: 'sub-2', date: getDateOffset(-2), hours: 3.0, topics: 'Bellman-Ford & Floyd-Warshall', notes: 'Reviewed complexities' },
    { id: 'log-6', subjectId: 'sub-5', date: getDateOffset(-1), hours: 2.5, topics: 'Peer Review & Citations', notes: 'Finished citations' },
    { id: 'log-7', subjectId: 'sub-1', date: getDateOffset(0), hours: 1.5, topics: 'Surface integrals practice', notes: 'Need more practice with Green theorem' }
  ],
  assignments: [
    {
      id: 'asg-1',
      title: 'Midterm Examination: Electromagnetism',
      subjectId: 'sub-3',
      dueDate: getDateOffset(2),
      estHours: 6.0,
      priority: 'HIGH',
      status: 'PENDING',
      desc: 'Chapters 21 to 26 - Gauss Law, Magnetic Flux, and Induction.'
    },
    {
      id: 'asg-2',
      title: 'Organic Chemistry Synthesis Problem Set',
      subjectId: 'sub-4',
      dueDate: getDateOffset(3),
      estHours: 4.5,
      priority: 'HIGH',
      status: 'PENDING',
      desc: 'Reaction mechanisms, SN1/SN2 pathways and NMR spectroscopy.'
    },
    {
      id: 'asg-3',
      title: 'Calculus III WebAssign #5',
      subjectId: 'sub-1',
      dueDate: getDateOffset(5),
      estHours: 3.0,
      priority: 'MEDIUM',
      status: 'PENDING',
      desc: 'Triple integrals and Vector calculus.'
    },
    {
      id: 'asg-4',
      title: 'Algorithms Homework 4: Graphs',
      subjectId: 'sub-2',
      dueDate: getDateOffset(8),
      estHours: 4.0,
      priority: 'MEDIUM',
      status: 'PENDING',
      desc: 'Implement A* search and benchmark against Dijkstra.'
    },
    {
      id: 'asg-5',
      title: 'History Paper Final Submission',
      subjectId: 'sub-5',
      dueDate: getDateOffset(-1),
      estHours: 5.0,
      priority: 'HIGH',
      status: 'COMPLETED',
      desc: 'Submitted via Canvas.'
    }
  ]
};

function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Storage helpers
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file, resetting to default:', err);
    saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// AI Cognitive Blind Spot Diagnostic Engine
function calculateAIBigPicture(data) {
  const now = new Date();
  const subjects = data.subjects || [];
  const logs = data.studyLogs || [];
  const assignments = data.assignments || [];

  const subjectMetrics = subjects.map(sub => {
    const subLogs = logs.filter(l => l.subjectId === sub.id);
    const totalHours = subLogs.reduce((acc, curr) => acc + Number(curr.hours || 0), 0);

    let daysSinceLastStudy = 999;
    if (subLogs.length > 0) {
      const sorted = [...subLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
      const lastDate = new Date(sorted[0].date);
      const diffTime = Math.abs(now - lastDate);
      daysSinceLastStudy = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    const pendingAsgs = assignments.filter(a => a.subjectId === sub.id && a.status === 'PENDING');
    const urgentAsgs = pendingAsgs.filter(a => {
      const due = new Date(a.dueDate);
      const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 4;
    });

    const totalEstHoursPending = pendingAsgs.reduce((acc, curr) => acc + Number(curr.estHours || 0), 0);

    return {
      subject: sub,
      totalHours,
      daysSinceLastStudy,
      pendingAsgsCount: pendingAsgs.length,
      urgentAsgs,
      totalEstHoursPending,
      confidence: sub.confidence || 3
    };
  });

  const totalGlobalHours = subjectMetrics.reduce((sum, sm) => sum + sm.totalHours, 0);
  const avgHoursPerSubject = subjects.length > 0 ? (totalGlobalHours / subjects.length) : 0;
  const blindSpots = [];

  subjectMetrics.forEach(sm => {
    // 1. Deadline Collision / Cram Risk
    if (sm.urgentAsgs.length > 0 && sm.daysSinceLastStudy >= 3) {
      const nextAsg = sm.urgentAsgs[0];
      blindSpots.push({
        severity: 'CRITICAL',
        type: 'Deadline Collision',
        subject: sm.subject.name,
        icon: 'alert-triangle',
        color: 'rose',
        title: `Critical Cramming Risk: ${sm.subject.name}`,
        metric: `Assignment "${nextAsg.title}" due soon with ${sm.daysSinceLastStudy === 999 ? 'zero' : sm.daysSinceLastStudy + ' days'} since last study session!`,
        recommendation: `Schedule an immediate 90-minute deep-work session today targeting ${nextAsg.title}. Break down the ${nextAsg.estHours} estimated hours into focused blocks before deadline.`
      });
    }

    // 2. Chronic Neglect
    if (sm.totalHours < (avgHoursPerSubject * 0.35) && sm.pendingAsgsCount > 0) {
      blindSpots.push({
        severity: 'HIGH',
        type: 'Chronic Neglect',
        subject: sm.subject.name,
        icon: 'eye-off',
        color: 'amber',
        title: `Neglected Discipline: ${sm.subject.name}`,
        metric: `Only ${sm.totalHours.toFixed(1)}h logged total (Class average expectation is ~${avgHoursPerSubject.toFixed(1)}h), yet you have ${sm.pendingAsgsCount} open deliverables.`,
        recommendation: `This subject is slipping into your academic peripheral vision. Rebalance your weekly calendar by dedicating the first 45 minutes of your next 3 days here.`
      });
    }

    // 3. Confidence vs Study Dissonance
    if (sm.confidence <= 2 && sm.totalHours < avgHoursPerSubject) {
      blindSpots.push({
        severity: 'HIGH',
        type: 'High Anxiety Gap',
        subject: sm.subject.name,
        icon: 'help-circle',
        color: 'purple',
        title: `Vulnerability Zone: Low Confidence in ${sm.subject.name}`,
        metric: `Self-rated confidence is only ${sm.confidence}/5, but received only ${sm.totalHours.toFixed(1)}h of review.`,
        recommendation: `Low comprehension requires proactive reinforcement rather than avoidance. Use active recall (flashcards, practice problems) rather than passive reading to rebuild momentum.`
      });
    }

    // 4. Memory Decay Risk (Ebbinghaus curve)
    if (sm.daysSinceLastStudy >= 5 && sm.totalHours > 0) {
      blindSpots.push({
        severity: 'MEDIUM',
        type: 'Memory Decay Risk',
        subject: sm.subject.name,
        icon: 'history',
        color: 'blue',
        title: `Memory Decay Alert: ${sm.subject.name}`,
        metric: `${sm.daysSinceLastStudy} days since your last logged study session on this subject.`,
        recommendation: `Human memory decay accelerates after 4-5 days without retrieval. Do a rapid 20-minute conceptual recap today to retain past study gains.`
      });
    }
  });

  // 5. Comfort-Zone Trap
  const topSubject = [...subjectMetrics].sort((a, b) => b.totalHours - a.totalHours)[0];
  if (topSubject && totalGlobalHours > 6 && (topSubject.totalHours / totalGlobalHours) > 0.55) {
    const pct = Math.round((topSubject.totalHours / totalGlobalHours) * 100);
    blindSpots.push({
      severity: 'MEDIUM',
      type: 'Comfort-Zone Trap',
      subject: topSubject.subject.name,
      icon: 'shield-alert',
      color: 'indigo',
      title: `Comfort-Zone Trap: Over-indexing on ${topSubject.subject.name}`,
      metric: `${pct}% of all your recorded academic time is absorbed by this single subject.`,
      recommendation: `You may be using this subject as a productive procrastination refuge against more demanding courses. Cap your next session here and divert 1 hour to your lowest-confidence topics.`
    });
  }

  if (blindSpots.length === 0) {
    blindSpots.push({
      severity: 'LOW',
      type: 'Balanced Study Pace',
      subject: 'All Subjects',
      icon: 'check-circle-2',
      color: 'emerald',
      title: 'Optimal Academic Distribution Detected',
      metric: 'Study time is evenly distributed across your active subjects and upcoming assignment deadlines.',
      recommendation: 'Maintain your current cadence. Ensure you continue logging daily hours and update assignment due dates as professors announce them.'
    });
  }

  const criticalCount = blindSpots.filter(b => b.severity === 'CRITICAL').length;
  const highCount = blindSpots.filter(b => b.severity === 'HIGH').length;

  let overallRisk = 'Low';
  let overallColor = 'emerald';
  if (criticalCount > 0) {
    overallRisk = 'High Alert';
    overallColor = 'rose';
  } else if (highCount > 0) {
    overallRisk = 'Moderate';
    overallColor = 'amber';
  }

  return {
    subjectMetrics,
    totalGlobalHours,
    avgHoursPerSubject,
    blindSpots,
    riskSummary: {
      score: overallRisk,
      color: overallColor,
      criticalCount,
      highCount,
      totalIssues: blindSpots.length
    }
  };
}

// Request Body Parser Helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // JSON responder helper
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // REST API Routes
  try {
    // GET /api/state - Full academic bundle
    if (req.method === 'GET' && pathname === '/api/state') {
      const data = loadData();
      const aiDiagnostics = calculateAIBigPicture(data);
      sendJSON(200, { success: true, ...data, aiDiagnostics });
      return;
    }

    // POST /api/reset - Reset to sample data
    if (req.method === 'POST' && pathname === '/api/reset') {
      saveData(DEFAULT_DATA);
      sendJSON(200, { success: true, message: 'Data reset to demo state', data: DEFAULT_DATA });
      return;
    }

    // GET /api/ai/diagnostics - Blind Spot Analysis
    if (req.method === 'GET' && pathname === '/api/ai/diagnostics') {
      const data = loadData();
      const aiDiagnostics = calculateAIBigPicture(data);
      sendJSON(200, { success: true, diagnostics: aiDiagnostics });
      return;
    }

    // === STUDY LOGS ===
    // GET /api/logs
    if (req.method === 'GET' && pathname === '/api/logs') {
      const data = loadData();
      sendJSON(200, { success: true, studyLogs: data.studyLogs });
      return;
    }

    // POST /api/logs
    if (req.method === 'POST' && pathname === '/api/logs') {
      const body = await parseBody(req);
      if (!body.subjectId || !body.date || body.hours === undefined) {
        sendJSON(400, { success: false, error: 'subjectId, date, and hours are required' });
        return;
      }
      const data = loadData();
      const newLog = {
        id: 'log-' + Date.now(),
        subjectId: body.subjectId,
        date: body.date,
        hours: Number(body.hours),
        topics: body.topics || '',
        notes: body.notes || ''
      };
      data.studyLogs.unshift(newLog);
      saveData(data);
      sendJSON(201, { success: true, log: newLog });
      return;
    }

    // DELETE /api/logs/:id
    if (req.method === 'DELETE' && pathname.startsWith('/api/logs/')) {
      const id = pathname.replace('/api/logs/', '');
      const data = loadData();
      data.studyLogs = data.studyLogs.filter(l => l.id !== id);
      saveData(data);
      sendJSON(200, { success: true, message: 'Study log removed' });
      return;
    }

    // === ASSIGNMENTS ===
    // GET /api/assignments
    if (req.method === 'GET' && pathname === '/api/assignments') {
      const data = loadData();
      sendJSON(200, { success: true, assignments: data.assignments });
      return;
    }

    // POST /api/assignments
    if (req.method === 'POST' && pathname === '/api/assignments') {
      const body = await parseBody(req);
      if (!body.title || !body.subjectId || !body.dueDate) {
        sendJSON(400, { success: false, error: 'title, subjectId, and dueDate are required' });
        return;
      }
      const data = loadData();
      const newAsg = {
        id: 'asg-' + Date.now(),
        title: body.title,
        subjectId: body.subjectId,
        dueDate: body.dueDate,
        estHours: Number(body.estHours || 2),
        priority: body.priority || 'MEDIUM',
        status: body.status || 'PENDING',
        desc: body.desc || ''
      };
      data.assignments.unshift(newAsg);
      saveData(data);
      sendJSON(201, { success: true, assignment: newAsg });
      return;
    }

    // PUT /api/assignments/:id (Edit or toggle status)
    if (req.method === 'PUT' && pathname.startsWith('/api/assignments/')) {
      const id = pathname.replace('/api/assignments/', '');
      const body = await parseBody(req);
      const data = loadData();
      const asg = data.assignments.find(a => a.id === id);
      if (!asg) {
        sendJSON(404, { success: false, error: 'Assignment not found' });
        return;
      }
      if (body.title !== undefined) asg.title = body.title;
      if (body.subjectId !== undefined) asg.subjectId = body.subjectId;
      if (body.dueDate !== undefined) asg.dueDate = body.dueDate;
      if (body.estHours !== undefined) asg.estHours = Number(body.estHours);
      if (body.priority !== undefined) asg.priority = body.priority;
      if (body.status !== undefined) asg.status = body.status;
      if (body.desc !== undefined) asg.desc = body.desc;

      saveData(data);
      sendJSON(200, { success: true, assignment: asg });
      return;
    }

    // DELETE /api/assignments/:id
    if (req.method === 'DELETE' && pathname.startsWith('/api/assignments/')) {
      const id = pathname.replace('/api/assignments/', '');
      const data = loadData();
      data.assignments = data.assignments.filter(a => a.id !== id);
      saveData(data);
      sendJSON(200, { success: true, message: 'Assignment removed' });
      return;
    }

    // === SUBJECTS ===
    // POST /api/subjects
    if (req.method === 'POST' && pathname === '/api/subjects') {
      const body = await parseBody(req);
      if (!body.name) {
        sendJSON(400, { success: false, error: 'name is required' });
        return;
      }
      const data = loadData();
      const palette = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'];
      const chosenColor = body.color || palette[data.subjects.length % palette.length];
      const newSub = {
        id: 'sub-' + Date.now(),
        name: body.name,
        color: chosenColor,
        confidence: Number(body.confidence || 3)
      };
      data.subjects.push(newSub);
      saveData(data);
      sendJSON(201, { success: true, subject: newSub });
      return;
    }

    // PUT /api/subjects/:id/confidence
    if (req.method === 'PUT' && pathname.includes('/confidence')) {
      const parts = pathname.split('/');
      const id = parts[3];
      const body = await parseBody(req);
      const data = loadData();
      const sub = data.subjects.find(s => s.id === id);
      if (sub && body.confidence !== undefined) {
        sub.confidence = Number(body.confidence);
        saveData(data);
        sendJSON(200, { success: true, subject: sub });
        return;
      }
      sendJSON(404, { success: false, error: 'Subject not found' });
      return;
    }

    // DELETE /api/subjects/:id
    if (req.method === 'DELETE' && pathname.startsWith('/api/subjects/')) {
      const id = pathname.replace('/api/subjects/', '');
      const data = loadData();
      if (data.subjects.length <= 1) {
        sendJSON(400, { success: false, error: 'Cannot delete the only remaining subject' });
        return;
      }
      data.subjects = data.subjects.filter(s => s.id !== id);
      saveData(data);
      sendJSON(200, { success: true, message: 'Subject removed' });
      return;
    }

    // Static Frontend File Serving
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const fileData = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fileData);
      return;
    }

    sendJSON(404, { success: false, error: 'Endpoint or file not found' });
  } catch (err) {
    console.error('Server error handling request:', err);
    sendJSON(500, { success: false, error: 'Internal Server Error', details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`AcademiaAI Backend Server running at http://localhost:${PORT}`);
});
