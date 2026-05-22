// 汉字处理模块 - cnchar 封装
// cnchar 在浏览器端使用，提供笔画数和拼音
// cnchar-trad 提供简繁转换功能

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
  char: string;           // 简体字（用户输入）
  traditionalChar: string; // 繁体字（用于测算）
  pinyin: string;
  strokes: number;         // 简体笔画
  traditionalStrokes: number; // 繁体笔画（用于起卦）
  wuxing: WuXing;          // 基于繁体笔画的五行
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
let cncharTradLoaded = false;

async function loadCnchar(): Promise<void> {
  if (cncharLoaded) return;
  try {
    cncharModule = (await import('cnchar')).default;
    // 加载繁体插件 — cnchar-trad 提供 install() 方法注册
    try {
      const tradPlugin = (await import('cnchar-trad')).default || await import('cnchar-trad');
      if (tradPlugin?.install) {
        tradPlugin.install(cncharModule);
      } else if (typeof tradPlugin === 'function') {
        (tradPlugin as any)(cncharModule);
      }
      cncharTradLoaded = true;
    } catch {
      console.warn('cnchar-trad not available, using fallback traditional data');
    }
    cncharLoaded = true;
  } catch {
    console.warn('cnchar not available, using fallback stroke data');
  }
}

// 常用简繁对照表（后备方案）
const SIMPLIFIED_TO_TRADITIONAL: Record<string, string> = {
  '天': '天', '地': '地', '人': '人', '大': '大', '小': '小', '中': '中', '上': '上', '下': '下',
  '日': '日', '月': '月', '水': '水', '火': '火', '山': '山', '风': '風', '雷': '雷', '泽': '澤',
  '龙': '龍', '虎': '虎', '凤': '鳳', '鹤': '鶴', '梅': '梅', '兰': '蘭', '竹': '竹', '菊': '菊',
  '春': '春', '夏': '夏', '秋': '秋', '冬': '冬', '东': '東', '南': '南', '西': '西', '北': '北',
  '金': '金', '木': '木', '土': '土', '石': '石', '云': '雲', '雪': '雪', '花': '花', '草': '草',
  '爱': '愛', '心': '心', '思': '思', '想': '想', '梦': '夢', '情': '情', '缘': '緣', '福': '福',
  '运': '運', '命': '命', '吉': '吉', '祥': '祥', '和': '和', '平': '平', '安': '安', '康': '康',
  '富': '富', '贵': '貴', '明': '明', '光': '光', '德': '德', '道': '道', '善': '善', '美': '美',
  '学': '學', '文': '文', '武': '武', '才': '才', '智': '智', '慧': '慧', '勇': '勇', '信': '信',
  '仁': '仁', '义': '義', '礼': '禮', '孝': '孝', '忠': '忠', '诚': '誠', '家': '家', '国': '國',
  '马': '馬', '车': '車', '书': '書', '画': '畫', '长': '長', '门': '門', '开': '開', '关': '關',
  '见': '見', '观': '觀', '觉': '覺', '说': '說', '话': '話', '语': '語', '读': '讀', '写': '寫',
  '钱': '錢', '银': '銀', '铁': '鐵', '铜': '銅', '钟': '鐘', '镜': '鏡', '链': '鏈', '锁': '鎖',
  '飞': '飛', '鸟': '鳥', '鱼': '魚', '鸡': '雞', '鸭': '鴨', '鹅': '鵝', '猪': '豬', '狗': '狗',
  '树': '樹', '叶': '葉', '果': '果', '园': '園', '场': '場', '城': '城', '楼': '樓', '桥': '橋',
  '头': '頭', '脸': '臉', '眼': '眼', '耳': '耳', '鼻': '鼻', '嘴': '嘴', '手': '手', '脚': '腳',
  '红': '紅', '绿': '綠', '蓝': '藍', '黄': '黃', '黑': '黑', '白': '白', '紫': '紫', '灰': '灰',
  '气': '氣', '电': '電', '灯': '燈', '机': '機', '器': '器', '网': '網', '线': '線', '图': '圖',
  '时': '時', '岁': '歲', '年': '年', '分': '分', '秒': '秒', '点': '點', '星': '星', '阳': '陽',
  '阴': '陰', '乾': '乾', '坤': '坤', '离': '離', '坎': '坎', '震': '震', '巽': '巽', '艮': '艮',
  '兑': '兌', '易': '易', '卦': '卦', '象': '象', '数': '數', '理': '理', '占': '占', '测': '測',
  '财': '財', '宝': '寶', '丰': '豐', '华': '華', '贤': '賢', '圣': '聖', '灵': '靈', '神': '神',
  '佛': '佛', '禅': '禪', '寿': '壽', '喜': '喜', '乐': '樂', '欢': '歡', '笑': '笑', '泪': '淚',
};

