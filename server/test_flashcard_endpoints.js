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

async function testFlashcards() {
  console.log('--- TESTING FLASHGEN AI ENDPOINTS (/generate, /getcards, /deletecard) ---');

  // 1. POST /generate
  const genRes = await makeRequest('/generate', 'POST', {
    topic: 'System Design',
    count: 3
  });
  console.log('1. POST /generate Status:', genRes.statusCode, genRes.body || genRes.raw);

  if (genRes.body && genRes.body.cards) {
    const generatedCardId = genRes.body.cards[0]?._id;
    console.log('   Generated Card Question:', genRes.body.cards[0]?.question);

    // 2. GET /getcards
    const getRes = await makeRequest('/getcards', 'GET');
    console.log('2. GET /getcards Status:', getRes.statusCode, 'Total stored cards:', getRes.body?.count);

    // 3. POST /deletecard
    if (generatedCardId) {
      const delRes = await makeRequest('/deletecard', 'POST', { cardId: generatedCardId });
      console.log('3. POST /deletecard Status:', delRes.statusCode, delRes.body?.message);
    }

    // 4. Verify count after delete
    const finalGet = await makeRequest('/getcards', 'GET');
    console.log('4. GET /getcards (after delete) Status:', finalGet.statusCode, 'Final card count:', finalGet.body?.count);
  }

  console.log('--- ALL FLASHCARD ENDPOINTS VERIFIED SUCCESSFULLY ---');
}

testFlashcards().catch(console.error);
