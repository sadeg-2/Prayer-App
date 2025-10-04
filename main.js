import { Timer } from "./modules/timer.js";
import utils from "./utility.js";

const countrySelection = document.getElementById("county");
const defaultOptionValue = document.getElementById("defaultValue");
const liveCountLabel = document.getElementById("liveCount");

async function renderCountries() {
  defaultOptionValue.textContent = "loading...";
  try {
    const countries = await utils.getCountries("asia");
    defaultOptionValue.textContent = "-- Country Name --";

    if (countries.length === 0) {
      defaultOptionValue.textContent = "Failed to load countries";
      return;
    }

    countries.forEach((country) => {
      const countyOption = document.createElement("option");
      countyOption.value = country;
      countyOption.textContent = country;
      countrySelection.append(countyOption);
    });
  } catch (err) {
    console.error("Error loading countries:", err);
    defaultOptionValue.textContent = "Failed to load countries";
  }
}
renderCountries();


let timer = new Timer(0, 0, 5, liveCountLabel, () => {
  liveCountLabel.textContent = "HEEE";
});
timer.startTimer();

// // 3. Get prayer times for a city & country
// async function getPrayerTimes(country, city) {
//   const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data.data.timings; // object with Fajr, Dhuhr, Asr, Maghrib, Isha, etc.
// }

// // Example usage
// (async () => {
//   const countries = await getCountries("Asia");
//   console.log("Countries in Asia:", countries);

//   const cities = await getCities("Palestine");
//   console.log("Cities in Palestine:", cities);

//   //   const prayerTimes = await getPrayerTimes("Palestine", "Gaza");
//   //   console.log("Prayer times in Gaza:", prayerTimes);
// })();
