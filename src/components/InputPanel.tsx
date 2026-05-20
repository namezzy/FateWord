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
      <div className="scroll-border rounded-lg p-6 sm:p-8">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => handleInput(e.target.value)}
            onCompositionStart={() => { isComposing.current = true; }}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={(e) => e.key === 'Enter' && !isComposing.current && handleSubmit()}
            placeholder="请输入 1-3 个汉字"
            className="w-full text-center text-2xl sm:text-3xl tracking-[0.3em] py-4
                       bg-white/60 border border-[var(--color-border)] rounded-md
                       text-[var(--color-dan-mo)] placeholder:text-[var(--color-border)]
                       placeholder:text-base placeholder:tracking-[0.2em]
                       focus:outline-none focus:border-[var(--color-gu-tong)]
                       focus:ring-1 focus:ring-[var(--color-gu-tong)]
                       transition-all duration-300"
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
          className="w-full mt-5 py-3 px-8 border border-[var(--color-gu-tong)]
                     text-[var(--color-gu-tong)] text-lg tracking-[0.4em]
                     rounded-md transition-all duration-300
                     hover:bg-[var(--color-gu-tong)] hover:text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent disabled:hover:text-[var(--color-gu-tong)]"
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
            '测 算'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
