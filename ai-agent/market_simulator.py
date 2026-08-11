"""
Simulated market data: a random walk with drift, running in a background
thread so price ticks accumulate over time even between requests.
"""
import threading
import time
from collections import deque

import numpy as np

SYMBOLS = {
    "BTC/USD": {"start_price": 65000.0, "drift": 0.00002, "volatility": 0.0015},
}

MAX_TICKS = 200
_lock = threading.Lock()
_history = {symbol: deque(maxlen=MAX_TICKS) for symbol in SYMBOLS}
_current_price = {symbol: cfg["start_price"] for symbol, cfg in SYMBOLS.items()}


def _tick():
    for symbol, cfg in SYMBOLS.items():
        shock = np.random.normal(loc=cfg["drift"], scale=cfg["volatility"])
        with _lock:
            _current_price[symbol] *= (1 + shock)
            _history[symbol].append({"timestamp": time.time(), "price": round(_current_price[symbol], 2)})


def _run_forever():
    while True:
        _tick()
        time.sleep(1)


def start_background_feed():
    thread = threading.Thread(target=_run_forever, daemon=True)
    thread.start()


def get_ticks(symbol: str):
    with _lock:
        return list(_history.get(symbol, []))


def get_latest_price(symbol: str):
    with _lock:
        return _current_price.get(symbol)