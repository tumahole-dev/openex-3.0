from flask import Flask, jsonify
from flask_cors import CORS
import market_simulator

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


if __name__ == "__main__":
    app.run(port=5000, debug=False)