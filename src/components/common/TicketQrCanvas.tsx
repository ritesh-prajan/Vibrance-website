import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface TicketQrCanvasProps {
  payload: string;
  bookingRef?: string;
  size?: number;
  color?: string;
  showDownload?: boolean;
}

export const TicketQrCanvas: React.FC<TicketQrCanvasProps> = ({
  payload,
  bookingRef,
  size = 180,
  color = '#10B981',
  showDownload = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !payload) return;

    QRCode.toCanvas(canvasRef.current, payload, {
      width: size,
      margin: 2,
      color: {
        dark: '#1a0e18',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  }, [payload, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const filename = bookingRef
      ? `vibrance-pass-${bookingRef.toLowerCase()}.png`
      : `vibrance-pass-qr.png`;
    link.download = filename;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-2xl p-2.5 bg-white shadow-xl flex items-center justify-center border-2"
        style={{ borderColor: color }}
      >
        <canvas ref={canvasRef} className="block rounded-lg" />
      </div>

      {showDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 hover:text-white transition-colors cursor-pointer pt-1"
        >
          <Download className="w-3.5 h-3.5 text-[#FF7099]" />
          <span>Download Pass QR (PNG)</span>
        </button>
      )}
    </div>
  );
};
