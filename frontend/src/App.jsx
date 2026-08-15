import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Landing from "./Landing.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import Trading from "./Trading.jsx";

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`nav-link${active ? " active" : ""}`}>
      {children}
    </Link>
  );
}

function RequireAuth({ children }) {
  const isLoggedIn = !!localStorage.getItem("openex_token");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isLoggedIn = !!localStorage.getItem("openex_token");
  const email = localStorage.getItem("openex_email");

  function handleLogout() {
    localStorage.removeItem("openex_token");
    localStorage.removeItem("openex_email");
    window.location.href = "/login";
  }

  return (
    <div className="app-shell">
      <div className="navbar">
        <Link to="/" className="brand"><span className="dot" /> OpenEx</Link>
        {isLoggedIn && (
          <>
            <NavLink to="/dashboard">Wallet</NavLink>
            <NavLink to="/trading">Trading</NavLink>
          </>
        )}
        <div className="spacer" />
        {isLoggedIn && (
          <>
            <span className="user-email">{email}</span>
            <button className="ghost" onClick={handleLogout}>Log out</button>
          </>
        )}
      </div>

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/trading" element={<RequireAuth><Trading /></RequireAuth>} />
      </Routes>
    </div>
  );
}