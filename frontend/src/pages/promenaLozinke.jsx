import React, { useState,useEffect } from "react";
import PasswordField from "../components/passwordField"; 
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Morate biti ulogovani da promenite lozinku.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirm
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("")
      } else {
        const backendMessage = data.message || Object.values(data.errors || {}).flat().join(", ");
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
      <h2>Promena lozinke</h2>

      <PasswordField 
        label="Trenutna lozinka" 
        value={currentPassword} 
        onChange={(e) => setCurrentPassword(e.target.value)} 
      />

      <PasswordField 
        label="Nova lozinka" 
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} 
      />

      <PasswordField 
        label="Potvrdi novu lozinku" 
        value={newPasswordConfirm} 
        onChange={(e) => setNewPasswordConfirm(e.target.value)} 
      />

      {message && <p class="message">{message}</p>}

      <button onClick={handleChangePassword} className="dugme">
        Promeni lozinku
      </button>
          </div>
        </div>
      </section>
    </div>
  );
}
