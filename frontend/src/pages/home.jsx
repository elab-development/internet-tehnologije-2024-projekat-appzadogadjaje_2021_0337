import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

  return (
    <div class="cyberpunk-frame">
        <h1 class="glitch">
  <span aria-hidden="true">GDE SAD</span>
  GDE SAD
  <span aria-hidden="true">GDE SAD</span>
</h1>
    <h1 class="naslov">Sve što se dešava – dešava se ovde.</h1>
    <button data-text="KRENI U POTRAGU" class="submit-btn" onClick={() => navigate("/dogadjaji")}>
  <span class="btn-text">KRENI U POTRAGU</span>
</button>

    </div>
  );
}

export default Home;
