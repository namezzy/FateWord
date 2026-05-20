// 汉字处理模块 - cnchar 封装
// cnchar 在浏览器端使用，提供笔画数和拼音

import { type WuXing } from './bagua';

// cnchar 类型声明
declare function cnchar_stroke(char: string): number;

// 五行偏旁部首映射（简化版）
const WUXING_RADICALS: Record<string, WuXing> = {
  // 金
  '金': '金', '钅': '金', '刂': '金', '刀': '金', '戈': '金', '矛': '金',
  // 木
  '木': '木', '艹': '木', '竹': '木', '禾': '木',
  // 水
  '水': '水', '氵': '水', '冫': '水', '雨': '水',
  // 火
  '火': '火', '灬': '火', '日': '火', '光': '火',
  // 土
  '土': '土', '石': '土', '山': '土', '田': '土',
};

// 根据笔画数判断五行（传统方法）
// 尾数 1,2 → 木; 3,4 → 火; 5,6 → 土; 7,8 → 金; 9,0 → 水
function getWuXingByStrokes(strokes: number): WuXing {
  const lastDigit = strokes % 10;
  if (lastDigit === 1 || lastDigit === 2) return '木';
  if (lastDigit === 3 || lastDigit === 4) return '火';
  if (lastDigit === 5 || lastDigit === 6) return '土';
  if (lastDigit === 7 || lastDigit === 8) return '金';
  return '水'; // 9, 0
}

export interface CharacterInfo {
  char: string;
  pinyin: string;
  strokes: number;
  wuxing: WuXing;
}

// 常见字笔画数备用表（当 cnchar 不可用时）
const STROKE_FALLBACK: Record<string, number> = {
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '天': 4, '地': 6, '人': 2, '大': 3, '小': 3, '中': 4, '上': 3, '下': 3,
  '日': 4, '月': 4, '水': 4, '火': 4, '山': 3, '风': 4, '雷': 13, '泽': 8,
  '龙': 5, '虎': 8, '凤': 4, '鹤': 15, '梅': 11, '兰': 5, '竹': 6, '菊': 11,
  '春': 9, '夏': 10, '秋': 9, '冬': 5, '东': 5, '南': 9, '西': 6, '北': 5,
  '金': 8, '木': 4, '土': 3, '石': 5, '云': 4, '雪': 11, '花': 7, '草': 9,
  '爱': 10, '心': 4, '思': 9, '想': 13, '梦': 11, '情': 11, '缘': 12, '福': 13,
  '运': 7, '命': 8, '吉': 6, '祥': 10, '和': 8, '平': 5, '安': 6, '康': 11,
  '富': 12, '贵': 9, '明': 8, '光': 6, '德': 15, '道': 12, '善': 12, '美': 9,
  '学': 8, '文': 4, '武': 8, '才': 3, '智': 12, '慧': 15, '勇': 9, '信': 9,
  '仁': 4, '义': 3, '礼': 5, '孝': 7, '忠': 8, '诚': 8, '家': 10, '国': 8,
};

// 常见字拼音备用表
const PINYIN_FALLBACK: Record<string, string> = {
  '天': 'tiān', '地': 'dì', '人': 'rén', '大': 'dà', '小': 'xiǎo', '中': 'zhōng',
  '日': 'rì', '月': 'yuè', '水': 'shuǐ', '火': 'huǒ', '山': 'shān', '风': 'fēng',
  '金': 'jīn', '木': 'mù', '土': 'tǔ', '龙': 'lóng', '凤': 'fèng',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng',
  '爱': 'ài', '心': 'xīn', '梦': 'mèng', '福': 'fú', '运': 'yùn', '命': 'mìng',
  '吉': 'jí', '祥': 'xiáng', '和': 'hé', '平': 'píng', '安': 'ān',
  '家': 'jiā', '国': 'guó', '学': 'xué', '文': 'wén', '德': 'dé', '道': 'dào',
};

let cncharLoaded = false;
let cncharModule: any = null;

async function loadCnchar(): Promise<void> {
  if (cncharLoaded) return;
  try {
    cncharModule = (await import('cnchar')).default;
    cncharLoaded = true;
  } catch {
    console.warn('cnchar not available, using fallback stroke data');
  }
}

export function getStrokeCount(char: string): number {
  if (cncharModule) {
    try {
      const result = cncharModule.stroke(char);
      if (typeof result === 'number' && result > 0) return result;
    } catch { /* fallback */ }
  }
  return STROKE_FALLBACK[char] || estimateStrokes(char);
}

// Unicode 编码估算笔画（粗略后备方案）
function estimateStrokes(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    return Math.floor((code - 0x4E00) / 2000) + 5;
  }
  return 8; // default
}

export function getPinyin(char: string): string {
  if (cncharModule) {
    try {
      const result = cncharModule.spell(char, 'tone');
      if (result && typeof result === 'string') return result.toLowerCase();
    } catch { /* fallback */ }
  }
  return PINYIN_FALLBACK[char] || '?';
}

export function getCharacterWuXing(char: string): WuXing {
  const strokes = getStrokeCount(char);
  return getWuXingByStrokes(strokes);
}

export async function analyzeCharacter(char: string): Promise<CharacterInfo> {
  await loadCnchar();
  return {
    char,
    pinyin: getPinyin(char),
    strokes: getStrokeCount(char),
    wuxing: getCharacterWuXing(char),
  };
}

export async function analyzeCharacters(text: string): Promise<CharacterInfo[]> {
  await loadCnchar();
  return Array.from(text).map(char => ({
    char,
    pinyin: getPinyin(char),
    strokes: getStrokeCount(char),
    wuxing: getCharacterWuXing(char),
  }));
}
