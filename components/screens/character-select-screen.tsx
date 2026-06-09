"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { characters } from "@/data/characters";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import { AudibleText } from "@/components/common/audible-text";
import type { Character } from "@/types";

interface CharacterSelectScreenProps {
  onSelect: (character: Character) => void;
}

const characterEmojis: Record<string, string> = {
  "rabbit": "🐰",
  "cat": "🐱",
  "bird": "🐦",
  "bear": "🐻",
  "fox": "🦊",
  "panda": "🐼",
};

export function CharacterSelectScreen({ onSelect }: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const { speak } = useTTS();
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  useEffect(() => {
    if (!hasSpokenWelcome) {
      speak("اختر صديقك المفضل ليرافقك في رحلة التعلم!");
      setHasSpokenWelcome(true);
    }
  }, [speak, hasSpokenWelcome]);

  const handleSelect = (character: Character) => {
    setSelected(character);
    speak(`رائع! لقد اخترت ${character.name}. ${character.description}`);
  };

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-4 md:p-8 relative" dir="rtl">
      {/* Decorative stars/dots background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full"
            style={{
              width: Math.random() * 30 + 10 + 'px',
              height: Math.random() * 30 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#FACC15' : '#39BDF8'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#5B49D1] mb-4">
            اختر صديقك المفضل
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-bold">
            سيرافقك صديقك في رحلة التعلم الممتعة!
          </p>
        </motion.div>

        {/* Characters Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12"
        >
          {characters.map((character, i) => {
            const isSelected = selected?.id === character.id;
            return (
              <motion.button
                key={character.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(character)}
                className={`
                  relative p-6 md:p-10 rounded-[3rem] bg-white shadow-xl
                  transition-all duration-300 text-center border-4
                  ${isSelected
                    ? "border-[#6366F1] shadow-2xl ring-8 ring-[#6366F1]/10"
                    : "border-transparent hover:border-gray-100"
                  }
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-4 -left-4 w-12 h-12 bg-[#6366F1] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
                  >
                    <Check className="w-7 h-7 text-white stroke-[4px]" />
                  </motion.div>
                )}

                {/* Character emoji */}
                <motion.div
                  animate={isSelected ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] mb-4 sm:mb-6 filter drop-shadow-lg"
                >
                  {characterEmojis[character.image] || "🎭"}
                </motion.div>

                {/* Character name */}
                <h3 className={`text-lg sm:text-xl md:text-2xl font-black mb-2 transition-colors ${isSelected ? "text-[#6366F1]" : "text-gray-800"}`}>
                  <AudibleText text={character.name} showIcon={false} stopPropagation={false} />
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium leading-relaxed">
                  <AudibleText text={character.description} showIcon={false} stopPropagation={false} />
                </p>
                
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-[#6366F1] font-black text-sm flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    اختيار رائع!
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleContinue}
            disabled={!selected}
            size="lg"
            className="text-2xl sm:text-3xl py-8 sm:py-10 px-8 sm:px-16 rounded-[2rem] bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_10px_0_#4338CA] active:shadow-none active:translate-y-2 transition-all gap-4 font-black disabled:opacity-50 disabled:grayscale"
          >
            {selected ? (
              <>
                انطلق مع {selected.name}
                <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </>
            ) : (
              "اختر صديقك أولاً"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
