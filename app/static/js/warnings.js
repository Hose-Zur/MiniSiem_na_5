/**
 * Moduł ostrzeżeń meteorologicznych - pobiera dane z API IMGW Warnings.
 * Wyświetla aktywne ostrzeżenia pogodowe dla Polski.
 * 
 * @author Hubert Czernicki
 * @version 2.0 (Upgrade na ocenę 5.0)
 */

export async function fetchWarnings() {
    const url = "https://danepubliczne.imgw.pl/api/data/warningsmeteo"
    const AlertBox = document.getElementById("alert-box")

    if (!AlertBox) return;

    AlertBox.textContent = "Ładowanie..."

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error("Błąd!")
        }

        const data = await response.json()

        AlertBox.textContent = "" // Clear loading message

        // Filtrowanie dla Krakowa (Woj. Małopolskie) - TERYT zaczyna się od 12
        // Kraków to 1261, powiaty 12xx.
        // Jeśli chcesz widzieć WSZYSTKIE, usuń ten filtr.
        const localWarnings = data.filter(alert => {
            if (!alert.teryt) return false;
            return alert.teryt.some(code => code.startsWith("12"));
        });

        // Jeśli brak lokalnych, wyświetl komunikat.
        if (localWarnings.length === 0) {
            let messageBox = document.createElement("div");
            messageBox.className = "text-center text-success";

            let h5 = document.createElement("h5");
            h5.textContent = "Brak ostrzeżeń dla Krakowa (Małopolskie).";

            let small = document.createElement("small");
            small.className = "text-muted";
            small.textContent = `(Aktywne w Polsce: ${data.length})`;

            messageBox.appendChild(h5);
            messageBox.appendChild(small);
            AlertBox.appendChild(messageBox);
        }
        else {
            localWarnings.forEach((element) => {
                // Kontener karty
                const card = document.createElement("div");
                card.classList = "card mb-3 border-warning";

                // Ciało karty
                const cardBody = document.createElement("div");
                cardBody.classList = "card-body";

                // Tytuł zdarzenia
                let h5 = document.createElement("h5");
                h5.classList = "card-title text-danger";
                h5.textContent = `Zdarzenie: ${element.nazwa_zdarzenia} (Stopień: ${element.stopien})`;
                cardBody.appendChild(h5);

                // Lista szczegółów (zamiast innerHTML)
                let ul = document.createElement("ul");
                ul.classList = "list-unstyled small mb-0";

                // Helper do tworzenia linii listy
                const createListItem = (label, value) => {
                    let li = document.createElement("li");
                    li.classList = "mb-1";

                    let strong = document.createElement("strong");
                    strong.textContent = `${label}: `;

                    let span = document.createElement("span");
                    span.textContent = value;

                    li.appendChild(strong);
                    li.appendChild(span);
                    return li;
                };

                // Dodawanie elementów listy
                ul.appendChild(createListItem("Prawdopodobieństwo", `${element.prawdopodobienstwo}%`));
                ul.appendChild(createListItem("Obszar", `Woj. Małopolskie (Dotyczy ${element.teryt ? element.teryt.length : 0} powiatów)`));
                ul.appendChild(createListItem("Treść", element.tresc));

                if (element.komentarz) {
                    ul.appendChild(createListItem("Komentarz", element.komentarz));
                }

                // Stopka wydawcy
                let footerP = document.createElement("p");
                footerP.classList = "text-muted mt-2 mb-0 fst-italic";
                footerP.style.fontSize = "0.8em";
                footerP.textContent = `Wydane przez: ${element.biuro}`;

                cardBody.appendChild(ul);
                cardBody.appendChild(footerP);

                card.appendChild(cardBody);
                AlertBox.appendChild(card);
            });
        }
    }
    catch (error) {
        console.error("Problem z pobieraniem danych:", error)
        AlertBox.textContent = "Nie udało się pobrać ostrzeżeń."
    }
}
