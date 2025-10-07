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
// 1. Get countries by continent
async function getCountries(continent) {
  const res = await fetch(`https://restcountries.com/v3.1/region/${continent}`);
  const data = await res.json();
  return data.map((c) => c.name.common); // return array of country names
}

// 2. Get cities of a country
async function getCities(country) {
  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/cities",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    }
  );
  console.log(res);
  const data = await res.json();
  return data.data; // array of city names
}

// 3. Get prayer times for a city & country
async function getPrayerTimes(country, city) {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data.timings; // object with Fajr, Dhuhr, Asr, Maghrib, Isha, etc.
}
async function getNextPrayerCountdown(country, city)
{
  const prayerTimes = await getPrayerTimes(country, city);
//  console.log(prayerTimes);
  const now = new Date();
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (let prayer of prayers) {
    const timeParts = prayerTimes[prayer].split(":");
    const prayerTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(timeParts[0]),
      parseInt(timeParts[1])
    );
    if (prayerTime > now) {
      const diffMs = prayerTime - now;
      const diffHrs = Math.floor(diffMs / 3600000); // hours
      const diffMins = Math.floor((diffMs % 3600000) / 60000); // minutes
      const difSecs = Math.floor((diffMs % 60000) / 1000); // seconds
      return { prayer, hours: diffHrs, minutes: diffMins, seconds: difSecs, day : 'Today'};
    }
  }
  // tomorrowprayer
  const timeParts = prayerTimes["Fajr"].split(":");
  const prayerTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    parseInt(timeParts[0]),
    parseInt(timeParts[1])
  );
  const diffMs = prayerTime - now;
  const diffHrs = Math.floor(diffMs / 3600000); // hours
  const diffMins = Math.floor((diffMs % 3600000) / 60000); // minutes
  const difSecs = Math.floor((diffMs % 60000) / 1000); // seconds
  return { prayer: "Fajr", hours: diffHrs, minutes: diffMins, seconds: difSecs, day : 'Tomorrow' };


} 
function formatTime(hours, minutes, seconds) {
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

async function startPrayerCountdown(country, city) {
  

   
  async function updateCountdown() {
    const result = await getNextPrayerCountdown(country, city);
    const timeStr = formatTime(result.hours, result.minutes, result.seconds);

    
    document.getElementById("nextPrayerCountDown").innerText =
      `Next prayer in ${country} : ${result.prayer} (${result.day}) in ${timeStr}`;
    
  }

  await updateCountdown();
  setInterval(updateCountdown, 1000);


}

function displayPrayerTimes(prayerTimes) {


  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let html = "<table border='1'><tr><th>Prayer</th><th>Time</th></tr>";
  for (let prayer of prayers) {
    html += `<tr><td>${prayer}</td><td>${prayerTimes[prayer]}</td></tr>`;
  }
  html += "</table>";
  document.getElementById("prayerTimeTable").innerHTML = html;  
  
  
}





// Example usage
(async () => {
    const countries = await getCountries("Asia");
    console.log("Countries in Asia:", countries);

  //const cities = await getCities("Palestine");
//  console.log("Cities in Palestine:", cities);

    const prayerTimes = await getPrayerTimes("Jordan", "Amman");
    console.log("Prayer times in Amman:", prayerTimes);
    const countdown = await getNextPrayerCountdown("Jordan", "Amman");
    console.log("Next prayer countdown in Amman:", countdown);
    startPrayerCountdown("Jordan", "Amman");
    displayPrayerTimes(prayerTimes);

})();

