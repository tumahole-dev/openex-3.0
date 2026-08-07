import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "./api.js";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const { data } = await authApi.register(email, password);
            localStorage.setItem("openex_token", data.token);
            localStorage.setItem("openex_email", data.email);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error ?? "Registration failed");
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></div>
                <div><input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} /></div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
            <p>Already registered? <Link to="/login">Log in</Link></p>
        </div>
    );
}