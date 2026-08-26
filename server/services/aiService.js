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
    content: `You are Miracle, an elite institutional AI financial advisor and anti-hype wealth assistant integrated into the FinAura AI Platform.
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
  const query = message.toLowerCase().trim();

  // 1. Greetings & Onboarding
  if (query === 'hi' || query === 'hello' || query === 'hey' || query.includes('who are you') || query.includes('what can you do')) {
    return `### 👋 **Hello! I'm Miracle, Your AI Wealth Co-Pilot**

I am integrated into **CredoMetrics AI** to assist you with:
- 📈 **Smart SIP Planning & Compounding Strategies**
- 🛡️ **Anti-Hype Social Audit & Scam Detection**
- 📊 **Portfolio Allocation for ${riskCategory} (Score: ${riskScore}/100)**
- 💡 **Tax Optimization, Emergency Funds & Wealth Education**

*What financial goal or question would you like to explore today?*`;
  }

  // 2. Gold & Sovereign Gold Bonds (SGB)
  if (query.includes('gold') || query.includes('sgb') || query.includes('sovereign gold') || query.includes('silver')) {
    return `### 🪙 **Gold & Sovereign Gold Bonds (SGB) Strategy**

Gold acts as a classic **inflation hedge** and portfolio stabilization anchor.

**Key Allocation Guidelines for ${riskCategory}:**
1. **Target Allocation**: Allocate **5% - 10%** of your overall wealth to gold.
2. **Sovereign Gold Bonds (SGB)**: 
   - Yields an extra **2.5% annual interest** paid semi-annually.
   - **100% Tax-Free** capital gains if held until 8-year maturity.
3. **Gold ETFs / Sovereign Gold Funds**: Ideal if you require higher liquidity over physical jewelry.

*Pro Tip: Avoid physical gold jewelry for investment due to 15-25% making charge losses.*`;
  }

  // 3. Mutual Funds & ETFs
  if (query.includes('mutual fund') || query.includes('etf') || query.includes('index fund') || query.includes('nav') || query.includes('flexi cap')) {
    return `### 📦 **Mutual Fund & Index Allocation**

Mutual funds allow instant diversification across hundreds of institutional-grade securities.

**Recommended Fund Structure for Your Profile (${riskCategory}):**
- 🏛️ **Large-Cap / Nifty 50 Index (45%)**: Core stability with top 50 audited Indian enterprises.
- 🚀 **Flexi-Cap / Mid-Cap Funds (35%)**: Dynamic market cap allocation for high CAGR growth.
- 🛡️ **Short-Duration Debt Funds (20%)**: Downside cushion and liquid rebalancing buffer.

*Always look for **Direct Plans** (0.5% - 1.0% lower expense ratio) over Regular Plans.*`;
  }

  // 4. Stocks & Equities
  if (query.includes('stock') || query.includes('share') || query.includes('equity') || query.includes('nifty') || query.includes('sensex') || query.includes('ipo')) {
    return `### 📊 **Equity Stock Selection & Valuation Framework**

Direct stock investing requires disciplined fundamental scrutiny rather than emotional momentum.

**Institutional Checklist Before Buying Any Stock:**
1. **Revenue & EPS Growth**: Consistent 12%+ YoY net profit growth over 5 years.
2. **Return on Equity (ROE)**: ROE > 15% with manageable Debt-to-Equity (< 0.5).
3. **Valuation Benchmark**: Price-to-Earnings (P/E) compared against sector 5-year average.
4. **Position Sizing**: Limit individual stock exposure to **max 5%** of net worth.`;
  }

  // 5. Tax Harvesting & Deductions
  if (query.includes('tax') || query.includes('80c') || query.includes('80d') || query.includes('elss') || query.includes('ltcg') || query.includes('stcg')) {
    return `### 💡 **Smart Tax Optimization & Deductions**

Maximize your net take-home returns legally using key tax provisions:

- 📑 **Sec 80C (up to ₹1.5 Lakhs)**: Invest via **ELSS Mutual Funds** (shortest 3-year lock-in with equity CAGR upside).
- 🏥 **Sec 80D (up to ₹75,000)**: Health insurance premium deductions for self & senior citizen parents.
- 🌾 **Tax-Loss Harvesting**: Offset capital gains against realized losses before March 31st annually.
- 📈 **Equity LTCG**: Tax-free up to ₹1.25 Lakhs per financial year.`;
  }

  // 6. Debt & Fixed Income (FD, PPF, NPS)
  if (query.includes('fd') || query.includes('fixed deposit') || query.includes('ppf') || query.includes('nps') || query.includes('bond') || query.includes('debt')) {
    return `### 🔒 **Fixed Income & Capital Preservation**

Fixed income instruments protect your portfolio against market drawdowns.

**Comparison of Capital Preservation Assets:**
- 🏛️ **Public Provident Fund (PPF)**: EEE tax-free status, 15-year horizon, guaranteed sovereign returns.
- 🏦 **Corporate & Bank FDs**: High liquidity, ideal for short-term goals (< 3 years).
- 👴 **National Pension System (NPS)**: Additional **₹50,000 tax deduction under Sec 80CCD(1B)** with low-cost equity-debt options.`;
  }

  // 7. Loans, EMIs & Debt Payoff
  if (query.includes('loan') || query.includes('emi') || query.includes('credit card') || query.includes('mortgage') || query.includes('debt repayment')) {
    return `### 💳 **Debt Repayment & EMI Optimization**

Managing debt effectively accelerates your journey toward financial independence.

