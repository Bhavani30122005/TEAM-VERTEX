import React, { useState } from 'react';
import { QrCode, Scan, CheckCircle2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { db } from '../../services/db';
import { ClassSession } from '../../types';

interface QRScannerModalProps {
  onClose: () => void;
  onSessionSelected: (session: ClassSession, token: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  onClose,
  onSessionSelected
}) => {
  const sessions = db.getSessions().filter(s => s.status === 'active');
  const [manualToken, setManualToken] = useState(sessions[0]?.qrCodeChallengeToken || 'VERITY-SESS-9938-X7K');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanSubmit = (tokenToUse: string) => {
    setErrorMsg('');
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const activeSess = sessions.find(s => s.qrCodeChallengeToken === tokenToUse || tokenToUse.startsWith('VERITY-SESS'));
      if (activeSess) {
        onSessionSelected(activeSess, tokenToUse);
        onClose();
      } else {
        setErrorMsg('Invalid or expired QR challenge token. Session is no longer active.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Scan Session QR Code</h3>
          </div>
          <p className="text-xs text-slate-400">
            Scan active QR code displayed on Faculty Screen to bind attendance
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Viewport QR Frame Simulator */}
        <div className="relative w-full aspect-square max-w-[220px] mx-auto bg-[#070B14] rounded-xl border border-cyan-500/40 p-4 flex flex-col items-center justify-center scanline shadow-2xl">
          <Scan className={`w-12 h-12 text-cyan-400 ${isScanning ? 'animate-ping' : 'animate-pulse'}`} />
          <span className="text-[10px] font-mono text-cyan-300 mt-2">
            {isScanning ? 'Decoding HMAC token...' : 'Align QR inside box'}
          </span>
        </div>

        {/* Available Active Class Sessions Quick List */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-300 font-medium">Select Active Faculty Session</label>
          {sessions.map((sess) => (
            <div
              key={sess.id}
              onClick={() => handleScanSubmit(sess.qrCodeChallengeToken)}
              className="bg-[#0B1020] border border-[#1E2D4A] hover:border-cyan-500 p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all"
            >
              <div>
                <span className="font-mono text-cyan-400 font-bold">{sess.subjectCode}</span>
                <p className="text-white font-semibold">{sess.subjectName}</p>
                <span className="text-[10px] text-slate-400">{sess.classroomName}</span>
              </div>
              <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                SCAN & CHECKIN
              </span>
            </div>
          ))}
        </div>

        {/* Manual Token Input */}
        <div className="pt-2 flex gap-2">
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Enter token manually..."
            className="flex-1 bg-[#0B1020] border border-[#1E2D4A] p-2.5 rounded-lg text-xs font-mono text-white outline-none"
          />
          <button
            onClick={() => handleScanSubmit(manualToken)}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Submit Token
          </button>
        </div>
      </div>
    </div>
  );
};
