import { useState } from "react";
import axios from "axios";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Ask me about your wallet or how the exchange works." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function send(e) {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setLoading(true);
        try {
            const token = localStorage.getItem("openex_token");
            const { data } = await axios.post("http://localhost:5000/api/chat", { message: userMsg.text, token });
            setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
        } catch {
            setMessages((m) => [...m, { role: "assistant", text: "The droid is offline right now." }]);
        } finally {
            setLoading(false);
        }
    }

    if (!open) {
        return (
            <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open trading assistant">
                🤖
            </button>
        );
    }

    return (
        <div className="chat-panel">
            <div className="chat-panel-header">
                <span>🤖 Trading Assistant</span>
                <button className="ghost" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="chat-messages">
                {messages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>
                ))}
                {loading && <div className="chat-bubble thinking">thinking…</div>}
            </div>
            <form className="chat-input-row" onSubmit={send}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something…" />
                <button type="submit" disabled={loading}>Send</button>
            </form>
        </div>
    );
}