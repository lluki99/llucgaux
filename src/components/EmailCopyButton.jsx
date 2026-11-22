import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { useSound } from "@/lib/SoundContext";

export default function EmailCopyButton({ email }) {
  const [copied, setCopied] = useState(false);
  const { playCoin } = useSound();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.button
      onClick={handleCopy}
      data-hover
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center gap-3 border-4 border-[#FF3CAC] text-[#FF3CAC] font-heading uppercase text-xl px-8 py-4 shadow-hardMagenta hover:bg-[#FF3CAC] hover:text-[#080808] transition-colors"
    >
      <Mail size={22} />
      {email}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#FFEB3B] text-[#080808] text-xs font-heading uppercase px-3 py-1"
          >
            <Check size={14} /> Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}