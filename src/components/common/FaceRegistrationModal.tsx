import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { db } from '../../services/db';
import { Student } from '../../types';

interface FaceRegistrationModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: (updatedStudent: Student) => void;
}

export const FaceRegistrationModal: React.FC<FaceRegistrationModalProps> = ({
  student,
  onClose,
  onSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [previewImage, setPreviewImage] = useState<string>(student.avatarUrl);
  const [isCapturing, setIsCapturing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startWebcam = () => {
    setMode('camera');
    setIsCapturing(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.warn('Webcam failed', err);
        setMode('upload');
      });
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(dataUrl);
        setIsCapturing(false);
        setMode('upload');

        // stop stream
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
        }
      }
    }
  };

  const handleSaveRegistration = () => {
    const updated = db.registerStudentFace(student.id, previewImage);
    setSuccessMsg('Facial template registered and 128-D embedding saved to database!');
    setTimeout(() => {
      if (updated) onSuccess(updated);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121A2B] border border-[#1E2D4A] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Register Student Face Profile</h3>
          </div>
          <p className="text-xs text-slate-400">
            Enrol facial biometric template for student <strong className="text-white">{student.name}</strong> ({student.rollNumber})
          </p>
        </div>

        {successMsg ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-4 rounded-xl flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Viewport Frame */}
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl bg-[#0B1020] flex items-center justify-center">
              {mode === 'camera' && isCapturing ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <img src={previewImage} alt="Registered Face" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              {mode === 'camera' && isCapturing ? (
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Snap Photo Frame
                </button>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-[#0B1020] border border-[#1E2D4A] hover:border-cyan-500 text-xs text-slate-200 flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" /> Upload Face Photo
                  </button>
                  <button
                    onClick={startWebcam}
                    className="px-3.5 py-2 rounded-lg bg-[#0B1020] border border-[#1E2D4A] hover:border-cyan-500 text-xs text-slate-200 flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" /> Use Webcam
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveRegistration}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg"
              >
                Save & Register Facial Vector in Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
