import React, { useState, useEffect } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Dogadjaji() {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    
    // STANJA ZA FILTER I SORTIRANJE
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

    // 1. AŽURIRANA FUNKCIJA ZA DOHVAT
    const fetchEvents = async (page, filter = "", sort = "name_asc", category = "") => {
        let apiUrl;

        if (category) {
    // ✅ ISPRAVLJENO — ruta se poklapa sa Laravel backendom
    apiUrl = new URL(`http://localhost:8000/api/events/category/${category}`);
    } else {
    apiUrl = new URL("http://localhost:8000/api/events");
    }
        
        // UVEK ŠALJEMO SVE PARAMETRE
        apiUrl.searchParams.append("page", page); 
        apiUrl.searchParams.append("sort", sort);
        if (filter) {
            apiUrl.searchParams.append("filter", filter);
        }

        try {
            const res = await fetch(apiUrl.toString());
            const data = await res.json();
            
            // UVEK TRETIRAMO KAO PAGINIRANI OBJEKAT
            if (data.data) {
                setEvents(data.data);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
            } else if (category && Array.isArray(data) && data.length > 0) {
                // Fallback za nepaginirani niz (ako ga backend vrati greškom)
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

    // 2. KONSOLIDOVAN useEffect: Prati SVA stanja
    useEffect(() => {
        fetchEvents(currentPage, filterText, sortOption, selectedCategory);
    }, [currentPage, filterText, sortOption, selectedCategory]); 
    
    // Dohvat kategorija (Nepromenjen)
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

    // Pomoćna funkcija za resetovanje stranice i postavljanje stanja
    const resetPageAndSetState = (setter, value) => {
        setter(value);
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    // 3. Ažurirane funkcije za Filter, Sort i Kategoriju
    const handleFilterChange = (e) => {
        resetPageAndSetState(setFilterText, e.target.value);
    };

    const handleSortChange = (e) => {
        resetPageAndSetState(setSortOption, e.target.value);
    };

    const handleCategoryChange = (e) => {
        resetPageAndSetState(setSelectedCategory, e.target.value);
    };


    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };
    
    // 👇 Fiksiranje: Dodate definicije funkcija koje su se koristile u JSX-u, a nedostajale su ESLint-u
    
    const handleShowForm = () => setShowForm(true);

    // ⭐ Fiksirano: Funkcija 'handleCloseForm'
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEvent(null);
        setNewEvent({
            event: "", place: "", event_start: "", category: "", location: "", image: "",
        });
    };

    // ⭐ Fiksirano: Funkcija 'handleEdit'
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
                // Ažuriraj listu sa trenutnim parametrima, uključujući kategoriju
                fetchEvents(currentPage, filterText, sortOption, selectedCategory); 
                handleCloseForm();
            } else {
                alert("Greška: " + data.message);
            }
        } catch (err) {
            alert("Network error: " + err.message);
        }
    };

    // Uklanjamo nepotrebno lokalno filtriranje!
    const filteredEvents = events;


    return (
        <div>
            
            {/* KONTROLE ZA FILTER I SORTIRANJE */}
            <div className="controls-bar" style={{ marginBottom: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
                
                <div className="filter-input">
                    <label>Pretraga po nazivu:</label>
                    <input
                        type="text"
                        placeholder="Unesite naziv događaja..."
                        value={filterText}
                        onChange={handleFilterChange}
                        style={{ padding: "5px", marginLeft: "10px", width: "250px" }}
                    />
                </div>

                <div className="sort-select">
                    <label>Sortiraj po:</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        style={{ padding: "5px", marginLeft: "10px" }}
                    >
                        <option value="name_asc">Nazivu (A-Z)</option>
                        <option value="name_desc">Nazivu (Z-A)</option>
                    </select>
                </div>
            </div>
            
            {/* FILTER PO KATEGORIJI */}
            {user && (
                <div className="category-filter">
                    <label>
                        Filtriraj po kategoriji:{" "}
                        <div className="select-wrapper">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange} 
                            >
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

            {/* Dugme za dodavanje */}
            {user && user.role === "admin" && (
                <button
                    className="dodaj"
                    onClick={handleShowForm}
                >
                    {editingEvent ? "+" : "+"}
                </button>
            )}

            {/* Forma za dodavanje/izmenu */}
             {showForm && (
                <div className="form-backdrop" onClick={handleCloseForm}> 
                    <div className="modal active form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__body">
                            <div className="body__content">
                                <h3>{editingEvent ? "IZMENI DOGAĐAJ" : "KREIRAJ NOVI DOGAĐAJ"}</h3>
                                <form onSubmit={handleSubmit}>
                                    {/* Unosi... */}
                                    <div className="input-field"><label className="input-label">Naziv:</label><input type="text" placeholder="Naziv događaja" value={newEvent.event} onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })} required /></div>
                                    <div className="input-field"><label className="input-label">Mesto:</label><input type="text" placeholder="Mesto" value={newEvent.place} onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })} required /></div>
                                    <div className="input-field"><label className="input-label">Datum:</label><input type="datetime-local" placeholder="Datum i vreme" value={newEvent.event_start} onChange={(e) => setNewEvent({ ...newEvent, event_start: e.target.value })} required /></div>
                                    <div className="input-field"><label className="input-label">Kategorija:</label><input type="text" placeholder="Kategorija" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} required /></div>
                                    <div className="input-field"><label className="input-label">Lokacija:</label><input type="text" placeholder="Lokacija" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} required /></div>
                                    <div className="input-field"><label className="input-label">Slika URL:</label><input type="text" placeholder="URL slike" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} /></div>
                                    {/* Akcije... */}
                                    <div className="modal__actions" style={{position: 'relative', top: 'initial', padding: '10px 0'}}>
                                        <button type="submit" className="dugme" style={{fontSize: '1.2rem', padding: '10px 20px', marginLeft: '0'}}>Sačuvaj</button>
                                        <button type="button" onClick={handleCloseForm} className="dugme" style={{fontSize: '1.2rem', padding: '10px 20px', marginLeft: '10px', background: 'gray', borderColor: 'gray'}}>Otkazi</button>
                                    </div>
                                </form>
                            </div> 
                        </div>
                    </div> 
                </div> 
            )}

            {/* Prikaz događaja */}
            <div className="events-container">
                {filteredEvents.map((event) => (
                    <Dogadjaj
                        key={event.id}
                        event={event}
                        isAdmin={user?.role === "admin"}
                        onDelete={(id) => setEvents(events.filter((e) => e.id !== id))}
                        onEdit={handleEdit} // ⭐ Fiksirano: Koristi 'handleEdit'
                    />
                ))}
            </div>

            {/* PAGINACIJA: Prikazuje se uvek kada ima više stranica (lastPage > 1) */}
            {lastPage > 1 && ( 
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