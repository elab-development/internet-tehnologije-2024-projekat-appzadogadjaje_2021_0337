import React, { useState, useEffect } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Dogadjaji() {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [filterText, setFilterText] = useState("");
    const [sortOption, setSortOption] = useState("name_asc");

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


    const fetchEvents = async (page, filter = "", sort = "name_asc", category = "") => {
        let apiUrl;

        if (category) {
            apiUrl = new URL(`http://localhost:8000/api/events/category/${category}`);
        } else {
            apiUrl = new URL("http://localhost:8000/api/events");
        }

        apiUrl.searchParams.append("page", page);
        apiUrl.searchParams.append("sort", sort);
        if (filter) apiUrl.searchParams.append("filter", filter);

        try {
            const res = await fetch(apiUrl.toString(), {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await res.json();

            if (data.data) {
                setEvents(data.data);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
            } else if (category && Array.isArray(data) && data.length > 0) {
                setEvents(data);
                setCurrentPage(1);
                setLastPage(1);
            } else {
                setEvents([]);
                setCurrentPage(1);
                setLastPage(1);
            }
        } catch (err) {
            console.error("Greška prilikom dohvatanja događaja:", err);
            setEvents([]);
            setCurrentPage(1);
            setLastPage(1);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage, filterText, sortOption, selectedCategory);
    }, [currentPage, filterText, sortOption, selectedCategory]);

    
    useEffect(() => {
        if (!token) return; 
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/categories", {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                });
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Greška prilikom dohvatanja kategorija:", err);
            }
        };
        fetchCategories();
    }, [token]); 

    const resetPageAndSetState = (setter, value) => {
        setter(value);
        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleFilterChange = (e) => resetPageAndSetState(setFilterText, e.target.value);
    const handleSortChange = (e) => resetPageAndSetState(setSortOption, e.target.value);
    const handleCategoryChange = (e) => resetPageAndSetState(setSelectedCategory, e.target.value);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) setCurrentPage(page);
    };

    const handleShowForm = () => setShowForm(true);

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEvent(null);
        setNewEvent({
            event: "", place: "", event_start: "", category: "", location: "", image: "",
        });
    };

    const handleFavorite = async (eventId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Morate biti prijavljeni da biste sačuvali događaj!");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/favorites/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      alert("Događaj sačuvan u favorite!");
    } else {
      let errorMsg = `Greška (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } catch (parseErr) {
      }
      alert(errorMsg);
    }
  } catch (err) {
    console.error("Greška:", err);
    alert("Mrežna greška prilikom čuvanja događaja.");
  }
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
        const dataToSend = editingEvent ? { ...newEvent, adress: newEvent.location } : newEvent;
        try {
            const url = editingEvent
                ? `http://localhost:8000/api/events/${editingEvent.id}`
                : "http://localhost:8000/api/events";
            const method = editingEvent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if (res.ok) {
                alert(editingEvent ? "Događaj ažuriran!" : "Događaj dodat!");
                fetchEvents(currentPage, filterText, sortOption, selectedCategory);
                handleCloseForm();
            } else {
                alert("Greška: " + data.message);
            }
        } catch (err) {
            alert("Network error: " + err.message);
        }
    };
    
    const handleScrape = async () => {
         alert("Pokretanje skrejpera... Molimo sačekajte.");
        
        try {
            const res = await fetch(`http://localhost:8000/api/scrape`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message || "Skrejper uspešno završen!");
                fetchEvents(1, filterText, sortOption, selectedCategory); 
            } else {
                const errorData = await res.json();
                alert(`Greška (${res.status}): ${errorData.message || "Neuspešno pokretanje skrejpera."}`);
            }
        } catch (err) {
            alert("Mrežna greška prilikom poziva skrejpera.");
        }
    };

    const filteredEvents = events;

    return (
        <div>
            <div 
                className="controls-bar" 
            >
                <div className="search-group">
                    <label>Pretraga po nazivu:</label>
                    <input
                        type="text"
                        placeholder="Unesite naziv događaja..."
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-sort">
                    <label>Sortiraj po:</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="name_asc">Nazivu (A-Z)</option>
                        <option value="name_desc">Nazivu (Z-A)</option>
                    </select>
                </div>
                
                {user && (
                    <div className="filter-sort">
                        <label>
                            Filtriraj po kategoriji:
                            </label>
                            <div>
                                <select value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value="">Sve kategorije</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                       </div>
                )}
                
                
            </div>

            {user && user.role === "admin" && (
                    <div>
                        <button
                            className="skrejp" 
                            onClick={handleScrape} 
                        >
                            POKRENI SKREJPER
                        </button>
                    </div>
                )}
            
            {user && user.role === "admin" && (
                <button 
                    className="dodaj" 
                    onClick={handleShowForm}
                    style={{ marginBottom: "20px" }} 
                >
                    +
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
                                className="dugme--cancel dugme" 
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
                         user={user}    
                         handleFavorite={handleFavorite}
                        onDelete={(id) => setEvents(events.filter((e) => e.id !== id))}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {lastPage > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                    <span>{currentPage} / {lastPage}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>Next</button>
                </div>
            )}
        </div>
    );
}