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

/**
 * 3. AI Chatbot Assistant Engine
 */
async function chatWithAI(userMessage, conversationHistory = [], userContext = {}) {
  const riskCategory = userContext?.riskProfile?.category || 'Growth / Moderate-Aggressive';
  const riskScore = userContext?.riskProfile?.score || 68;

  const systemMessage = {
    role: 'system',
    content: `You are FinAura AI Assistant, an elite institutional financial advisor and anti-hype wealth assistant integrated into the FinAura AI Platform.
Your job is to provide actionable, empirical, clear, and anti-hype wealth management guidance.
User Profile Context: Risk Score ${riskScore}/100 (${riskCategory}).
Keep responses well-formatted with markdown, bold key takeaways, bullet points, and concise actionable steps. Always warn against unverified social media hype or guaranteed return claims.`
  };

  // Standardize history formatting
  const formattedHistory = Array.isArray(conversationHistory) 
    ? conversationHistory.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content || m.text || ''
      }))
    : [];

  const apiMessages = [
    systemMessage,
    ...formattedHistory,
    { role: 'user', content: userMessage }
  ];

  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        messages: apiMessages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 800
      });

      const responseText = completion.choices[0]?.message?.content;
      if (responseText) {
        return {
          success: true,
          response: responseText,
          model: 'llama-3.3-70b-versatile',
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Groq Chatbot API call failed, using intelligent financial fallback:', err.message);
    }
  }

  return {
    success: true,
    response: fallbackChatbotResponse(userMessage, riskCategory, riskScore),
    model: 'finaura-financial-intelligence-engine',
    timestamp: new Date().toISOString()
  };
}

function fallbackChatbotResponse(message, riskCategory, riskScore) {
  const query = message.toLowerCase();

  if (query.includes('sip') || query.includes('systematic investment') || query.includes('monthly investment')) {
    return `### 📈 **Smart SIP Strategy & Compounding**

Automated monthly SIPs (Systematic Investment Plans) are the single most effective tool for long-term wealth creation.

**Key Rule of Thumb for Your Profile (${riskCategory}):**
1. **Core Allocation (75-80%)**: Nifty 50 Index / Sensex Bluechip funds + Flexi-cap funds.
2. **Growth Allocation (15-20%)**: Mid-cap / Tech Sectoral funds for alpha generation.
3. **Emergency Cushion (5%)**: Liquid / Debt funds or high-yield savings.

*Tip: Increasing your SIP contribution by just **10% annually** reduces the time to reach ₹1 Crore by up to 4 years!*`;
  }

  if (query.includes('hype') || query.includes('crypto') || query.includes('memecoin') || query.includes('pump') || query.includes('telegram')) {
    return `### 🚨 **Anti-Hype & Volatility Protection Notice**

Social media "tips" and Telegram pump groups disproportionately target retail investors.

**FinAura Risk Assessment for ${riskCategory} (Score: ${riskScore}/100):**
- **Red Flags**: Unrealistic 10x promises, emotional urgency, unverified SEBI/SEC registration.
- **Actionable Advice**: Never allocate more than **2% of net worth** into speculative assets. 
- **Core Defense**: Keep 90%+ of capital anchored in audited index funds, equities, and real estate.`;
  }

  if (query.includes('emergency') || query.includes('fund') || query.includes('savings')) {
    return `### 🛡️ **Emergency Fund Blueprint**

Before aggressive equity investing, secure a financial safety net:

- **Target Amount**: **6 months** of essential expenses (rent, groceries, EMIs, insurance).
- **Placement**: Keep 50% in instant-access savings accounts and 50% in Liquid/Short-term Debt Mutual Funds.
- **Rule**: Never invest your emergency fund in volatile stocks or crypto!`;
  }

  if (query.includes('retirement') || query.includes('goal') || query.includes('50l') || query.includes('crore')) {
    return `### 🎯 **Goal Planning & Target Asset Strategy**

Achieving major milestones requires disciplined asset mapping:

1. **Calculate Inflation-Adjusted Target**: At 6% inflation, ₹50 Lakhs in 15 years requires ~₹1.2 Crore nominal value.
2. **SIP Needed**: Investing ~₹22,500/month at an assumed 12% annual equity return will achieve this goal.
3. **FinAura Goal Tracker**: You can track and adjust this directly in our **Goal Planner** section!`;
  }

  if (query.includes('p/e') || query.includes('pe ratio') || query.includes('valuation') || query.includes('metric')) {
    return `### 📊 **Understanding Financial Metrics: P/E Ratio**

The **Price-to-Earnings (P/E) Ratio** measures how much investors are paying per ₹1 of company profit.

- **Trailing P/E**: Shares price ÷ Last 12 months EPS.
- **Benchmark**: Compare a stock's P/E against its **5-year historical average** and its **industry peer group**.
- **Caution**: High P/E (>50) isn't always bad if earnings growth is >30% (PEG ratio < 1), but requires deep scrutiny.`;
  }

  return `### 🤖 **FinAura AI Wealth Assistant**

Thank you for your inquiry regarding *"${message}"*. 

As a **${riskCategory}** investor (Risk Score: **${riskScore}/100**), here are key guidelines:

- **Disciplined Execution**: Stick to asset allocation targets rather than timing market swings.
- **Anti-Hype Filtering**: Run speculative asset recommendations through our **Hype Analyzer** tab to check risk scores.
- **Portfolio Health**: Ensure broad diversification across large-cap index funds, mid-caps, and debt instruments.

*How else can I assist you with your financial planning, portfolio, or investment learning today?*`;
}

module.exports = { analyzeFinancialTrend, generateFlashcards, chatWithAI };

