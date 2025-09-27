import React from "react";

export default function NameField({ value, onChange, error }) {
  return (
    <div className="input-field">
      <label className="input-label">Ime</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Unesi ime"
        className={`input-box ${error ? "input-error" : ""}`}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
