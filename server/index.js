const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      faceRecognitionEngine: 'operational',
      geofenceTriangulator: 'operational',
      tokenValidator: 'operational',
      dbCluster: 'connected'
    }
  });
});

// Authentication Routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  res.json({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.verity_session_jwt_token',
    user: {
      id: 'usr_2026_01',
      name: role === 'faculty' ? 'Dr. Rajesh Kumar' : 'Aarav Sharma',
      email: email,
      role: role || 'student'
    }
  });
});

// Sessions API
app.get('/api/v1/sessions', (req, res) => {
  res.json({
    sessions: [
      {
        id: 'sess_1001',
        subjectCode: 'CS401',
        subjectName: 'Advanced AI & Biometric Security',
        facultyName: 'Dr. Rajesh Kumar',
        classroomName: 'Cyber Security Research Lab 302',
        status: 'active',
        qrCodeChallengeToken: 'VERITY-SESS-9938-X7K',
        stats: { totalEnrolled: 60, presentCount: 52, lateCount: 3, pendingReviewCount: 2, rejectedCount: 1 }
      }
    ]
  });
});

// Verification Endpoint
app.post('/api/v1/verification/verify', (req, res) => {
  const { studentId, sessionId, faceMatchScore, gpsDistanceMeters } = req.body;

  let overallStatus = 'verified';
  let riskScore = 4;
  let explainableRiskFactors = [];

  if (faceMatchScore && faceMatchScore < 85) {
    overallStatus = 'rejected';
    riskScore = 98;
    explainableRiskFactors.push('Facial vector mismatch (24.5% match vs 85.0% required threshold)');
  } else if (gpsDistanceMeters && gpsDistanceMeters > 25) {
    overallStatus = 'pending_review';
    riskScore = 68;
    explainableRiskFactors.push(`GPS location (${gpsDistanceMeters}m) exceeded classroom radius (25m)`);
  }

  res.json({
    attemptId: `VATT-${Date.now()}`,
    overallStatus,
    riskScore,
    explainableRiskFactors,
    latencyMs: 140,
    timestamp: new Date().toISOString()
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`VERITY Express Backend API server running on port ${PORT}`);
  });
}

module.exports = app;
