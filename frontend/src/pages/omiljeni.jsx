import React, { useEffect, useState } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Omiljeni() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/favorites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else {
          console.error("Greška prilikom dohvatanja omiljenih događaja");
        }
      } catch (err) {
        console.error("Greška:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);
const handleRemoveFavorite = async (eventId) => {
    
    try {
      const res = await fetch(`http://localhost:8000/api/favorites/${eventId}`, {
        method: "DELETE", // Koristimo DELETE metodu
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Ažuriranje frontenda: Filtriraj događaje i ukloni onaj sa datim ID-jem
        setFavorites(favorites.filter((fav) => fav.id !== eventId));
        
        // Opcionalno, ponovo dohvati podatke ako želite da budete 100% sigurni
        // fetchFavorites();
      } else {
        const errorData = await res.json();
        alert(`Greška pri uklanjanju: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Greška:", err);
      alert("Mrežna greška prilikom uklanjanja događaja.");
    }
  };
  if (!user) {
    return <p style={{ color: "white" }}>Morate biti prijavljeni da biste videli omiljene događaje.</p>;
  }

  if (loading) {
    return <p style={{ color: "white" }}>Učitavanje omiljenih događaja...</p>;
  }

  if (favorites.length === 0) {
    return <p style={{ color: "white" }}>Nemate sačuvanih događaja još uvek.</p>;
  }

  return (
    <div>
      <h2 style={{ color: "yellow", marginBottom: "20px" }}>💖 Vaši omiljeni događaji</h2>
      <div className="events-container">
        {favorites.map((fav) => (
          <Dogadjaj
            key={fav.id}
            event={fav} 
            isAdmin={false}
            user={user}
            handleFavorite={null} 
            isFavoritePage={true}
            handleRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
}
