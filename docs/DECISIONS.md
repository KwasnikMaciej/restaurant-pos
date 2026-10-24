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

- **Status:** wstępnie zaakceptowana; protokół do weryfikacji
- **Decyzja:** próbujemy drukować bezpośrednio z aplikacji webowej przez Web Bluetooth.
- **Powód:** połączenie i testowy wydruk na drukarce `MX06 Mini Printer` zostały potwierdzone w Chrome na Androidzie 16.
- **Konsekwencje:** trzeba potwierdzić protokół i możliwości urządzenia z poziomu naszej aplikacji. Nie zakładamy automatycznie ESC/POS ani zgodności każdej przeglądarki.

## D-006 — Płatność symulowana, paragon niefiskalny

- **Status:** zaakceptowana
- **Decyzja:** aplikacja nie przetwarza prawdziwych płatności i nie realizuje fiskalizacji.
- **Powód:** celem jest prosty demonstracyjny POS.
- **Konsekwencje:** interfejs powinien jasno informować, że płatność jest symulowana, a wydruk nie jest dokumentem fiskalnym.

## D-007 — Osobne repozytorium aplikacji

- **Status:** zaakceptowana
- **Decyzja:** kod i dokumentacja aplikacji są utrzymywane w repozytorium `KwasnikMaciej/restaurant-pos`, oddzielnie od repozytorium Second Brain.
- **Powód:** niezależna historia kodu i cykl rozwoju aplikacji.
