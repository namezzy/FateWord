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

export interface AiAdvice {
  dos: string;        // 宜
  donts: string;      // 忌
  luckyColor: string;  // 幸运颜色
  luckyNumber: string; // 幸运数字
  luckyDirection: string; // 幸运方位
  poem: string;        // AI 赠诗一句
}

export interface FortuneResult {
  overallFortune: string;    // 总体批语
  aspects: FortuneAspect[];  // 四柱运势
  dateGanZhi: GanZhi;
  wuxingRelation: WuXingRelation;
  isAiEnhanced?: boolean;    // 是否已 AI 增强
  aiAdvice?: AiAdvice;       // AI 锦囊妙计
}

type LocaleKey = 'zh-CN' | 'zh-TW' | 'en';

// 五行关系描述
const relationTexts: Record<LocaleKey, Record<WuXingRelation, string>> = {
  'zh-CN': {
    '相生': '字运与日辰相生，气运和顺，诸事皆宜。',
    '比和': '字运与日辰同气，平稳安定，守正即吉。',
    '被生': '日辰生扶字运，有贵人暗助之象。',
    '被克': '日辰克制字运，行事宜慎，不可冒进。',
    '相克': '字运与日辰相克，恐有阻碍，需谨慎行事。',
  },
  'zh-TW': {
    '相生': '字運與日辰相生，氣運和順，諸事皆宜。',
    '比和': '字運與日辰同氣，平穩安定，守正即吉。',
    '被生': '日辰生扶字運，有貴人暗助之象。',
    '被克': '日辰克制字運，行事宜慎，不可冒進。',
    '相克': '字運與日辰相克，恐有阻礙，需謹慎行事。',
  },
  'en': {
    '相生': 'Character energy harmonizes with the day, all matters are favorable.',
    '比和': 'Character energy aligns with the day, stability prevails.',
    '被生': 'The day supports the character energy, hidden benefactors may assist.',
    '被克': 'The day restrains the character energy, proceed with caution.',
    '相克': 'Character energy conflicts with the day, obstacles may arise.',
  },
};

// 事业运势文本
const careerTexts: Record<LocaleKey, { summaries: string[]; details: string[] }> = {
  'zh-CN': {
    summaries: [
      '事业运势低迷，宜蛰伏养精蓄锐。',
      '事业运势平平，不宜有大动作。',
      '事业运势尚可，稳步前进为佳。',
      '事业运势良好，可把握机会拓展。',
      '事业运势大旺，宜大展宏图。',
    ],
    details: [
      '当前不宜跳槽或创业，适合学习充电，积累实力。贵人运弱，凡事需靠自己。',
      '工作中可能遇到小阻碍，保持平常心即可。与同事和睦相处，避免口舌是非。',
      '工作进展平稳，有小的晋升机会。适合完成手头项目，打好基础。',
      '事业上有贵人相助，项目推进顺利。可以适当展示自己的能力，争取表现机会。',
      '事业运势极佳，适合开拓新领域。领导赏识，同事配合，正是大展拳脚的好时机。',
    ],
  },
  'zh-TW': {
    summaries: [
      '事業運勢低迷，宜蟄伏養精蓄銳。',
      '事業運勢平平，不宜有大動作。',
      '事業運勢尚可，穩步前進為佳。',
      '事業運勢良好，可把握機會拓展。',
      '事業運勢大旺，宜大展宏圖。',
    ],
    details: [
      '當前不宜跳槽或創業，適合學習充電，積累實力。貴人運弱，凡事需靠自己。',
      '工作中可能遇到小阻礙，保持平常心即可。與同事和睦相處，避免口舌是非。',
      '工作進展平穩，有小的晉升機會。適合完成手頭項目，打好基礎。',
      '事業上有貴人相助，項目推進順利。可以適當展示自己的能力，爭取表現機會。',
      '事業運勢極佳，適合開拓新領域。領導賞識，同事配合，正是大展拳腳的好時機。',
    ],
  },
  'en': {
    summaries: [
      'Career prospects are dim; focus on rest and self-improvement.',
      'Career outlook is average; avoid major moves.',
      'Career is stable; steady progress is best.',
      'Career outlook is favorable; seize opportunities.',
      'Career is thriving; time to expand your horizons.',
    ],
    details: [
      'Not the time for job changes or startups. Focus on learning and building your skills. Rely on yourself for now.',
      'Minor obstacles at work may arise. Keep calm and maintain good relationships with colleagues.',
      'Work progresses steadily with small advancement opportunities. Focus on completing current projects.',
      'Benefactors support your career; projects move forward smoothly. Show your abilities and seize the moment.',
      'Excellent career fortune. Leaders appreciate you, colleagues cooperate. The perfect time for bold moves.',
    ],
  },
};

