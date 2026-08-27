import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const SCANNER_ID = 'vib-qr-region';

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const stoppingRef = useRef(false);

  const [status, setStatus] = useState<'starting' | 'running' | 'error'>('starting');
  const [errorMsg, setErrorMsg] = useState('');

  // Hard-stop: stop scanning, release camera track, clear DOM
  const stopScanner = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      // swallow – already stopped or never started
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // html5-qrcode needs the DOM node to exist first
        const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            // qrbox controls the *decode* region but we'll draw our own visual box
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1,
          },
          (decoded) => {
            if (!scannedRef.current && !cancelled) {
              scannedRef.current = true;
              stopScanner().then(() => onScan(decoded));
            }
          },
          () => {} // ignore per-frame "no QR" errors
        );

        if (!cancelled) setStatus('running');
      } catch (err: any) {
        if (cancelled) return;
        const msg: string = err?.message ?? String(err);
        if (/permission|denied/i.test(msg)) {
          setErrorMsg('Camera permission denied. Allow camera access in your browser settings and try again.');
        } else if (/notfound|no camera|no device/i.test(msg)) {
          setErrorMsg('No camera device found on this device.');
        } else if (/constraint|overconstrained/i.test(msg)) {
          setErrorMsg('Camera constraints not supported. Try a different browser.');
        } else {
          setErrorMsg('Camera could not be started. ' + msg);
        }
        setStatus('error');
      }
    };

    init();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [stopScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="bg-[#1a0e18] border border-white/15 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#DF367C] flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white font-mono text-sm tracking-wide uppercase">
              QR Ticket Scanner
            </span>
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
          {status === 'error' ? (
            /* ── Error State ── */
            <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm font-mono">Camera Unavailable</div>
                <div className="text-xs text-white/50 font-mono leading-relaxed max-w-xs">
                  {errorMsg}
                </div>
              </div>
              <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-mono flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                <span>
                  Close this dialog and type the booking reference or paste the QR payload into the manual entry field.
                </span>
              </div>
            </div>
          ) : (
            /* ── Camera View ── */
            <div className="space-y-3">
              <p className="text-[11px] font-mono text-white/40 text-center tracking-wide uppercase">
                Align QR code within the frame
              </p>

              {/* Outer container — clips video + overlays */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '1' }}>

                {/* html5-qrcode mounts its own <video> inside this div */}
                <div
                  id={SCANNER_ID}
                  className="absolute inset-0 w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden"
                />

                {/* Dark radial vignette */}
                {status === 'running' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 56% 56% at 50% 50%, transparent 38%, rgba(0,0,0,0.75) 100%)',
                    }}
                  />
                )}

                {/* Viewfinder brackets + scan line */}
                {status === 'running' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-52 h-52">
                      {/* Corner brackets */}
                      <span className="absolute top-0 left-0 w-9 h-9 border-t-[3px] border-l-[3px] border-[#FF3E41] rounded-tl-xl" />
                      <span className="absolute top-0 right-0 w-9 h-9 border-t-[3px] border-r-[3px] border-[#FF3E41] rounded-tr-xl" />
                      <span className="absolute bottom-0 left-0 w-9 h-9 border-b-[3px] border-l-[3px] border-[#FF3E41] rounded-bl-xl" />
                      <span className="absolute bottom-0 right-0 w-9 h-9 border-b-[3px] border-r-[3px] border-[#FF3E41] rounded-br-xl" />

                      {/* Animated scan line */}
                      <div
                        className="absolute inset-x-2"
                        style={{ top: '6px', bottom: '6px', overflow: 'hidden' }}
                      >
                        <div className="scan-beam absolute left-0 right-0 h-[2px]"
                          style={{
                            background:
                              'linear-gradient(90deg, transparent 0%, #FF3E41 30%, #DF367C 50%, #FF3E41 70%, transparent 100%)',
                            boxShadow: '0 0 10px 3px rgba(255,62,65,0.55)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Starting overlay */}
                {status === 'starting' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-[#DF367C] rounded-full animate-spin" />
                    <span className="text-xs font-mono text-white/50">Starting camera…</span>
                  </div>
                )}
              </div>

              {status === 'running' && (
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#10B981]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse inline-block" />
                  Camera active — scanning for QR code
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-white/8 hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer border border-white/10"
          >
            Cancel &amp; Use Manual Entry
          </button>
        </div>
      </div>

      {/* Scan beam animation */}
      <style>{`
        .scan-beam {
          animation: vib-scan 2.2s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes vib-scan {
          0%   { top: 0;    opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
