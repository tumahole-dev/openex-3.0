import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import Trading from "./Trading.jsx";


export default function App() {
    const isLoggedIn = !!localStorage.getItem("openex_token");

    function handleLogout() {
  localStorage.removeItem("openex_token");
  localStorage.removeItem("openex_email");
  window.location.href = "/login";
}

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
            <nav style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <strong>⚔️ OpenEx</strong>
                {!isLoggedIn && <Link to="/login">Login</Link>}
                {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                {isLoggedIn && <Link to="/trading">Trading</Link>}
                {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
            </nav>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
            </Routes>
        </div>
    );
}