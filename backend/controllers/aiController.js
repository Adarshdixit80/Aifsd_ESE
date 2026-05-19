const axios = require('axios');

// ─── Rule-based AI fallback (works without API key) ───────────────────────────
const ruleBasedAnalysis = (category, description, title) => {
  const text = `${title} ${description}`.toLowerCase();

  // Priority Detection
  let priority = 'Medium';
  const highKeywords = [
    'urgent',
    'emergency',
    'danger',
    'fire',
    'flood',
    'accident',
    'critical',
    'immediate',
    'broken',
    'no water',
    'no electricity',
    'outage',
  ];
  const lowKeywords = ['minor', 'small', 'slight', 'little', 'rarely'];

  if (highKeywords.some((k) => text.includes(k))) priority = 'High';
  else if (lowKeywords.some((k) => text.includes(k))) priority = 'Low';
  else if (category === 'Electricity' || category === 'Water Supply')
    priority = 'High';

  // Department Recommendation
  const deptMap = {
    'Water Supply': 'Water & Sewerage Board',
    Electricity: 'Electricity Department',
    'Roads & Infrastructure': 'Public Works Department (PWD)',
    'Garbage & Sanitation': 'Municipal Sanitation Department',
    'Public Safety': 'Police & Safety Department',
    'Noise Pollution': 'Environmental Control Board',
    Other: 'General Administration Department',
  };
  const department = deptMap[category] || 'General Administration Department';

  // Summary
  const summary = `A ${priority.toLowerCase()} priority ${category.toLowerCase()} complaint has been registered. The issue reported is: "${title}". Immediate attention is recommended by the ${department}.`;

  // Auto Response
  const response = `Dear Complainant,\n\nThank you for registering your complaint titled "${title}". Your complaint has been assigned to the ${department} with a priority of "${priority}".\n\nWe assure you that the concerned department will review and address your issue within the stipulated timeframe. You may track the status of your complaint using your complaint ID.\n\nBest Regards,\nComplaint Management Team`;

  return { priority, department, summary, response };
};

// ─── OpenRouter AI Analysis ───────────────────────────────────────────────────
const openRouterAnalysis = async (category, description, title, location) => {
  const prompt = `You are an AI assistant for a Smart Complaint Management System in India.

Analyze this citizen complaint and provide a structured JSON response:

Complaint Title: ${title}
Category: ${category}
Location: ${location}
Description: ${description}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "priority": "High" or "Medium" or "Low",
  "department": "Name of responsible government department",
  "summary": "A 2-3 sentence summary of the complaint",
  "response": "A professional auto-generated response message to the complainant (3-4 sentences)"
}`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://complaint-management.app',
        'X-Title': 'Smart Complaint Management',
      },
      timeout: 15000,
    }
  );

  const content = response.data.choices[0].message.content.trim();

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI did not return valid JSON');

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate fields
  if (!parsed.priority || !parsed.department || !parsed.summary || !parsed.response) {
    throw new Error('AI response missing required fields');
  }

  return parsed;
};

// ─── POST /api/ai/analyze ─────────────────────────────────────────────────────
const analyzeComplaint = async (req, res) => {
  try {
    const { category, description, title, location } = req.body;

    if (!category || !description || !title) {
      return res.status(400).json({
        message: 'category, description, and title are required for analysis.',
      });
    }

    let analysis;
    let aiUsed = false;

    // Try OpenRouter AI first if API key is set
    if (
      process.env.OPENROUTER_API_KEY &&
      process.env.OPENROUTER_API_KEY !== 'sk-or-v1-your-openrouter-api-key-here'
    ) {
      try {
        analysis = await openRouterAnalysis(
          category,
          description,
          title,
          location || 'Not specified'
        );
        aiUsed = true;
      } catch (aiError) {
        console.warn(
          'OpenRouter AI failed, using rule-based fallback:',
          aiError.message
        );
        analysis = ruleBasedAnalysis(category, description, title);
      }
    } else {
      // Use rule-based analysis (no API key needed)
      analysis = ruleBasedAnalysis(category, description, title);
    }

    res.status(200).json({
      message: 'Analysis complete!',
      aiUsed,
      analysis,
    });
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    res.status(500).json({ message: 'AI analysis failed. Please try again.' });
  }
};

module.exports = { analyzeComplaint };
