# 天机测字 | FateWord

> 以字问天机，观卦知运势

基于**梅花易数**与**五行生克**理论的中国风测字运势应用。输入 1-3 个汉字，即刻起卦，解读事业、财运、感情、健康运势。

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎴 **梅花易数起卦** — 根据汉字笔画数精确计算上卦、下卦、动爻，推演本卦、互卦、变卦
- 🔥 **五行生克推演** — 结合汉字五行属性与当日天干地支，计算运势吉凶权重
- 🎨 **水墨淡雅 UI** — 新中式视觉设计，宣纸色背景、古铜色点缀、朱砂红强调
- 🎬 **流畅动画** — Framer Motion 驱动的卷轴展开效果与卦象绘制动画
- 🤖 **AI 解卦**（可选） — 接入 DeepSeek API，动态生成文言结合白话的个性化批语
- 📱 **响应式设计** — 移动端优先，完美适配各种屏幕尺寸
- 📝 **历史记录** — 本地保存最近 20 条测算记录，可随时回顾

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + Framer Motion |
| Chinese NLP | cnchar (stroke count & pinyin) |
| AI Engine | DeepSeek API (optional) |
| Deployment | Vercel |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/namezzy/FateWord.git
cd FateWord

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

Create a `.env.local` file in the project root:

```env
# Optional: Enable AI-powered fortune interpretation
# Get your API key at https://platform.deepseek.com/
DEEPSEEK_API_KEY=sk-your-api-key-here
```

> The app works without an API key — it uses built-in static fortune texts as fallback.

## 📐 Core Algorithm

The divination engine implements the traditional **梅花易数 (Plum Blossom Numerology)** method:

```
Input: Chinese character(s) → Stroke count analysis
                ↓
    ┌───────────────────────┐
    │  Single Character:    │
    │  First half  → Upper  │
    │  Second half → Lower  │
    │                       │
    │  Multiple Characters: │
    │  1st char    → Upper  │
    │  Rest chars  → Lower  │
    └───────────────────────┘
                ↓
    Total strokes mod 6 → Moving Line (动爻)
                ↓
    ┌─────────┬─────────┬─────────┐
    │  本卦    │  互卦    │  变卦    │
    │ Original │ Mutual  │ Changed │
    └─────────┴─────────┴─────────┘
                ↓
    Five Elements (五行) + Stems & Branches (天干地支)
                ↓
    Fortune Reading (事业 · 财运 · 感情 · 健康)
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/divine/route.ts   # DeepSeek API proxy
│   ├── globals.css            # Ink-wash theme styles
│   ├── layout.tsx             # Root layout with Noto Serif SC
│   └── page.tsx               # Main page with state management
├── components/
│   ├── InputPanel.tsx         # Character input with IME support
│   ├── CharacterInfo.tsx      # Character breakdown display
│   ├── HexagramDisplay.tsx    # Trigram & hexagram visualization
│   ├── FortuneCard.tsx        # Fortune aspect card with rating
│   └── ResultPanel.tsx        # Result container with animations
└── lib/
    ├── bagua.ts               # 8 trigrams data & constants
    ├── hexagrams.ts           # 64 hexagrams lookup table
    ├── meihua.ts              # Plum Blossom divination engine
    ├── wuxing.ts              # Five Elements relationships
    ├── ganzhi.ts              # Heavenly Stems & Earthly Branches
    ├── character.ts           # Chinese character processing
    └── fortune.ts             # Fortune text generation
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/namezzy/FateWord)

1. Click the button above or import from [vercel.com](https://vercel.com)
2. Add environment variable `DEEPSEEK_API_KEY` (optional)
3. Deploy — that's it!

## 📜 License

MIT

---

<p align="center">
  <sub>Crafted by <b>Levi</b> · Powered by <b>Claude Opus</b> · © 2026</sub>
</p>
