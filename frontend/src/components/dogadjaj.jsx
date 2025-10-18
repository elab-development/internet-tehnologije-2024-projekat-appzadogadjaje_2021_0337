import React, { useState, useEffect } from "react";

export default function Dogadjaj({
  event,
  isAdmin,
  onDelete,
  onEdit,
  user,
  handleFavorite,
  initialIsFavorite = false,
  isFavoritePage,
  handleRemoveFavorite
}) {
  const [liked, setLiked] = useState(initialIsFavorite);


  useEffect(() => {
    setLiked(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Morate biti prijavljeni da biste sačuvali događaj!");
      return;
    }

  if (handleFavorite) {
    handleFavorite(event.id); 
  }
  setLiked(true); 
};


  const handleDelete = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj događaj?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Događaj obrisan!");
        onDelete(event.id);
      } else {
        alert("Greška: " + data.message);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!window.confirm("Da li želite da uklonite događaj iz omiljenih?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/favorites/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Događaj uklonjen iz omiljenih!");
        if (handleRemoveFavorite) handleRemoveFavorite(event.id);
        setLiked(false);
      } else {
        const data = await res.json();
        alert("Greška: " + (data.message || "Neuspešno uklanjanje iz omiljenih"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  return (
    <div className="events-container">
      <div className="event-card">
        <h3 className="text-lg font-bold mb-2">{event.event}</h3>
        <p><strong>Mesto:</strong> {event.place}</p>
        <p><strong>Datum:</strong> {event.event_start}</p>
        <p><strong>Adresa:</strong> {event.adress}</p>
        <p><strong>Kategorija:</strong> {event.category}</p>
        {event.image && (
          <img
            src={event.image}
            alt={event.event}
            className="mt-2 w-full h-48 object-cover rounded"
          />
        )}

        {user && user.role !== "admin" && !isFavoritePage && (
          <span 
            className={`heart-icon ${liked ? "liked" : ""}`}
            onClick={handleToggleFavorite}
             style={{ cursor: "pointer", fontSize: "2.5rem", marginTop: "1rem",marginLeft:"0.5rem", display: "inline-block" }}
          >
            {liked ? "❤️" : "🤍"}
          </span>
        )}

        {isFavoritePage && user && handleRemoveFavorite && (
          <button class="button" onClick={handleRemoveFromFavorites}>
  <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
</button>
        )}

        {isAdmin && (
          <div className="dugmici">
            <button className="dugmence dugmence--delete"
              onClick={handleDelete}>
              Obriši
            </button>
            <button className="dugmence dugmence--edit"
              onClick={() => onEdit(event)}>
              Izmeni
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
