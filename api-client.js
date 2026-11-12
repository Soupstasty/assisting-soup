// Academic API Client Layer with automatic fallback to localStorage
// Works seamlessly both when server.js is running AND when running standalone via file://

const API_BASE = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000';
let isBackendConnected = false;

const AcademicAPI = {
  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/api/state`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        isBackendConnected = true;
        return true;
      }
    } catch (e) {
      isBackendConnected = false;
    }
    return false;
  },

  async getState() {
    if (await this.checkConnection()) {
      try {
        const res = await fetch(`${API_BASE}/api/state`);
        const data = await res.json();
        if (data.success) {
          return {
            subjects: data.subjects,
            studyLogs: data.studyLogs,
            assignments: data.assignments,
            aiDiagnostics: data.aiDiagnostics,
            connected: true
          };
        }
      } catch (err) {
        console.warn('API error, falling back to local cache', err);
      }
    }
    return {
      subjects: JSON.parse(localStorage.getItem('academia_subjects_v1')) || null,
      studyLogs: JSON.parse(localStorage.getItem('academia_study_logs_v1')) || null,
      assignments: JSON.parse(localStorage.getItem('academia_assignments_v1')) || null,
      connected: false
    };
  },

  async addStudyLog(log) {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
        const json = await res.json();
        if (json.success) return json.log;
      } catch (err) {
        console.warn('Failed to post log to backend', err);
      }
    }
    return log;
  },

  async deleteStudyLog(id) {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/api/logs/${id}`, { method: 'DELETE' });
      } catch (e) {}
    }
  },

  async addAssignment(asg) {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(asg)
        });
        const json = await res.json();
        if (json.success) return json.assignment;
      } catch (e) {}
    }
    return asg;
  },

  async updateAssignment(id, changes) {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/assignments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changes)
        });
        const json = await res.json();
        if (json.success) return json.assignment;
      } catch (e) {}
    }
    return changes;
  },

  async deleteAssignment(id) {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/api/assignments/${id}`, { method: 'DELETE' });
      } catch (e) {}
    }
  },

  async addSubject(sub) {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/subjects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub)
        });
        const json = await res.json();
        if (json.success) return json.subject;
      } catch (e) {}
    }
    return sub;
  },

  async updateConfidence(id, confidence) {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/api/subjects/${id}/confidence`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confidence })
        });
      } catch (e) {}
    }
  },

  async deleteSubject(id) {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/api/subjects/${id}`, { method: 'DELETE' });
      } catch (e) {}
    }
  },

  async resetBackend() {
    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
        return await res.json();
      } catch (e) {}
    }
  }
};
