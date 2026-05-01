// x402 Data API Node.js Client Example
const BASE_URL = 'https://your-api-url.coze.site';

async function getGitHubTrending(language = 'python') {
  const res = await fetch(`${BASE_URL}/api/github/trending?language=${language}`);
  if (res.status === 402) {
    const data = await res.json();
    console.log('Payment required - x402:', data);
    return null;
  }
  return res.json();
}

async function getNews(category = 'technology') {
  const res = await fetch(`${BASE_URL}/api/news?category=${category}`);
  return res.json();
}

async function main() {
  const trending = await getGitHubTrending('python');
  if (trending) {
    console.log('Trending repos:', trending.repos?.slice(0, 5));
  }
}

main().catch(console.error);
