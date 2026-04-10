// src/components/QRModal.jsx
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { roomUrl } from "../utils/helpers";

export default function QRModal({ room, onClose }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, roomUrl(room.id), {
        width: 200,
        margin: 2,
        color: { dark: "#1e293b", light: "#ffffff" },
      });
    }
  }, [room.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-2xl bg-white p-6 shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 font-mono text-xs text-slate-400">Scan to open</p>
        <h3 className="mb-4 text-lg font-bold text-slate-800">{room.name}</h3>
        <canvas ref={canvasRef} className="mx-auto rounded-lg" />
        <p className="mt-3 text-xs text-slate-400 break-all">{roomUrl(room.id)}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded-xl bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
