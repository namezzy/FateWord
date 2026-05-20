'use client';

import { motion } from 'framer-motion';
import { type DivinationResult } from '@/lib/meihua';
import { type Trigram } from '@/lib/bagua';
import { type Hexagram } from '@/lib/hexagrams';

interface HexagramDisplayProps {
  result: DivinationResult;
}

function TrigramSymbol({ trigram, label }: { trigram: Trigram; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-[var(--color-gu-tong)] mb-1">{label}</div>
      <div className="trigram-symbol">{trigram.symbol}</div>
      <div className="text-sm mt-1">{trigram.name}({trigram.nature})</div>
    </div>
  );
}

function HexagramCard({ hexagram, label, delay = 0 }: { hexagram: Hexagram; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="scroll-border rounded-lg p-4 text-center flex-1 min-w-[90px]"
    >
      <div className="text-xs text-[var(--color-gu-tong)] tracking-[0.2em] mb-2">{label}</div>
      <div className="text-2xl sm:text-3xl mb-1 text-[#1a1a1a] font-bold">{hexagram.name}</div>
      <div className="text-xs text-[#5a4a3a] font-medium">{hexagram.fullName}</div>
    </motion.div>
  );
}

// 绘制六爻图
function YaoLines({ result }: { result: DivinationResult }) {
  const lines = [
    ...result.lowerTrigram.lines,
    ...result.upperTrigram.lines,
  ];

  return (
    <div className="flex flex-col-reverse gap-1 items-center my-3">
      {lines.map((line, i) => {
        const isMoving = i + 1 === result.movingLine;
        return (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="flex items-center gap-1"
          >
            {line === 1 ? (
              // 阳爻 ———
              <div
                className={`w-24 h-2 rounded-sm ${
                  isMoving ? 'bg-[var(--color-zhu-sha)] animate-pulse-glow' : 'bg-[var(--color-dan-mo)]'
                }`}
              />
            ) : (
              // 阴爻 — —
              <div className="flex gap-2">
                <div
                  className={`w-10 h-2 rounded-sm ${
                    isMoving ? 'bg-[var(--color-zhu-sha)] animate-pulse-glow' : 'bg-[var(--color-dan-mo)]'
                  }`}
                />
                <div
                  className={`w-10 h-2 rounded-sm ${
                    isMoving ? 'bg-[var(--color-zhu-sha)] animate-pulse-glow' : 'bg-[var(--color-dan-mo)]'
                  }`}
                />
              </div>
            )}
            {isMoving && (
              <span className="text-[var(--color-zhu-sha)] text-xs ml-1">← 动</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HexagramDisplay({ result }: HexagramDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-lg mx-auto"
    >
      <h3 className="text-center text-[var(--color-gu-tong)] tracking-[0.3em] mb-4 text-sm">
        — 卦 象 —
      </h3>

      {/* 上下卦 */}
      <div className="flex justify-center gap-8 mb-4">
        <TrigramSymbol trigram={result.upperTrigram} label="上卦" />
        <div className="flex flex-col items-center justify-center">
          <YaoLines result={result} />
          <div className="text-xs text-[var(--color-gu-tong)]">
            动{result.movingLine}爻
          </div>
        </div>
        <TrigramSymbol trigram={result.lowerTrigram} label="下卦" />
      </div>

      {/* 本卦 / 互卦 / 变卦 */}
      <div className="flex gap-3">
        <HexagramCard hexagram={result.originalHex} label="本 卦" delay={0.3} />
        <HexagramCard hexagram={result.mutualHex} label="互 卦" delay={0.45} />
        <HexagramCard hexagram={result.changedHex} label="变 卦" delay={0.6} />
      </div>

      {/* 卦辞 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-4 text-center text-sm text-[var(--color-dan-mo)] italic"
      >
        「{result.originalHex.description}」
      </motion.div>
    </motion.div>
  );
}
