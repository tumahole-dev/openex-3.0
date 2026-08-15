import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "./api.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const { data } = await authApi.login(email, password);
            localStorage.setItem("openex_token", data.token);
            localStorage.setItem("openex_email", data.email);
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.response?.data?.error ?? "Login failed");
        }
    }

    return (
        <div>
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <div><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></div>
                <div><input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Log in</button>
            </form>
            <p>No account? <Link to="/register">Register</Link></p>
        </div>
    );
}