# Rejestr decyzji technicznych

Zapisujemy tutaj decyzje, które wpływają na zakres, technologię lub architekturę. To krótki rejestr, nie dziennik każdej drobnej zmiany.

## D-001 — React + TypeScript + Vite

- **Status:** zaakceptowana
- **Decyzja:** używamy React + TypeScript + Vite.
- **Powód:** szybki lokalny development, typowanie modeli i prosty sposób budowania aplikacji webowej.
- **Konsekwencje:** aplikacja jest frontendowa; funkcje przeglądarkowe, w tym Bluetooth, muszą być zgodne z ograniczeniami środowiska uruchomieniowego.

## D-002 — React Compiler

- **Status:** zaakceptowana
- **Decyzja:** pozostawiamy React Compiler włączony w konfiguracji wygenerowanej podczas tworzenia projektu.
- **Powód:** korzystamy z domyślnego wariantu wybranego podczas setupu.
- **Konsekwencje:** w razie problemów z kompatybilnością lub wydajnością sprawdzimy konfigurację zamiast zakładać, że kompilator jest źródłem problemu.

## D-003 — ESLint

- **Status:** zaakceptowana
- **Decyzja:** używamy ESLint jako narzędzia lintującego.
- **Powód:** dojrzały ekosystem i powszechne zastosowanie w projektach TypeScript / React.

## D-004 — Bez backendu w MVP

- **Status:** zaakceptowana
- **Decyzja:** pierwsza wersja nie ma backendu, kont ani synchronizacji chmurowej.
- **Powód:** ograniczenie kosztów i infrastruktury oraz skupienie na przepływie zamówienia i druku.
- **Konsekwencje:** dane lokalne mogą być dostępne tylko w danej przeglądarce / urządzeniu; nie zakładamy synchronizacji między urządzeniami.

## D-005 — Drukowanie przez Web Bluetooth

- **Status:** wstępnie zaakceptowana; protokół i błędy do dalszej weryfikacji
- **Decyzja:** próbujemy drukować bezpośrednio z aplikacji webowej przez Web Bluetooth.
- **Powód:** 2026-10-24 potwierdzono, że aplikacja łączy się z `MX06 Mini Printer` i uzyskuje poprawny wydruk testowy.
- **Konsekwencje:** jakość wydruku i scenariusze awaryjne nie zostały jeszcze w pełni sprawdzone. Nie zakładamy automatycznie ESC/POS ani tego, że stan braku papieru da się odczytać z aplikacji.

## D-006 — Płatność symulowana, paragon niefiskalny

- **Status:** zaakceptowana
- **Decyzja:** aplikacja nie przetwarza prawdziwych płatności i nie realizuje fiskalizacji.
- **Powód:** celem jest prosty demonstracyjny POS.
- **Konsekwencje:** interfejs powinien jasno informować, że płatność jest symulowana, a wydruk nie jest dokumentem fiskalnym.

## D-007 — Osobne repozytorium aplikacji

- **Status:** zaakceptowana
- **Decyzja:** kod i dokumentacja aplikacji są utrzymywane w repozytorium `KwasnikMaciej/restaurant-pos`, oddzielnie od repozytorium Second Brain.
- **Powód:** niezależna historia kodu i cykl rozwoju aplikacji.

## D-008 — Tymczasowe wstrzymanie prac nad drukarką

- **Status:** zaakceptowana
- **Decyzja:** po potwierdzeniu pierwszego poprawnego wydruku wstrzymujemy dalsze testy sprzętowe do czasu uzupełnienia papieru i skupiamy się na innych funkcjonalnościach POS.
- **Powód:** brak papieru uniemożliwia rzetelny test jakości i zużycia wydruku, ale nie blokuje rozwoju pozostałej części aplikacji.
- **Konsekwencje:** kolejne kroki diagnostyczne pozostają zapisane w `docs/ROADMAP.md`: kontrola kompletności i czytelności wydruku, a następnie testy błędów i bezpiecznego ponawiania. Sam fakt pierwszego wydruku nie oznacza ukończenia całej integracji.
