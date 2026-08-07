import { Routes, Route, Link } from "react-router-dom";

function Dashboard() {
  return <h2>Wallet Dashboard (placeholder)</h2>;
}

function Trading() {
  return <h2>Trading Terminal (placeholder)</h2>;
}

function Login() {
  return <h2>Login (placeholder)</h2>;
}

export default function App() {
  return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <nav style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <strong>⚔️ OpenEx</strong>
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/trading">Trading</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trading" element={<Trading />} />
        </Routes>
      </div>
  );
}