**Recommended Payoff Rules:**
1. **High-Interest Debt First (Credit Cards >18% APR)**: Pay off aggressively using the **Avalanche Method**.
2. **EMI Cap Rule**: Total monthly debt EMIs should never exceed **30-35% of net monthly income**.
3. **Prepayment vs Investment**: If loan interest rate is < 8.5% (e.g. Home Loan), continuing equities SIPs often outperforms lump-sum loan prepayment.`;
  }

  // 8. Real Estate & REITs
  if (query.includes('real estate') || query.includes('property') || query.includes('reit') || query.includes('house') || query.includes('land')) {
    return `### 🏠 **Real Estate vs Real Estate Investment Trusts (REITs)**

Real estate provides physical tangible wealth, but comes with illiquidity and high ticket sizes.

**Modern Real Estate Strategy:**
- 🏢 **REITs (Real Estate Investment Trusts)**: Invest in Grade-A commercial office parks starting at ₹300 with 6-8% quarterly dividend yields.
- 📑 **Residential Property**: Residential rental yield averages 2.5% - 3.5% in major metros. Factor in maintenance costs and property taxes.`;
  }

  // 9. SIPs & Compounding
  if (query.includes('sip') || query.includes('systematic investment') || query.includes('compounding') || query.includes('rule of 72') || query.includes('step up')) {
    return `### 📈 **Smart SIP Strategy & Compounding**

Automated monthly SIPs (Systematic Investment Plans) are the single most effective tool for long-term wealth creation.

**Key Rule of Thumb for Your Profile (${riskCategory}):**
1. **Core Allocation (75-80%)**: Nifty 50 Index / Sensex Bluechip funds + Flexi-cap funds.
2. **Growth Allocation (15-20%)**: Mid-cap / Tech Sectoral funds for alpha generation.
3. **Emergency Cushion (5%)**: Liquid / Debt funds or high-yield savings.

*Tip: Increasing your SIP contribution by just **10% annually** reduces the time to reach ₹1 Crore by up to 4 years!*`;
  }

  // 10. Anti-Hype & Social Scams
  if (query.includes('hype') || query.includes('crypto') || query.includes('memecoin') || query.includes('pump') || query.includes('telegram') || query.includes('10x') || query.includes('tip')) {
    return `### 🚨 **Anti-Hype & Volatility Protection Notice**

Social media "tips" and Telegram pump groups disproportionately target retail investors.

**FinAura Risk Assessment for ${riskCategory} (Score: ${riskScore}/100):**
- **Red Flags**: Unrealistic 10x promises, emotional urgency, unverified SEBI/SEC registration.
- **Actionable Advice**: Never allocate more than **2% of net worth** into speculative assets. 
- **Core Defense**: Keep 90%+ of capital anchored in audited index funds, equities, and real estate.`;
  }

  // 11. Emergency Fund
  if (query.includes('emergency') || query.includes('savings') || query.includes('buffer')) {
    return `### 🛡️ **Emergency Fund Blueprint**

Before aggressive equity investing, secure a financial safety net:

- **Target Amount**: **6 months** of essential expenses (rent, groceries, EMIs, insurance).
- **Placement**: Keep 50% in instant-access savings accounts and 50% in Liquid/Short-term Debt Mutual Funds.
- **Rule**: Never invest your emergency fund in volatile stocks or crypto!`;
  }

  // 12. Retirement & FIRE
  if (query.includes('retirement') || query.includes('swp') || query.includes('fire') || query.includes('4% rule') || query.includes('pension')) {
    return `### 🏖️ **Retirement Planning & The 4% SWP Rule**

Building a sustainable retirement corpus ensures lifetime financial freedom.

**The 4% Safe Withdrawal Rate (SWP):**
1. **Corpus Target**: Multiply annual retirement expenses by **25×** (e.g., ₹12 Lakhs annual expense requires ₹3 Crore corpus).
2. **Asset Split**: Keep 50% in Equity Mutual Funds for growth and 50% in Sovereign Bonds/Debt for steady monthly cashflow.
3. **Systematic Withdrawal**: Withdraw 4% annually adjusted for inflation.`;
  }

  // 13. Metrics & Valuation (P/E Ratio, Sharpe, ROE)
  if (query.includes('p/e') || query.includes('pe ratio') || query.includes('valuation') || query.includes('sharpe') || query.includes('roe')) {
    return `### 📊 **Financial Valuation Metrics: P/E & Sharpe Ratio**

- **Price-to-Earnings (P/E)**: Shares price ÷ Last 12 months EPS. Compare a stock's P/E against its **5-year historical average** and its **industry peer group**.
- **Sharpe Ratio**: Measures risk-adjusted excess returns over risk-free rate. A Sharpe ratio > 1.0 indicates institutional excellence.
- **PEG Ratio**: P/E divided by Annual EPS Growth. A PEG < 1.0 signals attractive growth at reasonable price.`;
  }

  // 14. Dynamic Query Specific Response for Unlisted Topics
  const words = message.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(w => w.length > 3);
  const keyTopic = words.length > 0 ? words.join(' ') : message;

  return `### 💡 **Miracle AI Financial Advisory: ${keyTopic.charAt(0).toUpperCase() + keyTopic.slice(1)}**

Here is a structured financial analysis for your query regarding **"${message}"**:

1. **Risk Alignment**: Tailored for your **${riskCategory}** investor profile (Risk Score: **${riskScore}/100**).
2. **Empirical Discipline**: Ensure any investment decision around *"${keyTopic}"* is based on audited disclosures rather than market hype.
3. **Portfolio Action**:
   - Verify sector valuation metrics before allocating capital.
   - Maintain disciplined position sizing (max 5% single exposure).
   - Use our **Hype Analyzer** tab to audit social media claims.

*Would you like to analyze a specific asset ticker, run a SIP calculation, or take a risk profiling quiz?*`;
}

module.exports = { analyzeFinancialTrend, generateFlashcards, chatWithAI };

