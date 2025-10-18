import React, { useState, useEffect } from "react";
import EmailField from "../components/emailField";
import PasswordField from "../components/passwordField";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForgotForm, setShowForgotForm] = useState(false); 
  const [forgotEmail, setForgotEmail] = useState(""); 
  const [forgotMessage, setForgotMessage] = useState(""); 

  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setForgotMessage(""); 

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("Slanje zahteva...");
    
    try {
      const res = await fetch("http://localhost:8000/api/forgot-password", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setForgotMessage("Link za reset lozinke je poslat na vaš email.");
      } else {
        const backendMessage = data.message || "Greška pri slanju zahteva.";
        setForgotMessage(backendMessage);
      }
    } catch (err) {
      setForgotMessage("Network error: Nije moguće povezati se sa serverom.");
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
              <span>{showForgotForm ? "ZABORAVLJENA LOZINKA" : "LOGIN"}</span>
            </h2>

            {!showForgotForm && (
              <div>
                <EmailField 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <PasswordField 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                
                <p 
                  className="forgot-password-link" 
                  onClick={() => {
                    setShowForgotForm(true);
                    setMessage("");
                  }}
                >
                  Zaboravio sam lozinku
                </p>

                {message && <p className="message">{message}</p>}
                
                <button onClick={handleLogin} className="dugme" style={{marginTop: '20px'}}>
                  ULOGUJ SE
                </button>
              </div>
            )}
            
            {showForgotForm && (
              <form onSubmit={handleForgotPassword}>
                <div className="input-field" style={{display: 'block'}}>
                    <input
                      type="email"
                      placeholder="UNESITE EMAIL"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="input-box" 
                      required
                    />
                </div>
                
                {forgotMessage && <p className="message" style={{marginBottom: '10px'}}>{forgotMessage}</p>}

                <button type="submit" className="dugme">
                  POŠALJI LINK
                </button>
                
                <button 
                    type="button" 
                    onClick={() => {
                        setShowForgotForm(false);
                        setForgotMessage("");
                    }} 
                    className="dugme" 
                    style={{
                        marginLeft: '10px',
                        background: 'gray', 
                        borderColor: 'gray'
                    }}
                >
                    NAZAD
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}