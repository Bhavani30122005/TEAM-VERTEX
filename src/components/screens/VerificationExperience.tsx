import React, { useState, useEffect } from 'react';
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
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { ConfidenceTimeline } from '../common/ConfidenceTimeline';
import { VerificationStage, VerificationStatus } from '../../types';

export const VerificationExperience: React.FC = () => {
  const { currentStudent, setActiveScreen } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [motionPrompt, setMotionPrompt] = useState<string>('Align face inside scanning oval');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(4.2);
  const [overallResult, setOverallResult] = useState<VerificationStatus>('incomplete');
  const [simulatedRiskScenario, setSimulatedRiskScenario] = useState<'normal' | 'geofence_flag' | 'liveness_fail'>('normal');

  // Interactive Live Stages
  const [stages, setStages] = useState<VerificationStage[]>([
    { id: 'account', name: '1. Account & Enrolment', iconName: 'UserCheck', status: 'pending', explanation: 'Verifying student enrolment token' },
    { id: 'session_challenge', name: '2. Session QR Challenge', iconName: 'Key', status: 'pending', explanation: 'Validating HMAC session signature' },
    { id: 'face_match', name: '3. Face Identity Match', iconName: 'Scan', status: 'pending', explanation: 'Computing 128D neural vector distance' },
    { id: 'liveness', name: '4. Passive Liveness Test', iconName: 'ShieldCheck', status: 'pending', explanation: '3D depth & movement anti-spoofing' },
    { id: 'location', name: '5. Location & Geofence', iconName: 'MapPin', status: 'pending', explanation: 'Triangulating GPS & Wi-Fi BSSID' },
    { id: 'time_duplicate', name: '6. Anti-Replay & Time Check', iconName: 'Clock', status: 'pending', explanation: 'Checking temporal nonce validity' }
  ]);

  // Handle Step-by-step verification pipeline execution
  const startVerificationProcess = () => {
    setIsVerifying(true);
    setOverallResult('incomplete');
    setCurrentStepIndex(0);
    setMotionPrompt('Initializing camera feed & sensors...');

    // Reset stages
    setStages(prev => prev.map(s => ({ ...s, status: 'pending', completionTimeMs: undefined })));

    // Step 1: Account
    setTimeout(() => {
      updateStageStatus(0, 'passed', 'Enrolled face template active & verified', 110);
      setCurrentStepIndex(1);
      setMotionPrompt('Scanning session QR token challenge...');
    }, 600);

    // Step 2: Token
    setTimeout(() => {
      updateStageStatus(1, 'passed', 'Session token VERITY-SESS-9938 verified', 140);
      setCurrentStepIndex(2);
      setMotionPrompt('Position face inside oval & hold steady');
    }, 1300);

    // Step 3: Face Match
    setTimeout(() => {
      updateStageStatus(2, 'passed', 'Facial vector match 98.6% confidence', 380, { confidenceScore: 98.6 });
      setCurrentStepIndex(3);
      setMotionPrompt('ACTION REQUESTED: Turn head slightly left & blink twice');
    }, 2200);

    // Step 4: Liveness
    setTimeout(() => {
      if (simulatedRiskScenario === 'liveness_fail') {
        updateStageStatus(3, 'failed', 'Liveness score low: Possible screen playback detected', 550, { livenessScore: 42.0 });
        setOverallResult('rejected');
        setIsVerifying(false);
        setMotionPrompt('Verification Failed: Spoofing anomaly flagged');
        return;
      } else {
        updateStageStatus(3, 'passed', 'Passed 3D liveness micro-gesture check', 480, { livenessScore: 96.4 });
        setCurrentStepIndex(4);
        setMotionPrompt('Validating GPS classroom geofence...');
      }
    }, 3200);

    // Step 5: Location
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

      if (simulatedRiskScenario === 'geofence_flag') {
        setOverallResult('pending_review');
      } else {
        setOverallResult('verified');
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
              Live Attendance Verification
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              LAYERED ZERO-TRUST
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.rollNumber}) • Target Session: <strong className="text-cyan-400">CS401 Lab 302</strong>
          </p>
        </div>

        {/* Demo Scenario Switcher */}
        <div className="bg-[#121A2B] border border-[#1E2D4A] p-1.5 rounded-lg flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px] pl-1">Scenario:</span>
          <button
            onClick={() => setSimulatedRiskScenario('normal')}
            className={`px-2 py-1 rounded text-[11px] transition-all ${
              simulatedRiskScenario === 'normal' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            Normal (Pass)
          </button>
          <button
            onClick={() => setSimulatedRiskScenario('geofence_flag')}
            className={`px-2 py-1 rounded text-[11px] transition-all ${
              simulatedRiskScenario === 'geofence_flag' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            Geofence Flag
          </button>
          <button
            onClick={() => setSimulatedRiskScenario('liveness_fail')}
            className={`px-2 py-1 rounded text-[11px] transition-all ${
              simulatedRiskScenario === 'liveness_fail' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Spoof Fail
          </button>
        </div>
      </div>

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Live Camera & Sensor Viewport */}
        <div className="lg:col-span-5 bg-[#121A2B] border border-[#1E2D4A] rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" /> SENSOR & CAMERA FEED
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> GPS: {gpsAccuracy}m
              </span>
            </div>

            {/* Viewport Frame with Face Oval Overlay */}
            <div className="relative w-full aspect-[4/3] bg-[#070B14] rounded-xl overflow-hidden border border-[#1E2D4A] flex items-center justify-center scanline shadow-inner">
              {/* Simulated Camera Video Stream background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-[#0B1020]/60" />

              {/* Facial Scanner Target Oval */}
              <div className={`relative w-48 h-60 rounded-[50%] border-2 transition-all flex items-center justify-center ${
                isVerifying ? 'border-cyan-400 cyan-glow scale-105' : 
                overallResult === 'verified' ? 'border-emerald-400 teal-glow' :
                overallResult === 'rejected' ? 'border-rose-400' :
                'border-slate-600'
              }`}>
                {/* Facial Mesh Scanning Grid simulation */}
                <div className="w-36 h-48 rounded-[50%] border border-cyan-500/20 border-dashed animate-spin" style={{ animationDuration: '12s' }} />
                <Scan className={`w-8 h-8 absolute ${isVerifying ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              </div>

              {/* Top Motion Prompt Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#0B1020]/90 backdrop-blur-md border border-[#1E2D4A] p-2.5 rounded-lg text-center text-xs font-mono text-cyan-300 shadow-lg">
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

          {/* Verification Action Trigger Button */}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Layer {currentStepIndex + 1}...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Start Multi-Layer Verification Test
                </>
              )}
            </button>

            {/* Status Feedback Banner */}
            {overallResult === 'verified' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-lg flex items-center justify-between font-mono">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> VERIFICATION PASSED
                </span>
                <button
                  onClick={() => setActiveScreen('student-dashboard')}
                  className="text-cyan-400 hover:underline"
                >
                  Return to Dashboard →
                </button>
              </div>
            )}

            {overallResult === 'pending_review' && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-lg flex items-center justify-between font-mono">
                <span className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> ROUTED TO FACULTY REVIEW
                </span>
                <button
                  onClick={() => setActiveScreen('investigation-center')}
                  className="text-amber-400 hover:underline"
                >
                  Inspect Case →
                </button>
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
              simulatedRiskScenario === 'geofence_flag' ? 68 : simulatedRiskScenario === 'liveness_fail' ? 92 : 4
            }
            explainableRiskFactors={
              simulatedRiskScenario === 'geofence_flag'
                ? ['GPS location (42m) exceeded classroom radius (25m)']
                : simulatedRiskScenario === 'liveness_fail'
                ? ['Liveness challenge failed: 2D static reflection detected']
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};
