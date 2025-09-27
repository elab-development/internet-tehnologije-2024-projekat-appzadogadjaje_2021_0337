import React from "react";

export default function PasswordField({ value, onChange, error }) {
  return (
    <div className="input-field">
      <label className="input-label">Lozinka</label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder="Unesi lozinku"
        className={`input-box ${error ? "input-error" : ""}`}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
