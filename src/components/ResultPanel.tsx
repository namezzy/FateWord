'use client';

import { motion } from 'framer-motion';
import { type DivinationResult } from '@/lib/meihua';
import { type CharacterInfo } from '@/lib/character';
import { type FortuneResult } from '@/lib/fortune';
import CharacterInfoDisplay from './CharacterInfo';
import HexagramDisplay from './HexagramDisplay';
import FortuneCard from './FortuneCard';
import ExportCard from './ExportCard';
import { useLanguage } from '@/lib/i18n';

interface ResultPanelProps {
  divination: DivinationResult;
  characters: CharacterInfo[];
  fortune: FortuneResult;
}

export default function ResultPanel({ divination, characters, fortune }: ResultPanelProps) {
  const { t } = useLanguage();
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
          {t('result.commentary')}
        </h3>
        <div className={`scroll-border rounded-lg p-5 sm:p-6 relative corner-ornament ${
          fortune.isAiEnhanced ? 'ai-enhanced-card' : ''
        }`}>
          {/* 印章装饰 */}
          <div className="absolute top-3 right-3 seal-stamp hidden sm:inline-flex">
            {fortune.isAiEnhanced ? '✨' : '卦'}
          </div>
          <div className="text-sm sm:text-base text-[#1a1a1a] leading-loose whitespace-pre-line sm:pr-14 font-medium">
            {fortune.overallFortune}
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--color-border-light,var(--color-border))] flex justify-between items-center">
            <span className="text-xs text-[var(--color-gu-tong)]">
              {fortune.isAiEnhanced ? '✨ AI · 梅花易数' : t('result.meihua')}
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
          {t('result.fourPillars')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fortune.aspects.map((aspect, i) => (
            <FortuneCard key={aspect.name} aspect={aspect} index={i} isAiEnhanced={fortune.isAiEnhanced} />
          ))}
        </div>
      </motion.section>

      {/* AI 锦囊妙计 */}
      {fortune.isAiEnhanced && fortune.aiAdvice && (
        <>
          <div className="ink-divider" />
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-center text-[var(--color-liu-li-jin)] tracking-[0.3em] mb-4 text-sm">
              {t('ai.advice.title')}
            </h3>
            <div className="ai-advice-card scroll-border rounded-lg p-5 sm:p-6 corner-ornament">
              {/* 宜忌 */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="text-xs text-[var(--color-gu-tong)] tracking-[0.2em] mb-2 flex items-center gap-1">
                    <span className="text-green-700">●</span> {t('ai.advice.dos')}
                  </div>
                  <p className="text-sm text-[#2a2a2a] leading-relaxed">{fortune.aiAdvice.dos}</p>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-gu-tong)] tracking-[0.2em] mb-2 flex items-center gap-1">
                    <span className="text-red-700">●</span> {t('ai.advice.donts')}
                  </div>
                  <p className="text-sm text-[#2a2a2a] leading-relaxed">{fortune.aiAdvice.donts}</p>
                </div>
              </div>

              {/* 幸运元素 */}
              <div className="flex flex-wrap justify-center gap-3 mb-5 py-3 border-y border-[var(--color-border-light,var(--color-border))]">
                {fortune.aiAdvice.luckyColor && (
                  <span className="ai-lucky-tag">🎨 {fortune.aiAdvice.luckyColor}</span>
                )}
                {fortune.aiAdvice.luckyNumber && (
                  <span className="ai-lucky-tag">🔢 {fortune.aiAdvice.luckyNumber}</span>
                )}
                {fortune.aiAdvice.luckyDirection && (
                  <span className="ai-lucky-tag">🧭 {fortune.aiAdvice.luckyDirection}</span>
                )}
              </div>

              {/* 赠诗 */}
              {fortune.aiAdvice.poem && (
                <div className="text-center">
                  <p className="text-sm text-[#3a3a3a] italic leading-loose tracking-[0.15em]">
                    「{fortune.aiAdvice.poem}」
                  </p>
                  <p className="text-[10px] text-[var(--color-gu-tong)] mt-1 opacity-70">
                    —— AI 赠诗
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </>
      )}

      {/* 导出图片 */}
      <ExportCard divination={divination} characters={characters} fortune={fortune} />

      {/* 底部 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center py-8 space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-gu-tong)]" />
          <span className="text-[var(--color-gu-tong)] text-sm">☯</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-gu-tong)]" />
        </div>
        <p className="text-xs text-[#5a4a3a]">{t('result.disclaimer')}</p>
        <p className="text-xs text-[#6a5a4a] tracking-[0.2em] italic">
          {t('result.yijing')}
        </p>
      </motion.div>
    </motion.div>
  );
}
