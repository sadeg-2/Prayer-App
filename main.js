import { Timer } from "./modules/timer.js";
import utils from "./utility.js";

const countrySelection = document.getElementById("county");
const citySelection = document.getElementById("city");
const liveCountLabel = document.getElementById("liveCount");

function resetSelectLabel(selection, message) {
  selection.innerHTML = `
    <option value="" id="cityDefaultValue" disabled selected>${message}</option>
  `;
}
async function renderSelection({
  selectedValue,
  selectionLabel,
  selection,
  fetchingDataFn,
}) {
  if (!selectedValue)
    resetSelectLabel(selection, `-- Select a ${selectionLabel} First --`);
  try {
    const data = await fetchingDataFn(selectedValue);
    resetSelectLabel(selection, `-- ${selectionLabel} Name --`);

    if (!Array.isArray(data) || data.length === 0) {
      resetSelectLabel(selection, `No ${selectionLabel} `);
      return;
    }

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selection.append(option);
    });
  } catch (err) {
    console.error(`Error loading ${selectionLabel}:`, err);
    resetSelectLabel(selection, `Failed to load ${selectionLabel}`);
  }
}

renderSelection({
  selectedValue: "africa",
  selectionLabel: "Country",
  selection: countrySelection,
  fetchingDataFn: utils.getCountries,
});

const citiesCache = {};

async function getCachedCities(country) {
  if (citiesCache[country]) return citiesCache[country];
  else {
    const cities = await utils.getCities(country);
    citiesCache[country] = cities;
    return cities;
  }
}
async function handleCountrySelection(e) {
  const selectedCountry = e.target.value;
  await renderSelection({
    selectedValue: selectedCountry,
    selectionLabel: "City",
    fetchingDataFn: getCachedCities,
    selection: citySelection,
  });
}

let timer = new Timer(0, 0, 5, liveCountLabel, () => {
  liveCountLabel.textContent = "HEEE";
});
timer.startTimer();

countrySelection.addEventListener("change", handleCountrySelection);

// // 3. Get prayer times for a city & country
// async function getPrayerTimes(country, city) {
//   const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data.data.timings; // object with Fajr, Dhuhr, Asr, Maghrib, Isha, etc.
// }
