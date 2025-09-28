
const apiKey = 'ba75bcf4cfa0843b186ae2becf35c41c';
let lang = 'en';

const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const langToggle = document.getElementById('lang-toggle');

function setPlaceholders() {
  if (lang === 'th') {
    cityInput.placeholder = 'ค้นหา';
    langToggle.textContent = 'EN';
  } else {
    cityInput.placeholder = 'Search';
    langToggle.textContent = 'ไทย';
  }
}

langToggle.addEventListener('click', () => {
  lang = lang === 'en' ? 'th' : 'en';
  setPlaceholders();
  weatherResult.innerHTML = '';
});

setPlaceholders();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  weatherResult.textContent = lang === 'th' ? 'กำลังค้นหา...' : 'Searching...';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${lang}`);
    if (!res.ok) throw new Error(lang === 'th' ? 'ไม่พบข้อมูลเมืองนี้' : 'City not found');
    const data = await res.json();
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const now = new Date();
    const dateStr = now.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    weatherResult.innerHTML = `
      <img src="${iconUrl}" alt="weather icon" class="weather-icon" />
      <h2>${data.name}, ${data.sys.country}</h2>
      <div style="color:#217dbb; font-size:1em; margin-bottom:6px;">${dateStr}</div>
      <div class="temp-center">${Math.round(data.main.temp)}<span class="temp-unit">°C</span></div>
      <div class="desc-center">${data.weather[0].description}</div>
      <div class="weather-details">
        <span><strong>${lang === 'th' ? 'ความชื้น' : 'Humidity'}:</strong> ${data.main.humidity}%</span>
        <span><strong>${lang === 'th' ? 'ลม' : 'Wind'}:</strong> ${data.wind.speed} m/s</span>
      </div>
    `;
  } catch (err) {
    weatherResult.textContent = err.message;
  }
});
