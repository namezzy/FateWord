'use client';

import { motion } from 'framer-motion';
import { type CharacterInfo } from '@/lib/character';
import { getWuXingColor, getWuXingEmoji } from '@/lib/wuxing';

interface CharacterInfoDisplayProps {
  characters: CharacterInfo[];
}

export default function CharacterInfoDisplay({ characters }: CharacterInfoDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <h3 className="text-center text-[var(--color-gu-tong)] tracking-[0.3em] mb-4 text-sm">
        — 字 解 —
      </h3>
      <div className="flex justify-center gap-4 sm:gap-6">
        {characters.map((info, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="scroll-border rounded-lg p-4 sm:p-5 text-center min-w-[100px]"
          >
            <div className="text-4xl sm:text-5xl mb-2 text-[var(--color-dan-mo)]">
              {info.char}
            </div>
            <div className="text-sm text-[var(--color-gu-tong)] mb-1">
              {info.pinyin}
            </div>
            <div className="ink-divider !my-2" />
            <div className="text-xs text-[var(--color-dan-mo)] space-y-1">
              <div>笔画：<span className="font-bold">{info.strokes}</span></div>
              <div className="flex items-center justify-center gap-1">
                五行：
                <span
                  className="font-bold"
                  style={{ color: getWuXingColor(info.wuxing) }}
                >
                  {getWuXingEmoji(info.wuxing)} {info.wuxing}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
