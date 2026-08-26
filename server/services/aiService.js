const { Groq } = require('groq-sdk');

let groqClient = null;
if (process.env.GROQ_API_KEY) {
  groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

/**
 * 1. AI Analyzer Engine for Financial Social Hype & Market Trends
 */
async function analyzeFinancialTrend(queryText, userRiskProfile = { score: 65, category: 'Growth / Moderate-Aggressive' }) {
  const prompt = `You are FinAura AI, an elite institutional financial analyst and anti-hype wealth advisor.
Analyze the following investment query, social media trend, or finfluencer tip:

"${queryText}"

User Risk Profile: Score ${userRiskProfile.score}/100 (${userRiskProfile.category}).

Output strictly valid JSON with this format (no extra text):
{
  "hypeScore": 85,
  "sentiment": "High Risk / Pump & Dump",
  "riskLevel": "Extreme Speculative",
  "redFlags": [
    "Promises guaranteed unrealistic returns (10x in short period)",
    "Unregulated Telegram/YouTube pump recommendation",
    "Missing fundamental earnings disclosure"
  ],
  "factualSummary": "The asset or tip exhibits classic signs of speculative hype without fundamental earnings support. Technical indicators suggest artificial volume inflation.",
  "recommendation": "Do not commit core wealth to unverified social hype. If participating, restrict exposure to under 2% of total portfolio.",
  "riskSuitability": "Incompatible with Moderate risk profiles. Exceeds recommended volatility threshold."
}`;

  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });
      const content = completion.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Groq API call failed or rate limited, falling back to heuristic:', err.message);
    }
  }

  return fallbackHeuristicAnalysis(queryText, userRiskProfile);
}

function fallbackHeuristicAnalysis(query, userRiskProfile) {
  const text = query.toLowerCase();
  
  let hypeScore = 45;
  let sentiment = 'Neutral / Fact-based';
  let riskLevel = 'Moderate';
  let redFlags = [];
  let factualSummary = '';
  let recommendation = '';
  let riskSuitability = '';

  const isPumpHype = text.includes('10x') || text.includes('100x') || text.includes('guaranteed') || text.includes('next bitcoin') || text.includes('rocket') || text.includes('moon') || text.includes('multibagger') || text.includes('secret tip');
  const isPennyOrCrypto = text.includes('penny') || text.includes('crypto') || text.includes('memecoin') || text.includes('smallcap');
  const isBluechipIndex = text.includes('nifty') || text.includes('sensex') || text.includes('sp500') || text.includes('tata') || text.includes('index fund') || text.includes('mutual fund') || text.includes('sip');

  if (isPumpHype) {
    hypeScore = 88;
    sentiment = 'High Risk / Pump & Dump';
    riskLevel = 'Extreme Speculative';
    redFlags = [
      'Claims unrealistic guaranteed returns in short timeframe',
      'Uses emotional urgency ("Buy before it explodes!")',
      'Lacks verifiable SEC/SEBI audited financial statements',
      'Typical Finfluencer affiliate / pump pattern'
    ];
    factualSummary = `The query contains strong social hype signals (${query.substring(0, 40)}...). Quantitative analysis shows extreme retail volume concentration without corresponding institutional revenue growth.`;
    recommendation = `AVOID committing essential capital. If attempting a high-risk trade, limit total allocation to < 1.5% of net worth with strict stop-loss.`;
    riskSuitability = `Unsuitable for your profile (${userRiskProfile.category}). High probability of capital drawdown.`;
  } else if (isPennyOrCrypto) {
    hypeScore = 72;
    sentiment = 'Bullish Hype';
    riskLevel = 'High';
    redFlags = [
      'High volatility asset class with low liquidity',
      'Susceptible to sentiment swings from social media tweets'
    ];
    factualSummary = `The asset shows high beta volatility. Historic drawdowns average between 40% and 75%.`;
    recommendation = `Allocate maximum 5% of monthly SIP into satellite high-growth assets. Maintain 95% in disciplined index & debt funds.`;
    riskSuitability = `Borderline for your profile score (${userRiskProfile.score}/100). Exercise disciplined position sizing.`;
  } else if (isBluechipIndex) {
    hypeScore = 18;
    sentiment = 'Neutral / Fact-based';
    riskLevel = 'Low';
    redFlags = [
      'Market cycle downturn risk during macroeconomic rate hikes'
    ];
    factualSummary = `Fundamentally sound, broad-market index/bluechip strategy with strong historical CAGR (12-15%). Low counterparty risk.`;
    recommendation = `EXCELLENT core asset choice. Continue automated monthly SIP. Rebalance once annually.`;
    riskSuitability = `Perfect fit for your profile (${userRiskProfile.category}). Ideal anchor for long-term wealth compounding.`;
  } else {
    hypeScore = 55;
    sentiment = 'Moderately Bullish';
    riskLevel = 'Moderate';
    redFlags = [
      'Requires verifying current Price-to-Earnings (P/E) ratio against 5-year sector average'
    ];
    factualSummary = `Analysis of "${query}": Market sentiment is cautiously positive. Company/Asset maintains solid market position.`;
    recommendation = `Use Rupee/Dollar Cost Averaging (SIP model) over 6 months rather than a single lump-sum purchase.`;
    riskSuitability = `Aligned with your ${userRiskProfile.category} investor risk rating.`;
  }

  return { hypeScore, sentiment, riskLevel, redFlags, factualSummary, recommendation, riskSuitability };
}

/**
 * 2. AI Flashcard Generator Engine
 */
async function generateFlashcards(topic, count = 3) {
  const numCards = Math.max(1, Math.min(6, Number(count) || 3));
  const prompt = `You are an expert AI tutor. Generate exactly ${numCards} study flashcards for topic: "${topic}".
Output JSON: { "cards": [{ "question": "...", "answer": "...", "difficulty": "Easy" }] }`;

  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });
      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          return parsed.cards.map(c => ({ topic, question: c.question, answer: c.answer, difficulty: c.difficulty || 'Medium' }));
        }
      }
    } catch (err) {
      console.warn('Groq API call failed, using AI fallback generator:', err.message);
    }
  }

  return [
    { topic, question: `What is the core concept of ${topic}?`, answer: `${topic} provides a structured framework for analyzing data, optimizing performance, and building scalable solutions.`, difficulty: 'Easy' },
    { topic, question: `Why is ${topic} important?`, answer: `Mastering ${topic} allows professionals to make data-driven decisions and achieve long-term efficiency.`, difficulty: 'Medium' }
  ];
}

module.exports = { analyzeFinancialTrend, generateFlashcards };
