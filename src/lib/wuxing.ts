import { type WuXing } from './bagua';

// 五行生克关系

// 生（相生）：木→火→土→金→水→木
const SHENG_MAP: Record<WuXing, WuXing> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// 克（相克）：木→土→水→火→金→木
const KE_MAP: Record<WuXing, WuXing> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
};

export type WuXingRelation = '相生' | '相克' | '被生' | '被克' | '比和';

export function getRelation(from: WuXing, to: WuXing): WuXingRelation {
  if (from === to) return '比和';
  if (SHENG_MAP[from] === to) return '相生';
  if (KE_MAP[from] === to) return '相克';
  // 反向
  if (SHENG_MAP[to] === from) return '被生';
  if (KE_MAP[to] === from) return '被克';
  return '比和';
}

// 运势权重：生 > 比和 > 被生 > 被克 > 克
export function getFortuneWeight(relation: WuXingRelation): number {
  switch (relation) {
    case '相生': return 5;
    case '比和': return 4;
    case '被生': return 3;
    case '被克': return 2;
    case '相克': return 1;
  }
}

// 五行对应颜色
export function getWuXingColor(wx: WuXing): string {
  const colors: Record<WuXing, string> = {
    '金': '#E8B004',
    '木': '#2D8B4E',
    '水': '#1A6B8A',
    '火': '#C93756',
    '土': '#8B7355',
  };
  return colors[wx];
}

export function getWuXingEmoji(wx: WuXing): string {
  const emojis: Record<WuXing, string> = {
    '金': '🪙', '木': '🌿', '水': '💧', '火': '🔥', '土': '⛰️',
  };
  return emojis[wx];
}
