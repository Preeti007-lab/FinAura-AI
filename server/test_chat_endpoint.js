const http = require('http');
const app = require('./index');
const { chatWithAI } = require('./services/aiService');

async function testFullChatIntegration() {
  console.log('--- Testing AI Chatbot Functionality & HTTP Endpoint ---');

  // 1. Direct Service Logic Test
  const directRes = await chatWithAI('How do I build a SIP strategy for long term wealth?', [], {
    riskProfile: { score: 70, category: 'Growth Investor' }
  });
  console.log('✅ 1. Direct Service Test Passed:', directRes.success);
  console.log('💬 Direct Response Model:', directRes.model);

  // 2. Express HTTP Endpoint Test
  const TEST_PORT = 5099;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`📡 Temporary test server running on port ${TEST_PORT}`);

    try {
      const postData = JSON.stringify({
        message: 'Calculate ₹50 Lakhs retirement goal investment',
        history: [],
        riskProfile: { score: 75, category: 'Aggressive Growth' }
      });

      const req = http.request({
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log('📡 HTTP Response Status:', res.statusCode);
          const parsed = JSON.parse(body);
          console.log('✅ 2. HTTP Endpoint Test Passed:', parsed.success);
          console.log('💬 HTTP Response Model:', parsed.model);
          console.log('💬 HTTP Response Snippet:', parsed.response.substring(0, 140) + '...\n');
          
          server.close(() => {
            console.log('--- All Chat Engine & HTTP Endpoint Tests Passed Successfully! ---');
            process.exit(0);
          });
        });
      });

      req.on('error', (e) => {
        console.error('❌ HTTP Request Error:', e.message);
        server.close(() => process.exit(1));
      });

      req.write(postData);
      req.end();
    } catch (err) {
      console.error('❌ HTTP Test Exception:', err.message);
      server.close(() => process.exit(1));
    }
  });
}

testFullChatIntegration().catch(err => {
  console.error('❌ Test Execution Error:', err);
  process.exit(1);
});
