import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const EVM_ADDRESS = process.env.EVM_ADDRESS || '0xd931e9e57a14c4c800f6b6337a9c6608850c301d';
const NETWORK = process.env.NETWORK || 'eip155:8453';

app.use(cors());
app.use(express.json());

// Free endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'x402 Data API', paymentAddress: EVM_ADDRESS, network: NETWORK });
});

app.get('/.well-known/x402-discovery', (req, res) => {
  res.json({
    name: 'Data API Service',
    description: 'Developer data APIs with x402 payment',
    version: '1.0.0',
    endpoints: [
      { path: 'GET /api/github/trending', price: '$0.01', description: 'GitHub Trending' },
      { path: 'GET /api/npm/stats/:package', price: '$0.005', description: 'NPM Stats' },
      { path: 'GET /api/hackernews/top', price: '$0.005', description: 'HN Top Stories' },
      { path: 'GET /api/crypto/price/:symbol', price: '$0.003', description: 'Crypto Price' }
    ]
  });
});

// x402 middleware
function x402Check(req, res, next) {
  const paid = req.headers['payment-signature'] || req.headers['x-payment'] || req.headers['pay'];
  if (!paid) {
    return res.status(402).json({
      x402Version: 1,
      error: 'Payment required',
      accepts: [{
        scheme: 'exact',
        network: NETWORK,
        payTo: EVM_ADDRESS,
        maxAmountRequired: req._price || '10000',
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        maxTimeoutSeconds: 60
      }]
    });
  }
  next();
}

// GitHub Trending (without cheerio, use regex)
app.get('/api/github/trending', x402Check, async (req, res) => {
  try {
    const resp = await axios.get('https://github.com/trending', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = resp.data;
    const repos = [];
    // Simple regex extraction
    const repoRegex = /href="\/([^"]+?)"[^>]*class="[^"]*Link[^"]*"/g;
    let match;
    while ((match = repoRegex.exec(html)) !== null && repos.length < 25) {
      const path = match[1];
      if (path.includes('/') && !path.startsWith('topics') && !path.startsWith('settings') && !path.startsWith('explore')) {
        repos.push({ path: 'https://github.com/' + path });
      }
    }
    res.json({ success: true, data: { repos, fetchedAt: new Date().toISOString() } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// NPM Stats
app.get('/api/npm/stats/:pkg', x402Check, async (req, res) => {
  try {
    const pkg = req.params.pkg;
    const [registry, downloads] = await Promise.all([
      axios.get(`https://registry.npmjs.org/${pkg}`, { timeout: 10000 }),
      axios.get(`https://api.npmjs.org/downloads/point/last-week/${pkg}`).catch(() => ({ data: null }))
    ]);
    const d = registry.data;
    const latest = d['dist-tags']?.latest;
    res.json({
      success: true,
      data: {
        name: d.name, version: latest, description: d.description,
        weeklyDownloads: downloads.data?.downloads || null,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Hacker News Top
app.get('/api/hackernews/top', x402Check, async (req, res) => {
  try {
    const ids = (await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')).data.slice(0, 30);
    const stories = await Promise.all(ids.map(async id => {
      try { return (await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).data; }
      catch { return null; }
    }));
    res.json({ success: true, data: { stories: stories.filter(Boolean).map(s => ({
      id: s.id, title: s.title, url: s.url, score: s.score, by: s.by, time: new Date(s.time*1000).toISOString()
    })), fetchedAt: new Date().toISOString() }});
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Crypto Price
app.get('/api/crypto/price/:symbol', x402Check, async (req, res) => {
  try {
    const sym = req.params.symbol.toLowerCase();
    const resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${sym}&vs_currencies=usd&include_24hr_change=true`, { timeout: 10000 });
    const data = resp.data[sym];
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { symbol: sym, price: data.usd, change24h: data.usd_24h_change, fetchedAt: new Date().toISOString() } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`x402 Data API running on port ${PORT}`);
  console.log(`Payment address: ${EVM_ADDRESS}`);
  console.log(`Network: ${NETWORK}`);
});
