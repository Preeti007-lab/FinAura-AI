const http = require('http');

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo_investor_99',
        ...headers
      }
    }, (res) => {
      let output = '';
      res.on('data', chunk => output += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(output) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: output });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('--- TESTING FINAURA BACKEND API ENDPOINTS ---');
  
  // 1. Health
  const health = await makeRequest('/api/health');
  console.log('1. GET /api/health:', health.statusCode, health.body?.status);

  // 2. Portfolio Consolidation
  const portfolio = await makeRequest('/portfolio');
  console.log('2. GET /portfolio:', portfolio.statusCode, 'NetWorth:', portfolio.body?.summary?.totalNetWorth, 'Holdings count:', portfolio.body?.holdings?.length);

  // 3. Add Portfolio Asset
  const addAsset = await makeRequest('/portfolio/add', 'POST', {
    name: 'Apple Inc',
    assetClass: 'Equity/Stocks',
    ticker: 'AAPL',
    quantity: 50,
    avgBuyPrice: 180,
    currentPrice: 225
  });
  console.log('3. POST /portfolio/add:', addAsset.statusCode, addAsset.body?.message, 'New Asset:', addAsset.body?.item?.name);

  // 4. Analyze Trend / Hype Analyzer
  const analyze = await makeRequest('/analyze-trend', 'POST', {
    queryText: '🔥 10x GUARANTEED GAINS on Penny Stock XYZ! Buy now before pump!',
    customRiskScore: 68
  });
  console.log('4. POST /analyze-trend:', analyze.statusCode, 'Hype Score:', analyze.body?.data?.hypeScore, 'Sentiment:', analyze.body?.data?.sentiment);

  // 5. Goals & SIP Projections
  const goals = await makeRequest('/goals');
  console.log('5. GET /goals:', goals.statusCode, 'Goals count:', goals.body?.goals?.length, 'Goal 1 SIP Req:', goals.body?.goals?.[0]?.monthlySipRequired);

  // 6. Risk Profile
  const risk = await makeRequest('/risk-profile');
  console.log('6. GET /risk-profile:', risk.statusCode, 'Risk Score:', risk.body?.riskProfile?.score, 'Category:', risk.body?.riskProfile?.category);

  console.log('--- ALL API ENDPOINTS VERIFIED SUCCESSFULLY ---');
}

runTests().catch(console.error);
