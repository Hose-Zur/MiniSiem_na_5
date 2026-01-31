/**
 * Moduł pogodowy - pobiera dane z API IMGW (Synop) dla Krakowa.
 * Wykorzystuje publiczne API: danepubliczne.imgw.pl
 * 
 * @author Hubert Czernicki
 * @version 2.0 (Upgrade na ocenę 5.0)
 */

export async function fetchWeatherIMGW() {
    const city = 'krakow';
    const url = `https://danepubliczne.imgw.pl/api/data/synop/station/${city}`;
    const weatherBox = document.getElementById('weather-box');

    if (!weatherBox) return; // Guard clause

    weatherBox.textContent = "Ładowanie..."

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Błąd pobierania danych!");
        }

        const data = await response.json();

        weatherBox.textContent = "";

        const h1 = document.createElement("h3");
        h1.textContent = `${data.stacja}`;
        h1.classList = "text-center mb-3"
        weatherBox.appendChild(h1)

        const ul = document.createElement("ul")
        ul.classList.add("list-unstyled"); // Bootstrap clean list

        const createLi = (text) => {
            const li = document.createElement("li");
            li.textContent = text;
            return li;
        }

        ul.appendChild(createLi(`Temperatura: ${data.temperatura} °C`));
        ul.appendChild(createLi(`Prędkość wiatru: ${data.predkosc_wiatru} m/s`));
        ul.appendChild(createLi(`Ciśnienie: ${data.cisnienie} Pa`));
        ul.appendChild(createLi(`Wilgotność: ${data.wilgotnosc_wzgledna} g/m³`));
        ul.appendChild(createLi(`Suma opadów: ${data.suma_opadu} mm`));

        weatherBox.appendChild(ul)

    }
    catch (error) {
        weatherBox.textContent = "Nie udało się pobrać pogody."
        console.error("Problem z pobieraniem danych:", error)
    }
}
