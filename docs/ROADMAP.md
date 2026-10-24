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
- [x] Połączyć repozytorium z hostingiem HTTPS i wykonać pierwsze wdrożenie.
- [ ] Potwierdzić, że opublikowana strona otwiera się na tablecie po wdrożeniu ekranu POS.

## Etap 1 — Podstawowy interfejs POS

- [x] Zaprojektować układ przeznaczony do obsługi dotykiem na tablecie.
- [x] Zdefiniować model produktu: identyfikator, nazwa, kategoria, cena.
- [x] Przygotować przykładowe menu dań i napojów.
- [x] Wyświetlać menu i filtrować produkty według kategorii.
- [x] Zbudować koszyk z ilościami, usuwaniem pozycji i sumą.
- [x] Obsłużyć pusty koszyk i stany brzegowe (ilość nie spada poniżej zera, usunięcie pozycji po zmniejszeniu do zera).
- [x] Sprawdzić czytelność i obsługę dotykową na docelowym tablecie (test użytkownika 2026-10-24).
- [ ] Potwierdzić, że CI przechodzi dla implementacji ekranu POS i finalizacji zamówienia.

## Etap 2 — Finalizacja zamówienia

- [x] Dodać panel podsumowania z listą pozycji i sumą.
- [x] Dodać symulowaną finalizację bez prawdziwej płatności.
- [x] Dodać numerację zamówień zapisywaną lokalnie (ostatni numer w localStorage; bez historii zamówień).
- [x] Przygotować dane zamówienia i podgląd potwierdzenia z datą, numerem, pozycjami i sumą.
- [x] Dodać komunikat sukcesu i jasne oznaczenie, że potwierdzenie nie jest paragonem fiskalnym.
- [x] Na MVP pozostawić historię zamówień poza zakresem; po finalizacji zachowujemy jedynie ostatnie potwierdzenie w pamięci aplikacji.

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

- [ ] Zweryfikować Web Bluetooth na docelowym urządzeniu po wdrożeniu.
- [ ] Rozważyć instalację PWA i zachowanie po ponownym uruchomieniu tabletu.
- [ ] Spisać instrukcję wdrożenia, uruchamiania i diagnostyki.
- [ ] Wykonać pełny test akceptacyjny: menu → koszyk → finalizacja → wydruk.

## Zasada zakończenia etapu

Etap uznajemy za ukończony dopiero po sprawdzeniu działania na uruchomionej aplikacji. Samo napisanie kodu nie wystarcza.
