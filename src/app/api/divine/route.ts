import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hexagramData, characters } = body;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured', fallback: true },
        { status: 200 }
      );
    }

    const prompt = `你是一位精通梅花易数的国学大师，擅长结合卦象深入剖析运势。请根据以下卦象信息，给出一段极富个性化的运势解读。

要求：
- 解读必须紧密结合具体的卦象特征（如卦名含义、爻辞、五行生克关系），不可是泛泛的套话
- 用古典雅致的文风，文言文与白话文交融
- 总体批语要引用相关的卦辞或象辞

输入汉字：${characters}
本卦：${hexagramData.originalHex}
互卦：${hexagramData.mutualHex}
变卦：${hexagramData.changedHex}
动爻：第${hexagramData.movingLine}爻

请给出以下内容：

1. 总体批语（100字左右，需引用卦辞/象辞，结合卦象给出深度总结）
2. 事业运势：一句话概括（20字）+ 详细解读（80字，要结合卦象具体分析）
3. 财运：一句话概括（20字）+ 详细解读（80字，要结合卦象具体分析）
4. 感情运势：一句话概括（20字）+ 详细解读（80字，要结合卦象具体分析）
5. 健康运势：一句话概括（20字）+ 详细解读（80字，要结合卦象具体分析）
6. 锦囊妙计：今日宜做之事、忌做之事、幸运颜色、幸运数字、幸运方位、赠诗一句

请严格以JSON格式回复：
{
  "overall": "总体批语（引用卦辞，结合卦象分析）",
  "career": "事业一句话概括",
  "careerDetail": "事业详细解读（结合卦象）",
  "wealth": "财运一句话概括",
  "wealthDetail": "财运详细解读（结合卦象）",
  "love": "感情一句话概括",
  "loveDetail": "感情详细解读（结合卦象）",
  "health": "健康一句话概括",
  "healthDetail": "健康详细解读（结合卦象）",
  "dos": "今日宜做的2-3件事，逗号分隔",
  "donts": "今日忌做的2-3件事，逗号分隔",
  "luckyColor": "幸运颜色",
  "luckyNumber": "幸运数字",
  "luckyDirection": "幸运方位",
  "poem": "结合卦象赠诗一句（七言或五言）"
}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位精通梅花易数的国学大师，请用古典雅致的语言风格回答。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', errText);
      return NextResponse.json({ error: 'API call failed', fallback: true }, { status: 200 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // 尝试解析 JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, data: parsed });
      }
    } catch {
      // JSON 解析失败，返回原文
    }

    return NextResponse.json({ success: true, data: { overall: content } });
  } catch (error) {
    console.error('Divine API error:', error);
    return NextResponse.json({ error: 'Internal error', fallback: true }, { status: 200 });
  }
}
