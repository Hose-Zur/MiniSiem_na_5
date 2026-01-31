# 🛡️ Mini-SIEM (Security Information & Event Management) - Wersja 2.0

> **Projekt zrealizowany na przedmiot: Języki Skryptowe (Cyberbezpieczeństwo, Rok II)**
> **Autor:** Hubert Czernicki (Nr albumu: 426686)
> **Cel:** Rozbudowa projektu podstawowego o funkcje Enterprise w celu uzyskania oceny **5.0**.

---

## 📑 Spis Treści
1. [Realizacja Wymagań od P. Ossysek](#1-realizacja-wymagań-od-p-ossysek)
2. [Lista Zmienionych i Dodanych Plików](#2-lista-zmienionych-i-dodanych-plików)
3. [Instrukcja Uruchomienia (Krok po Kroku)](#3-instrukcja-uruchomienia-krok-po-kroku)
4. [Instrukcja Weryfikacji Nowych Funkcji](#4-instrukcja-weryfikacji-nowych-funkcji)

---

## 1. Realizacja Wymagań (Podsumowanie)

Projekt został zrealizowany w 100%, obejmując zarówno **zestaw podstawowy (Security + Logika SIEM)**, jak i **zadania dodatkowe na ocenę 5.0**.

### A. Zadania Dodatkowe (Wymagane na 5.0)

| # | Wymaganie z maila | Status | Gdzie to jest |
|:-:|------------------|:------:|---------------|
| 1 | Strona z kalendarzem i pogodą (API IMGW) | ✅ | Menu "Info" → `/info` |
| 2 | Opcja "Archiwizuj Alerty" (zapis do JSON) | ✅ | Dashboard → czerwony przycisk nad tabelą |
| 3 | Komentarze w nowym kodzie | ✅ | Docstrings w kluczowych plikach (`.py`, `.js`) |
| 4 | README z listą zmienionych plików | ✅ | Ten dokument (`README.md`) |
| 5 | Projekt na GitHub | ✅ | Repozytorium GitHub |

### B. Zadania Podstawowe (Wymagane na zaliczenie)

Realizacja kluczowych funkcjonalności z oryginalnego zadania (patrz: `README_ORYGINALNE_ZADANIE.md`):

1.  **Security Hardening (Etap 1)**
    *   ✅ Modele haseł: Hasłowanie SHA-256 z solą (`werkzeug.security`).
    *   ✅ Logowanie: Działający formularz logowania, obsługa sesji (`flask_login`).
    *   ✅ Ochrona API: Endpointy (`/api/hosts`, `/api/alerts`) chronione dekoratorem `@login_required`.
2.  **Log Collection (Etap 2)**
    *   ✅ Linux: Parsowanie `journalctl` (SSH) z filtrowaniem Regex.
    *   ✅ Windows: Pobieranie Event ID 4625 przez PowerShell (XML Parsing).
    *   ✅ Forensics: Zapis surowych logów do plików `.parquet` w folderze `storage/`.
3.  **Threat Intelligence (Etap 3)**
    *   ✅ Logika `LogAnalyzer`: Korelacja IP z bazą reputacji (`IPRegistry`).
    *   ✅ Wykrywanie incydentów: Oznaczanie ataków `FAILED_LOGIN`.

### C. Zrealizowane Zadania Dodatkowe (Oryginalna Specyfikacja)

Oprócz wymagań z maila, projekt zawiera również rozwiązania "Zadań z Gwiazdką" z oryginalnego `README.md` (teraz `README_ORYGINALNE_ZADANIE.md`):

1.  ⭐ **Cross-Host Correlation**: System wykrywa rozproszone ataki (ten sam IP atakujący różne hosty) i automatycznie banuje agresora.
2.  ⭐ **Dark Mode**: Zaimplementowano przełącznik trybu jasnego/ciemnego (zapis ustawień w `localStorage`).
3.  ⭐ **Hardening API (CSRF)**: Usunięto `csrf.exempt`, a API jest chronione tokenami CSRF we wszystkich żądaniach `fetch`.
4.  ⭐ **Wykresy (`Chart.js`)**: Dashboard zawiera wykres statystyk atakujących adresów IP.

---

## 2. Lista Kluczowych Plików

Poniżej znajduje się zestawienie plików, które zostały stworzone lub zmodyfikowane w ramach całego projektu.

### 🟢 NOWE PLIKI (Created from scratch)

| Plik | Kategoria | Opis funkcji |
|------|-----------|--------------|
| `app/templates/info.html` | Extra | Strona informacyjna (Pogoda, Kalendarz, Ostrzeżenia). |
| `app/templates/login.html` | Security | Formularz logowania (wymagany w Etapie 1). |
| `app/static/js/weather.js` | Extra | Obsługa API IMGW (Synop). |
| `app/static/js/warnings.js` | Extra | Obsługa API IMGW (Warnings). |
| `app/static/js/namedays.js` | Extra | Obsługa API Nameday. |
| `README.md` | Docs | Główna dokumentacja końcowa. |
| `README_ORYGINALNE_ZADANIE.md` | Docs | Oryginalna treść zadania. |

### 🟡 ZMODYFIKOWANE PLIKI (Kluczowe zmiany)

| Plik | Kategoria | Co zostało zmienione |
|------|-----------|---------------------|
| `app/blueprints/auth.py` | Security | Implementacja logiki logowania i wylogowania. |
| `app/models.py` | Security | Dodano metody `set_password` i `check_password`. Dodano docstrings. |
| `app/blueprints/api/hosts.py` | API | Dodano `fetch_logs`, archiwizację JSON, endpointy IP. Dodano `@login_required`. |
| `app/services/log_collector.py` | Core | Implementacja logiki Regex (Linux) i XML (Windows). |
| `app/services/log_analyzer.py` | Core | Logika `Cross-Host Correlation` i wykrywanie incydentów. |
| `app/templates/base.html` | UI | Dodano linki w menu (Info, Wyloguj). Obsługa CSRF. |
| `app/static/js/dashboard.js` | UI | Obsługa przycisku "Archiwizuj Alerty". |

---

## 3. Instrukcja Uruchomienia (Krok po Kroku)

### Wymagania wstępne:
- Python 3.10+
- System Windows (dla pobierania lokalnych logów Event ID 4625)
- Środowisko wirtualne `venv` (dołączone w projekcie)

### Krok 1: Otwórz PowerShell jako Administrator
1. Kliknij prawym przyciskiem myszy na ikonę PowerShell w menu Start.
2. Wybierz **"Uruchom jako administrator"**.
3. Przejdź do folderu projektu:
   ```powershell
   cd C:\Users\Hose\Desktop\Skryptowe\MiniSIEM
   ```

### Krok 2: Aktywuj środowisko wirtualne
```powershell
.\venv\Scripts\Activate
```
*(Powinna pojawić się etykieta `(venv)` przed linią poleceń)*

### Krok 3: Uruchom serwer Flask
```powershell
python -m flask run
```

### Krok 4: Otwórz przeglądarkę
Wejdź na adres: **http://localhost:5000**

### Krok 5: Zaloguj się
Użyj danych administratora (jeśli go stworzyłeś wcześniej przez `flask shell`).

---

## 4. Instrukcja Weryfikacji Nowych Funkcji

### ✅ Test 1: Strona Info (Pogoda, Kalendarz, Ostrzeżenia)

1. Po zalogowaniu kliknij w menu górnym link **"Info"**.
2. Powinna załadować się strona z trzema kafelkami:
   - **🌤️ Pogoda (Kraków)** - dane z API IMGW (temperatura, wiatr, ciśnienie).
   - **📅 Kartka z Kalendarza** - aktualna data i imieniny z API Nameday.
   - **⚠️ Ostrzeżenia Meteorologiczne** - lista aktywnych alertów IMGW (lub komunikat "Brak ostrzeżeń").
3. Sprawdź konsolę przeglądarki (F12 → Console) - powinien pojawić się log: `"Inicjalizacja Info Page..."`.

### ✅ Test 2: Weryfikacja Logów Windows (Symulacja Intruza)

Ponieważ system działa **przyrostowo** (pobiera tylko *nowe* logi), jeśli klikniesz "Logi" i nic się nie pojawi, to znaczy, że nie było nowych incydentów. Aby to przetestować:

1. Zablokuj ekran Windows (`Win + L`).
2. Spróbuj się zalogować wpisując **błędne hasło** (to wygeneruje zdarzenie Event ID 4625).
3. Zaloguj się poprawnie swoim hasłem.
4. Wróć do Mini-SIEM Dashboard i kliknij przycisk **"Logi"** przy hoście Windows.
5. Przycisk powinien zmienić się na czerwony (np. `⚠️ 1`), a w tabeli poniżej powinien pojawić się nowy wiersz z typem `WIN_FAILED_LOGIN`.

### ✅ Test 3: Archiwizacja Alertów do JSON

1. Wróć na **Dashboard** (kliknij "Dashboard" w menu).
2. Jeśli masz jakieś alerty w tabeli, kliknij czerwony przycisk **"📥 Archiwizuj Alerty (JSON)"**.
3. Przeglądarka powinna pobrać plik o nazwie `alerts_archive.json`.
4. Otwórz pobrany plik w edytorze tekstowym i zweryfikuj, że zawiera dane alertów w formacie JSON.

### ✅ Test 3: Komentarze w kodzie

Otwórz w edytorze następujące pliki i sprawdź, czy zawierają docstringi/komentarze:

1. **`app/services/log_collector.py`** - linie 5-9 (docstring klasy), linie 24-28 (docstring metody).
2. **`app/services/log_analyzer.py`** - linie 7-11 (docstring klasy), linie 30-31, 63-64 (komentarze).
3. **`app/models.py`** - linie 26-28, 47-50, 58-61, 70-72 (docstringi klas).
4. **`app/static/js/weather.js`** - linie 1-6 (nagłówek JSDoc).
5. **`app/static/js/warnings.js`** - linie 1-6 (nagłówek JSDoc).
6. **`app/static/js/namedays.js`** - linie 1-6 (nagłówek JSDoc).

---

*Dziękuję za rozpatrzenie mojej prośby o podwyższenie oceny.*

*Hubert Czernicki*
