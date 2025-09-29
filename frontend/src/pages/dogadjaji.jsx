import React, { useState, useEffect } from "react";
import Dogadjaj from "../components/dogadjaj";

export default function Dogadjaji() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="events-container">
        {events.map((event) => (
          <Dogadjaj key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>

        <span>{currentPage} / {lastPage}</span>

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
          Next
        </button>
      </div>
    </div>
  );
}
