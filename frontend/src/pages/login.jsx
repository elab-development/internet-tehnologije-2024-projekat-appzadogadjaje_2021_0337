import React, { useState } from "react";
import EmailField from "../components/emailField";
import PasswordField from "../components/passwordField";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage(data.message);
        setEmail("");
        setPassword("");
        navigate("/dogadjaji");
      } else {
        const backendMessage = data.message || Object.values(data).flat().join(", ");
        setMessage(backendMessage);
    }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField   value={password} onChange={(e) => setPassword(e.target.value)} />

      {message && <p style={{ color: "yellow", marginTop: "1rem" }}>{message}</p>}

      <button onClick={handleLogin} className="auth-button">Uloguj se</button>
    </div>
  );
}