// 财运文本
const wealthTexts: Record<LocaleKey, { summaries: string[]; details: string[] }> = {
  'zh-CN': {
    summaries: [
      '财运不佳，守财为上，切忌投资。',
      '财运平淡，正财尚可，偏财不利。',
      '财运中等，量入为出，可有小进。',
      '财运亨通，正偏财皆有收获。',
      '财运大旺，投资有利，财源广进。',
    ],
    details: [
      '近期不宜投资理财，也要注意防止破财。管好钱袋子，减少不必要的开支。',
      '正常工资收入稳定，但不要期望意外之财。适合储蓄，不适合高风险投资。',
      '财运稳中有进，可以考虑稳健型的理财方式。日常开支要有计划，避免冲动消费。',
      '财运走旺，工作收入有增长的可能。适当参与投资，但仍需理性，不可贪心。',
      '财运极旺，有意外收获的可能。投资眼光准确，但需见好就收，不可过于贪心。',
    ],
  },
  'zh-TW': {
    summaries: [
      '財運不佳，守財為上，切忌投資。',
      '財運平淡，正財尚可，偏財不利。',
      '財運中等，量入為出，可有小進。',
      '財運亨通，正偏財皆有收穫。',
      '財運大旺，投資有利，財源廣進。',
    ],
    details: [
      '近期不宜投資理財，也要注意防止破財。管好錢袋子，減少不必要的開支。',
      '正常工資收入穩定，但不要期望意外之財。適合儲蓄，不適合高風險投資。',
      '財運穩中有進，可以考慮穩健型的理財方式。日常開支要有計劃，避免衝動消費。',
      '財運走旺，工作收入有增長的可能。適當參與投資，但仍需理性，不可貪心。',
      '財運極旺，有意外收穫的可能。投資眼光準確，但需見好就收，不可過於貪心。',
    ],
  },
  'en': {
    summaries: [
      'Wealth outlook is poor; protect your assets, avoid investments.',
      'Finances are flat; regular income is stable, windfalls unlikely.',
      'Moderate financial luck; budget carefully, small gains possible.',
      'Finances flourish; gains from both regular and unexpected sources.',
      'Wealth is booming; investments are favorable, prosperity flows.',
    ],
    details: [
      'Avoid financial ventures and guard against losses. Tighten your budget and reduce unnecessary spending.',
      'Salary income remains stable, but don\'t expect windfalls. Saving is wise; avoid high-risk investments.',
      'Finances improve gradually. Consider conservative investment strategies. Plan daily expenses carefully.',
      'Financial luck is rising with potential income growth. Invest moderately but remain rational.',
      'Exceptional financial fortune with possible windfalls. Your investment instincts are sharp, but know when to stop.',
    ],
  },
};

// 感情文本
const loveTexts: Record<LocaleKey, { summaries: string[]; details: string[] }> = {
  'zh-CN': {
    summaries: [
      '感情运势低迷，易有误会争执。',
      '感情运势平淡，缺乏新鲜感。',
      '感情运势平稳，细水长流。',
      '感情运势良好，桃花运旺。',
      '感情运势极佳，姻缘天定。',
    ],
    details: [
      '已有伴侣者需注意沟通，避免因小事引发矛盾。单身者暂时不宜强求，顺其自然。',
      '感情生活波澜不惊，有伴侣者可以尝试制造小惊喜。单身者多参加社交活动。',
      '感情关系稳定和谐，相互理解包容。单身者可能在工作或学习中遇到心仪之人。',
      '桃花运旺盛，有新的邂逅可能。有伴侣者感情升温，适合共同规划未来。',
      '感情运势大吉，有缘人即将出现或关系更进一步。有伴侣者可考虑人生大事。',
    ],
  },
  'zh-TW': {
    summaries: [
      '感情運勢低迷，易有誤會爭執。',
      '感情運勢平淡，缺乏新鮮感。',
      '感情運勢平穩，細水長流。',
      '感情運勢良好，桃花運旺。',
      '感情運勢極佳，姻緣天定。',
    ],
    details: [
      '已有伴侶者需注意溝通，避免因小事引發矛盾。單身者暫時不宜強求，順其自然。',
      '感情生活波瀾不驚，有伴侶者可以嘗試製造小驚喜。單身者多參加社交活動。',
      '感情關係穩定和諧，相互理解包容。單身者可能在工作或學習中遇到心儀之人。',
      '桃花運旺盛，有新的邂逅可能。有伴侶者感情升溫，適合共同規劃未來。',
      '感情運勢大吉，有緣人即將出現或關係更進一步。有伴侶者可考慮人生大事。',
    ],
  },
  'en': {
    summaries: [
      'Love life is troubled; misunderstandings and conflicts may arise.',
      'Romance is uneventful; lacking excitement.',
      'Love is steady and stable; a gentle, lasting flow.',
      'Love prospects are bright; romance blossoms.',
      'Love fortune is excellent; a destined match awaits.',
    ],
    details: [
      'If in a relationship, focus on communication to avoid conflicts. Singles should let things happen naturally.',
      'Romantic life is calm. Partners can try small surprises. Singles should attend more social events.',
      'Relationships are harmonious with mutual understanding. Singles may meet someone special through work or study.',
      'Romance is in the air with new encounters possible. Couples deepen their bond and plan for the future.',
      'Love fortune is exceptional. A destined person appears or the relationship advances. Consider major life decisions.',
    ],
  },
};

