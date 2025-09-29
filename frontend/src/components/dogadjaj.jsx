import React from "react";

export default function Dogadjaj({ event }) {
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
    </div>
    </div>
  );
}
