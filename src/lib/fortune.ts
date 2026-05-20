// 运势文本生成模块

import { type DivinationResult } from './meihua';
import { type CharacterInfo } from './character';
import { getRelation, getFortuneWeight, type WuXingRelation } from './wuxing';
import { getDateGanZhi, type GanZhi } from './ganzhi';

export interface FortuneAspect {
  name: string;
  icon: string;
  score: number;      // 1-5
  summary: string;
  detail: string;
}

export interface FortuneResult {
  overallFortune: string;    // 总体批语
  aspects: FortuneAspect[];  // 四柱运势
  dateGanZhi: GanZhi;
  wuxingRelation: WuXingRelation;
}

// 基于卦象和五行生成内置运势文本
export function generateFortune(
  result: DivinationResult,
  charInfos: CharacterInfo[]
): FortuneResult {
  const dateGanZhi = getDateGanZhi();
  const charWuXing = charInfos[0]?.wuxing || '土';
  const hexWuXing = result.upperTrigram.wuxing;
  const relation = getRelation(charWuXing, dateGanZhi.ganWuXing);
  const baseWeight = getFortuneWeight(relation);

  const overallFortune = generateOverallFortune(result, relation, dateGanZhi);

  const aspects: FortuneAspect[] = [
    generateCareer(result, baseWeight),
    generateWealth(result, baseWeight),
    generateLove(result, baseWeight),
    generateHealth(result, baseWeight),
  ];

  return {
    overallFortune,
    aspects,
    dateGanZhi,
    wuxingRelation: relation,
  };
}

function generateOverallFortune(
  result: DivinationResult,
  relation: WuXingRelation,
  ganZhi: GanZhi
): string {
  const { originalHex, changedHex, movingLine, upperTrigram, lowerTrigram } = result;

  const relationText: Record<WuXingRelation, string> = {
    '相生': '字运与日辰相生，气运和顺，诸事皆宜。',
    '比和': '字运与日辰同气，平稳安定，守正即吉。',
    '被生': '日辰生扶字运，有贵人暗助之象。',
    '被克': '日辰克制字运，行事宜慎，不可冒进。',
    '相克': '字运与日辰相克，恐有阻碍，需谨慎行事。',
  };

  const lines = [
    `【${ganZhi.label}日占】`,
    `得${originalHex.fullName}，动${movingLine}爻，变${changedHex.fullName}。`,
    `${upperTrigram.name}${upperTrigram.nature}在上，${lowerTrigram.name}${lowerTrigram.nature}在下。`,
    originalHex.description + '。',
    relationText[relation],
    `综观卦象：${originalHex.fortune}`,
  ];

  return lines.join('\n');
}

function generateCareer(result: DivinationResult, baseWeight: number): FortuneAspect {
  const score = clampScore(baseWeight + (result.originalHex.fortune.includes('大吉') ? 1 : 0));
  const summaries = [
    '事业运势低迷，宜蛰伏养精蓄锐。',
    '事业运势平平，不宜有大动作。',
    '事业运势尚可，稳步前进为佳。',
    '事业运势良好，可把握机会拓展。',
    '事业运势大旺，宜大展宏图。',
  ];
  const details = [
    '当前不宜跳槽或创业，适合学习充电，积累实力。贵人运弱，凡事需靠自己。',
    '工作中可能遇到小阻碍，保持平常心即可。与同事和睦相处，避免口舌是非。',
    '工作进展平稳，有小的晋升机会。适合完成手头项目，打好基础。',
    '事业上有贵人相助，项目推进顺利。可以适当展示自己的能力，争取表现机会。',
    '事业运势极佳，适合开拓新领域。领导赏识，同事配合，正是大展拳脚的好时机。',
  ];
  return {
    name: '事业',
    icon: '💼',
    score,
    summary: summaries[score - 1],
    detail: details[score - 1],
  };
}

function generateWealth(result: DivinationResult, baseWeight: number): FortuneAspect {
  const hexBonus = result.changedHex.fortune.includes('吉') ? 1 : -1;
  const score = clampScore(baseWeight + hexBonus);
  const summaries = [
    '财运不佳，守财为上，切忌投资。',
    '财运平淡，正财尚可，偏财不利。',
    '财运中等，量入为出，可有小进。',
    '财运亨通，正偏财皆有收获。',
    '财运大旺，投资有利，财源广进。',
  ];
  const details = [
    '近期不宜投资理财，也要注意防止破财。管好钱袋子，减少不必要的开支。',
    '正常工资收入稳定，但不要期望意外之财。适合储蓄，不适合高风险投资。',
    '财运稳中有进，可以考虑稳健型的理财方式。日常开支要有计划，避免冲动消费。',
    '财运走旺，工作收入有增长的可能。适当参与投资，但仍需理性，不可贪心。',
    '财运极旺，有意外收获的可能。投资眼光准确，但需见好就收，不可过于贪心。',
  ];
  return {
    name: '财运',
    icon: '💰',
    score,
    summary: summaries[score - 1],
    detail: details[score - 1],
  };
}

function generateLove(result: DivinationResult, baseWeight: number): FortuneAspect {
  const mutualBonus = result.mutualHex.fortune.includes('和') || result.mutualHex.fortune.includes('感') ? 1 : 0;
  const score = clampScore(baseWeight + mutualBonus - 1);
  const summaries = [
    '感情运势低迷，易有误会争执。',
    '感情运势平淡，缺乏新鲜感。',
    '感情运势平稳，细水长流。',
    '感情运势良好，桃花运旺。',
    '感情运势极佳，姻缘天定。',
  ];
  const details = [
    '已有伴侣者需注意沟通，避免因小事引发矛盾。单身者暂时不宜强求，顺其自然。',
    '感情生活波澜不惊，有伴侣者可以尝试制造小惊喜。单身者多参加社交活动。',
    '感情关系稳定和谐，相互理解包容。单身者可能在工作或学习中遇到心仪之人。',
    '桃花运旺盛，有新的邂逅可能。有伴侣者感情升温，适合共同规划未来。',
    '感情运势大吉，有缘人即将出现或关系更进一步。有伴侣者可考虑人生大事。',
  ];
  return {
    name: '感情',
    icon: '❤️',
    score,
    summary: summaries[score - 1],
    detail: details[score - 1],
  };
}

function generateHealth(result: DivinationResult, baseWeight: number): FortuneAspect {
  const score = clampScore(baseWeight);
  const summaries = [
    '健康需要特别关注，注意休息。',
    '身体状况一般，预防为主。',
    '健康状况尚可，保持规律作息。',
    '身体状况良好，精力充沛。',
    '身心俱佳，活力满满。',
  ];
  const details = [
    '近期容易疲劳或有小恙，需要注意作息规律。适当运动，但不要过度劳累。饮食清淡为宜。',
    '要注意预防季节性疾病，保持良好的生活习惯。适当进行户外活动，增强体质。',
    '整体健康状况平稳，保持现有的作息节奏即可。可以尝试新的运动方式，调节身心。',
    '身体状况不错，精力旺盛。适合安排运动健身计划，保持积极乐观的心态。',
    '身心状态俱佳，是加强锻炼、培养健康习惯的好时机。保持愉悦心情，万事如意。',
  ];
  return {
    name: '健康',
    icon: '🏥',
    score,
    summary: summaries[score - 1],
    detail: details[score - 1],
  };
}

function clampScore(n: number): number {
  return Math.max(1, Math.min(5, n));
}
