import React, { useRef, useState } from "react";
import { COSMETICS, AVATAR_IMAGE } from "@/lib/cosmetics";
import { useGameState } from "@/lib/GameStateContext";
import PlacedCosmetic from "@/components/PlacedCosmetic";
import { Lock } from "lucide-react";

// A transparent 1x1 image used to fully suppress the browser's native HTML5 drag-and-drop
// ghost/selection preview, so only the cosmetic PNG itself is ever visible while dragging.
const BLANK_DRAG_IMAGE = new Image();
BLANK_DRAG_IMAGE.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export default function CosmeticDecorator() {
  const { isUnlocked, placedCosmetics, addPlacedCosmetic, updatePlacedCosmetic, removePlacedCosmetic } = useGameState();
  const containerRef = useRef(null);
  const [dragPreview, setDragPreview] = useState(null); // { cosmeticId, x, y } | null

  const handleDragStart = (cosmeticId) => (e) => {
    e.dataTransfer.setDragImage(BLANK_DRAG_IMAGE, 0, 0);
    e.dataTransfer.setData("text/plain", cosmeticId);
    // Start the preview offscreen; it tracks the pointer via dragover on the container.
    setDragPreview({ cosmeticId, x: -100, y: -100 });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragPreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDragPreview((p) => (p ? { ...p, x, y } : p));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cosmeticId = e.dataTransfer.getData("text/plain");
    const cosmetic = COSMETICS.find((c) => c.id === cosmeticId);
    setDragPreview(null);
    if (!cosmetic || !isUnlocked(cosmeticId)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    addPlacedCosmetic(cosmeticId, x, y);
  };

  const handleDragEnd = () => setDragPreview(null);

  const previewCosmetic = dragPreview ? COSMETICS.find((c) => c.id === dragPreview.cosmeticId) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 items-start">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative aspect-square border-4 border-white overflow-hidden select-none"
      >
        <img src={AVATAR_IMAGE} alt="Portrait" className="w-full h-full object-cover" draggable={false} />
        {placedCosmetics.map((s) => {
          const cosmetic = COSMETICS.find((c) => c.id === s.cosmeticId);
          if (!cosmetic) return null;
          return (
            <PlacedCosmetic
              key={s.key}
              item={s}
              cosmetic={cosmetic}
              containerRef={containerRef}
              onChange={updatePlacedCosmetic}
              onRemove={removePlacedCosmetic}
            />
          );
        })}
        {/* Live preview while dragging a cosmetic from the toolbar: shown exactly as it
            will appear once placed (same size, scale 1, rotation 0), hiding the native ghost. */}
        {previewCosmetic && dragPreview.x >= 0 && (
          <div
            className="absolute w-20 h-20 pointer-events-none"
            style={{ left: `${dragPreview.x}%`, top: `${dragPreview.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <img src={previewCosmetic.image} alt="" className="w-full h-full object-contain opacity-90" draggable={false} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-heading uppercase text-xl">Cosmetics</h3>
        <p className="text-white/50 text-xs font-mono uppercase">
          Drag an unlocked item onto the photo. Then drag to move, use the pink handle to rotate, and the yellow
          handle to resize. Click the X to remove.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
          {COSMETICS.map((c) => {
            const unlocked = isUnlocked(c.id);
            return (
              <div
                key={c.id}
                draggable={unlocked}
                onDragStart={unlocked ? handleDragStart(c.id) : undefined}
                onDragEnd={unlocked ? handleDragEnd : undefined}
                data-hover
                className={`relative aspect-square border-2 flex items-center justify-center p-2 ${unlocked ? "border-[#FFEB3B] cursor-grab bg-white/5" : "border-white/20 bg-white/5 opacity-40"}`}
                title={unlocked ? c.name : `${c.name} (locked — win it in the slot machine)`}
              >
                <img src={c.image} alt={c.name} className="w-full h-full object-contain" draggable={false} />
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Lock size={20} className="text-white/70" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}