import React, { useState } from "react";
import NameField from "../components/nameField";
import EmailField from "../components/emailField";
import PasswordField from "../components/passwordField";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setName("");
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
      <h1 className="auth-title">Registracija</h1>
      <NameField value={name} onChange={(e) => setName(e.target.value)} />
      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
      
      {message && <p style={{ color: "yellow", marginTop: "1rem" }}>{message}</p>}

      <button onClick={handleRegister} className="auth-button">
        Registruj se
      </button>
    </div>
  );
}
