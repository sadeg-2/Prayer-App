import { getCountries, getCities, getPrayerTimes, showError } from './utility.js';


const continentSelect = document.getElementById('continent-select');
const countrySelect = document.getElementById('country-select');
const citySelect = document.getElementById('city-select');
const methodSelect = document.getElementById('method-select');
const prayerTableBody = document.querySelector('#prayer-table tbody');
const resetBtn = document.getElementById('reset-btn');

// fallback 
const fallbackCities = {
  "Palestine": ["Gaza", "Ramallah", "Nablus", "Hebron", "Jenin"]
};

// localStorage 
window.addEventListener('DOMContentLoaded', async () => {
  const lastContinent = localStorage.getItem('continent');
  const lastCountry = localStorage.getItem('country');
  const lastCity = localStorage.getItem('city');
  const lastMethod = localStorage.getItem('method');

  if (lastContinent) {
    continentSelect.value = lastContinent;
    await loadCountries(lastContinent);
  }
  if (lastCountry) {
    countrySelect.value = lastCountry;
    await loadCities(lastCountry);
  }
  if (lastCity) citySelect.value = lastCity;
  if (lastMethod) methodSelect.value = lastMethod;

  if (lastCountry && lastCity) loadPrayerTimes();
});

//Loading 
async function loadCountries(continent) {
  countrySelect.innerHTML = '<option>Loading countries...</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';
  prayerTableBody.innerHTML = '';

  try {
    const countries = await getCountries(continent);
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    countries.forEach(c => {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      countrySelect.appendChild(option);
    });
  } catch (err) {
    showError(err.message);
  }
}

async function loadCities(country) {
  citySelect.innerHTML = '<option>Loading cities...</option>';
  prayerTableBody.innerHTML = '';

  try {
    let cities = await getCities(country);
    if (!cities || cities.length === 0) {
      if (fallbackCities[country]) cities = fallbackCities[country];
      else { showError("No cities available"); return; }
    }
    citySelect.innerHTML = '<option value="">Select City</option>';
    cities.forEach(c => {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      citySelect.appendChild(option);
    });
  } catch (err) {
    if (fallbackCities[country]) {
      citySelect.innerHTML = '<option value="">Select City</option>';
      fallbackCities[country].forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        citySelect.appendChild(option);
      });
    } else {
      showError(err.message);
    }
  }
}

async function loadPrayerTimes() {
  const country = countrySelect.value;
  const city = citySelect.value;
  const method = methodSelect.value;

  if (!country || !city) return;

  prayerTableBody.innerHTML = '<tr><td colspan="2">Loading prayer times...</td></tr>';

  try {
    const prayers = await getPrayerTimes(country, city, method);
    prayerTableBody.innerHTML = '';
    for (const [name, time] of Object.entries(prayers)) {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${name}</td><td>${time}</td>`;
      prayerTableBody.appendChild(row);
    }
  } catch (err) {
    showError(err.message);
  }
}

//  أاختيار القارة والدولة والمدينة 
continentSelect.addEventListener('change', async () => {
  localStorage.setItem('continent', continentSelect.value);
  await loadCountries(continentSelect.value);
  localStorage.removeItem('country');
  localStorage.removeItem('city');
});

countrySelect.addEventListener('change', async () => {
  localStorage.setItem('country', countrySelect.value);
  await loadCities(countrySelect.value);
  localStorage.removeItem('city');
});

citySelect.addEventListener('change', () => {
  localStorage.setItem('city', citySelect.value);
  loadPrayerTimes();
});

methodSelect.addEventListener('change', () => {
  localStorage.setItem('method', methodSelect.value);
  loadPrayerTimes();
});

// زر Reset
resetBtn.addEventListener('click', () => {
  continentSelect.value = '';
  countrySelect.innerHTML = '<option value="">Select Country</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';
  methodSelect.value = '2';
  prayerTableBody.innerHTML = '';

  localStorage.removeItem('continent');
  localStorage.removeItem('country');
  localStorage.removeItem('city');
  localStorage.removeItem('method');
});
