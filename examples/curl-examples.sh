#!/bin/bash
API="https://charleston-friendship-contributors-wallpapers.trycloudflare.com"
echo "=== x402 API cURL Examples ==="
echo -e "\n1. GitHub Trending:"
curl -s "$API/api/github/trending?language=python" | head -c 300
echo -e "\n\n2. NPM Stats:"
curl -s "$API/api/npm/stats?package=express" | head -c 300
echo -e "\n\n3. ETH Price:"
curl -s "$API/api/crypto/price?symbol=ETH" | head -c 300
echo -e "\n\n4. Gas:"
curl -s "$API/api/gas/base" | head -c 300
echo -e "\n"
