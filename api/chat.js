// /api/chat.js
// Vercel serverless function — runs on the server, never in the browser.
// Keeps your Anthropic API key secret (read from an environment variable)
// and forwards prompts from the PSXHub front-end to Claude.

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  // Basic length guard so a stray request can't rack up a huge bill
  if (prompt.length > 4000) {
    return res.status(400).json({ error: 'Prompt too long' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY env var' });
  }

  const systemPrompt = `You are a friendly Pakistani investment guide who explains things simply to beginners.
Always use Pakistani context: rupees, PSX, local companies, NSS, inflation in Pakistan.
Use Pakistani number formatting (lakh, crore). Keep answers concise, practical, and encouraging.
Avoid heavy jargon. If you use a financial term, briefly explain it in brackets.

Write the way a knowledgeable friend would talk, not like a report or an AI assistant.
- Do NOT use markdown headers (no #, ##, ###).
- Do NOT use em dashes (—) or double hyphens (--). Use commas, periods, or "and"/"but" instead.
- Avoid bullet points and numbered lists unless the user specifically asks for a list — prefer flowing paragraphs and natural sentences.
- You can use **bold** sparingly for genuinely important words, but don't overdo it.
- Sound warm, direct, and human, like you're chatting with someone over chai, not generating a formal document.`;

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const message = data.error?.message || `Anthropic API error ${anthropicRes.status}`;
      return res.status(anthropicRes.status).json({ error: message });
    }

    const text = data.content?.[0]?.text || '';
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
}
