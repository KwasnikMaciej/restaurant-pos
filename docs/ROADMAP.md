# Plan prac

Plan jest iteracyjny. Statusy aktualizujemy, gdy etap zostanie rzeczywiście wykonany i zweryfikowany.

## Etap 0 — Fundamenty

- [x] Utworzyć projekt React + TypeScript + Vite.
- [x] Włączyć React Compiler.
- [x] Wybrać ESLint.
- [x] Uruchomić aplikację lokalnie.
- [x] Utworzyć repozytorium Git i wykonać pierwszy push do prywatnego GitHuba.
- [x] Dodać dokumentację projektu.
- [ ] Sprawdzić, czy lokalny projekt jest czysty po dodaniu dokumentacji.
- [ ] Zweryfikować `npm run lint` i `npm run build` lokalnie.
- [x] Dodać workflow CI w GitHub Actions (lint + build).
- [x] Opisać konfigurację hostingu i CD w `docs/DEPLOYMENT.md`.
- [ ] Jednorazowo połączyć repozytorium z hostingiem HTTPS i wykonać pierwsze wdrożenie.
- [ ] Potwierdzić, że opublikowana strona otwiera się na tablecie.

## Etap 1 — Podstawowy interfejs POS

- [ ] Zaprojektować układ przeznaczony do obsługi dotykiem na tablecie.
- [ ] Zdefiniować model produktu: identyfikator, nazwa, kategoria, cena.
- [ ] Przygotować przykładowe menu dań i napojów.
- [ ] Wyświetlać menu i filtrować produkty według kategorii.
- [ ] Zbudować koszyk z ilościami, usuwaniem pozycji i sumą.
- [ ] Obsłużyć pusty koszyk i stany brzegowe.
- [ ] Sprawdzić czytelność na docelowym tablecie.

## Etap 2 — Finalizacja zamówienia

- [ ] Dodać ekran / panel podsumowania.
- [ ] Dodać symulowaną finalizację bez prawdziwej płatności.
- [ ] Ustalić numerację lokalnych zamówień.
- [ ] Zaprojektować dane zamówienia potrzebne do paragonu.
- [ ] Dodać komunikaty o sukcesie i błędach.
- [ ] Zdecydować, czy historia zamówień wchodzi do pierwszej wersji MVP.

## Etap 3 — Rozpoznanie i integracja drukarki

- [x] Potwierdzić, że Chrome na Androidzie 16 łączy się z `MX06 Mini Printer` i wykonuje testowy wydruk.
- [ ] Zweryfikować możliwości Web Bluetooth i ograniczenia uprawnień w docelowym Chrome.
- [ ] Przeanalizować [cat-printer-web](https://github.com/zmras/cat-printer-web) i ustalić właściwy protokół / format danych.
- [ ] Sprawdzić, czy drukarka wymaga konkretnego kodowania znaków, komend lub formatu obrazu.
- [ ] Zaimplementować mały, niezależny test wydruku z aplikacji.
- [ ] Wydzielić obsługę drukarki do modułu `src/printing/`.
- [ ] Zbudować format niefiskalnego paragonu.
- [ ] Połączyć finalizację zamówienia z drukowaniem.
- [ ] Obsłużyć anulowanie połączenia i błędy wydruku bez utraty danych zamówienia.

## Etap 4 — Dane lokalne i dopracowanie

- [ ] Ustalić, jakie dane należy przechowywać lokalnie.
- [ ] Jeśli potrzebne, zapisać historię zamówień w pamięci lokalnej przeglądarki.
- [ ] Dodać możliwość ponownego wydruku paragonu, jeśli będzie przydatna.
- [ ] Dopracować komunikaty, dostępność i wygodę obsługi dotykowej.
- [ ] Przetestować odświeżenie aplikacji i ponowne połączenie z drukarką.

## Etap 5 — Wydanie na urządzeniu

- [ ] Przygotować sposób uruchamiania aplikacji przez HTTPS, jeśli aplikacja będzie hostowana zdalnie.
- [ ] Zweryfikować Web Bluetooth na docelowym urządzeniu po wdrożeniu.
- [ ] Rozważyć instalację PWA i zachowanie po ponownym uruchomieniu tabletu.
- [ ] Spisać instrukcję wdrożenia, uruchamiania i diagnostyki.
- [ ] Wykonać pełny test akceptacyjny: menu → koszyk → finalizacja → wydruk.

## Zasada zakończenia etapu

Etap uznajemy za ukończony dopiero po sprawdzeniu działania na uruchomionej aplikacji. Samo napisanie kodu nie wystarcza.
