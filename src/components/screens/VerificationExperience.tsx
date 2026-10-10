import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Zap, 
  Sparkles,
  ArrowRight,
  Loader2,
  Lock,
  Video,
  UserCheck,
  QrCode,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { ConfidenceTimeline } from '../common/ConfidenceTimeline';
import { VerificationStage, VerificationStatus, ClassSession } from '../../types';
import { db } from '../../services/db';
import { FaceRegistrationModal } from '../common/FaceRegistrationModal';
import { QRScannerModal } from '../common/QRScannerModal';

export const VerificationExperience: React.FC = () => {
  const { currentStudent, setActiveScreen } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeSession, setActiveSession] = useState<ClassSession>(db.getSessions()[0]);
  const [scannedQrToken, setScannedQrToken] = useState<string>(activeSession?.qrCodeChallengeToken || 'VERITY-SESS-9938-X7K');
  const [showFaceRegModal, setShowFaceRegModal] = useState<boolean>(false);
  const [showQrScanModal, setShowQrScanModal] = useState<boolean>(false);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [motionPrompt, setMotionPrompt] = useState<string>('Face aligned in detection zone');
  const [useRealWebcam, setUseRealWebcam] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string>('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(4.2);
  const [overallResult, setOverallResult] = useState<VerificationStatus>('incomplete');
  
  // Test Scenarios including Strict Face Mismatch
  const [simulatedRiskScenario, setSimulatedRiskScenario] = useState<'normal' | 'unmatched_face' | 'geofence_flag' | 'liveness_fail'>('normal');

  // Interactive Live Stages
  const [stages, setStages] = useState<VerificationStage[]>([
    { id: 'account', name: '1. Account & Enrolment', iconName: 'UserCheck', status: 'pending', explanation: 'Verifying student enrolment token' },
    { id: 'session_challenge', name: '2. Session QR Challenge', iconName: 'Key', status: 'pending', explanation: 'Validating HMAC session signature' },
    { id: 'face_match', name: '3. Face Identity Match', iconName: 'Scan', status: 'pending', explanation: 'Computing 128D neural vector distance' },
    { id: 'liveness', name: '4. Passive Liveness Test', iconName: 'ShieldCheck', status: 'pending', explanation: '3D depth & movement anti-spoofing' },
    { id: 'location', name: '5. Location & Geofence', iconName: 'MapPin', status: 'pending', explanation: 'Triangulating GPS & Wi-Fi BSSID' },
    { id: 'time_duplicate', name: '6. Anti-Replay & Time Check', iconName: 'Clock', status: 'pending', explanation: 'Checking temporal nonce validity' }
  ]);

  // Real Webcam Access Toggle
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (useRealWebcam) {
      setWebcamError('');
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera access fallback:", err);
          setWebcamError('Camera hardware restricted or unavailable. Running biometric neural face stream.');
          setUseRealWebcam(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useRealWebcam]);

  // Handle Step-by-step verification pipeline execution
  const startVerificationProcess = () => {
    setIsVerifying(true);
    setOverallResult('incomplete');
    setCurrentStepIndex(0);
    setMotionPrompt('Initializing facial mesh & sensors...');

    // Reset stages
    setStages(prev => prev.map(s => ({ ...s, status: 'pending', completionTimeMs: undefined })));

    // Step 1: Account & Enrolment Guard
    setTimeout(() => {
      if (!currentStudent.enrolledFaceTemplate) {
        updateStageStatus(0, 'failed', 'Unregistered Identity: No enrolled facial template found in database', 90);
        setOverallResult('rejected');
        setIsVerifying(false);
        setMotionPrompt('Verification Aborted: Student face not enrolled in database.');
        return;
      }
      updateStageStatus(0, 'passed', `Enrolled profile verified: ${currentStudent.rollNumber}`, 110);
      setCurrentStepIndex(1);
      setMotionPrompt(`Validating session QR token: ${scannedQrToken}...`);
    }, 600);

    // Step 2: Session Challenge Token
    setTimeout(() => {
      updateStageStatus(1, 'passed', `Session QR token ${scannedQrToken} valid & active`, 140, { tokenAgeSeconds: 3.2 });
      setCurrentStepIndex(2);
      setMotionPrompt('FACE DETECTED: Matching live camera image with registered profile...');
    }, 1300);

    // Step 3: Face Identity Match (STRICT COMPARISON)
    setTimeout(() => {
      if (simulatedRiskScenario === 'unmatched_face') {
        updateStageStatus(2, 'failed', 'CRITICAL MISMATCH: Face image does not match registered student template (24.5% vs 85.0% required)', 420, { confidenceScore: 24.5 });
        setOverallResult('rejected');
        setIsVerifying(false);
        setMotionPrompt('Verification Failed: Facial identity mismatch detected.');
        
        // Record rejected attempt in DB
        db.recordAttempt({
          id: `VATT-${Date.now()}`,
          sessionId: activeSession.id,
          sessionTitle: activeSession.subjectName,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          studentRoll: currentStudent.rollNumber,
          timestamp: new Date().toLocaleTimeString(),
          overallStatus: 'rejected',
          riskScore: 98,
          explainableRiskFactors: ['Facial vector mismatch (24.5% confidence vs 85% required threshold)'],
          stages: stages,
          capturedLocation: { latitude: 12.9716, longitude: 77.5946, accuracyMeters: 4.2, distanceFromGeofenceMeters: 6.2 },
          capturedBiometrics: { faceMatchScore: 24.5, livenessScore: 82.0, livenessMotionDetected: 'None' },
          deviceInfo: { ipAddress: '172.16.48.55', userAgent: 'Mozilla/5.0', deviceId: 'DEV-F892' }
        });
        return;
      } else {
        updateStageStatus(2, 'passed', 'Facial vector match 98.6% confidence against enrolled profile', 380, { confidenceScore: 98.6 });
        setCurrentStepIndex(3);
        setMotionPrompt('ACTION REQUESTED: Turn head slightly left & blink twice');
      }
    }, 2200);

    // Step 4: Liveness Challenge
    setTimeout(() => {
      if (simulatedRiskScenario === 'liveness_fail') {
        updateStageStatus(3, 'failed', 'Liveness score low: Possible screen video playback detected', 550, { livenessScore: 42.0 });
        setOverallResult('rejected');
        setIsVerifying(false);
        setMotionPrompt('Verification Failed: Spoofing anomaly flagged');
        
        db.recordAttempt({
          id: `VATT-${Date.now()}`,
          sessionId: activeSession.id,
          sessionTitle: activeSession.subjectName,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          studentRoll: currentStudent.rollNumber,
          timestamp: new Date().toLocaleTimeString(),
          overallStatus: 'rejected',
          riskScore: 92,
          explainableRiskFactors: ['Liveness challenge failed: 2D static reflection detected'],
          stages: stages,
          capturedLocation: { latitude: 12.9716, longitude: 77.5946, accuracyMeters: 4.2, distanceFromGeofenceMeters: 6.2 },
          capturedBiometrics: { faceMatchScore: 98.6, livenessScore: 42.0, livenessMotionDetected: 'Failed gesture' },
          deviceInfo: { ipAddress: '172.16.48.55', userAgent: 'Mozilla/5.0', deviceId: 'DEV-F892' }
        });
        return;
      } else {
        updateStageStatus(3, 'passed', 'Passed 3D liveness micro-gesture check', 480, { livenessScore: 96.4 });
        setCurrentStepIndex(4);
        setMotionPrompt('Validating GPS classroom geofence boundary...');
      }
    }, 3200);

    // Step 5: Location Validation
    setTimeout(() => {
      if (simulatedRiskScenario === 'geofence_flag') {
        updateStageStatus(4, 'warning', 'User is 42m away from Lab 302 center (Radius: 25m)', 290, { gpsDistanceMeters: 42 });
        setCurrentStepIndex(5);
        setMotionPrompt('Finalizing temporal anti-replay check...');
      } else {
        updateStageStatus(4, 'passed', 'GPS inside Lab 302 boundary (Distance: 6.2m)', 210, { gpsDistanceMeters: 6.2 });
        setCurrentStepIndex(5);
        setMotionPrompt('Finalizing temporal anti-replay check...');
      }
    }, 4000);

    // Step 6: Temporal & Finalization
    setTimeout(() => {
      updateStageStatus(5, 'passed', 'Check-in timestamp verified. Nonce consumed.', 90);
      setIsVerifying(false);
      setMotionPrompt('Verification Pipeline Complete!');

      const finalStatus: VerificationStatus = simulatedRiskScenario === 'geofence_flag' ? 'pending_review' : 'verified';
      setOverallResult(finalStatus);

      // Record successful/pending attempt in DB
      db.recordAttempt({
        id: `VATT-${Date.now()}`,
        sessionId: activeSession.id,
        sessionTitle: activeSession.subjectName,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentRoll: currentStudent.rollNumber,
        timestamp: new Date().toLocaleTimeString(),
        overallStatus: finalStatus,
        riskScore: finalStatus === 'pending_review' ? 68 : 4,
        explainableRiskFactors: finalStatus === 'pending_review' ? ['GPS location (42m) exceeded classroom radius (25m)'] : [],
        stages: stages,
        capturedLocation: { latitude: 12.9716, longitude: 77.5946, accuracyMeters: 4.2, distanceFromGeofenceMeters: finalStatus === 'pending_review' ? 42 : 6.2 },
        capturedBiometrics: { faceMatchScore: 98.6, livenessScore: 96.4, livenessMotionDetected: 'Head turn left + double blink' },
        deviceInfo: { ipAddress: '172.16.48.55', userAgent: 'Mozilla/5.0', deviceId: 'DEV-F892' }
      });

      if (finalStatus === 'verified') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }, 4800);
  };

  const updateStageStatus = (index: number, status: 'passed' | 'failed' | 'warning', explanation: string, timeMs: number, metrics?: any) => {
    setStages(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status,
        explanation,
        completionTimeMs: timeMs,
        metrics
      };
      return updated;
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Attendance Verification Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              STRICT ZERO-TRUST
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.rollNumber}) • Session Token: <strong className="text-cyan-400 font-mono">{scannedQrToken}</strong>
          </p>
        </div>

        {/* Demo Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* QR Scanner Trigger */}
          <button
            onClick={() => setShowQrScanModal(true)}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/20 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            Scan Session QR Code
          </button>

          {/* Register Face Trigger */}
          <button
            onClick={() => setShowFaceRegModal(true)}
            className="px-3 py-1.5 rounded-lg bg-[#121A2B] text-teal-300 border border-teal-500/40 hover:bg-teal-500/20 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            Register Face
          </button>

          {/* Demo Scenario Switcher */}
          <div className="bg-[#121A2B] border border-[#1E2D4A] p-1.5 rounded-lg flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px] pl-1 hidden sm:inline">Scenario:</span>
            <button
              onClick={() => setSimulatedRiskScenario('normal')}
              className={`px-2 py-1 rounded text-[11px] transition-all ${
                simulatedRiskScenario === 'normal' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              Pass
            </button>
            <button
              onClick={() => setSimulatedRiskScenario('unmatched_face')}
              className={`px-2 py-1 rounded text-[11px] transition-all ${
                simulatedRiskScenario === 'unmatched_face' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400'
              }`}
            >
              Face Mismatch
            </button>
            <button
              onClick={() => setSimulatedRiskScenario('geofence_flag')}
              className={`px-2 py-1 rounded text-[11px] transition-all ${
                simulatedRiskScenario === 'geofence_flag' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              Geofence
            </button>
          </div>
        </div>
      </div>

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport */}
        <div className="lg:col-span-5 bg-[#121A2B] border border-[#1E2D4A] rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" /> BIOMETRIC DETECTION VIEWPORT
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> GPS: {gpsAccuracy}m
              </span>
            </div>

            {/* Viewport Frame */}
            <div className="relative w-full aspect-[4/3] bg-[#050810] rounded-xl overflow-hidden border border-[#1E2D4A] flex items-center justify-center scanline shadow-2xl">
              {useRealWebcam ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#090F1E]">
                  <img
                    src={simulatedRiskScenario === 'unmatched_face' 
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' 
                      : currentStudent.avatarUrl}
                    alt="Detected Face Target"
                    className={`w-44 h-56 object-cover rounded-[50%] border-2 transition-all duration-500 shadow-2xl ${
                      isVerifying 
                        ? 'brightness-110 border-cyan-400 cyan-glow scale-105' 
                        : overallResult === 'verified'
                        ? 'brightness-110 border-emerald-400 teal-glow'
                        : overallResult === 'rejected'
                        ? 'brightness-75 border-rose-500 grayscale'
                        : 'brightness-95 border-cyan-500/40'
                    }`}
                  />
                  <div className="absolute w-44 h-56 rounded-[50%] bg-gradient-to-b from-cyan-500/10 via-transparent to-teal-500/10 pointer-events-none" />
                </div>
              )}

              {/* Facial Mesh Overlay */}
              <div className={`relative w-48 h-60 rounded-[50%] border-2 transition-all duration-300 flex items-center justify-center pointer-events-none ${
                isVerifying ? 'border-cyan-400 cyan-glow scale-105' : 
                overallResult === 'verified' ? 'border-emerald-400 teal-glow' :
                overallResult === 'rejected' ? 'border-rose-500' :
                'border-cyan-500/50'
              }`}>
                <div className="w-40 h-52 rounded-[50%] border border-cyan-400/40 border-dashed animate-spin" style={{ animationDuration: '10s' }} />

                {/* 3D Facial Landmark Mesh Points */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={`absolute top-20 left-14 w-2 h-2 rounded-full transition-all ${isVerifying ? 'bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-ping' : 'bg-cyan-500/60'}`} />
                  <span className={`absolute top-20 right-14 w-2 h-2 rounded-full transition-all ${isVerifying ? 'bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-ping' : 'bg-cyan-500/60'}`} />
                  <span className={`absolute top-28 w-2 h-2 rounded-full transition-all ${isVerifying ? 'bg-emerald-400 shadow-[0_0_8px_#22C55E]' : 'bg-teal-500/60'}`} />
                </div>

                <Scan className={`w-8 h-8 absolute ${isVerifying ? 'text-cyan-400 animate-pulse' : 'text-slate-400/60'}`} />
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-[#0B1020]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#1E2D4A] text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {simulatedRiskScenario === 'unmatched_face' ? 'TARGET: Unmatched Person' : `REGISTERED PROFILE: ${currentStudent.name}`}
                </span>
              </div>

              {/* Motion Prompt Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0B1020]/95 backdrop-blur-md border border-[#1E2D4A] p-2.5 rounded-lg text-center text-xs font-mono text-cyan-300 shadow-xl">
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> {motionPrompt}
                  </span>
                ) : (
                  <span>{motionPrompt}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={startVerificationProcess}
              disabled={isVerifying}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 ${
                isVerifying
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Executing Layer {currentStepIndex + 1}...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Execute Multi-Layer Verification Test
                </>
              )}
            </button>

            {/* Status Feedback Banner */}
            {overallResult === 'verified' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-lg flex items-center justify-between font-mono">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> VERIFICATION PASSED & RECORDED IN DB
                </span>
                <button
                  onClick={() => setActiveScreen('student-dashboard')}
                  className="text-cyan-400 hover:underline"
                >
                  Dashboard →
                </button>
              </div>
            )}

            {overallResult === 'rejected' && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center justify-between font-mono">
                <span className="flex items-center gap-2 font-semibold">
                  <XCircle className="w-4 h-4 text-rose-400" /> ATTENDANCE REJECTED: FACE MISMATCH
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Signature Feature #1 - Verification Confidence Timeline */}
        <div className="lg:col-span-7">
          <ConfidenceTimeline
            stages={stages}
            overallStatus={overallResult}
            riskScore={
              simulatedRiskScenario === 'unmatched_face' ? 98 : simulatedRiskScenario === 'geofence_flag' ? 68 : simulatedRiskScenario === 'liveness_fail' ? 92 : 4
            }
            explainableRiskFactors={
              simulatedRiskScenario === 'unmatched_face'
                ? ['Facial vector mismatch (24.5% match vs 85.0% required threshold). Face does not match registered student profile.']
                : simulatedRiskScenario === 'geofence_flag'
                ? ['GPS location (42m) exceeded classroom radius (25m)']
                : simulatedRiskScenario === 'liveness_fail'
                ? ['Liveness challenge failed: 2D static reflection detected']
                : undefined
            }
          />
        </div>
      </div>

      {/* Modals */}
      {showFaceRegModal && (
        <FaceRegistrationModal
          student={currentStudent}
          onClose={() => setShowFaceRegModal(false)}
          onSuccess={(updated) => alert('Face template registered in database!')}
        />
      )}

      {showQrScanModal && (
        <QRScannerModal
          onClose={() => setShowQrScanModal(false)}
          onSessionSelected={(sess, token) => {
            setActiveSession(sess);
            setScannedQrToken(token);
            alert(`Bound session to ${sess.subjectCode} with QR token ${token}`);
          }}
        />
      )}
    </div>
  );
};
