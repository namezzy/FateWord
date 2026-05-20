'use client';

import { motion } from 'framer-motion';
import { type DivinationResult } from '@/lib/meihua';
import { type CharacterInfo } from '@/lib/character';
import { type FortuneResult } from '@/lib/fortune';
import CharacterInfoDisplay from './CharacterInfo';
import HexagramDisplay from './HexagramDisplay';
import FortuneCard from './FortuneCard';

interface ResultPanelProps {
  divination: DivinationResult;
  characters: CharacterInfo[];
  fortune: FortuneResult;
}

export default function ResultPanel({ divination, characters, fortune }: ResultPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto space-y-8"
    >
      {/* 卷轴展开分隔线 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gu-tong)] to-transparent"
      />

      {/* 字解 */}
      <section>
        <CharacterInfoDisplay characters={characters} />
      </section>

      <div className="ink-divider" />

      {/* 卦象 */}
      <section>
        <HexagramDisplay result={divination} />
      </section>

      <div className="ink-divider" />

      {/* 批语 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-center text-[var(--color-gu-tong)] tracking-[0.3em] mb-4 text-sm">
          — 批 语 —
        </h3>
        <div className="scroll-border rounded-lg p-5 sm:p-6 relative corner-ornament">
          {/* 印章装饰 */}
          <div className="absolute top-3 right-3 seal-stamp hidden sm:inline-flex">
            卦
          </div>
          <div className="text-sm sm:text-base text-[var(--color-dan-mo)] leading-loose whitespace-pre-line sm:pr-14">
            {fortune.overallFortune}
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--color-border-light,var(--color-border))] flex justify-between items-center">
            <span className="text-xs text-[var(--color-gu-tong)]">
              ☰ 梅花易数
            </span>
            <span className="text-xs text-[var(--color-gu-tong)]">
              {fortune.dateGanZhi.label}日 · {fortune.wuxingRelation}
            </span>
          </div>
        </div>
      </motion.section>

      <div className="ink-divider" />

      {/* 四柱运势 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-center text-[var(--color-gu-tong)] tracking-[0.3em] mb-4 text-sm">
          — 四 柱 运 势 —
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fortune.aspects.map((aspect, i) => (
            <FortuneCard key={aspect.name} aspect={aspect} index={i} />
          ))}
        </div>
      </motion.section>

      {/* 底部 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center py-8 space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <span className="text-[var(--color-border)] text-sm">☯</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>
        <p className="text-xs text-[var(--color-border)]">此测算结果仅供娱乐参考</p>
        <p className="text-[10px] text-[var(--color-border)] tracking-[0.2em]">
          易曰：「天垂象，见吉凶，圣人象之」
        </p>
      </motion.div>
    </motion.div>
  );
}
