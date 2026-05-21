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
            {/* 繁体大字 */}
            <div className="text-4xl sm:text-5xl mb-1 text-[#1a1a1a] font-bold">
              {info.traditionalChar}
            </div>
            {/* 简体小字（如果不同） */}
            {info.traditionalChar !== info.char && (
              <div className="text-xs text-[#8B7355] mb-1">
                简：{info.char}
              </div>
            )}
            <div className="text-sm text-[#5a4a3a] mb-1 font-semibold">
              {info.pinyin}
            </div>
            <div className="ink-divider !my-2" />
            <div className="text-xs text-[#3a3a3a] space-y-1 font-medium">
              <div>
                繁体笔画：<span className="font-bold text-[#1a1a1a]">{info.traditionalStrokes}</span>
                {info.traditionalStrokes !== info.strokes && (
                  <span className="text-[#8B7355] ml-1">(简{info.strokes})</span>
                )}
              </div>
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
