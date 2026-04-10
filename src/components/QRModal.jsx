// src/components/QRModal.jsx
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { roomUrl } from "../utils/helpers";
import useStore from "../store/useStore";

export default function QRModal({ room, onClose }) {
  const canvasRef = useRef();
  const theme = useStore((s) => s.theme);
  const isDark = theme === "dark";

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, roomUrl(room.id), {
        width: 200,
        margin: 2,
        color: { dark: isDark ? "#e2e8f0" : "#1e293b", light: isDark ? "#131b2d" : "#ffffff" },
      });
    }
  }, [room.id, isDark]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 text-center shadow-xl"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 font-mono text-xs" style={{ color: "var(--text-subtle)" }}>Scan to open</p>
        <h3 className="mb-4 text-lg font-bold" style={{ color: "var(--text)" }}>{room.name}</h3>
        <canvas
          ref={canvasRef}
          className="mx-auto rounded-lg"
          style={{ border: `1px solid ${isDark ? "#2a3651" : "#d8e1ec"}` }}
        />
        <p className="mt-3 break-all text-xs" style={{ color: "var(--text-subtle)" }}>{roomUrl(room.id)}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded-xl px-5 py-2 text-sm font-medium transition-colors"
          style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
