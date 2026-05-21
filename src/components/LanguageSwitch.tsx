'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, type Locale } from '@/lib/i18n';

const options: { value: Locale; label: string }[] = [
  { value: 'zh-CN', label: '简体' },
  { value: 'zh-TW', label: '繁體' },
  { value: 'en', label: 'EN' },
];

export default function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLabel = options.find(o => o.value === locale)!.label;

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-xs tracking-wide
                   border border-[var(--color-border)] rounded
                   text-[var(--color-gu-tong)] bg-[var(--color-xuan-zhi)]
                   hover:border-[var(--color-gu-tong)] transition-colors
                   backdrop-blur-sm bg-opacity-90"
      >
        {currentLabel}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 py-1 min-w-[72px]
                        border border-[var(--color-border)] rounded
                        bg-[var(--color-xuan-zhi)] shadow-md">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setLocale(opt.value); setOpen(false); }}
              className={`block w-full px-3 py-1.5 text-xs text-left transition-colors
                ${opt.value === locale
                  ? 'text-[var(--color-dan-mo)] font-semibold'
                  : 'text-[var(--color-gu-tong)] hover:bg-white/40'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
