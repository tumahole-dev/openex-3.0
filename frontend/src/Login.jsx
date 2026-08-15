import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "./api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem("openex_token", data.token);
      localStorage.setItem("openex_email", data.email);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="eyebrow">⚔️ OpenEx</div>
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to see your wallet and place orders.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        </form>
        <p className="switch-link">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}