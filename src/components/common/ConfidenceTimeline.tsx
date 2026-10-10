import React from 'react';
import { 
  UserCheck, 
  Key, 
  Scan, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { VerificationStage, VerificationStatus } from '../../types';

interface ConfidenceTimelineProps {
  stages: VerificationStage[];
  overallStatus: VerificationStatus;
  riskScore?: number;
  explainableRiskFactors?: string[];
}

const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Key': return <Key className={className} />;
    case 'Scan': return <Scan className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Clock': return <Clock className={className} />;
    default: return <CheckCircle className={className} />;
  }
};

export const ConfidenceTimeline: React.FC<ConfidenceTimelineProps> = ({
  stages,
  overallStatus,
  riskScore,
  explainableRiskFactors
}) => {
  return (
    <div className="w-full bg-[#121A2B] border border-[#1E2D4A] rounded-xl p-5 shadow-2xl space-y-6">
      {/* Header with Overall Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-wide">
              Verification Confidence Timeline™
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              LAYER-BY-LAYER AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent multi-layer verification telemetry and decision rationale
          </p>
        </div>

        <div className="flex items-center gap-3">
          {riskScore !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1020] border border-[#1E2D4A]">
              <span className="text-xs text-slate-400">Risk Score:</span>
              <span className={`font-mono text-xs font-bold ${
                riskScore < 30 ? 'text-emerald-400' : riskScore < 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {riskScore}/100
              </span>
            </div>
          )}

          {/* Overall Status Badge */}
          <div className="flex items-center gap-2">
            {overallStatus === 'verified' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" /> VERIFIED
              </span>
            )}
            {overallStatus === 'pending_review' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" /> PENDING REVIEW
              </span>
            )}
            {overallStatus === 'rejected' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <XCircle className="w-4 h-4" /> REJECTED
              </span>
            )}
            {overallStatus === 'incomplete' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/30">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> IN PROGRESS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Explainable Risk Factors Warning (if present) */}
      {explainableRiskFactors && explainableRiskFactors.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-200">Flagged Risk Factors:</span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-300/90 font-mono text-[11px]">
              {explainableRiskFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Interactive Stages List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2D4A]">
        {stages.map((stage, idx) => {
          const isPassed = stage.status === 'passed';
          const isFailed = stage.status === 'failed';
          const isWarning = stage.status === 'warning';
          const isProcessing = stage.status === 'processing';

          return (
            <div key={stage.id} className="relative group">
              {/* Dot Icon */}
              <div className={`absolute -left-6 top-0.5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                isPassed ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40' :
                isFailed ? 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40' :
                isWarning ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40' :
                isProcessing ? 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/40 animate-pulse' :
                'bg-slate-800 text-slate-500 ring-1 ring-slate-700'
              }`}>
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isPassed ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : isFailed ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Card Container */}
              <div className="bg-[#0B1020]/90 border border-[#1E2D4A] hover:border-[#2A3F66] rounded-lg p-3.5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-[#121A2B] text-cyan-400 border border-[#1E2D4A]">
                      {getIcon(stage.iconName, 'w-4 h-4')}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                        Layer {idx + 1}
                      </span>
                      <h4 className="text-sm font-medium text-white">{stage.name}</h4>
                    </div>
                  </div>

                  {stage.completionTimeMs && (
                    <span className="text-[11px] font-mono text-slate-400 bg-[#121A2B] px-2 py-0.5 rounded border border-[#1E2D4A]">
                      {stage.completionTimeMs}ms
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2 pl-0.5 leading-relaxed">
                  {stage.explanation}
                </p>

                {/* Metrics detail tags */}
                {stage.metrics && (
                  <div className="flex flex-wrap gap-2 mt-2.5 pt-2 border-t border-[#1E2D4A]/50 text-[11px] font-mono">
                    {stage.metrics.confidenceScore !== undefined && (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Face Match: {stage.metrics.confidenceScore}%
                      </span>
                    )}
                    {stage.metrics.livenessScore !== undefined && (
                      <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        Liveness Score: {stage.metrics.livenessScore}%
                      </span>
                    )}
                    {stage.metrics.gpsDistanceMeters !== undefined && (
                      <span className={`px-2 py-0.5 rounded border ${
                        stage.metrics.gpsDistanceMeters <= 25 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        Distance: {stage.metrics.gpsDistanceMeters}m
                      </span>
                    )}
                    {stage.metrics.tokenAgeSeconds !== undefined && (
                      <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        Token Age: {stage.metrics.tokenAgeSeconds}s
                      </span>
                    )}
                  </div>
                )}

                {/* Failure Rationale */}
                {stage.failureReason && (
                  <div className="mt-2 text-xs text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/20 font-mono">
                    ⚠️ {stage.failureReason}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
