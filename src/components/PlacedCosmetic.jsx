import React, { useRef, useCallback } from "react";
import { X, RotateCw, Maximize2 } from "lucide-react";
import { useSound } from "@/lib/SoundContext";

export default function PlacedCosmetic({ item, cosmetic, containerRef, onChange, onRemove }) {
  const itemRef = useRef(null);
  const dragState = useRef(null);
  const lastScaleSoundTime = useRef(0);
  const lastRotateAngleForSound = useRef(0);
  const { playScaleTick, playRotateTick, playCancel } = useSound();

  const getCenter = () => {
    const rect = itemRef.current.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const onPointerMove = useCallback(
    (e) => {
      const state = dragState.current;
      if (!state) return;
      e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      if (state.type === "move") {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((point.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((point.clientY - rect.top) / rect.height) * 100));
        onChange(item.key, { x, y });
      } else if (state.type === "rotate") {
        const angle = Math.atan2(point.clientY - state.center.y, point.clientX - state.center.x) * (180 / Math.PI);
        const rotation = state.startRotation + (angle - state.startAngle);
        onChange(item.key, { rotation });
        if (Math.abs(rotation - lastRotateAngleForSound.current) > 12) {
          playRotateTick();
          lastRotateAngleForSound.current = rotation;
        }
      } else if (state.type === "scale") {
        const dist = Math.hypot(point.clientX - state.center.x, point.clientY - state.center.y);
        const scale = Math.min(6, Math.max(0.3, (dist / state.startDist) * state.startScale));
        onChange(item.key, { scale });
        const now = Date.now();
        if (now - lastScaleSoundTime.current > 90) {
          playScaleTick();
          lastScaleSoundTime.current = now;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.key]
  );

  const onPointerUp = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPointerMove]);

  const startDrag = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "scale") lastScaleSoundTime.current = 0;
    if (type === "rotate") lastRotateAngleForSound.current = item.rotation || 0;
    const point = e.touches ? e.touches[0] : e;
    const center = getCenter();
    dragState.current = {
      type,
      center,
      startAngle: Math.atan2(point.clientY - center.y, point.clientX - center.x) * (180 / Math.PI),
      startRotation: item.rotation || 0,
      startDist: Math.hypot(point.clientX - center.x, point.clientY - center.y) || 1,
      startScale: item.scale || 1,
    };
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  };

  const invScale = 1 / (item.scale || 1);

  return (
    <div
      ref={itemRef}
      className="absolute w-20 h-20 group touch-none cosmetic-item"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${item.scale || 1})`,
      }}
    >
      <img
        src={cosmetic.image}
        alt={cosmetic.name}
        onMouseDown={startDrag("move")}
        onTouchStart={startDrag("move")}
        className="w-full h-full object-contain cursor-move"
        draggable={false}
      />
      <button
        onClick={() => { playCancel(); onRemove(item.key); }}
        title="Remove"
        data-no-sound
        style={{ transform: `scale(${invScale})` }}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} className="text-white" />
      </button>
      <button
        onMouseDown={startDrag("rotate")}
        onTouchStart={startDrag("rotate")}
        title="Rotate"
        data-no-sound
        style={{ transform: `scale(${invScale})` }}
        className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-[#FF3CAC] border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-alias"
      >
        <RotateCw size={12} className="text-black" />
      </button>
      <button
        onMouseDown={startDrag("scale")}
        onTouchStart={startDrag("scale")}
        title="Resize"
        data-no-sound
        style={{ transform: `scale(${invScale})` }}
        className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#FFEB3B] border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
      >
        <Maximize2 size={12} className="text-black" />
      </button>
    </div>
  );
}