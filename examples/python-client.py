#!/usr/bin/env python3
"""
x402 Data API - Python Client Example
Pay-per-request data API with USDC on Base chain
"""

import requests
import json

API_URL = "https://charleston-friendship-contributors-wallpapers.trycloudflare.com"

def call_api(endpoint: str, params: dict = None):
    """Call x402 API endpoint"""
    response = requests.get(
        f"{API_URL}/{endpoint}",
        params=params or {},
        headers={"Accept": "application/json"}
    )
    return response.json()

def main():
    print("=== x402 Data API Examples ===\n")
    
    # GitHub Trends
    print("1. GitHub Trending (Python)")
    result = call_api("api/github/trending", {"language": "python"})
    print(json.dumps(result, indent=2)[:500])
    print()
    
    # NPM Stats  
    print("2. NPM Stats (express)")
    result = call_api("api/npm/stats", {"package": "express"})
    print(json.dumps(result, indent=2)[:500])
    print()
    
    # Crypto Price
    print("3. ETH Price")
    result = call_api("api/crypto/price", {"symbol": "ETH"})
    print(json.dumps(result, indent=2)[:500])
    print()
    
    # Gas Tracker
    print("4. Base Gas")
    result = call_api("api/gas/base")
    print(json.dumps(result, indent=2)[:500])

if __name__ == "__main__":
    main()
