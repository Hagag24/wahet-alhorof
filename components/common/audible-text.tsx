"use client";

import { useTTS } from "@/hooks/use-tts";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudibleTextProps {
  text: string;
  audioPath?: string;
  className?: string;
  showIcon?: boolean;
  variant?: "inline" | "block";
  stopPropagation?: boolean;
}

export function AudibleText({
  text,
  audioPath,
  className,
  showIcon = true,
  variant = "inline",
  stopPropagation = true
}: AudibleTextProps) {
  const { speak, isSpeaking } = useTTS();

  const handleSpeak = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    speak(text, audioPath);
  };

  return (
    <span
      onClick={handleSpeak}
      className={cn(
        "cursor-pointer transition-colors duration-200 rounded-md px-1 -mx-1",
        isSpeaking ? "bg-primary/20 text-primary font-bold shadow-sm" : "hover:bg-primary/10",
        variant === "block" ? "block w-full" : "inline-flex items-center gap-1",
        className
      )}
      title="انقر للاستماع"
    >
      {text}
      {showIcon && (
        <Volume2 
          className={cn(
            "w-4 h-4 opacity-50",
            isSpeaking && "opacity-100 animate-pulse text-primary"
          )} 
        />
      )}
    </span>
  );
}
