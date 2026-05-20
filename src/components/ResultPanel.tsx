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
        <div className="scroll-border rounded-lg p-5 sm:p-6">
          <div className="text-sm sm:text-base text-[var(--color-dan-mo)] leading-loose whitespace-pre-line">
            {fortune.overallFortune}
          </div>
          <div className="mt-3 text-xs text-[var(--color-gu-tong)] text-right">
            {fortune.dateGanZhi.label}日 · 字五行{fortune.wuxingRelation}日辰
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
        className="text-center text-xs text-[var(--color-border)] py-6 space-y-1"
      >
        <p>此测算结果仅供娱乐参考</p>
        <p>基于梅花易数传统术数逻辑</p>
      </motion.div>
    </motion.div>
  );
}
