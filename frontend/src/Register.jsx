import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "./api.js";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.register(email, password, fullName || undefined);
      localStorage.setItem("openex_token", data.token);
      localStorage.setItem("openex_email", data.email);
      localStorage.setItem("openex_name", data.fullName ?? "");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error ?? "Registration failed");
      setLoading(false);
    }
  }

  return (
      <div className="auth-wrap">
        <div className="card auth-card">
          <div className="eyebrow">⚔️ OpenEx</div>
          <h2>Create your account</h2>
          <p className="subtitle">Simulated funds only — nothing here is real money.</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Full name (optional)</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Jane Doe" />
            </div>
            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" required minLength={8} />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
          </form>
          <p className="switch-link">Already registered? <Link to="/login">Log in</Link></p>
        </div>
      </div>
  );
}