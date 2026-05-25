'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputPanel from '@/components/InputPanel';
import ResultPanel from '@/components/ResultPanel';
import LanguageSwitch from '@/components/LanguageSwitch';
import { analyzeCharacters, type CharacterInfo } from '@/lib/character';
import { divine, type DivinationResult } from '@/lib/meihua';
import { generateFortune, type FortuneResult } from '@/lib/fortune';
import { useLanguage } from '@/lib/i18n';

interface HistoryEntry {
  id: string;
  text: string;
  timestamp: number;
  hexName: string;
}

export default function Home() {
  const { locale, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<CharacterInfo[] | null>(null);
  const [divination, setDivination] = useState<DivinationResult | null>(null);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('fateword_history') || '[]');
      } catch { return []; }
    }
    return [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const handleDivine = useCallback(async (text: string) => {
    setIsLoading(true);
    setAiStatus('idle');

    try {
      // 1. 解析汉字
      const charInfos = await analyzeCharacters(text);
      setCharacters(charInfos);

      // 2. 起卦（使用繁体笔画）
      const input = {
        characters: charInfos.map(c => c.traditionalChar),
        strokeCounts: charInfos.map(c => c.traditionalStrokes),
      };
      const result = divine(input);
      setDivination(result);

      // 3. 生成运势
      const fortuneResult = generateFortune(result, charInfos, locale);
      setFortune(fortuneResult);

      // 4. 保存历史
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now(),
        hexName: result.originalHex.fullName,
      };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fateword_history', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Divination error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [history, locale]);

  // AI 增强：调用 DeepSeek API 生成更详细的解读
  const handleAiEnhance = useCallback(async () => {
    if (!divination || !characters || !fortune || aiLoading) return;
    setAiLoading(true);
    setAiStatus('idle');

    try {
      const res = await fetch('/api/divine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hexagramData: {
            originalHex: divination.originalHex.fullName,
            mutualHex: divination.mutualHex.fullName,
            changedHex: divination.changedHex.fullName,
            movingLine: divination.movingLine,
          },
          characters: characters.map(c => c.traditionalChar).join(''),
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        // 用 AI 生成的文本替换本地文本
        const aiData = data.data;
        setFortune(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            isAiEnhanced: true,
            overallFortune: aiData.overall || prev.overallFortune,
            aiAdvice: (aiData.dos || aiData.poem) ? {
              dos: aiData.dos || '',
              donts: aiData.donts || '',
              luckyColor: aiData.luckyColor || '',
              luckyNumber: aiData.luckyNumber || '',
              luckyDirection: aiData.luckyDirection || '',
              poem: aiData.poem || '',
            } : undefined,
            aspects: prev.aspects.map(aspect => {
              if (aspect.name === '事业' || aspect.name === '事業' || aspect.name === 'Career') {
                return { ...aspect, summary: aiData.career || aspect.summary, detail: aiData.careerDetail || aspect.detail };
              }
              if (aspect.name === '财运' || aspect.name === '財運' || aspect.name === 'Wealth') {
                return { ...aspect, summary: aiData.wealth || aspect.summary, detail: aiData.wealthDetail || aspect.detail };
              }
              if (aspect.name === '感情' || aspect.name === 'Love') {
                return { ...aspect, summary: aiData.love || aspect.summary, detail: aiData.loveDetail || aspect.detail };
              }
              if (aspect.name === '健康' || aspect.name === 'Health') {
                return { ...aspect, summary: aiData.health || aspect.summary, detail: aiData.healthDetail || aspect.detail };
              }
              return aspect;
            }),
          };
        });
        setAiStatus('success');
      } else {
        setAiStatus('failed');
      }
    } catch (err) {
      console.error('AI enhance error:', err);
      setAiStatus('failed');
    } finally {
      setAiLoading(false);
    }
  }, [divination, characters, fortune, aiLoading]);

  // 删除单条历史记录
  const handleDeleteEntry = useCallback((id: string) => {
    const newHistory = history.filter(e => e.id !== id);
    setHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fateword_history', JSON.stringify(newHistory));
    }
  }, [history]);

  // 清空全部历史记录
  const handleClearAll = useCallback(() => {
    setHistory([]);
    setShowHistory(false);
    setConfirmClearAll(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fateword_history');
    }
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12 overflow-hidden">
      <LanguageSwitch />

      {/* 背景装饰：太极八卦图 */}
      <div className="taiji-bg" aria-hidden="true">
        {/* 中心太极图 */}
        <div className="bagua-circle bagua-circle-rotate">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            {/* 太极阴阳 */}
            <circle cx="250" cy="250" r="120" fill="none" stroke="#8B7355" strokeWidth="1"/>
            <path d="M250,130 A120,120 0 0,1 250,370 A60,60 0 0,0 250,250 A60,60 0 0,1 250,130" fill="#8B7355" opacity="0.3"/>
            <path d="M250,130 A120,120 0 0,0 250,370 A60,60 0 0,1 250,250 A60,60 0 0,0 250,130" fill="#8B7355" opacity="0.08"/>
            <circle cx="250" cy="190" r="12" fill="#8B7355" opacity="0.08"/>
            <circle cx="250" cy="310" r="12" fill="#8B7355" opacity="0.3"/>

            {/* 八卦方位文字 */}
            <text x="250" y="90" textAnchor="middle" fill="#8B7355" fontSize="16" fontFamily="serif">☰ 乾</text>
            <text x="250" y="425" textAnchor="middle" fill="#8B7355" fontSize="16" fontFamily="serif">☷ 坤</text>
            <text x="95" y="255" textAnchor="middle" fill="#8B7355" fontSize="16" fontFamily="serif">☵ 坎</text>
            <text x="405" y="255" textAnchor="middle" fill="#8B7355" fontSize="16" fontFamily="serif">☲ 离</text>
            <text x="130" y="130" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">☶ 艮</text>
            <text x="370" y="130" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">☱ 兑</text>
            <text x="130" y="385" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">☳ 震</text>
            <text x="370" y="385" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">☴ 巽</text>

            {/* 八卦连线 */}
            <circle cx="250" cy="250" r="180" fill="none" stroke="#8B7355" strokeWidth="0.5" strokeDasharray="4,6"/>
            <circle cx="250" cy="250" r="220" fill="none" stroke="#8B7355" strokeWidth="0.3" strokeDasharray="2,8"/>
          </svg>
        </div>

        {/* 五行相生环 */}
        <div className="wuxing-ring wuxing-ring-rotate">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* 五行文字：金木水火土 */}
            <text x="150" y="30" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">金</text>
            <text x="270" y="120" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">水</text>
            <text x="225" y="265" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">木</text>
            <text x="75" y="265" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">火</text>
            <text x="30" y="120" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif">土</text>
            {/* 相生箭头 */}
            <circle cx="150" cy="150" r="100" fill="none" stroke="#8B7355" strokeWidth="0.5" strokeDasharray="3,5"/>
          </svg>
        </div>

        {/* 角落装饰卦符 */}
        <div className="absolute top-[8%] left-[6%] text-7xl text-[var(--color-gu-tong)] opacity-[0.03]" style={{ transform: 'rotate(-15deg)' }}>☰</div>
        <div className="absolute bottom-[8%] right-[6%] text-7xl text-[var(--color-gu-tong)] opacity-[0.03]" style={{ transform: 'rotate(15deg)' }}>☷</div>
        <div className="absolute top-[40%] right-[4%] text-5xl text-[var(--color-gu-tong)] opacity-[0.03]" style={{ transform: 'rotate(10deg)' }}>☵</div>
        <div className="absolute bottom-[30%] left-[4%] text-5xl text-[var(--color-gu-tong)] opacity-[0.03]" style={{ transform: 'rotate(-10deg)' }}>☲</div>

        {/* 竖排古文装饰 */}
        <div className="vertical-text absolute top-[15%] left-[2%] text-xs text-[var(--color-gu-tong)] opacity-[0.06] hidden lg:block tracking-[0.5em]">
          {t('app.verticalLeft')}
        </div>
        <div className="vertical-text absolute top-[15%] right-[2%] text-xs text-[var(--color-gu-tong)] opacity-[0.06] hidden lg:block tracking-[0.5em]">
          {t('app.verticalRight')}
        </div>
      </div>

      {/* 顶部装饰线 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="max-w-2xl mx-auto mb-6"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gu-tong)] to-transparent opacity-40" />
        <div className="flex justify-center gap-3 -mt-[3px]">
          <span className="text-[6px] text-[var(--color-border)] bg-[var(--color-xuan-zhi)] px-2">◆</span>
        </div>
      </motion.div>

      {/* 标题 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-6 sm:mb-10"
      >
        {/* 古诗引言 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="quote-classical text-xs sm:text-sm mb-5 max-w-xs mx-auto"
        >
          {t('app.quote')}
        </motion.p>

        <h1 className="text-4xl sm:text-6xl tracking-[0.5em] text-[var(--color-dan-mo)] mb-3 relative inline-block">
          {t('app.title')}
        </h1>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[var(--color-gu-tong)] opacity-60" />
          <span className="text-[var(--color-zhu-sha)] text-2xl">☯</span>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[var(--color-gu-tong)] opacity-60" />
        </div>

        <p className="text-xs sm:text-sm text-[var(--color-gu-tong)] tracking-[0.4em]">
          {t('app.subtitle')}
        </p>

        {/* 八卦符号装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex justify-center gap-3 mt-4 text-xl text-[#6a5a4a]"
        >
          {['☰','☱','☲','☳','☴','☵','☶','☷'].map((s, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </motion.header>

      {/* 输入 */}
      <InputPanel onDivine={handleDivine} isLoading={isLoading} />

      {/* 加载动画 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-5xl text-[var(--color-gu-tong)]"
            >
              ☯
            </motion.div>
            <p className="mt-4 text-sm text-[var(--color-gu-tong)] tracking-[0.2em]">
              {t('app.loading')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结果 */}
      <AnimatePresence>
        {!isLoading && divination && characters && fortune && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <ResultPanel
              divination={divination}
              characters={characters}
              fortune={fortune}
            />

            {/* AI 增强按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-lg mx-auto mt-6 text-center"
            >
              {aiStatus === 'success' ? (
                <div className="text-sm text-[var(--color-zhu-sha)] tracking-[0.2em]">
                  {t('ai.success')}
                </div>
              ) : aiStatus === 'failed' ? (
                <div className="space-y-2">
                  <div className="text-sm text-[var(--color-zhu-sha)]">{t('ai.failed')}</div>
                  <button
                    onClick={handleAiEnhance}
                    className="text-xs text-[var(--color-gu-tong)] hover:text-[var(--color-dan-mo)]
                               underline underline-offset-4 transition-colors"
                  >
                    {t('ai.enhance')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    onClick={handleAiEnhance}
                    disabled={aiLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2.5 px-8 border border-[var(--color-gu-tong)]
                               text-sm text-[var(--color-gu-tong)] tracking-[0.2em]
                               transition-all duration-300
                               hover:bg-[var(--color-gu-tong)] hover:text-white
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? t('ai.loading') : t('ai.enhance')}
                  </motion.button>
                  <p className="text-[10px] text-[var(--color-gu-tong)] opacity-70">
                    {t('ai.desc')}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 历史记录 */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-md mx-auto mt-12"
        >
          <button
            onClick={() => { setShowHistory(!showHistory); setConfirmClearAll(false); }}
            className="w-full text-center text-xs text-[#6a5a4a]
                       hover:text-[var(--color-dan-mo)] transition-colors"
          >
            {showHistory ? t('history.collapse') : t('history.expand')}{t('history.label')} ({history.length})
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                {/* 清空全部按钮 */}
                <div className="flex justify-end mb-2">
                  {confirmClearAll ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--color-zhu-sha)]">{t('history.confirmClear')}</span>
                      <button
                        onClick={handleClearAll}
                        className="text-xs px-2 py-0.5 border border-[var(--color-zhu-sha)] text-[var(--color-zhu-sha)]
                                   hover:bg-[var(--color-zhu-sha)] hover:text-white transition-colors rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setConfirmClearAll(false)}
                        className="text-xs px-2 py-0.5 border border-[var(--color-border)] text-[#6a5a4a]
                                   hover:bg-white/50 transition-colors rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClearAll(true)}
                      className="text-xs text-[#8a7a6a] hover:text-[var(--color-zhu-sha)] transition-colors"
                    >
                      {t('history.clearAll')}
                    </button>
                  )}
                </div>

                <div className="scroll-border rounded-lg divide-y divide-[var(--color-border)]">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center hover:bg-white/30 transition-colors"
                    >
                      <button
                        onClick={() => handleDivine(entry.text)}
                        className="flex-1 px-4 py-3 flex justify-between items-center text-left"
                      >
                        <div>
                          <span className="text-base text-[var(--color-dan-mo)] tracking-[0.2em]">
                            {entry.text}
                          </span>
                          <span className="text-xs text-[var(--color-gu-tong)] ml-2">
                            {entry.hexName}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-border)]">
                          {new Date(entry.timestamp).toLocaleDateString('zh-CN')}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="px-3 py-3 text-xs text-[#aaa] hover:text-[var(--color-zhu-sha)]
                                   transition-colors shrink-0"
                        title={t('history.delete')}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <div className="inline-flex flex-col items-center gap-2">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[var(--color-gu-tong)] to-transparent" />
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6a5a4a]">
            <span>Crafted by <a href="https://github.com/namezzy" target="_blank" rel="noopener noreferrer" className="text-[#3a3a3a] font-semibold hover:text-[var(--color-zhu-sha)] transition-colors">Levi</a></span>
            <span className="mx-2">·</span>
            <a href="https://github.com/namezzy/FateWord" target="_blank" rel="noopener noreferrer"
               className="text-[#3a3a3a] font-semibold hover:text-[var(--color-zhu-sha)] transition-colors">
              GitHub
            </a>
            <span className="mx-2">·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
