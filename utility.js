// 1. Get countries by continent

async function getCountries(continent) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/region/${continent}`
    );
    if (!res.ok) throw newError(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.map((c) => c.name.common);
  } catch (err) {
    console.error(`There is an error ${err}`);
    return [];
  }
}

// 2. Get cities of a country
async function getCities(country) {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    if (!res.ok) throw newError(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(`There is an error ${err}`);
    throw err;
  }
}

export default {
  getCountries,
  getCities,
};
