"""
The trading assistant: a LangChain agent backed by a local Ollama model.
No trading tools on purpose — it can only talk, never place an order.
"""
from langchain_ollama import OllamaLLM

SYSTEM_PROMPT = (
    "You are the OpenEx trading terminal's onboard assistant. You explain "
    "how the exchange works and answer general questions about trading "
    "concepts. You never give financial advice, and you never claim to "
    "place or suggest trades yourself."
)


def ask(message: str) -> str:
    llm = OllamaLLM(model="llama3", temperature=0.3)
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {message}\nAssistant:"
    try:
        return llm.invoke(full_prompt)
    except Exception as exc:
        return f"The droid glitched: {exc}"