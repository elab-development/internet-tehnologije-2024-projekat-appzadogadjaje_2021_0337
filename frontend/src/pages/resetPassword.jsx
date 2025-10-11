// src/pages/ResetPassword.js

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Stanja za formu
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  // 2. Izvlačenje tokena iz URL-a (token=XYZ...)
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setMessage("Greška: Token za resetovanje nije pronađen u URL-u.");
    }
    setToken(urlToken);
  }, [searchParams]);

  // 3. Rukovanje slanjem nove lozinke
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Resetovanje lozinke u toku...");

    if (!token) {
      setMessage("Greška: Token nedostaje.");
      return;
    }
    if (password !== passwordConfirmation) {
      setMessage("Greška: Lozinke se ne podudaraju.");
      return;
    }

    try {
      // PROMENITE URL OVDE: Koristite vaš stvarni backend endpoint za resetovanje lozinke!
      const res = await fetch(`http://localhost:8000/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          email: searchParams.get("email"),
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Lozinka uspešno resetovana. Možete se ulogovati.");
        // Opcionalno: Preusmeri na login nakon kratkog odlaganja
        setTimeout(() => navigate("/login"), 3000); 
      } else {
        // Prikazuje greške iz backenda (npr. token istekao, lozinka prekratka)
        const backendMessage = data.message || "Greška pri resetovanju lozinke.";
        setMessage(backendMessage);
      }
    } catch (err) {
      setMessage("Mrežna greška: Nije moguće povezati se sa serverom.");
    }
  };

  // 4. Prikaz (Koristimo isti modal stil kao za Login!)
  return (
    <div className={`modal active`} id="reset-password-modal">
      <section className="modal__body">
        <div className="body__backdrop"></div>
        <div className="body__content">
          <div className="modal__glitch" aria-hidden="true">
            <h2>
              <span>RESET LOZINKE</span>
            </h2>

            {token ? (
              <form onSubmit={handleSubmit}>
                <p className="message" style={{ color: 'white' }}>
                    Unesite novu lozinku 
                </p>
                <div className="input-field">
                  <input
                    type="password"
                    placeholder="Nova lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-box" 
                    required
                  />
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    placeholder="Potvrdi lozinku"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="input-box"
                    required
                  />
                </div>
                
                {message && <p className="message" style={{marginTop: '20px'}}>{message}</p>}

                <button type="submit" className="dugme" style={{marginTop: '20px'}}>
                  POTVRDI LOZINKU
                </button>
              </form>
            ) : (
              // Prikazuje poruku dok čekamo token ili ako token nije pronađen
              <p className="message">{message || "Proveravam token..."}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}