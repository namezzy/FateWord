// 八卦 (Eight Trigrams) data with 先天八卦 numbering

export type WuXing = '金' | '木' | '水' | '火' | '土';

export interface Trigram {
  number: number;     // 先天八卦数 1-8
  name: string;       // 卦名
  symbol: string;     // Unicode 符号
  nature: string;     // 自然象征
  wuxing: WuXing;     // 五行属性
  lines: [number, number, number]; // 从下到上: 1=阳, 0=阴
}

export const TRIGRAMS: Record<number, Trigram> = {
  1: { number: 1, name: '乾', symbol: '☰', nature: '天', wuxing: '金', lines: [1, 1, 1] },
  2: { number: 2, name: '兑', symbol: '☱', nature: '泽', wuxing: '金', lines: [0, 1, 1] },
  3: { number: 3, name: '离', symbol: '☲', nature: '火', wuxing: '火', lines: [1, 0, 1] },
  4: { number: 4, name: '震', symbol: '☳', nature: '雷', wuxing: '木', lines: [1, 0, 0] },
  5: { number: 5, name: '巽', symbol: '☴', nature: '风', wuxing: '木', lines: [0, 1, 1] },
  6: { number: 6, name: '坎', symbol: '☵', nature: '水', wuxing: '水', lines: [0, 1, 0] },
  7: { number: 7, name: '艮', symbol: '☶', nature: '山', wuxing: '土', lines: [1, 0, 0] },
  8: { number: 8, name: '坤', symbol: '☷', nature: '地', wuxing: '土', lines: [0, 0, 0] },
};

// 先天八卦数：余数 → 卦，余数为0取8（坤）
export function getTrigramByRemainder(remainder: number): Trigram {
  const n = remainder === 0 ? 8 : remainder;
  return TRIGRAMS[n];
}

export function getTrigramByNumber(num: number): Trigram {
  return TRIGRAMS[num];
}
