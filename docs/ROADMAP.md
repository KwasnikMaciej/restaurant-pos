# Plan prac

Plan jest iteracyjny. Statusy aktualizujemy, gdy etap zostanie rzeczywiście wykonany i zweryfikowany. Integrację drukarki chwilowo wstrzymujemy po potwierdzeniu pierwszego poprawnego wydruku; wrócimy do testów jakości i błędów, gdy będzie dostępny papier.

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
- [x] Potwierdzić działanie CI/CD i wyświetlanie numeru wersji w stopce.

## Etap 2 — Finalizacja zamówienia

- [x] Dodać panel podsumowania z listą pozycji i sumą.
- [x] Dodać symulowaną finalizację bez prawdziwej płatności.
- [x] Dodać numerację zamówień zapisywaną lokalnie (ostatni numer w localStorage; bez historii zamówień).
- [x] Przygotować dane zamówienia i podgląd potwierdzenia z datą, numerem, pozycjami i sumą.
- [x] Dodać komunikat sukcesu i jasne oznaczenie, że potwierdzenie nie jest paragonem fiskalnym.
- [x] Dodać lokalną historię ostatnich 100 zamówień w `localStorage`, z możliwością ponownego otwarcia szczegółów i potwierdzenia.

## Etap 3 — Rozpoznanie i integracja drukarki (wstrzymany)

- [x] Potwierdzić, że Chrome na Androidzie 16 łączy się z `MX06 Mini Printer` i potrafi wykonać testowy wydruk.
- [x] Potwierdzić wymagania Web Bluetooth: bezpieczny kontekst HTTPS i wybór urządzenia po geście użytkownika.
- [x] Przeanalizować [cat-printer-web](https://github.com/zmras/cat-printer-web); przyjąć roboczo protokół rodziny MX06/GB01 oparty o ramki `51 78` (szczegóły nadal wymagają walidacji).
- [x] Przygotować monochromatyczny obraz potwierdzenia, aby nie polegać na kodowaniu znaków w firmware drukarki.
- [x] Wydzielić adapter Bluetooth i formatowanie pakietów do `src/printing/mx06-printer.ts`.
- [x] Dodać w potwierdzeniu zamówienia przycisk wydruku uruchamiany gestem użytkownika.
- [x] Potwierdzić na własnym egzemplarzu, że aplikacja potrafi połączyć się z drukarką i uzyskać poprawny wydruk testowy (2026-10-24; test jakości nieukończony z powodu braku papieru).
- [x] Oddzielić status drukowania od statusu zamówienia; błąd wydruku nie cofa zamówienia.
- [ ] Po uzupełnieniu papieru sprawdzić jakość wydruku: kompletność pozycji, ilości, ceny i sumy, długie nazwy, polskie znaki, numer/datę oraz oznaczenie niefiskalne.
- [ ] Sprawdzić obsługę braku papieru, jeśli drukarka udostępnia taki stan aplikacji; nie zakładać, że da się go wiarygodnie wykryć przez Web Bluetooth.
- [ ] Przetestować wyłączoną drukarkę, anulowanie wyboru urządzenia, zerwanie połączenia i błąd zapisu.
- [ ] Ocenić odstępy, marginesy, czytelność i ilość zużywanego papieru.
- [ ] Sprawdzić, że ponowienie wydruku nie tworzy nowego zamówienia ani nie zmienia jego statusu.

## Etap 4 — Funkcjonalności aplikacji i dane lokalne

- [x] Ustalić dane przechowywane lokalnie: numer, pozycje, ceny, suma i data ukończenia zamówienia.
- [x] Zapisywać maksymalnie 100 ostatnich zamówień w `localStorage` i umożliwić ponowne otwarcie szczegółów.
- [x] Wydzielić historię do osobnej podstrony i dodać nawigację „Zamówienie” / „Historia”.
- [ ] Dopracować komunikaty, dostępność i wygodę obsługi dotykowej.
- [ ] Przetestować odświeżenie aplikacji i zachowanie bieżącego zamówienia.
- [ ] Wybrać i wdrożyć kolejną funkcjonalność POS przed powrotem do szczegółowych testów drukarki.

## Etap 5 — Wydanie na urządzeniu

- [ ] Zweryfikować Web Bluetooth na docelowym urządzeniu po wdrożeniu.
- [ ] Rozważyć instalację PWA i zachowanie po ponownym uruchomieniu tabletu.
- [ ] Spisać instrukcję wdrożenia, uruchamiania i diagnostyki.
- [ ] Wykonać pełny test akceptacyjny: menu → koszyk → finalizacja → wydruk.

## Zasada zakończenia etapu

Etap uznajemy za ukończony dopiero po sprawdzeniu działania na uruchomionej aplikacji. Samo napisanie kodu nie wystarcza.
