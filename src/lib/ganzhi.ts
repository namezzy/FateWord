// 天干地支 (Heavenly Stems & Earthly Branches)

import { type WuXing } from './bagua';

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

const GAN_WUXING: Record<string, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};

const ZHI_WUXING: Record<string, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

export interface GanZhi {
  gan: string;
  zhi: string;
  ganWuXing: WuXing;
  zhiWuXing: WuXing;
  label: string;
}

// 根据日期计算天干地支（简化算法，基于已知参照日推算）
// 参照：2000年1月7日 = 甲子日
export function getDateGanZhi(date: Date = new Date()): GanZhi {
  const ref = new Date(2000, 0, 7); // 2000-01-07 甲子日
  const diffDays = Math.floor((date.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
  const ganIndex = ((diffDays % 10) + 10) % 10;
  const zhiIndex = ((diffDays % 12) + 12) % 12;

  const gan = TIAN_GAN[ganIndex];
  const zhi = DI_ZHI[zhiIndex];

  return {
    gan,
    zhi,
    ganWuXing: GAN_WUXING[gan],
    zhiWuXing: ZHI_WUXING[zhi],
    label: `${gan}${zhi}`,
  };
}

// 获取当前年份的天干地支
export function getYearGanZhi(year: number = new Date().getFullYear()): GanZhi {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  const gan = TIAN_GAN[ganIndex];
  const zhi = DI_ZHI[zhiIndex];

  return {
    gan,
    zhi,
    ganWuXing: GAN_WUXING[gan],
    zhiWuXing: ZHI_WUXING[zhi],
    label: `${gan}${zhi}`,
  };
}
