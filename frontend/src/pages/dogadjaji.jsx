import React, { useState, useEffect } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Dogadjaji() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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


  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events;


  return (
    <div>
       {user && (
         <div className="category-filter"> 
          <label>
             Filtriraj po kategoriji:{" "}

            <div className="select-wrapper"> 
                 <select
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)} >
                 <option value="">Sve kategorije</option>
                {categories.map((cat) => (
                 <option key={cat.id} value={cat.name}>
                 {cat.name}
              </option>
              ))}
             </select>
            </div> 
           </label>
         </div>
      )}

      {user && user.role === "admin" && (
        <button
          class="dodaj"
          onClick={handleShowForm}
        >
          {editingEvent ? "Izmeni Događaj" : "+"}
        </button>
      )}

       {showForm && (
         <div className="form-backdrop" onClick={handleCloseForm}> 
            <div 
                className="modal active form-modal" 
                data-action="open"
                onClick={(e) => e.stopPropagation()}>
                <div className="modal__body">
                    <div className="body__backdrop"></div>
                    <div className="body__content">
                        <h3>{editingEvent ? "IZMENI DOGAĐAJ" : "KREIRAJ NOVI DOGAĐAJ"}</h3>
                        <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label className="input-label">Naziv:</label>
                            <input
                            type="text"
                            placeholder="Naziv događaja"
                            value={newEvent.event}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, event: e.target.value })
                            }
                            required
                            />
                        </div>

                        <div className="input-field">
                            <label className="input-label">Mesto:</label>
                            <input
                            type="text"
                            placeholder="Mesto"
                            value={newEvent.place}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, place: e.target.value })
                            }
                            required
                            />
                        </div>
                        
                        <div className="input-field">
                            <label className="input-label">Datum:</label>
                            <input
                            type="datetime-local"
                            placeholder="Datum i vreme"
                            value={newEvent.event_start}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, event_start: e.target.value })
                            }
                            required
                            />
                        </div>
                        
                        <div className="input-field">
                            <label className="input-label">Kategorija:</label>
                            <input
                            type="text"
                            placeholder="Kategorija"
                            value={newEvent.category}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, category: e.target.value })
                            }
                            required
                            />
                        </div>
                        
                        <div className="input-field">
                            <label className="input-label">Lokacija:</label>
                            <input
                            type="text"
                            placeholder="Lokacija"
                            value={newEvent.location}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, location: e.target.value })
                            }
                            required
                            />
                        </div>
                        
                        <div className="input-field">
                            <label className="input-label">Slika URL:</label>
                            <input
                            type="text"
                            placeholder="URL slike"
                            value={newEvent.image}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, image: e.target.value })
                            }
                            />
                        </div>

                        <div className="modal__actions" style={{position: 'relative', top: 'initial', padding: '10px 0'}}>
                            <button type="submit" className="dugme" style={{fontSize: '1.2rem', padding: '10px 20px', marginLeft: '0'}}>
                                Sačuvaj
                            </button>
                            <button 
                                type="button" 
                                onClick={handleCloseForm} 
                                className="dugme" 
                                style={{
                                    fontSize: '1.2rem', 
                                    padding: '10px 20px', 
                                    marginLeft: '10px', 
                                    background: 'gray', 
                                    borderColor: 'gray'
                                }}
                            >
                                Otkaži
                            </button>
                        </div>
                        
                        </form>
                    </div> 
                </div>
            </div> 
          </div> 
)}

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
