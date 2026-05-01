#!/usr/bin/env node
const https = require('https');
const API_URL = 'https://charleston-friendship-contributors-wallpapers.trycloudflare.com';

async function callApi(path, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `https://${API_URL.replace('https://', '')}/${path}${query ? '?'+query : ''}`;
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function main() {
    console.log('=== x402 API Node.js Examples ===\n');
    console.log('1. GitHub:', JSON.stringify(await callApi('api/github/trending', {language:'js'})).slice(0,300));
    console.log('2. NPM:', JSON.stringify(await callApi('api/npm/stats', {package:'react'})).slice(0,300));
    console.log('3. Crypto:', JSON.stringify(await callApi('api/crypto/price', {symbol:'BTC'})).slice(0,300));
}
main().catch(console.error);
