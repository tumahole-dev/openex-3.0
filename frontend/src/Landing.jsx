import { Link } from "react-router-dom";

const TICKER_DATA = [
  { sym: "BTC/USD", price: "64,832.10", change: "+1.4%", up: true },
  { sym: "ETH/USD", price: "3,412.55", change: "-0.6%", up: false },
  { sym: "BTC/USD", price: "64,798.20", change: "+1.2%", up: true },
  { sym: "ETH/USD", price: "3,409.90", change: "-0.7%", up: false },
];

export default function Landing() {
  return (
    <div>
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span className="ticker-item" key={i}>
              <span className="sym">{t.sym}</span>
              <span className="mono">{t.price}</span>{" "}
              <span className={t.up ? "up" : "down"}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="hero">
        <div className="eyebrow">⚔️ Simulated Exchange</div>
        <h1>Trade fast.<br /><span className="accent-text">Settle honest.</span></h1>
        <p>
          A crypto exchange built from the ground up — matching engine,
          double-entry ledger, and an AI assistant that never guesses your balance.
        </p>
        <div className="cta-row">
          <Link to="/register"><button>Create account</button></Link>
          <Link to="/login"><button className="ghost">Log in</button></Link>
        </div>

        <div className="feature-grid">
          <div className="card">
            <div className="feature-icon">01 · ENGINE</div>
            <h3>Price-time priority matching</h3>
            <p>Every order matched fairly, oldest order at the best price wins first.</p>
          </div>
          <div className="card">
            <div className="feature-icon">02 · LEDGER</div>
            <h3>Double-entry accounting</h3>
            <p>Every trade posts a balanced debit and credit. Balances can't drift.</p>
          </div>
          <div className="card">
            <div className="feature-icon">03 · DROID</div>
            <h3>An assistant that checks first</h3>
            <p>Ask about your balance — it looks up the real number, never invents one.</p>
          </div>
        </div>
      </div>
    </div>
  );
}