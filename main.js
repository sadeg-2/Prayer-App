import { Timer } from "./modules/timer.js";
import utils from "./utility.js";

const countrySelection = document.getElementById("county");
const citySelection = document.getElementById("city");
const liveCountLabel = document.getElementById("liveCount");

function storeLocally(key, value) {
  const storedSelection = JSON.parse(localStorage.getItem("selection")) || {};
  storedSelection[key] = value;
  localStorage.setItem("selection", JSON.stringify(storedSelection));
}

async function getStoredSelection() {
  const storedSelection = JSON.parse(localStorage.getItem("selection")) || {};

  // if (continentSelection.value) {

  if ("africa") {
    // this is just a hard coded which should be deleted

    // continentSelection.value = storedSelection["continent"];
    await renderSelection({
      selectedValue: "africa", // it should be continentSelection.value
      selectionLabel: "Country",
      selection: countrySelection,
      fetchingDataFn: utils.getCountries,
    });
  }

  if (storedSelection["country"]) {
    countrySelection.value = storedSelection["country"];

    await renderSelection({
      selectedValue: countrySelection.value,
      selectionLabel: "City",
      fetchingDataFn: getCachedCities,
      selection: citySelection,
    });
  }

  if (storedSelection["city"]) {
    citySelection.value = storedSelection["city"];
  }

  // add the function of rendering MethodFetching

  // if (methodSelection.value) methodSelection.value = storedSelection["method"];
}

function resetSelectLabel(selection, message) {
  selection.innerHTML = `
    <option value="" id="optionDefaultValue" disabled selected>${message}</option>
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
  storeLocally("country", selectedCountry);
  await renderSelection({
    selectedValue: selectedCountry,
    selectionLabel: "City",
    fetchingDataFn: getCachedCities,
    selection: citySelection,
  });
}

async function handleCitySelection(e) {
  const selectedCity = e.target.value;
  storeLocally("city", selectedCity);

  /*  just a pseudocode of rendering methods function 
  await renderMethods({
    selectedValue: selectedCity,
    selectionLabel: "Method",
    fetchingDataFn: utils.getMethods,
    selection: MethodSelection,
  });
  */
}

let timer = new Timer(0, 0, 5, liveCountLabel, () => {
  liveCountLabel.textContent = "HEEE";
});
timer.startTimer();

countrySelection.addEventListener("change", handleCountrySelection);
citySelection.addEventListener("change", handleCitySelection);
window.addEventListener("DOMContentLoaded", getStoredSelection);
