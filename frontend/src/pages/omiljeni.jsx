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
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== eventId));
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
    return <p className="poruka">Morate biti prijavljeni da biste videli omiljene događaje.</p>;
  }

  if (loading) {
    return <p className="poruka">Učitavanje omiljenih događaja...</p>;
  }

  if (favorites.length === 0) {
    return <p className="poruka">Nemate sačuvanih događaja.</p>;
  }

  return (
    <div>
      <h2 class="poruka">Vaši omiljeni događaji</h2>
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
