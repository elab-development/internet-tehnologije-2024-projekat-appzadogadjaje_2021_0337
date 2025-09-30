import React, { useState,useEffect } from "react";
import EmailField from "../components/emailField";
import PasswordField from "../components/passwordField";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        localStorage.setItem("user", JSON.stringify(data.user));
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 30);
    return () => clearTimeout(timer); 
  }, []); 

  return (
      <div className={`modal ${isModalOpen ? 'active' : ''}`} id="login-form-modal">
        <section className="modal__body">
          <div className="body__backdrop"></div>
          <div className="body__content">
            <div className="modal__glitch" aria-hidden="true">
              <h2>
                <span>LOGIN</span>
              </h2>
              
              <div>
                <EmailField 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                 />
                <PasswordField 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />

                {message && <p class="message">{message}</p>}
                </div>
                <button onClick={handleLogin} class="dugme">
                  ULOGOJ SE
                </button>
               
              
            </div>
          </div>
        </section>
      </div>
  );
}
