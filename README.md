<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gde sad - README</title>
</head>
<body>

<a id="readme-top"></a>

<h1 align="center">Gde sad</h1>
<p align="center">
  Web application for managing and displaying events with Laravel backend, React frontend, and automated Node.js scraping.
  <br>
  <a href="https://github.com/your_username/gde-sad"><strong>Explore the repo »</strong></a>
  <br><br>
  <a href="https://github.com/your_username/gde-sad">View Demo</a> &middot;
  <a href="https://github.com/your_username/gde-sad/issues/new?labels=bug">Report Bug</a> &middot;
  <a href="https://github.com/your_username/gde-sad/issues/new?labels=enhancement">Request Feature</a>
</p>

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<h2 id="about-the-project">About The Project</h2>
<p>
  Gde sad is a full-stack event management application. Users can view, filter, and search events. The backend is built with Laravel (REST API), frontend with React, and data can be scraped automatically using a Node.js script.
</p>
<ul>
  <li>User authentication and roles</li>
  <li>Event filtering and search</li>
  <li>Automated scraping of events</li>
  <li>RESTful API with Laravel</li>
  <li>Responsive frontend in React</li>
</ul>

<h2 id="built-with">Built With</h2>
<ul>
  <li><a href="https://reactjs.org/">React.js</a> – Frontend</li>
  <li><a href="https://laravel.com">Laravel</a> – Backend API</li>
  <li><a href="https://nodejs.org/">Node.js</a> – Scraping script</li>
  <li><a href="https://getbootstrap.com">Bootstrap</a> – Styling</li>
  <li><a href="https://www.mysql.com/">MySQL</a> – Database</li>
</ul>

<h2 id="getting-started">Getting Started</h2>
<p>Follow these steps to set up the project locally.</p>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js & npm
    <pre><code>npm install npm@latest -g</code></pre>
  </li>
  <li>PHP & Composer
    <pre><code>composer install</code></pre>
  </li>
  <li>MySQL or MariaDB</li>
</ul>

<h3>Installation</h3>
<ol>
  <li>Clone the repo
    <pre><code>git clone https://github.com/your_username/gde-sad.git</code></pre>
  </li>
  <li>Install backend dependencies
    <pre><code>cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed</code></pre>
  </li>
  <li>Install frontend dependencies
    <pre><code>cd ../frontend
npm install</code></pre>
  </li>
  <li>Start frontend
    <pre><code>npm start</code></pre>
  </li>
  <li>Start backend
    <pre><code>php artisan serve</code></pre>
  </li>
  <li>(Optional) Run scraping script
    <pre><code>cd ../scraper
node scrape.js</code></pre>
  </li>
</ol>

<h2 id="usage">Usage</h2>
<ul>
  <li>Visit the frontend at <code>http://localhost:3000</code></li>
  <li>Log in with seeded users</li>
  <li>Explore events, filter, search, and view details</li>
  <li>Scraping script updates events automatically from external sources</li>
</ul>

<h2 id="roadmap">Roadmap</h2>
<ul>
  <li>Backend REST API ✔</li>
  <li>Frontend React App ✔</li>
  <li>Node.js scraping ✔</li>
  <li>Pagination & advanced filtering</li>
  <li>File uploads for events</li>
  <li>User roles & access control</li>
  <li>Data export and search improvements</li>
</ul>

<h2 id="contributing">Contributing</h2>
<p>Contributions are welcome!</p>
<ol>
  <li>Fork the Project</li>
  <li>Create your Feature Branch <code>git checkout -b feature/AmazingFeature</code></li>
  <li>Commit your Changes <code>git commit -m 'Add some AmazingFeature'</code></li>
  <li>Push to the Branch <code>git push origin feature/AmazingFeature</code></li>
  <li>Open a Pull Request</li>
</ol>

<h2 id="license">License</h2>
<p>Distributed under the Unlicense License. See <code>LICENSE.txt</code> for more information.</p>

<h2 id="contact">Contact</h2>
<p>Tijana Topalović – <a href="https://linkedin.com/in/your_linkedin">LinkedIn</a> – your_email@example.com</p>
<p>Project Link: <a href="https://github.com/your_username/gde-sad">https://github.com/your_username/gde-sad</a></p>

<h2 id="acknowledgments">Acknowledgments</h2>
<ul>
  <li><a href="https://choosealicense.com">Choose an Open Source License</a></li>
  <li><a href="https://shields.io">Img Shields</a></li>
  <li><a href="https://react-icons.github.io/react-icons/search">React Icons</a></li>
</ul>

</body>
</html>



