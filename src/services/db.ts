import { 
  Student, 
  Faculty, 
  Subject, 
  Classroom, 
  ClassSession, 
  VerificationAttempt, 
  RiskEvent, 
  AuditLog, 
  InstitutionTrustPulse 
} from '../types';
import { 
  mockStudents as initialStudents, 
  mockFaculty as initialFaculty, 
  mockSubjects as initialSubjects, 
  mockClassrooms as initialClassrooms, 
  mockSessions as initialSessions, 
  mockVerificationAttempts as initialAttempts, 
  mockRiskEvents as initialRiskEvents, 
  mockAuditLogs as initialAuditLogs, 
  mockTrustPulse as initialTrustPulse 
} from '../data/mockData';

const DB_KEY = 'verity_platform_database_v2';

interface DBStore {
  students: Student[];
  faculty: Faculty;
  subjects: Subject[];
  classrooms: Classroom[];
  sessions: ClassSession[];
  attempts: VerificationAttempt[];
  riskEvents: RiskEvent[];
  auditLogs: AuditLog[];
  trustPulse: InstitutionTrustPulse;
}

const loadDB = (): DBStore => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load database from localStorage', e);
  }
  const store: DBStore = {
    students: initialStudents,
    faculty: initialFaculty,
    subjects: initialSubjects,
    classrooms: initialClassrooms,
    sessions: initialSessions,
    attempts: initialAttempts,
    riskEvents: initialRiskEvents,
    auditLogs: initialAuditLogs,
    trustPulse: initialTrustPulse
  };
  saveDB(store);
  return store;
};

const saveDB = (store: DBStore) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save database to localStorage', e);
  }
};

export const db = {
  getStore: (): DBStore => loadDB(),

  // Students
  getStudents: (): Student[] => loadDB().students,
  
  getStudentById: (id: string): Student | undefined => {
    return loadDB().students.find(s => s.id === id || s.rollNumber === id || s.email === id);
  },

  registerStudentFace: (studentId: string, facePhotoUrl: string) => {
    const store = loadDB();
    const student = store.students.find(s => s.id === studentId || s.rollNumber === studentId);
    if (student) {
      student.avatarUrl = facePhotoUrl;
      student.enrolledFaceTemplate = true;
      student.trustScore = 99;
      
      store.auditLogs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: student.name,
        role: 'STUDENT',
        action: 'BIOMETRIC_ENROLLED',
        details: `Updated 128-D facial vector template for ${student.rollNumber}`,
        ipAddress: '172.16.48.55'
      });

      saveDB(store);
    }
    return student;
  },

  addStudent: (newStudent: Partial<Student>): Student => {
    const store = loadDB();
    const student: Student = {
      id: `std_${Date.now()}`,
      rollNumber: newStudent.rollNumber || `2026-CS-${Math.floor(100 + Math.random() * 900)}`,
      name: newStudent.name || 'New Student',
      email: newStudent.email || 'student@vertex.edu',
      avatarUrl: newStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science',
      semester: 6,
      overallAttendancePct: 100,
      enrolledFaceTemplate: true,
      trustScore: 100,
      registeredDevice: 'Registered Device (Mobile)'
    };
    store.students.push(student);
    saveDB(store);
    return student;
  },

  // Sessions
  getSessions: (): ClassSession[] => loadDB().sessions,
  
  createSession: (sessionData: Partial<ClassSession>): ClassSession => {
    const store = loadDB();
    const newSession: ClassSession = {
      id: `sess_${Date.now()}`,
      subjectCode: sessionData.subjectCode || 'CS401',
      subjectName: sessionData.subjectName || 'Advanced AI Security',
      facultyId: store.faculty.id,
      facultyName: store.faculty.name,
      classroomId: 'room_302',
      classroomName: 'Cyber Security Research Lab 302',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 90 * 60000).toISOString(),
      lateThresholdMinutes: sessionData.lateThresholdMinutes || 10,
      status: 'active',
      qrCodeChallengeToken: `VERITY-SESS-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      qrExpiresAt: new Date(Date.now() + 15 * 1000).toISOString(),
      geofenceRadiusMeters: sessionData.geofenceRadiusMeters || 25,
      stats: {
        totalEnrolled: 60,
        presentCount: 0,
        lateCount: 0,
        pendingReviewCount: 0,
        rejectedCount: 0
      }
    };
    store.sessions.unshift(newSession);
    saveDB(store);
    return newSession;
  },

  // Verification Attempts & Check-in Logic
  recordAttempt: (attempt: VerificationAttempt) => {
    const store = loadDB();
    store.attempts.unshift(attempt);

    // Update Session Stats
    const session = store.sessions.find(s => s.id === attempt.sessionId);
    if (session) {
      if (attempt.overallStatus === 'verified') {
        session.stats.presentCount += 1;
      } else if (attempt.overallStatus === 'pending_review') {
        session.stats.pendingReviewCount += 1;
      } else if (attempt.overallStatus === 'rejected') {
        session.stats.rejectedCount += 1;
      }
    }

    // Add Audit Log
    store.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: attempt.studentName,
      role: 'STUDENT',
      action: `ATTENDANCE_${attempt.overallStatus.toUpperCase()}`,
      details: `Attempt ${attempt.id} for ${attempt.sessionTitle}. Status: ${attempt.overallStatus}`,
      ipAddress: attempt.deviceInfo.ipAddress
    });

    saveDB(store);
    return attempt;
  },

  getAttempts: (): VerificationAttempt[] => loadDB().attempts,

  // CSV Report Generator
  exportSessionCSV: (sessionId?: string) => {
    const store = loadDB();
    const attempts = sessionId 
      ? store.attempts.filter(a => a.sessionId === sessionId)
      : store.attempts;

    const headers = [
      'Attempt ID',
      'Student Roll',
      'Student Name',
      'Session Title',
      'Timestamp',
      'Overall Status',
      'Risk Score',
      'Face Match %',
      'Liveness Score',
      'GPS Distance (m)',
      'IP Address'
    ];

    const rows = attempts.map(a => [
      a.id,
      `"${a.studentRoll}"`,
      `"${a.studentName}"`,
      `"${a.sessionTitle}"`,
      `"${a.timestamp}"`,
      a.overallStatus.toUpperCase(),
      a.riskScore,
      `${a.capturedBiometrics.faceMatchScore}%`,
      `${a.capturedBiometrics.livenessScore}%`,
      `${a.capturedLocation.distanceFromGeofenceMeters}m`,
      a.deviceInfo.ipAddress
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `verity_attendance_ledger_${sessionId || 'all'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
