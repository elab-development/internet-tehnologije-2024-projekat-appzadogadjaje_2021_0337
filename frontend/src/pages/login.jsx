import React, { useState, useEffect } from "react";
import EmailField from "../components/emailField";
import PasswordField from "../components/passwordField";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // NOVO STANJE: Kontroliše prikaz forme za zaboravljenu lozinku
  const [showForgotForm, setShowForgotForm] = useState(false); 
  const [forgotEmail, setForgotEmail] = useState(""); // Email za formu za zaboravljenu lozinku
  const [forgotMessage, setForgotMessage] = useState(""); // Poruka za formu za zaboravljenu lozinku

  const navigate = useNavigate();

  const handleLogin = async () => {
    // Resetuj poruke pre logovanja
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

  // NOVA FUNKCIJA: Rukuje slanjem forme za zaboravljenu lozinku
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("Slanje zahteva...");
    
    try {
      // PROMENITE URL OVDE: Dodajte stvarni endpoint za reset lozinke na vašem backendu
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

            {/* Logovanje forma */}
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
                
                {/* NOVI LINK ZA ZABORAVLJENU LOZINKU */}
                <p 
                  className="forgot-password-link" 
                  onClick={() => {
                    setShowForgotForm(true);
                    setMessage(""); // Sakrij poruku o logovanju
                  }}
                >
                  Zaboravio sam lozinku
                </p>
                {/* KRAJ LINKA */}

                {message && <p className="message">{message}</p>}
                
                <button onClick={handleLogin} className="dugme" style={{marginTop: '20px'}}>
                  ULOGUJ SE
                </button>
              </div>
            )}
            
            {/* NOVI BLOK: Forma za zaboravljenu lozinku */}
            {showForgotForm && (
              <form onSubmit={handleForgotPassword}>
                <div className="input-field" style={{display: 'block'}}>
                    <input
                      type="email"
                      placeholder="UNESITE EMAIL"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="input-box" // Koristimo postojeću klasu za stil
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
            {/* KRAJ NOVE FORME */}
            
          </div>
        </div>
      </section>
    </div>
  );
}