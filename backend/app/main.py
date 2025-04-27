from fastapi import FastAPI
from prometheus_client import Counter, generate_latest, REGISTRY
from fastapi.responses import PlainTextResponse

app = FastAPI()

# Prometheus metrics
request_counter = Counter('http_requests_total', 'Total HTTP Requests', ['endpoint'])

@app.get("/coins")
async def get_coins():
    request_counter.labels(endpoint='/coins').inc()
    return [
        {
            "ticker": "$DOGE",
            "name": "Dogecoin",
            "market_cap": 1000000,
            "ath_market_cap": 2000000,
            "ath_change": -50,
            "follower_count": 10000,
            "growth_rate": 100,
            "sentiment_score": 0.8,
            "market_cap_history": [{"timestamp": "2025-04-26", "market_cap": 1000000}]
        }
    ]

@app.get("/metrics")
async def metrics():
    return PlainTextResponse(generate_latest(REGISTRY))