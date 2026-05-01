#!/bin/bash
# x402 Data API - curl Examples
BASE_URL="https://your-api-url.coze.site"

# Get GitHub trending repos
curl "$BASE_URL/api/github/trending?language=python"

# Get news
curl "$BASE_URL/api/news?category=technology"

# Get weather
curl "$BASE_URL/api/weather?city=Beijing"

# Check API health
curl "$BASE_URL/health"

# Discover x402 payment endpoints
curl "$BASE_URL/.well-known/x402-discovery"
