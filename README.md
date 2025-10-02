<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<a id="readme-top"></a>

<h1 align="center">Gde sad</h1>
<p align="center">
  Veb aplikacija za upravljanje i prikaz događaja sa Laravel bekendom, React frontend-om i automatskim Node.js skrejpingom.
  <br>
</p>

<details>
  <summary><strong>Sadržaj</strong></summary>
  <ol>
    <li><a href="#about-the-project">O projektu</a></li>
    <li><a href="#built-with">Tehnologije</a></li>
    <li><a href="#getting-started">Početak rada</a></li>
    <li><a href="#usage">Korišćenje</a></li>
  </ol>
</details>

<h2 id="about-the-project">O projektu</h2>
<p>
  Gde sad je full-stack aplikacija za upravljanje događajima. Korisnici mogu pregledati, filtrirati i pretraživati događaje. Backend je napravljen u Laravel-u (REST API), frontend u React-u, a podaci se mogu automatski ažurirati pomoću Node.js skripte.
</p>
<ul>
  <li>Autentifikacija korisnika i uloge</li>
  <li>Filtriranje i pretraga događaja</li>
  <li>Automatsko skrejpovanje događaja</li>
  <li>RESTful API sa Laravel-om</li>
  <li>Responsivni frontend u React-u</li>
</ul>

<h2 id="built-with">Tehnologije</h2>
<ul>
  <li>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />

  </li>
  <li>
    <a href="https://laravel.com">
      <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  </li>
  <li>
    <a href="https://nodejs.org/">
      <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
   
  </li>
  <li>
    <a href="https://www.mysql.com/">
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />

  </li>
  <li>
  <a href="https://pptr.dev/">
    <img src="https://img.shields.io/badge/Puppeteer-000000?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer" />
</li>
</ul>



<h2 id="getting-started">Početak rada</h2>
<p>Prati sledeće korake da pokreneš projekat lokalno.</p>

<h3>Preuzeti</h3>
<ul>
  <li>Node.js & npm
    <pre><code>npm install npm@latest -g</code></pre>
  </li>
  <li>PHP & Composer
    <pre><code>composer install</code></pre>
  </li>
  <li>MySQL ili MariaDB</li>
</ul>

<h3>Instalacija</h3>
<ol>
  <li>Kloniraj repozitorijum
    <pre><code>git clone https://github.com/your_username/gde-sad.git</code></pre>
  </li>
  <li>Instaliraj backend zavisnosti
    <pre><code>cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed</code></pre>
  </li>
  <li>Instaliraj frontend zavisnosti
    <pre><code>cd ../frontend
npm install</code></pre>
  </li>
  <li>Pokreni frontend
    <pre><code>npm start</code></pre>
  </li>
  <li>Pokreni backend
    <pre><code>php artisan serve</code></pre>
  </li>
  <li>(Opcionalno) Pokreni skriptu za skrejping
    <pre><code>cd ../scraper
node scrape.js</code></pre>
  </li>
</ol>

<h2 id="usage">Korišćenje</h2>
<ul>
  <li>Pokreni XAMPP i startuj Apache i MySQL server.</li>
  <li>U Laravel backend folderu pokreni <code>php artisan serve</code> (podrazumevano <code>http://localhost:8000</code>).</li>
  <li>U React frontend folderu pokreni <code>npm start</code> (podrazumevano <code>http://localhost:3000</code>).</li>
  <li>Frontend komunicira sa backend API-jem na <code>http://localhost:8000</code>.</li>
  <li>Prijavi se koristeći seedovane korisnike.</li>
  <li>Istraži događaje: pregled, filtriranje, pretraga i detalji.</li>
  <li>Node.js skripta za skrejping automatski ažurira događaje iz eksternih izvora.</li>
</ul>

</body>
</html>
