import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, XCircle, Clock, Download } from 'lucide-react';

interface DemoQr {
  label: string;
  payload: string;
  expectedResult: 'VALID' | 'INVALID' | 'EXPIRED';
  color: string;
  textColor: string;
  icon: React.ReactNode;
  description: string;
}

const DEMO_QRS: DemoQr[] = [
  {
    label: 'VALID — Armaan Malik Pro Show',
    payload: 'VIBRANCE26-TICKET-VIB26-ARMAAN-A1-RA2111003010142',
    expectedResult: 'VALID',
    color: '#10B981',
    textColor: 'text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'Seat A-1 · VIP Front · Rahul Sharma',
  },
  {
    label: 'VALID — Choreonite Dance Clash',
    payload: 'VIBRANCE26-TICKET-VIB26-DANCE-B4-RA2111003010142',
    expectedResult: 'VALID',
    color: '#10B981',
    textColor: 'text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'Seat B-4 · VIP Front · Rahul Sharma',
  },
  {
    label: 'EXPIRED — Past Hackathon',
    payload: 'VIB26-HACK-EXPIRED',
    expectedResult: 'EXPIRED',
    color: '#f59e0b',
    textColor: 'text-amber-300',
    icon: <Clock className="w-4 h-4" />,
    description: 'Hackathon pass - event concluded',
  },
  {
    label: 'INVALID — Forged Ticket',
    payload: 'VIB26-INVALID-TEST99',
    expectedResult: 'INVALID',
    color: '#ef4444',
    textColor: 'text-red-400',
    icon: <XCircle className="w-4 h-4" />,
    description: 'Counterfeit / unrecognized code',
  },
];

const QrCodeCanvas: React.FC<{ payload: string; color: string }> = ({ payload, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1a0e18',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  }, [payload]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `vibrance-qr-${payload.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-2xl p-3 bg-white shadow-lg border-4"
        style={{ borderColor: color }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
      >
        <Download className="w-3 h-3" />
        Save PNG
      </button>
    </div>
  );
};

import { GlassCard } from '../../components/common/GlassCard';

export const DemoQrCodesPage: React.FC = () => {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
            GATE STAFF DEMO TOOL
          </span>
          <span className="text-xs text-white/50">Mock QR Tickets for Scanner Testing</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
          DEMO QR PASS CODES
        </h1>
        <p className="text-sm text-white/50 mt-2 max-w-xl leading-relaxed">
          These are scannable QR codes for testing the gate scanner. Print or save the{' '}
          <span className="text-emerald-300 font-bold">green (VALID)</span> ones to demo a
          successful check-in flow.
        </p>
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {DEMO_QRS.map((qr) => (
          <GlassCard
            key={qr.payload}
            variant="default"
            rounded="3xl"
            glowColor={qr.color}
            className="p-6 space-y-4 shadow-xl"
            style={{ borderColor: `${qr.color}44` }}
          >
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border ${qr.textColor}`}
              style={{ backgroundColor: `${qr.color}22`, borderColor: `${qr.color}44` }}
            >
              {qr.icon}
              <span>{qr.expectedResult}</span>
            </div>

            <div>
              <div className="text-sm font-bold text-white">{qr.label}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{qr.description}</div>
            </div>

            {/* QR Code */}
            <QrCodeCanvas payload={qr.payload} color={qr.color} />

            {/* Payload Text */}
            <div className="rounded-xl bg-[#2A1D26]/80 border border-white/10 px-3.5 py-2.5 text-[11px] text-white/70 break-all">
              {qr.payload}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Instructions */}
      <GlassCard variant="subtle" rounded="3xl" className="p-6 space-y-3 text-xs text-white/60">
        <div className="text-white font-bold text-sm">How to use for demo:</div>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Save the green <span className="text-emerald-300">VALID</span> QR images (click Save PNG below each).</li>
          <li>Open the Gate Scanner page on the device you'll be scanning from.</li>
          <li>Click <span className="text-[#FF7099] font-bold">Scan QR Code</span> to open the camera.</li>
          <li>Hold the saved/printed QR image up to the camera.</li>
          <li>The system will auto-detect and process the ticket — no typing needed.</li>
        </ol>
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          The expired and invalid codes will demonstrate how the system rejects unauthorized entry attempts.
        </div>
      </GlassCard>
    </div>
  );
};
