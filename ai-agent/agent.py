"""
The trading assistant, now with one real capability: reading the calling
user's wallet balances from the Kotlin core API. It cannot place orders —
that's a deliberate limit, not a missing feature.
"""
import os

import requests
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_ollama import ChatOllama

CORE_API_URL = os.getenv("CORE_API_URL", "http://localhost:8080")

SYSTEM_PREAMBLE = (
    "You are the OpenEx trading terminal's onboard assistant. "
    "Your job is narrow: answer questions about the user's OpenEx wallet, "
    "balances, orders, and how the exchange works (order types, the "
    "matching engine, the ledger, trading concepts). "
    "\n\n"
    "Rules:\n"
    "- If the user greets you (hi, hey, hello) or makes small talk, just "
    "greet back naturally. Do NOT look up their wallet unless they actually "
    "ask about it.\n"
    "- Only call get_wallet_balances when the user's message is actually "
    "asking about their balance, holdings, or wallet. Never call it "
    "speculatively or as a default action.\n"
    "- If asked about their balance, you MUST call the tool before "
    "answering — never guess or invent numbers. If the tool fails, say so "
    "plainly instead of making up a balance.\n"
    "- If the user asks something unrelated to OpenEx, trading, or their "
    "account (general trivia, coding help, other topics), politely say "
    "that's outside what you can help with here, and steer back to OpenEx.\n"
    "- You never place, suggest, or execute trades, and you never give "
    "financial advice."
)


def ask(message: str, bearer_token: str) -> str:
    if not bearer_token:
        return "Log in first so I can look up your wallet."

    @tool
    def get_wallet_balances(_: str = "") -> str:
        """Look up the current user's wallet balances across all currencies."""
        print(">>> get_wallet_balances tool was called")  # debug marker
        try:
            response = requests.get(
                f"{CORE_API_URL}/api/wallets",
                headers={"Authorization": f"Bearer {bearer_token}"},
                timeout=5,
            )
            response.raise_for_status()
            balances = response.json()
            result = ", ".join(f"{b['currency']}: {b['balance']}" for b in balances)
            print(f">>> tool result: {result}")  # debug marker
            return result
        except requests.RequestException as exc:
            print(f">>> tool error: {exc}")  # debug marker
            return f"Could not reach the wallet service: {exc}"

    llm = ChatOllama(model="llama3.2:3b", temperature=0)
    agent = create_agent(model=llm, tools=[get_wallet_balances], system_prompt=SYSTEM_PREAMBLE)

    try:
        result = agent.invoke({"messages": [{"role": "user", "content": message}]})
        return result["messages"][-1].content
    except Exception as exc:
        return f"The droid glitched: {exc}"