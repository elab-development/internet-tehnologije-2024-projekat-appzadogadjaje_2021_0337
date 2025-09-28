import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // može biti "user" ili "admin"
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // sprečava default href ponašanje
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // redirect na login stranicu
  };

  return (
    <div className="navBar">
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/dogadjaji">Događaji</a></li>

        {/* Ako korisnik nije ulogovan */}
        {!token && (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/registracija">Registracija</a></li>
          </>
        )}

        {/* Ako je korisnik ulogovan */}
        {token && (
          <>
            <li><a href="/promenaLozinke">Promeni lozinku</a></li>
            {role === "admin" && <li><a href="/admin">Admin panel</a></li>}
            <li>
              <a href="#" onClick={handleLogout}>Logout</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
