import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const scannerId = 'qr-scanner-region';

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (mountedRef.current) {
              onScan(decodedText);
              stopScanner();
            }
          },
          () => {
            // silent scan failures
          }
        );

        if (mountedRef.current) setStarted(true);
      } catch (err: any) {
        if (mountedRef.current) {
          setError(
            err?.message?.includes('Permission')
              ? 'Camera permission denied. Please allow camera access and try again.'
              : 'No camera found or camera is in use by another application.'
          );
        }
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
      scannerRef.current = null;
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#2A1D26] border border-white/20 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FF7099]" />
            <span className="font-bold text-white font-mono text-sm uppercase tracking-wide">QR Scanner</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner View */}
        <div className="p-4 space-y-4">
          {error ? (
            <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <CameraOff className="w-7 h-7 text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Camera Unavailable</div>
                <div className="text-xs text-white/60 font-mono leading-relaxed">{error}</div>
              </div>
              <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>You can still type or paste the QR payload text in the manual entry field.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-mono text-white/50 text-center">
                Point camera at a Vibrance QR ticket
              </div>
              {/* Scanner DOM target */}
              <div
                id="qr-scanner-region"
                className="w-full overflow-hidden rounded-2xl bg-black border border-white/10"
                style={{ minHeight: '300px' }}
              />
              {!started && !error && (
                <div className="flex items-center justify-center py-2 gap-2 text-xs font-mono text-white/40">
                  <span className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting camera...
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Cancel &amp; Use Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
};