// 繁体字笔画表（后备方案）
const TRADITIONAL_STROKE_FALLBACK: Record<string, number> = {
  '風': 9, '澤': 16, '龍': 16, '鳳': 14, '鶴': 21, '蘭': 21,
  '東': 8, '雲': 12, '愛': 13, '夢': 14, '緣': 15, '運': 12,
  '貴': 12, '學': 16, '義': 13, '禮': 18, '誠': 14, '國': 11,
  '馬': 10, '車': 7, '書': 10, '畫': 12, '長': 8, '門': 8,
  '開': 12, '關': 19, '見': 7, '觀': 25, '覺': 20, '說': 14,
  '話': 13, '語': 14, '讀': 22, '寫': 15, '錢': 16, '銀': 14,
  '鐵': 21, '銅': 14, '鐘': 17, '鏡': 19, '飛': 9, '鳥': 11,
  '魚': 11, '雞': 18, '鴨': 16, '鵝': 18, '豬': 16, '樹': 16,
  '葉': 13, '園': 13, '場': 12, '樓': 15, '橋': 16, '頭': 16,
  '臉': 17, '腳': 13, '紅': 9, '綠': 14, '藍': 18, '黃': 12,
  '氣': 10, '電': 13, '燈': 16, '機': 16, '網': 14, '線': 15,
  '圖': 14, '時': 10, '歲': 13, '點': 17, '陽': 12, '陰': 12,
  '離': 19, '兌': 8, '數': 15, '測': 12, '財': 10, '寶': 20,
  '豐': 18, '華': 14, '賢': 15, '聖': 13, '靈': 24, '壽': 14,
  '樂': 15, '歡': 22, '淚': 11, '鏈': 19, '鎖': 18,
};

// 简繁转换
export function toTraditional(char: string): string {
  if (cncharTradLoaded && cncharModule) {
    try {
      // cnchar-trad 注册后提供 convert.simpleToTrad 方法
      if (typeof cncharModule.convert?.simpleToTrad === 'function') {
        const trad = cncharModule.convert.simpleToTrad(char);
        if (trad && typeof trad === 'string' && trad.length > 0) return trad;
      }
    } catch { /* fallback */ }
  }
  // 逐字查表转换
  return Array.from(char).map(c => SIMPLIFIED_TO_TRADITIONAL[c] || c).join('');
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

// 获取繁体字笔画数
export function getTraditionalStrokeCount(traditionalChar: string): number {
  // 先尝试 cnchar 直接计算繁体笔画
  if (cncharModule) {
    try {
      const result = cncharModule.stroke(traditionalChar);
      if (typeof result === 'number' && result > 0) return result;
    } catch { /* fallback */ }
  }
  // 繁体笔画后备表
  if (TRADITIONAL_STROKE_FALLBACK[traditionalChar]) {
    return TRADITIONAL_STROKE_FALLBACK[traditionalChar];
  }
  // 简体笔画后备表（字相同的情况）
  return STROKE_FALLBACK[traditionalChar] || estimateStrokes(traditionalChar);
}

export async function analyzeCharacter(char: string): Promise<CharacterInfo> {
  await loadCnchar();
  const traditionalChar = toTraditional(char);
  const traditionalStrokes = traditionalChar !== char
    ? getTraditionalStrokeCount(traditionalChar)
    : getStrokeCount(char);
  return {
    char,
    traditionalChar,
    pinyin: getPinyin(char),
    strokes: getStrokeCount(char),
    traditionalStrokes,
    wuxing: getWuXingByStrokes(traditionalStrokes),
  };
}

export async function analyzeCharacters(text: string): Promise<CharacterInfo[]> {
  await loadCnchar();
  return Array.from(text).map(char => {
    const traditionalChar = toTraditional(char);
    const traditionalStrokes = traditionalChar !== char
      ? getTraditionalStrokeCount(traditionalChar)
      : getStrokeCount(char);
    return {
      char,
      traditionalChar,
      pinyin: getPinyin(char),
      strokes: getStrokeCount(char),
      traditionalStrokes,
      wuxing: getWuXingByStrokes(traditionalStrokes),
    };
  });
}
