import React from "react";

export default function EmailField({ value, onChange, error }) {
  return (
    <div className="input-field">
      <label className="input-label">Email</label>
      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder="Unesi email"
        className={`input-box ${error ? "input-error" : ""}`}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
