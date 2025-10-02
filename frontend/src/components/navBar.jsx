import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); 
  };

  return (
    <div className="navBar">
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/dogadjaji">Događaji</a></li>

        {!token && (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/registracija">Registracija</a></li>
          </>
        )}

        {token && (
          <>
            <li><a href="/promenaLozinke">Promeni lozinku</a></li>
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
