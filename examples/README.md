# x402 Data API - Examples

## Quick Start

```bash
# Python
python3 examples/python-client.py

# Node.js
node examples/node-client.js

# cURL
bash examples/curl-examples.sh
```

## Available Endpoints

- `GET /api/github/trending?language=<lang>&since=<daily|weekly|monthly>`
- `GET /api/npm/stats?package=<name>`
- `GET /api/crypto/price?symbol=<SYMBOL>`
- `GET /api/gas/base`

## x402 Payment

For paid endpoints, include x402 token:
```bash
curl -H "Authorization: Bearer <x402-token>" $API/endpoint
```
