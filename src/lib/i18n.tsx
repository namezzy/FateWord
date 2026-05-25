'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Locale = 'zh-CN' | 'zh-TW' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // App chrome
  'app.title': { 'zh-CN': '天机测字', 'zh-TW': '天機測字', 'en': 'FateWord' },
  'app.subtitle': { 'zh-CN': '梅花易数 · 测字问运 · 五行推演', 'zh-TW': '梅花易數 · 測字問運 · 五行推演', 'en': 'Plum Blossom Numerology · Character Divination' },
  'app.quote': { 'zh-CN': '善易者不占，善占者不卜', 'zh-TW': '善易者不占，善占者不卜', 'en': '"The wise need not divine, the divine need not guess"' },
  'app.verticalLeft': { 'zh-CN': '天行健君子以自强不息', 'zh-TW': '天行健君子以自強不息', 'en': '天行健君子以自强不息' },
  'app.verticalRight': { 'zh-CN': '地势坤君子以厚德载物', 'zh-TW': '地勢坤君子以厚德載物', 'en': '地势坤君子以厚德载物' },
  'app.loading': { 'zh-CN': '正在起卦，请稍候...', 'zh-TW': '正在起卦，請稍候...', 'en': 'Casting hexagram, please wait...' },

  // Input panel
  'input.prompt': { 'zh-CN': '─── 请书一字 ───', 'zh-TW': '─── 請書一字 ───', 'en': '─── Write a Character ───' },
  'input.placeholder': { 'zh-CN': '落笔生卦', 'zh-TW': '落筆生卦', 'en': 'Type here' },
  'input.errorMax': { 'zh-CN': '最多输入 3 个汉字', 'zh-TW': '最多輸入 3 個漢字', 'en': 'Maximum 3 Chinese characters' },
  'input.errorMin': { 'zh-CN': '请输入至少 1 个汉字', 'zh-TW': '請輸入至少 1 個漢字', 'en': 'Please enter at least 1 Chinese character' },
  'input.loading': { 'zh-CN': '起卦中...', 'zh-TW': '起卦中...', 'en': 'Divining...' },
  'input.submit': { 'zh-CN': '卜 · 测 算', 'zh-TW': '卜 · 測 算', 'en': '☯ Divine' },

  // Character info
  'char.title': { 'zh-CN': '— 字 解 —', 'zh-TW': '— 字 解 —', 'en': '— Character Analysis —' },
  'char.simplified': { 'zh-CN': '简：', 'zh-TW': '簡：', 'en': 'Simplified: ' },
  'char.traditionalStrokes': { 'zh-CN': '繁体笔画：', 'zh-TW': '繁體筆畫：', 'en': 'Trad. Strokes: ' },
  'char.simplifiedNote': { 'zh-CN': '简', 'zh-TW': '簡', 'en': 'Simp.' },
  'char.wuxing': { 'zh-CN': '五行：', 'zh-TW': '五行：', 'en': 'Wu Xing: ' },

  // Hexagram display
  'hex.title': { 'zh-CN': '— 卦 象 —', 'zh-TW': '— 卦 象 —', 'en': '— Hexagram —' },
  'hex.upper': { 'zh-CN': '上卦', 'zh-TW': '上卦', 'en': 'Upper' },
  'hex.lower': { 'zh-CN': '下卦', 'zh-TW': '下卦', 'en': 'Lower' },
  'hex.moving': { 'zh-CN': '← 动', 'zh-TW': '← 動', 'en': '← Moving' },
  'hex.movingLine': { 'zh-CN': '动{n}爻', 'zh-TW': '動{n}爻', 'en': 'Line {n} moves' },
  'hex.original': { 'zh-CN': '本 卦', 'zh-TW': '本 卦', 'en': 'Original' },
  'hex.mutual': { 'zh-CN': '互 卦', 'zh-TW': '互 卦', 'en': 'Mutual' },
  'hex.changed': { 'zh-CN': '变 卦', 'zh-TW': '變 卦', 'en': 'Changed' },

  // Result panel
  'result.commentary': { 'zh-CN': '— 批 语 —', 'zh-TW': '— 批 語 —', 'en': '— Commentary —' },
  'result.meihua': { 'zh-CN': '☰ 梅花易数', 'zh-TW': '☰ 梅花易數', 'en': '☰ Plum Blossom' },
  'result.fourPillars': { 'zh-CN': '— 四 柱 运 势 —', 'zh-TW': '— 四 柱 運 勢 —', 'en': '— Four Aspects —' },
  'result.disclaimer': { 'zh-CN': '此测算结果仅供娱乐参考', 'zh-TW': '此測算結果僅供娛樂參考', 'en': 'For entertainment purposes only' },
  'result.yijing': { 'zh-CN': '易曰：「天垂象，见吉凶，圣人象之」', 'zh-TW': '易曰：「天垂象，見吉凶，聖人象之」', 'en': '"The Yi says: Heaven reveals signs of fortune and misfortune"' },

  // Export card
  'export.button': { 'zh-CN': '📷 保存测算结果为图片', 'zh-TW': '📷 保存測算結果為圖片', 'en': '📷 Save Result as Image' },
  'export.hexSection': { 'zh-CN': '─── 卦 象 ───', 'zh-TW': '─── 卦 象 ───', 'en': '─── Hexagram ───' },
  'export.commentSection': { 'zh-CN': '─── 批 语 ───', 'zh-TW': '─── 批 語 ───', 'en': '─── Commentary ───' },
  'export.seal': { 'zh-CN': '卦', 'zh-TW': '卦', 'en': '卦' },
  'export.footer': { 'zh-CN': '天机测字 · 仅供娱乐', 'zh-TW': '天機測字 · 僅供娛樂', 'en': 'FateWord · For Entertainment' },
  'export.saving': { 'zh-CN': '正在生成...', 'zh-TW': '正在生成...', 'en': 'Generating...' },
  'export.save': { 'zh-CN': '💾 保存图片', 'zh-TW': '💾 保存圖片', 'en': '💾 Save Image' },
  'export.close': { 'zh-CN': '关闭', 'zh-TW': '關閉', 'en': 'Close' },

  // History
  'history.collapse': { 'zh-CN': '收起', 'zh-TW': '收起', 'en': 'Collapse' },
  'history.expand': { 'zh-CN': '展开', 'zh-TW': '展開', 'en': 'Expand' },
  'history.label': { 'zh-CN': '历史记录', 'zh-TW': '歷史記錄', 'en': 'History' },

  // Fortune aspect names
  'fortune.career': { 'zh-CN': '事业', 'zh-TW': '事業', 'en': 'Career' },
  'fortune.wealth': { 'zh-CN': '财运', 'zh-TW': '財運', 'en': 'Wealth' },
  'fortune.love': { 'zh-CN': '感情', 'zh-TW': '感情', 'en': 'Love' },
  'fortune.health': { 'zh-CN': '健康', 'zh-TW': '健康', 'en': 'Health' },

  // AI enhance
  'ai.enhance': { 'zh-CN': '✨ AI 解卦', 'zh-TW': '✨ AI 解卦', 'en': '✨ AI Reading' },
  'ai.loading': { 'zh-CN': '✨ AI 正在解卦...', 'zh-TW': '✨ AI 正在解卦...', 'en': '✨ AI is reading...' },
  'ai.success': { 'zh-CN': '✨ AI 解卦（DeepSeek）', 'zh-TW': '✨ AI 解卦（DeepSeek）', 'en': '✨ AI Reading (DeepSeek)' },
  'ai.failed': { 'zh-CN': 'AI 解卦失败，显示本地结果', 'zh-TW': 'AI 解卦失敗，顯示本地結果', 'en': 'AI reading failed, showing local result' },
  'ai.desc': { 'zh-CN': '使用 DeepSeek 大模型生成更详细的运势解读', 'zh-TW': '使用 DeepSeek 大模型生成更詳細的運勢解讀', 'en': 'Use DeepSeek LLM for a more detailed fortune reading' },

  // AI advice section
  'ai.advice.title': { 'zh-CN': '— ✨ 锦 囊 妙 计 ✨ —', 'zh-TW': '— ✨ 錦 囊 妙 計 ✨ —', 'en': '— ✨ AI Wisdom ✨ —' },
  'ai.advice.dos': { 'zh-CN': '今日宜', 'zh-TW': '今日宜', 'en': 'Auspicious' },
  'ai.advice.donts': { 'zh-CN': '今日忌', 'zh-TW': '今日忌', 'en': 'Avoid' },

  // History actions
  'history.clearAll': { 'zh-CN': '清空全部', 'zh-TW': '清空全部', 'en': 'Clear All' },
  'history.confirmClear': { 'zh-CN': '确认清空？', 'zh-TW': '確認清空？', 'en': 'Confirm?' },
  'history.delete': { 'zh-CN': '删除', 'zh-TW': '刪除', 'en': 'Delete' },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fateword_locale');
      if (saved === 'zh-CN' || saved === 'zh-TW' || saved === 'en') return saved;
    }
    return 'zh-CN';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fateword_locale', newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[locale] ?? key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
