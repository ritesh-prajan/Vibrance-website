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
  const doneRef    = useRef(false); // prevents any double-fire

  const [status, setStatus]     = useState<'starting' | 'running' | 'error'>('starting');
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * killCamera — guaranteed, idempotent camera shutdown.
   * 1. Stops html5-qrcode (which calls .stop() on the internal stream).
   * 2. Then hunts down every MediaStreamTrack still alive and force-stops it.
   *    This is the nuclear option that ensures the browser camera LED turns off
   *    even if html5-qrcode didn't fully release the track.
   */
  const killCamera = useCallback(async () => {
    // Step 1 – Stop and clear the html5-qrcode instance
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
      } catch { /* already stopped */ }
      try { await scanner.clear(); } catch { /* DOM already gone */ }
    }

    // Step 2 – Nuke any lingering video tracks in the page
    // (html5-qrcode sometimes leaves a track open)
    document.querySelectorAll<HTMLVideoElement>('video').forEach((vid) => {
      const stream = vid.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        vid.srcObject = null;
      }
    });

    // Step 3 – Belt-and-suspenders: ask the browser for all active media devices
    // and stop any video tracks that are still "live"
    try {
      if (navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices) {
        // We can't enumerate active tracks directly, but we can get the stream
        // that html5-qrcode opened by requesting one ourselves and immediately
        // stopping all tracks — browsers share the same device so this ends the session
        const tmpStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
        if (tmpStream) {
          tmpStream.getTracks().forEach((t) => t.stop());
        }
      }
    } catch { /* getUserMedia may throw if already released */ }
  }, []);

  // On mount: start scanner
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 12, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
          async (decoded) => {
            // On successful scan
            if (doneRef.current || cancelled) return;
            doneRef.current = true;
            await killCamera();
            onScan(decoded);
          },
          () => {} // per-frame "no QR found" — silent
        );

        if (!cancelled) setStatus('running');
      } catch (err: any) {
        if (cancelled) return;
        const msg: string = err?.message ?? String(err);
        if (/permission|denied/i.test(msg)) {
          setErrorMsg('Camera permission denied. Allow camera access in your browser settings.');
        } else if (/notfound|no camera|no device/i.test(msg)) {
          setErrorMsg('No camera device found on this device.');
        } else if (/constraint|overconstrained/i.test(msg)) {
          setErrorMsg('Camera constraints not supported. Try a different browser.');
        } else {
          setErrorMsg(msg || 'Camera could not be started.');
        }
        setStatus('error');
      }
    };

    start();

    // Cleanup on unmount — always fires whether closed by X, cancel, or scan success
    return () => {
      cancelled = true;
      if (!doneRef.current) {
        // Not yet cleaned up via scan-success path
        killCamera();
      }
    };
  }, [killCamera, onScan]);

  // X button / Cancel button — explicit user close
  const handleClose = async () => {
    if (doneRef.current) { onClose(); return; }
    doneRef.current = true;
    await killCamera();
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
            <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm font-mono">Camera Unavailable</div>
                <div className="text-xs text-white/50 font-mono leading-relaxed max-w-xs">{errorMsg}</div>
              </div>
              <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-mono flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                <span>Close and type the booking reference into the manual entry field.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-mono text-white/40 text-center tracking-wide uppercase">
                Align QR code within the frame
              </p>

              {/* Camera viewport */}
              <div
                className="relative w-full rounded-2xl overflow-hidden bg-black"
                style={{ aspectRatio: '1' }}
              >
                {/* html5-qrcode renders its <video> inside this div */}
                <div
                  id={SCANNER_ID}
                  className="absolute inset-0 w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:!object-cover [&_img]:!hidden [&_canvas]:!hidden"
                />

                {/* Vignette — only once camera is live */}
                {status === 'running' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 56% 56% at 50% 50%, transparent 38%, rgba(0,0,0,0.78) 100%)',
                    }}
                  />
                )}

                {/* Viewfinder: corner brackets + scan beam */}
                {status === 'running' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-52 h-52">
                      {/* Corners */}
                      <span className="absolute top-0 left-0   w-9 h-9 border-t-[3px] border-l-[3px] border-[#FF3E41] rounded-tl-xl" />
                      <span className="absolute top-0 right-0  w-9 h-9 border-t-[3px] border-r-[3px] border-[#FF3E41] rounded-tr-xl" />
                      <span className="absolute bottom-0 left-0  w-9 h-9 border-b-[3px] border-l-[3px] border-[#FF3E41] rounded-bl-xl" />
                      <span className="absolute bottom-0 right-0 w-9 h-9 border-b-[3px] border-r-[3px] border-[#FF3E41] rounded-br-xl" />

                      {/* Scan beam */}
                      <div
                        className="absolute inset-x-2 overflow-hidden"
                        style={{ top: '6px', bottom: '6px' }}
                      >
                        <div
                          className="scan-beam absolute left-0 right-0 h-[2px]"
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

                {/* Starting spinner */}
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
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer border border-white/10"
          >
            Cancel &amp; Use Manual Entry
          </button>
        </div>
      </div>

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
