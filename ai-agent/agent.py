"""
The trading assistant, now with one real capability: reading the calling
user's wallet balances from the Kotlin core API. It cannot place orders —
that's a deliberate limit, not a missing feature.
"""
import os

import requests
from langchain.agents import AgentType, Tool, initialize_agent
from langchain_ollama import OllamaLLM

CORE_API_URL = os.getenv("CORE_API_URL", "http://localhost:8080")

SYSTEM_PREAMBLE = (
    "You are the OpenEx trading terminal's onboard assistant. You can look "
    "up the user's own wallet balances using your tool. You never place, "
    "suggest, or execute trades, and you never give financial advice."
)


def _make_wallet_tool(bearer_token: str) -> Tool:
    def _get_wallet_balances(_: str) -> str:
        try:
            response = requests.get(
                f"{CORE_API_URL}/api/wallets",
                headers={"Authorization": f"Bearer {bearer_token}"},
                timeout=5,
            )
            response.raise_for_status()
            balances = response.json()
            return ", ".join(f"{b['currency']}: {b['balance']}" for b in balances)
        except requests.RequestException as exc:
            return f"Could not reach the wallet service: {exc}"

    return Tool(
        name="get_wallet_balances",
        func=_get_wallet_balances,
        description="Look up the current user's wallet balances across all currencies. Input is ignored, pass an empty string.",
    )


def ask(message: str, bearer_token: str) -> str:
    if not bearer_token:
        return "Log in first so I can look up your wallet."

    llm = OllamaLLM(model="llama3", temperature=0.2)
    tools = [_make_wallet_tool(bearer_token)]
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=False,
        handle_parsing_errors=True,
        agent_kwargs={"prefix": SYSTEM_PREAMBLE},
    )

    try:
        return agent.run(message)
    except Exception as exc:
        return f"The droid glitched: {exc}"