import React from "react";

export default function Dogadjaj({ event, isAdmin, onDelete, onEdit, user, handleFavorite,isFavoritePage, handleRemoveFavorite }) {

  const handleDelete = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj događaj?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/events/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

        {/* Dugme za favorite samo za ulogovane korisnike koji nisu admini */}
        {user && user.role !== "admin" && handleFavorite && (
          <button 
            className="dugmence dugmence--favorite" 
            onClick={() => handleFavorite(event.id)}
          >
            💖 Sačuvaj
          </button>
        )}

        {/* Dugmad za admina */}
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
