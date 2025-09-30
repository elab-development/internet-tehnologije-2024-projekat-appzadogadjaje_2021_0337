import React, { useState, useEffect } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Dogadjaji() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Filter
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    event: "",
    place: "",
    event_start: "",
    category: "",
    location: "",
    image: "",
  });

  // Dohvati sve događaje sa backend-a (paginacija)
  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page) => {
    try {
      const res = await fetch(`http://localhost:8000/api/events?page=${page}`);
      const data = await res.json();
      setEvents(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err) {
      console.error("Greška prilikom dohvatanja događaja:", err);
    }
  };

  // Dohvati kategorije (samo ako je user ulogovan)
  useEffect(() => {
    if (!user) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Greška prilikom dohvatanja kategorija:", err);
      }
    };
    fetchCategories();
  }, [user]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const handleShowForm = () => setShowForm(true);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setNewEvent({
      event: "",
      place: "",
      event_start: "",
      category: "",
      location: "",
      image: "",
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setNewEvent({
      event: event.event,
      place: event.place,
      event_start: event.event_start,
      category: event.category,
      location: event.adress,
      image: event.image || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEvent
        ? `http://localhost:8000/api/events/${editingEvent.id}`
        : "http://localhost:8000/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editingEvent ? "Događaj ažuriran!" : "Događaj dodat!");
        fetchEvents(currentPage);
        handleCloseForm();
      } else {
        alert("Greška: " + data.message);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  // ⬇️ Filterirano po kategoriji (client-side)
  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events;

  return (
    <div>
      {/* Filter samo za ulogovane korisnike */}
      {user && (
        <div style={{ marginBottom: "20px" }}>
          <label>
            Filtriraj po kategoriji:{" "}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Sve kategorije</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Dugme za dodavanje događaja (samo admin) */}
      {user && user.role === "admin" && (
        <button
          style={{ marginBottom: "20px", background: "orange" }}
          onClick={handleShowForm}
        >
          {editingEvent ? "Izmeni Događaj" : "Dodaj Događaj"}
        </button>
      )}

      {/* Forma za dodavanje / edit */}
      {showForm && (
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid gray",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{editingEvent ? "Izmeni događaj" : "Kreiraj novi događaj"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Naziv događaja"
              value={newEvent.event}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Mesto"
              value={newEvent.place}
              onChange={(e) =>
                setNewEvent({ ...newEvent, place: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              placeholder="Datum i vreme"
              value={newEvent.event_start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event_start: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Kategorija"
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Lokacija"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="URL slike"
              value={newEvent.image}
              onChange={(e) =>
                setNewEvent({ ...newEvent, image: e.target.value })
              }
            />
            <div style={{ marginTop: "10px" }}>
              <button type="submit" style={{ marginRight: "10px" }}>
                Sačuvaj
              </button>
              <button type="button" onClick={handleCloseForm}>
                Otkaži
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista događaja */}
      <div className="events-container">
        {filteredEvents.map((event) => (
          <Dogadjaj
            key={event.id}
            event={event}
            isAdmin={user?.role === "admin"}
            onDelete={(id) => setEvents(events.filter((e) => e.id !== id))}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Pagination */}
      {!selectedCategory && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            {currentPage} / {lastPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
