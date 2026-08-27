import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CameraOff, AlertTriangle, ScanLine } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  // Hard-stop everything: video stream + html5-qrcode instance
  const stopAll = useCallback(() => {
    // Stop html5-qrcode if it's running
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    // Kill the MediaStream tracks explicitly so the camera LED turns off
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    const SCANNER_DIV_ID = 'qr-camera-feed';

    const start = async () => {
      try {
        // First get raw stream so we can display custom viewfinder on the <video> element
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Now start Html5Qrcode on the hidden div for decoding only
        const scanner = new Html5Qrcode(SCANNER_DIV_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 12, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            if (!scannedRef.current) {
              scannedRef.current = true;
              stopAll();
              onScan(decoded);
            }
          },
          () => {} // ignore per-frame failures
        );

        setStarted(true);
      } catch (err: any) {
        const msg = err?.message ?? '';
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
          setError('Camera permission denied. Please allow camera access in your browser and try again.');
        } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('no camera')) {
          setError('No camera device found on this device.');
        } else {
          setError('Could not start camera. It may be in use by another app.');
        }
      }
    };

    start();

    return () => {
      stopAll();
    };
  }, [stopAll]);

  const handleClose = () => {
    stopAll();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      {/* Hidden html5-qrcode scanning target — off-screen */}
      <div
        id="qr-camera-feed"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="bg-[#1a0e18] border border-white/15 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DF367C] flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white font-mono text-sm tracking-wide uppercase">QR Ticket Scanner</span>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          {error ? (
            /* ── Error State ── */
            <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm font-mono">Camera Unavailable</div>
                <div className="text-xs text-white/50 font-mono leading-relaxed max-w-xs">{error}</div>
              </div>
              <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-mono flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                <span>Close this dialog and type the booking reference or QR payload into the manual entry field instead.</span>
              </div>
            </div>
          ) : (
            /* ── Camera View + Viewfinder ── */
            <div className="space-y-3">
              <p className="text-[11px] font-mono text-white/40 text-center tracking-wide uppercase">
                Align QR code within the frame
              </p>

              {/* Camera viewport */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black">

                {/* Live video feed */}
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark vignette overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)',
                  }}
                />

                {/* Viewfinder cutout box */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-56 h-56">

                    {/* Corner brackets */}
                    {/* Top-left */}
                    <span className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#FF3E41] rounded-tl-lg" />
                    {/* Top-right */}
                    <span className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#FF3E41] rounded-tr-lg" />
                    {/* Bottom-left */}
                    <span className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#FF3E41] rounded-bl-lg" />
                    {/* Bottom-right */}
                    <span className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#FF3E41] rounded-br-lg" />

                    {/* Animated scan line */}
                    <div className="absolute inset-x-0 overflow-hidden" style={{ top: '4px', bottom: '4px' }}>
                      <div
                        className="absolute left-0 right-0 h-px"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #FF3E41, #DF367C, #FF3E41, transparent)',
                          animation: 'scanline 2s ease-in-out infinite',
                          boxShadow: '0 0 8px 2px rgba(255,62,65,0.6)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Loading overlay — before camera starts */}
                {!started && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-[#DF367C] rounded-full animate-spin" />
                    <span className="text-xs font-mono text-white/50">Starting camera...</span>
                  </div>
                )}
              </div>

              {started && (
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#10B981]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse inline-block" />
                  Camera live — scanning for QR code
                </div>
              )}
            </div>
          )}

          {/* Close / Cancel */}
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer border border-white/10"
          >
            Cancel &amp; Use Manual Entry
          </button>
        </div>
      </div>

      {/* Scan line keyframe */}
      <style>{`
        @keyframes scanline {
          0%   { top: 4px;  opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
