export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sentence, taskInstruction, storyContext } = req.body;
    
    if (!sentence || !taskInstruction || !storyContext) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are a friendly teacher for Year 1-2 Malaysian primary school students. Evaluate this sentence: "${sentence}"

Task: ${taskInstruction}

Story context: ${storyContext}

CRITICAL RULES - Follow these rules strictly:
- DO NOT, under any circumstances, provide the actual correct sentence or a complete section of the story context as the answer. Only provide encouraging, guiding hints.
- The ENTIRE response MUST be ONLY the structured format (e.g., 'PROCEED: [praise]'), with NO extra conversational text, greetings, or explanations before or after the structured output.
- You MUST reject sentences that contradict the story (e.g., if the story says "Rina is a student" then "Rina is a bird" is WRONG).
- You MUST reject sentences that don't match what the task is asking for.
- You MUST reject sentences that have grammar errors (missing capital letters, periods, wrong word forms).

Check two things IN THIS ORDER:
1. GRAMMAR: Is it a complete sentence with proper capitalization (capital at start) and punctuation (period at end)?
2. FACTUAL ACCURACY: Is the sentence TRUE according to the story? Does it answer what the task asks?

EXAMPLES OF WRONG SENTENCES:
- "Rina is a bird" - WRONG! Story says Rina is a student, not a bird
- "the bird is happy" - WRONG! No capital letter at the start
- "Rina loves birds" - WRONG! If task asks about what Rina sees, not what she loves

Respond EXACTLY in this format (remember, the hint should be encouraging and guiding, but DO NOT provide the answer):
- If both grammar AND facts are correct: "PROCEED: [brief praise]"
- If grammar is wrong: "FIX_GRAMMAR: [hint about capitalization or punctuation]"
- If facts are wrong (contradicts story or task): "FIX_CONTEXT: [hint about what the story actually says or what the task asked for]"
- If both wrong: "FIX_BOTH: [brief hints for both]"

Be encouraging but DO NOT approve wrong sentences. Young students need to learn accuracy.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "FIX_BOTH: Something went wrong with the check. Please try again or fix your capitalization and context.";

    const shouldProceed = responseText.startsWith("PROCEED");
    const feedback = responseText.replace(/^(PROCEED|FIX_GRAMMAR|FIX_CONTEXT|FIX_BOTH):\s*/, "");

    res.status(200).json({ shouldProceed, feedback });
  } catch (error) {
    console.error('Sentence validation error:', error);
    res.status(500).json({ 
      shouldProceed: false, 
      feedback: "Something went wrong with the check. Please try again or fix your capitalization and context." 
    });
  }
}