"""x402 Data API Python Client Example"""
import requests

BASE_URL = "https://your-api-url.coze.site"
API_KEY = "your-api-key"  # Optional if using x402 payment

def get_github_trending(language="python"):
    """Get trending GitHub repos"""
    response = requests.get(
        f"{BASE_URL}/api/github/trending",
        params={"language": language},
        headers={"Authorization": f"Bearer {API_KEY}"} if API_KEY else {}
    )
    if response.status_code == 402:
        print("Payment required - x402 protocol active")
        print(f"Payment info: {response.json()}")
        return None
    return response.json()

def get_news(category="technology"):
    """Get latest news"""
    response = requests.get(
        f"{BASE_URL}/api/news",
        params={"category": category}
    )
    return response.json()

def get_weather(city="Beijing"):
    """Get weather data"""
    response = requests.get(
        f"{BASE_URL}/api/weather",
        params={"city": city}
    )
    return response.json()

if __name__ == "__main__":
    # Example: Get trending Python repos
    trending = get_github_trending("python")
    if trending:
        for repo in trending.get("repos", [])[:5]:
            print(f"- {repo['name']}: {repo.get('description', 'N/A')}")

    # Example: Get weather
    weather = get_weather("Shanghai")
    if weather:
        print(f"\nShanghai: {weather.get('temperature', 'N/A')}°C")
