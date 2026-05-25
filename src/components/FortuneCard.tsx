'use client';

import { motion } from 'framer-motion';
import { type FortuneAspect } from '@/lib/fortune';

interface FortuneCardProps {
  aspect: FortuneAspect;
  index: number;
  isAiEnhanced?: boolean;
}

function PlumBlossomRating({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1 justify-center my-2">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${i < score ? 'plum-blossom active' : 'plum-blossom inactive'}`}
        >
          ✿
        </span>
      ))}
    </div>
  );
}

export default function FortuneCard({ aspect, index, isAiEnhanced }: FortuneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`scroll-border rounded-lg p-4 sm:p-5 fortune-card-hover corner-ornament relative ${
        isAiEnhanced ? 'ai-enhanced-card' : ''
      }`}
    >
      {isAiEnhanced && (
        <div className="absolute -top-2.5 right-3 ai-badge">
          ✨ AI
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{aspect.icon}</span>
        <h4 className="text-base font-bold text-[#1a1a1a] tracking-[0.2em]">
          {aspect.name}
        </h4>
      </div>

      <PlumBlossomRating score={aspect.score} />

      <p className="text-sm text-[#2a2a2a] font-semibold mb-2">
        {aspect.summary}
      </p>
      <p className="text-xs text-[#5a4a3a] leading-relaxed">
        {aspect.detail}
      </p>
    </motion.div>
  );
}
