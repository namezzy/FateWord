// 六十四卦 (64 Hexagrams) lookup table
// Key: `${upper trigram number}-${lower trigram number}`

export interface Hexagram {
  name: string;        // 卦名
  fullName: string;    // 完整名称（如"乾为天"）
  upper: number;       // 上卦先天数
  lower: number;       // 下卦先天数
  description: string; // 简短卦义
  fortune: string;     // 运势概要
}

// 生成 key: upper-lower
function k(u: number, l: number): string { return `${u}-${l}`; }

export const HEXAGRAMS: Record<string, Hexagram> = {
  [k(1,1)]: { name: '乾', fullName: '乾为天', upper: 1, lower: 1, description: '天行健，君子以自强不息', fortune: '大吉。元亨利贞，龙行天下，诸事顺遂。' },
  [k(8,8)]: { name: '坤', fullName: '坤为地', upper: 8, lower: 8, description: '地势坤，君子以厚德载物', fortune: '吉。柔顺利贞，厚积薄发，宜守正道。' },
  [k(6,4)]: { name: '屯', fullName: '水雷屯', upper: 6, lower: 4, description: '万事开头难，宜守不宜进', fortune: '小凶。初始艰难，需耐心等待时机。' },
  [k(7,6)]: { name: '蒙', fullName: '山水蒙', upper: 7, lower: 6, description: '蒙以养正，启蒙之象', fortune: '中平。宜学习求教，虚心向学则吉。' },
  [k(6,1)]: { name: '需', fullName: '水天需', upper: 6, lower: 1, description: '守正待时，需要等待', fortune: '吉。诚信等待，终有收获。' },
  [k(1,6)]: { name: '讼', fullName: '天水讼', upper: 1, lower: 6, description: '争讼之象，宜和不宜争', fortune: '凶。争执不利，宜退让和解。' },
  [k(8,6)]: { name: '师', fullName: '地水师', upper: 8, lower: 6, description: '师出有名，众志成城', fortune: '中吉。宜正道而行，领导有方则吉。' },
  [k(6,8)]: { name: '比', fullName: '水地比', upper: 6, lower: 8, description: '亲比辅助，和衷共济', fortune: '吉。亲近贵人，合作共赢。' },
  [k(5,1)]: { name: '小畜', fullName: '风天小畜', upper: 5, lower: 1, description: '密云不雨，蓄而未发', fortune: '小吉。积蓄力量，暂不宜大动。' },
  [k(1,5)]: { name: '履', fullName: '天泽履', upper: 1, lower: 5, description: '如履薄冰，谨慎前行', fortune: '中吉。谨慎行事，循礼而行则吉。' },
  [k(8,1)]: { name: '泰', fullName: '地天泰', upper: 8, lower: 1, description: '天地交泰，万物通达', fortune: '大吉。否极泰来，诸事亨通。' },
  [k(1,8)]: { name: '否', fullName: '天地否', upper: 1, lower: 8, description: '天地不交，闭塞不通', fortune: '凶。闭塞不通，宜守待变。' },
  [k(1,3)]: { name: '同人', fullName: '天火同人', upper: 1, lower: 3, description: '同人于野，志同道合', fortune: '吉。与人合作，同心同德则成。' },
  [k(3,1)]: { name: '大有', fullName: '火天大有', upper: 3, lower: 1, description: '日丽中天，大有收获', fortune: '大吉。丰收之象，诸事大吉。' },
  [k(7,8)]: { name: '谦', fullName: '地山谦', upper: 7, lower: 8, description: '谦虚受益，卑以自牧', fortune: '吉。谦逊有礼，处处受益。' },  // Note: 谦卦上坤下艮
  [k(4,8)]: { name: '豫', fullName: '雷地豫', upper: 4, lower: 8, description: '雷出地奋，豫乐之象', fortune: '吉。愉悦顺畅，宜行动。' },
  [k(2,4)]: { name: '随', fullName: '泽雷随', upper: 2, lower: 4, description: '随时而动，灵活应变', fortune: '吉。顺势而为，随机应变。' },
  [k(7,5)]: { name: '蛊', fullName: '山风蛊', upper: 7, lower: 5, description: '振弊起衰，革故鼎新', fortune: '中平。需整顿改革，拨乱反正。' },
  [k(8,2)]: { name: '临', fullName: '地泽临', upper: 8, lower: 2, description: '居上临下，亲近万民', fortune: '大吉。贵人来临，好运将至。' },
  [k(5,8)]: { name: '观', fullName: '风地观', upper: 5, lower: 8, description: '仰观天文，观察形势', fortune: '中平。宜观望思考，不宜妄动。' },
  [k(3,4)]: { name: '噬嗑', fullName: '火雷噬嗑', upper: 3, lower: 4, description: '明罚敕法，刚柔相济', fortune: '中吉。果断处事，除障碍则通。' },
  [k(7,3)]: { name: '贲', fullName: '山火贲', upper: 7, lower: 3, description: '文饰之象，外美内实', fortune: '小吉。注重形象，但勿华而不实。' },
  [k(7,8)]: { name: '剥', fullName: '山地剥', upper: 7, lower: 8, description: '剥落衰败，顺时而止', fortune: '凶。时运不济，宜静守退让。' },
  [k(8,4)]: { name: '复', fullName: '地雷复', upper: 8, lower: 4, description: '一阳复始，否极泰来', fortune: '吉。转机将至，柳暗花明。' },
  [k(1,4)]: { name: '无妄', fullName: '天雷无妄', upper: 1, lower: 4, description: '无妄之行，顺天而动', fortune: '吉。顺其自然，不妄为则吉。' },
  [k(7,1)]: { name: '大畜', fullName: '山天大畜', upper: 7, lower: 1, description: '大有积蓄，厚积薄发', fortune: '大吉。积蓄充足，大有可为。' },
  [k(7,4)]: { name: '颐', fullName: '山雷颐', upper: 7, lower: 4, description: '颐养正道，修身养性', fortune: '中吉。注重养生修身，谨言慎行。' },
  [k(2,5)]: { name: '大过', fullName: '泽风大过', upper: 2, lower: 5, description: '泽灭木，大过之象', fortune: '凶。过犹不及，宜审慎收敛。' },
  [k(6,6)]: { name: '坎', fullName: '坎为水', upper: 6, lower: 6, description: '重重险阻，习坎不已', fortune: '凶。险难重重，需坚守诚信。' },
  [k(3,3)]: { name: '离', fullName: '离为火', upper: 3, lower: 3, description: '日月丽天，光明之象', fortune: '吉。光明正大，前途明朗。' },
  [k(2,7)]: { name: '咸', fullName: '泽山咸', upper: 2, lower: 7, description: '山泽通气，感应相通', fortune: '吉。感情和合，心意相通。' },
  [k(4,5)]: { name: '恒', fullName: '雷风恒', upper: 4, lower: 5, description: '恒久不变，持之以恒', fortune: '吉。坚持不懈，持久则成。' },
  [k(1,7)]: { name: '遁', fullName: '天山遁', upper: 1, lower: 7, description: '遁世隐退，明哲保身', fortune: '小凶。宜退避隐忍，不宜强出。' },
  [k(4,1)]: { name: '大壮', fullName: '雷天大壮', upper: 4, lower: 1, description: '刚健壮盛，势不可挡', fortune: '大吉。气势强盛，勇往直前。' },
  [k(3,8)]: { name: '晋', fullName: '火地晋', upper: 3, lower: 8, description: '日出地上，光明进步', fortune: '吉。事业上升，前程似锦。' },
  [k(8,3)]: { name: '明夷', fullName: '地火明夷', upper: 8, lower: 3, description: '明入地中，韬光养晦', fortune: '凶。暗淡之象，宜隐忍蛰伏。' },
  [k(5,3)]: { name: '家人', fullName: '风火家人', upper: 5, lower: 3, description: '家道正则天下定', fortune: '吉。家庭和睦，齐家之道。' },
  [k(3,2)]: { name: '睽', fullName: '火泽睽', upper: 3, lower: 2, description: '二女同居，其志不同', fortune: '小凶。意见分歧，小事吉大事凶。' },
  [k(6,7)]: { name: '蹇', fullName: '水山蹇', upper: 6, lower: 7, description: '行路艰难，知难而退', fortune: '凶。前途多阻，宜守不宜进。' },
  [k(4,6)]: { name: '解', fullName: '雷水解', upper: 4, lower: 6, description: '雷雨大作，百果草木皆解', fortune: '吉。困难解除，拨云见日。' },
  [k(7,2)]: { name: '损', fullName: '山泽损', upper: 7, lower: 2, description: '损下益上，先损后益', fortune: '中平。有所失必有所得，塞翁失马。' },
  [k(5,4)]: { name: '益', fullName: '风雷益', upper: 5, lower: 4, description: '损上益下，利民之象', fortune: '大吉。利益增长，诸事有益。' },
  [k(2,1)]: { name: '夬', fullName: '泽天夬', upper: 2, lower: 1, description: '决断果敢，以刚决柔', fortune: '吉。果断决策，去除障碍。' },
  [k(1,2)]: { name: '姤', fullName: '天风姤', upper: 1, lower: 2, description: '不期而遇，一阴生于下', fortune: '中平。偶遇机缘，但勿轻信。' },  // 天风姤 actually 上乾下巽
  [k(2,8)]: { name: '萃', fullName: '泽地萃', upper: 2, lower: 8, description: '聚集荟萃，群贤毕至', fortune: '吉。人才汇聚，合力共进。' },
  [k(8,5)]: { name: '升', fullName: '地风升', upper: 8, lower: 5, description: '地中生木，积小成大', fortune: '大吉。步步高升，循序渐进。' },
  [k(2,6)]: { name: '困', fullName: '泽水困', upper: 2, lower: 6, description: '泽无水，困乏之象', fortune: '凶。处境困难，但守正则终通。' },
  [k(6,5)]: { name: '井', fullName: '水风井', upper: 6, lower: 5, description: '井养不穷，取之不尽', fortune: '吉。根基稳固，源源不断。' },
  [k(2,3)]: { name: '革', fullName: '泽火革', upper: 2, lower: 3, description: '天地革而四时成', fortune: '吉。变革创新，除旧布新。' },
  [k(3,5)]: { name: '鼎', fullName: '火风鼎', upper: 3, lower: 5, description: '鼎新之象，革故鼎新', fortune: '大吉。开创新局，大有建树。' },
  [k(4,4)]: { name: '震', fullName: '震为雷', upper: 4, lower: 4, description: '震来虩虩，恐惧致福', fortune: '中吉。虽有震动，但转危为安。' },
  [k(7,7)]: { name: '艮', fullName: '艮为山', upper: 7, lower: 7, description: '兼山艮，知止而止', fortune: '中平。宜静止不动，止于至善。' },
  [k(5,7)]: { name: '渐', fullName: '风山渐', upper: 5, lower: 7, description: '循序渐进，按部就班', fortune: '吉。循序渐进，稳步前行。' },
  [k(4,2)]: { name: '归妹', fullName: '雷泽归妹', upper: 4, lower: 2, description: '少女归嫁，有终之象', fortune: '小凶。事有不顺，但终有归宿。' },
  [k(4,3)]: { name: '丰', fullName: '雷火丰', upper: 4, lower: 3, description: '雷电皆至，丰盛之象', fortune: '大吉。事业丰盛，光明磊落。' },
  [k(3,7)]: { name: '旅', fullName: '火山旅', upper: 3, lower: 7, description: '行旅在外，小心谨慎', fortune: '中平。在外谨慎，不宜冒进。' },
  [k(5,5)]: { name: '巽', fullName: '巽为风', upper: 5, lower: 5, description: '随风而行，柔顺渗透', fortune: '小吉。柔顺处事，以退为进。' },
  [k(2,2)]: { name: '兑', fullName: '兑为泽', upper: 2, lower: 2, description: '丽泽兑，喜悦之象', fortune: '吉。喜悦和谐，人际顺畅。' },
  [k(5,6)]: { name: '涣', fullName: '风水涣', upper: 5, lower: 6, description: '风行水上，涣散之象', fortune: '小凶。人心涣散，宜聚不宜散。' },
  [k(6,2)]: { name: '节', fullName: '水泽节', upper: 6, lower: 2, description: '泽有水，有节制', fortune: '吉。适度节制，中正为吉。' },
  [k(5,2)]: { name: '中孚', fullName: '风泽中孚', upper: 5, lower: 2, description: '诚信中正，信及豚鱼', fortune: '大吉。诚信待人，万事亨通。' },
  [k(4,7)]: { name: '小过', fullName: '雷山小过', upper: 4, lower: 7, description: '小有过越，不可大事', fortune: '小凶。小事可为，大事不宜。' },
  [k(6,3)]: { name: '既济', fullName: '水火既济', upper: 6, lower: 3, description: '水火相济，万事已成', fortune: '吉。事已成就，宜守成防衰。' },
  [k(3,6)]: { name: '未济', fullName: '火水未济', upper: 3, lower: 6, description: '事未成也，尚需努力', fortune: '中平。尚未成功，仍需坚持努力。' },
};

// Fix: 谦卦应为上坤下艮 (8-7)，剥卦为上艮下坤 (7-8) — 上面已正确
// Fix: 姤卦应为上乾下巽 (1-5)
HEXAGRAMS[k(1, 5)] = { name: '姤', fullName: '天风姤', upper: 1, lower: 5, description: '不期而遇，一阴生于下', fortune: '中平。偶遇机缘，但勿轻信。' };
// Fix: 谦卦上坤下艮
HEXAGRAMS[k(8, 7)] = { name: '谦', fullName: '地山谦', upper: 8, lower: 7, description: '谦虚受益，卑以自牧', fortune: '吉。谦逊有礼，处处受益。' };

export function getHexagram(upper: number, lower: number): Hexagram {
  const key = k(upper, lower);
  return HEXAGRAMS[key] || {
    name: '未知',
    fullName: '未知卦',
    upper,
    lower,
    description: '此卦组合未收录',
    fortune: '中平。宜静观其变。',
  };
}
