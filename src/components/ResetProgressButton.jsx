import React from "react";
import { RotateCcw } from "lucide-react";
import { useGameState } from "@/lib/GameStateContext";
import { useSound } from "@/lib/SoundContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function ResetProgressButton() {
  const { resetProgress } = useGameState();
  const { playCancel } = useSound();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          aria-label="Reset Progress"
          title="Reset Progress"
          data-hover
          className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#111] border-4 border-[#FF3CAC] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading uppercase text-2xl text-white">Reset Progress?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/60 font-mono text-xs uppercase tracking-wide">
            This will reset your score to 0, mark every project as unvisited, and lock all cosmetics unlocked
            through the slot machine — restoring the site to its first-visit state. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={playCancel}
            data-no-sound
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={resetProgress}
            className="bg-[#FF3CAC] text-black hover:bg-[#FF3CAC]/80 font-heading uppercase"
          >
            Reset Progress
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}