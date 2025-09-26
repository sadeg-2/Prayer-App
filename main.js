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

// Example usage
(async () => {
    const countries = await getCountries("Asia");
    console.log("Countries in Asia:", countries);

  const cities = await getCities("Palestine");
  console.log("Cities in Palestine:", cities);

  //   const prayerTimes = await getPrayerTimes("Palestine", "Gaza");
  //   console.log("Prayer times in Gaza:", prayerTimes);
})();