// 健康文本
const healthTexts: Record<LocaleKey, { summaries: string[]; details: string[] }> = {
  'zh-CN': {
    summaries: [
      '健康需要特别关注，注意休息。',
      '身体状况一般，预防为主。',
      '健康状况尚可，保持规律作息。',
      '身体状况良好，精力充沛。',
      '身心俱佳，活力满满。',
    ],
    details: [
      '近期容易疲劳或有小恙，需要注意作息规律。适当运动，但不要过度劳累。饮食清淡为宜。',
      '要注意预防季节性疾病，保持良好的生活习惯。适当进行户外活动，增强体质。',
      '整体健康状况平稳，保持现有的作息节奏即可。可以尝试新的运动方式，调节身心。',
      '身体状况不错，精力旺盛。适合安排运动健身计划，保持积极乐观的心态。',
      '身心状态俱佳，是加强锻炼、培养健康习惯的好时机。保持愉悦心情，万事如意。',
    ],
  },
  'zh-TW': {
    summaries: [
      '健康需要特別關注，注意休息。',
      '身體狀況一般，預防為主。',
      '健康狀況尚可，保持規律作息。',
      '身體狀況良好，精力充沛。',
      '身心俱佳，活力滿滿。',
    ],
    details: [
      '近期容易疲勞或有小恙，需要注意作息規律。適當運動，但不要過度勞累。飲食清淡為宜。',
      '要注意預防季節性疾病，保持良好的生活習慣。適當進行戶外活動，增強體質。',
      '整體健康狀況平穩，保持現有的作息節奏即可。可以嘗試新的運動方式，調節身心。',
      '身體狀況不錯，精力旺盛。適合安排運動健身計劃，保持積極樂觀的心態。',
      '身心狀態俱佳，是加強鍛煉、培養健康習慣的好時機。保持愉悅心情，萬事如意。',
    ],
  },
  'en': {
    summaries: [
      'Health needs attention; prioritize rest.',
      'Health is fair; focus on prevention.',
      'Health is decent; maintain regular routines.',
      'Health is good; energy is abundant.',
      'Mind and body are in excellent shape; full of vitality.',
    ],
    details: [
      'You may feel fatigued or unwell. Maintain regular sleep patterns, exercise moderately, and eat light meals.',
      'Watch for seasonal illnesses and maintain good habits. Spend time outdoors to strengthen your constitution.',
      'Overall health is stable. Keep your current routine and try new exercise activities for balance.',
      'Your health is strong with abundant energy. A great time to start a fitness plan and stay optimistic.',
      'Mind and body are in peak condition. Strengthen healthy habits and maintain a joyful spirit.',
    ],
  },
};

// 运势名称
const aspectNames: Record<LocaleKey, { career: string; wealth: string; love: string; health: string }> = {
  'zh-CN': { career: '事业', wealth: '财运', love: '感情', health: '健康' },
  'zh-TW': { career: '事業', wealth: '財運', love: '感情', health: '健康' },
  'en': { career: 'Career', wealth: 'Wealth', love: 'Love', health: 'Health' },
};

