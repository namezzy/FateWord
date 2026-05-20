// 梅花易数核心算法

import { getTrigramByRemainder, TRIGRAMS, type Trigram } from './bagua';
import { getHexagram, type Hexagram } from './hexagrams';

export interface DivinationInput {
  characters: string[];
  strokeCounts: number[];
}

export interface DivinationResult {
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  movingLine: number;        // 动爻 1-6
  originalHex: Hexagram;     // 本卦
  mutualHex: Hexagram;       // 互卦
  changedHex: Hexagram;      // 变卦
  totalStrokes: number;
}

// 单字测字：总笔画前半→上卦，后半→下卦
function divineSingle(strokes: number): DivinationResult {
  const half = Math.ceil(strokes / 2);
  const firstHalf = half;
  const secondHalf = strokes - half;

  const upperNum = firstHalf % 8;
  const lowerNum = secondHalf % 8 || 8; // 余0取8

  const upper = getTrigramByRemainder(upperNum);
  const lower = getTrigramByRemainder(lowerNum);
  const movingLine = strokes % 6 || 6;

  return buildResult(upper, lower, movingLine, strokes);
}

// 多字测字：第一字→上卦，其余字总和→下卦
function divineMultiple(strokeCounts: number[]): DivinationResult {
  const firstStrokes = strokeCounts[0];
  const restStrokes = strokeCounts.slice(1).reduce((a, b) => a + b, 0);
  const totalStrokes = strokeCounts.reduce((a, b) => a + b, 0);

  const upper = getTrigramByRemainder(firstStrokes % 8);
  const lower = getTrigramByRemainder(restStrokes % 8);
  const movingLine = totalStrokes % 6 || 6;

  return buildResult(upper, lower, movingLine, totalStrokes);
}

function buildResult(
  upper: Trigram,
  lower: Trigram,
  movingLine: number,
  totalStrokes: number
): DivinationResult {
  const originalHex = getHexagram(upper.number, lower.number);
  const mutualHex = getMutualHexagram(upper, lower);
  const changedHex = getChangedHexagram(upper, lower, movingLine);

  return {
    upperTrigram: upper,
    lowerTrigram: lower,
    movingLine,
    originalHex,
    mutualHex,
    changedHex,
    totalStrokes,
  };
}

// 互卦：本卦六爻中 2-3-4 爻为下卦，3-4-5 爻为上卦
function getMutualHexagram(upper: Trigram, lower: Trigram): Hexagram {
  // 六爻从下到上: lower[0], lower[1], lower[2], upper[0], upper[1], upper[2]
  const lines = [...lower.lines, ...upper.lines]; // 6 lines, bottom to top

  // 互卦下卦: 2-3-4 爻 (index 1,2,3)
  const mutualLowerLines = [lines[1], lines[2], lines[3]] as [number, number, number];
  // 互卦上卦: 3-4-5 爻 (index 2,3,4)
  const mutualUpperLines = [lines[2], lines[3], lines[4]] as [number, number, number];

  const mutualLower = findTrigramByLines(mutualLowerLines);
  const mutualUpper = findTrigramByLines(mutualUpperLines);

  return getHexagram(mutualUpper.number, mutualLower.number);
}

// 变卦：将动爻变（阳变阴，阴变阳）
function getChangedHexagram(upper: Trigram, lower: Trigram, movingLine: number): Hexagram {
  const lines = [...lower.lines, ...upper.lines];
  const lineIndex = movingLine - 1; // 动爻从1开始
  lines[lineIndex] = lines[lineIndex] === 1 ? 0 : 1;

  const changedLowerLines = [lines[0], lines[1], lines[2]] as [number, number, number];
  const changedUpperLines = [lines[3], lines[4], lines[5]] as [number, number, number];

  const changedLower = findTrigramByLines(changedLowerLines);
  const changedUpper = findTrigramByLines(changedUpperLines);

  return getHexagram(changedUpper.number, changedLower.number);
}

// 根据三爻找到对应的卦
function findTrigramByLines(lines: [number, number, number]): Trigram {
  for (const t of Object.values(TRIGRAMS)) {
    if (t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2]) {
      return t;
    }
  }
  return TRIGRAMS[8]; // fallback 坤
}

// 主入口
export function divine(input: DivinationInput): DivinationResult {
  const { strokeCounts } = input;
  if (strokeCounts.length === 1) {
    return divineSingle(strokeCounts[0]);
  }
  return divineMultiple(strokeCounts);
}
