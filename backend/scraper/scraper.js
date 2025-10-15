const puppeteer = require('puppeteer');
const { executablePath } = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: executablePath()
  });

  const allEvents = [];

  // ----- Belgrade Beat -----
  const beatPage = await browser.newPage();
  await beatPage.goto('https://belgrade-beat.rs/lat/desavanja/danas', { waitUntil: 'domcontentloaded' });
  await beatPage.waitForSelector('.colx.w-75', { timeout: 10000 });

  const today = new Date();
  const dan = today.getDate();
  const meseci = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
  const dani = ['Nedelja','Ponedeljak','Utorak','Sreda','Četvrtak','Petak','Subota'];
  const formattedDate = `${dan}. ${meseci[today.getMonth()]} - ${dani[today.getDay()]}`;

  const beatEvents = await beatPage.evaluate((formattedDate) => {
    const eventNodes = document.querySelectorAll('.colx.w-75');
    const scrapedEvents = [];

    eventNodes.forEach(ev => {
      const title = ev.querySelector('h2')?.innerText.trim() || '';
      const timeDiv = [...ev.querySelectorAll('div')].find(div => div.innerText.includes('Vreme:'));
      const time = timeDiv ? timeDiv.innerText.replace('Vreme:', '').trim() : '';

      const locationDiv = [...ev.querySelectorAll('div')].find(div => div.innerText.includes('Mesto:'));
      let location = '';
      if (locationDiv) {
        const firstLink = locationDiv.querySelector('a');
        location = firstLink ? firstLink.innerText.trim() : '';
      }

      const imageElement = ev.closest('.colx.w-75')?.previousElementSibling?.querySelector('img.imgx');
      let imagePath = null;
      if (imageElement) {
        imagePath = imageElement.getAttribute('src');
      }

      const tags = [...ev.querySelectorAll('.mt1 .dib')].map(tag => tag.innerText.trim());
      const eventStart = `${formattedDate} ${time}`.trim();

      scrapedEvents.push({
        event: title,
        place: location,
        category: tags,
        event_start: eventStart,
        location: location,
        image: imagePath ? "https://belgrade-beat.rs" + imagePath : null,
      });
    });

    return scrapedEvents;
  }, formattedDate);

  allEvents.push(...beatEvents);


  // ----- Teatar na Brdu -----
const teatarPage = await browser.newPage();
await teatarPage.goto('https://teatarnabrdu.rs/repertoar/', { waitUntil: 'domcontentloaded' });
await teatarPage.waitForSelector('.et_pb_column', { timeout: 10000 });

const teatarEvents = await teatarPage.evaluate(() => {
  const eventNodes = document.querySelectorAll('.et_pb_column');
  const scrapedEvents = [];

  eventNodes.forEach(col => {
    const date = col.querySelector('div.et_pb_text_inner h1')?.innerText.trim() || '';
    const time = col.querySelectorAll('div.et_pb_text_inner h1')[1]?.innerText.trim() || '';
    const title = col.querySelector('div.et_pb_text_inner h2 a')?.innerText.trim() || '';
    if (title) {
      scrapedEvents.push({
        event: title,
        place: 'Teatar na Brdu',
        lokacija: 'Turgenjeva 5, Beograd',
        category: ['Predstava'],
        event_start: `${date} ${time}`.trim(),
        location: 'Turgenjeva 5, Beograd',
        image: "https://teatarnabrdu.rs/wp-content/uploads/2021/09/Nenaslovljeni-dizajn-1-2.png",
      });
    }
  });

  return scrapedEvents;
});

  allEvents.push(...teatarEvents);

  // ----- MTS Dvorana -----
  const mtsPage = await browser.newPage();
  await mtsPage.goto('https://mtsdvorana.rs/dogadjaji/koncerti', { waitUntil: 'domcontentloaded' });
  await mtsPage.waitForSelector('.movie-item', { timeout: 10000 });

  const mtsEvents = await mtsPage.evaluate(() => {
    const eventNodes = document.querySelectorAll('.movie-item');
    const scrapedEvents = [];

    eventNodes.forEach(ev => {
      const title = ev.querySelector('h2.movie-item-title a')?.innerText.trim() || '';
      const date = ev.querySelector('span.date')?.innerText.trim() || '';
      const time = ev.querySelector('span.time')?.innerText.trim() || '';
      const image = ev.querySelector('img')?.getAttribute('src') || null;

      if (title) {
        scrapedEvents.push({
          event: title,
          place: 'MTS Dvorana',
          lokacija: 'Dečanska 14, Beograd',
          category: ['koncert'],
          event_start: `${date} ${time}`.trim(),
          location: 'Dečanska 14, Beograd',
          image: image,
        });
      }
    });

    return scrapedEvents;
  });

  allEvents.push(...mtsEvents);

  console.log(JSON.stringify(allEvents, null, 2));

  await browser.close();
})();
