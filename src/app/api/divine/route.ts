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

    const prompt = `你是一位精通梅花易数的国学大师。请根据以下卦象信息，用文言文结合白话文的风格，给出一段运势解读。

输入汉字：${characters}
本卦：${hexagramData.originalHex}
互卦：${hexagramData.mutualHex}
变卦：${hexagramData.changedHex}
动爻：第${hexagramData.movingLine}爻

请分别给出以下方面的运势解读（每项50字左右）：
1. 总体批语
2. 事业运势
3. 财运
4. 感情运势
5. 健康运势

请以JSON格式回复：
{
  "overall": "总体批语",
  "career": "事业运势",
  "wealth": "财运",
  "love": "感情运势",
  "health": "健康运势"
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
        max_tokens: 1024,
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
