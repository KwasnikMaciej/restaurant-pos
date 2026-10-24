# Restaurant POS — założenia projektu

## Cel

Zbudować prostą aplikację POS na tablet z Androidem, przeznaczoną do symulowania zamówień w restauracji. Użytkownik wybiera dania i napoje, buduje koszyk, sprawdza sumę, symuluje finalizację zamówienia i może wydrukować niefiskalne potwierdzenie bezpośrednio z aplikacji.

Projekt jest edukacyjny i rodzinny. Nie obsługuje rzeczywistych płatności ani sprzedaży fiskalnej.

## Uzgodnione założenia

- **Urządzenie docelowe:** tablet z Androidem 16.
- **Forma aplikacji:** aplikacja webowa React/TypeScript, docelowo możliwa do używania jako PWA.
- **Uruchamianie:** Chrome na Androidzie.
- **Drukarka:** mini drukarka termiczna Drukus, wykrywana przez Bluetooth jako `MX06 Mini Printer`.
- **Status integracji:** 2026-10-24 potwierdzono poprawny wydruk testowy z aplikacji. Pełna kontrola jakości i testy sytuacji awaryjnych pozostają otwarte; prace nad drukarką są tymczasowo wstrzymane z powodu braku papieru.
- **Komunikacja z drukarką:** Web Bluetooth. Nie zakładamy automatycznie, że urządzenie obsługuje standard ESC/POS; szczegóły protokołu i obsługi błędów wymagają dalszej walidacji.
- **Protokół / materiał referencyjny:** [cat-printer-web](https://github.com/zmras/cat-printer-web). Własny egzemplarz potwierdził, że obecna implementacja potrafi wydrukować potwierdzenie, ale nie oznacza to jeszcze zweryfikowania wszystkich scenariuszy ani jakości.
- **Dane:** lokalnie, bez backendu, kont użytkowników i synchronizacji chmurowej. Historia przechowuje maksymalnie 100 ostatnich zamówień w `localStorage` bieżącej przeglądarki.
- **Płatność:** wyłącznie symulowana; żadnych prawdziwych transakcji.
- **Paragon:** niefiskalny, generowany i wysyłany do drukarki z poziomu aplikacji — bez ręcznego eksportu ani aplikacji pośredniczącej w docelowym przepływie.

## Technologia

- React
- TypeScript
- Vite
- React Compiler
- ESLint
- Git i GitHub

Wymagania środowiskowe i szczegóły zależą od aktualnej konfiguracji projektu. Nie zmieniamy narzędzi bez konkretnej potrzeby.

## Zakres MVP

1. Czytelny, dotykowy ekran menu.
2. Lista przykładowych dań i napojów z nazwą, kategorią i ceną.
3. Dodawanie produktów do koszyka.
4. Zwiększanie i zmniejszanie ilości oraz usuwanie pozycji.
5. Obliczanie sumy zamówienia.
6. Symulowana finalizacja zamówienia i lokalna historia do 100 ostatnich zamówień.
7. Podgląd szczegółów wcześniejszych zamówień.
8. Wydruk niefiskalnego potwierdzenia bezpośrednio na drukarce Bluetooth.
9. Podstawowa obsługa błędów: brak połączenia, anulowanie wyboru urządzenia, błąd wydruku.
10. Krótkie instrukcje uruchomienia i testowania.

## Poza zakresem pierwszej wersji

- rzeczywiste płatności i integracje z terminalem,
- fiskalizacja,
- backend i synchronizacja w chmurze,
- konta i logowanie,
- zarządzanie magazynem i stanami produktów,
- skanowanie kodów kreskowych,
- integracje z komercyjnymi systemami restauracyjnymi,
- rozbudowany panel administracyjny.

## Kryteria ukończenia MVP

- Użytkownik może przejść cały przepływ od menu do podsumowania zamówienia.
- Sumy są poprawne dla wielu pozycji i ilości.
- Aplikacja jasno informuje o powodzeniu lub niepowodzeniu wydruku.
- Potwierdzenie jest drukowane z aplikacji na MX06 Mini Printer bez ręcznego eksportu i bez aplikacji pośredniczącej.
- Aplikacja działa na docelowym tablecie w obsługiwanej wersji Chrome.
- Instrukcja pozwala odtworzyć środowisko i przetestować podstawowe scenariusze.

## Zasady pracy

- Budujemy małymi, sprawdzalnymi krokami.
- Najpierw rozwijamy i testujemy przepływ zamówienia, a następnie dopracowujemy integracje sprzętowe.
- Nie dodajemy infrastruktury ani usług płatnych bez wyraźnej potrzeby.
- Decyzje wpływające na architekturę zapisujemy w `docs/DECISIONS.md`.
- Po ukończeniu etapu uruchamiamy odpowiednie kontrole, np. `npm run lint` i `npm run build`, oraz tworzymy opisowy commit.
