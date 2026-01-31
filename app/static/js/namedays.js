/**
 * Moduł kalendarza - pobiera dane o imieninach z API Nameday.
 * Wyświetla aktualną datę, dzień tygodnia oraz imieniny (dla Polski).
 * 
 * @author Hubert Czernicki
 * @version 2.0 (Upgrade na ocenę 5.0)
 */

export async function initCalendar() {

    const url = `https://nameday.abalin.net/api/V2/today?timezone=UTC`
    const calendar_box = document.getElementById("calendar-box")

    if (!calendar_box) return;

    calendar_box.textContent = "Ładowanie..."

    // Obliczenie aktualnej daty w JavaScript
    const aktualnaData = new Date();
    const dzien = aktualnaData.getDate();
    const miesiac = aktualnaData.getMonth() + 1;
    const rok = aktualnaData.getFullYear();
    const dniTygodnia = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const dzienTygodnia = dniTygodnia[aktualnaData.getDay()];

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Błąd pobierania danych!");
        }

        const data = await response.json();
        calendar_box.textContent = ""; // Clear loading

        // Wyświetlenie daty i dnia tygodnia
        let h1 = document.createElement("h4");
        h1.classList = "text-center mb-3";
        h1.textContent = `${dzienTygodnia}, ${dzien}.${miesiac}.${rok}`;

        let divImiona = document.createElement("div");
        divImiona.classList = "text-center mt-3";

        let pLabel = document.createElement("p");
        pLabel.classList = "text-muted mb-1 small";
        pLabel.textContent = "Imieniny obchodzą:";

        // Pobranie imion dla Polski (pl) i rozdzielenie ich
        const imiona = data.data.pl.split(", ");

        divImiona.appendChild(pLabel);

        // Wyświetlenie każdego imienia jako badge Bootstrap
        imiona.forEach(name => {
            const span = document.createElement("span");
            span.classList = "badge rounded-pill bg-primary me-1 mb-1";
            span.textContent = name
            divImiona.appendChild(span)
        });

        calendar_box.appendChild(h1)
        calendar_box.appendChild(divImiona)

    }
    catch (error) {
        calendar_box.textContent = "Nie udało się pobrać kalendarza."
        console.error("Problem z pobieraniem danych:", error)
    }
}
