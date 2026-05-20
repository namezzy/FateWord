'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputPanel from '@/components/InputPanel';
import ResultPanel from '@/components/ResultPanel';
import { analyzeCharacters, type CharacterInfo } from '@/lib/character';
import { divine, type DivinationResult } from '@/lib/meihua';
import { generateFortune, type FortuneResult } from '@/lib/fortune';

interface HistoryEntry {
  id: string;
  text: string;
  timestamp: number;
  hexName: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<CharacterInfo[] | null>(null);
  const [divination, setDivination] = useState<DivinationResult | null>(null);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('fateword_history') || '[]');
      } catch { return []; }
    }
    return [];
  });
  const [showHistory, setShowHistory] = useState(false);

  const handleDivine = useCallback(async (text: string) => {
    setIsLoading(true);

    try {
      // 1. 解析汉字
      const charInfos = await analyzeCharacters(text);
      setCharacters(charInfos);

      // 2. 起卦
      const input = {
        characters: charInfos.map(c => c.char),
        strokeCounts: charInfos.map(c => c.strokes),
      };
      const result = divine(input);
      setDivination(result);

      // 3. 生成运势
      const fortuneResult = generateFortune(result, charInfos);
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
  }, [history]);

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      {/* 标题 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-4xl sm:text-5xl tracking-[0.4em] text-[var(--color-dan-mo)] mb-3">
          天机测字
        </h1>
        <div className="ink-divider" />
        <p className="text-sm text-[var(--color-gu-tong)] tracking-[0.3em] mt-3">
          梅花易数 · 测字问运
        </p>
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
              正在起卦，请稍候...
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
            onClick={() => setShowHistory(!showHistory)}
            className="w-full text-center text-xs text-[var(--color-border)]
                       hover:text-[var(--color-gu-tong)] transition-colors"
          >
            {showHistory ? '收起' : '展开'}历史记录 ({history.length})
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="scroll-border rounded-lg divide-y divide-[var(--color-border)]">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => handleDivine(entry.text)}
                      className="w-full px-4 py-3 flex justify-between items-center
                                 hover:bg-white/30 transition-colors text-left"
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
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <div className="inline-flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-500">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--color-gu-tong)] to-transparent" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-gu-tong)]">
            <span>Crafted by <span className="text-[var(--color-dan-mo)] font-semibold">Levi</span></span>
            <span className="mx-2">·</span>
            <span>Powered by <span className="text-[var(--color-dan-mo)] font-semibold">Claude Opus</span></span>
            <span className="mx-2">·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
