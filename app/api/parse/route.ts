import { NextRequest, NextResponse } from 'next/server';

const BASE  = process.env.OLLAMA_BASE_URL ?? 'http://ollama.ollama.svc.cluster.local:11434';
const MODEL = process.env.OLLAMA_MODEL    ?? 'qwen2.5:7b';

const SYSTEM = `Extract booking info from text. Return ONLY valid JSON — no markdown, no prose.
Schema: {"kind":"hotel"|"airbnb"|"ferry"|"activity"|"dining"|"note","title":"string","vendor":null,"ref":null,"start":"YYYY-MM-DDTHH:mm","end":null,"city":"city name","where":null,"pax":null,"price":null,"currency":null}
Use null for unknown fields. Use current year if year is missing.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.text?.trim()) {
    return NextResponse.json({ error: 'text required' }, { status: 400 });
  }

  let ollamaRes: Response;
  try {
    ollamaRes = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL, format: 'json', stream: false,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user',   content: body.text },
        ],
      }),
    });
  } catch {
    return NextResponse.json({ error: 'Ollama unreachable' }, { status: 502 });
  }

  if (!ollamaRes.ok) {
    return NextResponse.json({ error: `Ollama error ${ollamaRes.status}` }, { status: 502 });
  }

  const data = await ollamaRes.json();
  try {
    return NextResponse.json({ parsed: JSON.parse(data.message.content) });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from Ollama', raw: data.message?.content }, { status: 502 });
  }
}