// 基于卦象和五行生成内置运势文本
export function generateFortune(
  result: DivinationResult,
  charInfos: CharacterInfo[],
  locale?: string
): FortuneResult {
  const loc: LocaleKey = (locale === 'zh-TW' || locale === 'en') ? locale : 'zh-CN';
  const dateGanZhi = getDateGanZhi();
  const charWuXing = charInfos[0]?.wuxing || '土';
  const hexWuXing = result.upperTrigram.wuxing;
  const relation = getRelation(charWuXing, dateGanZhi.ganWuXing);
  const baseWeight = getFortuneWeight(relation);

  const overallFortune = generateOverallFortune(result, relation, dateGanZhi, loc);

  const aspects: FortuneAspect[] = [
    generateCareer(result, baseWeight, loc),
    generateWealth(result, baseWeight, loc),
    generateLove(result, baseWeight, loc),
    generateHealth(result, baseWeight, loc),
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
  ganZhi: GanZhi,
  locale: LocaleKey
): string {
  const { originalHex, changedHex, movingLine, upperTrigram, lowerTrigram } = result;

  if (locale === 'en') {
    return [
      `[${ganZhi.label} Day Divination]`,
      `Obtained ${originalHex.fullName}, Line ${movingLine} moves, changing to ${changedHex.fullName}.`,
      `${upperTrigram.name}(${upperTrigram.nature}) above, ${lowerTrigram.name}(${lowerTrigram.nature}) below.`,
      originalHex.description + '.',
      relationTexts[locale][relation],
      `Overall: ${originalHex.fortune}`,
    ].join('\n');
  }

  if (locale === 'zh-TW') {
    return [
      `【${ganZhi.label}日占】`,
      `得${originalHex.fullName}，動${movingLine}爻，變${changedHex.fullName}。`,
      `${upperTrigram.name}${upperTrigram.nature}在上，${lowerTrigram.name}${lowerTrigram.nature}在下。`,
      originalHex.description + '。',
      relationTexts[locale][relation],
      `綜觀卦象：${originalHex.fortune}`,
    ].join('\n');
  }

  // zh-CN (default)
  return [
    `【${ganZhi.label}日占】`,
    `得${originalHex.fullName}，动${movingLine}爻，变${changedHex.fullName}。`,
    `${upperTrigram.name}${upperTrigram.nature}在上，${lowerTrigram.name}${lowerTrigram.nature}在下。`,
    originalHex.description + '。',
    relationTexts[locale][relation],
    `综观卦象：${originalHex.fortune}`,
  ].join('\n');
}

function generateCareer(result: DivinationResult, baseWeight: number, locale: LocaleKey): FortuneAspect {
  const score = clampScore(baseWeight + (result.originalHex.fortune.includes('大吉') ? 1 : 0));
  const texts = careerTexts[locale];
  return {
    name: aspectNames[locale].career,
    icon: '💼',
    score,
    summary: texts.summaries[score - 1],
    detail: texts.details[score - 1],
  };
}

function generateWealth(result: DivinationResult, baseWeight: number, locale: LocaleKey): FortuneAspect {
  const hexBonus = result.changedHex.fortune.includes('吉') ? 1 : -1;
  const score = clampScore(baseWeight + hexBonus);
  const texts = wealthTexts[locale];
  return {
    name: aspectNames[locale].wealth,
    icon: '💰',
    score,
    summary: texts.summaries[score - 1],
    detail: texts.details[score - 1],
  };
}

function generateLove(result: DivinationResult, baseWeight: number, locale: LocaleKey): FortuneAspect {
  const mutualBonus = result.mutualHex.fortune.includes('和') || result.mutualHex.fortune.includes('感') ? 1 : 0;
  const score = clampScore(baseWeight + mutualBonus - 1);
  const texts = loveTexts[locale];
  return {
    name: aspectNames[locale].love,
    icon: '❤️',
    score,
    summary: texts.summaries[score - 1],
    detail: texts.details[score - 1],
  };
}

function generateHealth(result: DivinationResult, baseWeight: number, locale: LocaleKey): FortuneAspect {
  const score = clampScore(baseWeight);
  const texts = healthTexts[locale];
  return {
    name: aspectNames[locale].health,
    icon: '🏥',
    score,
    summary: texts.summaries[score - 1],
    detail: texts.details[score - 1],
  };
}

function clampScore(n: number): number {
  return Math.max(1, Math.min(5, n));
}
