from flask import Flask, jsonify
from flask_cors import CORS
import market_simulator
import agent

app = Flask(__name__)
CORS(app)

market_simulator.start_background_feed()


@app.get("/api/status")
def status():
    return jsonify({"service": "openex-ai-agent", "status": "UP"})


@app.get("/api/market/<path:symbol>")
def market(symbol):
    symbol = symbol.replace("-", "/")
    ticks = market_simulator.get_ticks(symbol)
    if not ticks:
        return jsonify({"error": f"Unknown symbol {symbol}"}), 404
    return jsonify({
        "symbol": symbol,
        "ticks": ticks,
        "latestPrice": market_simulator.get_latest_price(symbol),
    })

@app.post("/api/chat")
def chat():
    from flask import request
    body = request.get_json(force=True) or {}
    message = body.get("message", "").strip()
    token = body.get("token")
    if not message:
        return jsonify({"error": "message is required"}), 400
    return jsonify({"reply": agent.ask(message, token)})

if __name__ == "__main__":
    app.run(port=5000, debug=False)