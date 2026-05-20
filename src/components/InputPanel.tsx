'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputPanelProps {
  onDivine: (text: string) => void;
  isLoading: boolean;
}

export default function InputPanel({ onDivine, isLoading }: InputPanelProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const isComposing = useRef(false);

  const handleInput = (value: string) => {
    // IME 组字过程中不过滤，允许拼音输入
    if (isComposing.current) {
      setText(value);
      return;
    }
    const chinese = value.replace(/[^\u4e00-\u9fff]/g, '');
    if (chinese.length <= 3) {
      setText(chinese);
      setError('');
    } else {
      setError('最多输入 3 个汉字');
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const value = e.currentTarget.value;
    const chinese = value.replace(/[^\u4e00-\u9fff]/g, '');
    if (chinese.length <= 3) {
      setText(chinese);
      setError('');
    } else {
      setText(chinese.slice(0, 3));
      setError('最多输入 3 个汉字');
    }
  };

  const handleSubmit = () => {
    if (text.length === 0) {
      setError('请输入至少 1 个汉字');
      return;
    }
    setError('');
    onDivine(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="scroll-border rounded-lg p-6 sm:p-8 corner-ornament">
        {/* 顶部装饰 */}
        <div className="text-center mb-4">
          <span className="text-xs text-[var(--color-border)] tracking-[0.3em]">
            ─── 请书一字 ───
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => handleInput(e.target.value)}
            onCompositionStart={() => { isComposing.current = true; }}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={(e) => e.key === 'Enter' && !isComposing.current && handleSubmit()}
            placeholder="落笔生卦"
            className="w-full text-center text-3xl sm:text-4xl tracking-[0.5em] py-5
                       bg-transparent border-b-2 border-[var(--color-border)]
                       text-[var(--color-dan-mo)] placeholder:text-[var(--color-border)]
                       placeholder:text-lg placeholder:tracking-[0.3em]
                       focus:outline-none focus:border-[var(--color-gu-tong)]
                       transition-all duration-500"
            maxLength={3}
            disabled={isLoading}
          />
          <AnimatePresence>
            {text.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-gu-tong)]"
              >
                {text.length}/3
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[var(--color-zhu-sha)] text-sm text-center mt-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || text.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3.5 px-8 border-2 border-[var(--color-gu-tong)]
                     text-[var(--color-gu-tong)] text-lg tracking-[0.5em]
                     transition-all duration-500 relative overflow-hidden
                     hover:bg-[var(--color-gu-tong)] hover:text-white hover:shadow-lg
                     disabled:opacity-30 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent disabled:hover:text-[var(--color-gu-tong)]
                     disabled:hover:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                ☯
              </motion.span>
              起卦中...
            </span>
          ) : (
            '卜 · 测 算'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
