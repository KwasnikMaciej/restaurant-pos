# Restaurant POS — założenia projektu

## Cel

Zbudować prostą aplikację POS na tablet z Androidem, przeznaczoną do symulowania zamówień w restauracji. Użytkownik wybiera dania i napoje, buduje koszyk, sprawdza sumę, symuluje finalizację zamówienia i drukuje niefiskalny paragon bezpośrednio z aplikacji.

Projekt jest edukacyjny i rodzinny. Nie obsługuje rzeczywistych płatności ani sprzedaży fiskalnej.

## Uzgodnione założenia

- **Urządzenie docelowe:** tablet z Androidem 16.
- **Forma aplikacji:** aplikacja webowa React/TypeScript, docelowo możliwa do używania jako PWA.
- **Uruchamianie:** Chrome na Androidzie.
- **Drukarka:** mini drukarka termiczna Drukus, wykrywana przez Bluetooth jako `MX06 Mini Printer`.
- **Wstępny test sprzętu:** połączenie i testowy wydruk przez Chrome na Androidzie 16 działają. Integracja drukowania z naszą aplikacją pozostaje do wykonania.
- **Komunikacja z drukarką:** Web Bluetooth, o ile potwierdzi się zgodność z protokołem drukarki. Nie zakładamy automatycznie, że urządzenie obsługuje standard ESC/POS.
- **Protokół / materiał referencyjny:** [cat-printer-web](https://github.com/zmras/cat-printer-web). Trzeba zweryfikować, które elementy projektu pasują do konkretnej drukarki.
- **Dane:** początkowo lokalnie, bez backendu, kont użytkowników i synchronizacji chmurowej.
- **Płatność:** wyłącznie symulowana; żadnych prawdziwych transakcji.
- **Paragon:** niefiskalny, generowany i wysyłany do drukarki z poziomu aplikacji — bez ręcznego eksportu ani aplikacji pośredniczącej w docelowym przepływie.

## Technologia

- React
- TypeScript
- Vite
- React Compiler
- ESLint
- Git i GitHub (repozytorium prywatne)

Wymagania środowiskowe i szczegóły zależą od aktualnej konfiguracji projektu. Nie zmieniamy narzędzi bez konkretnej potrzeby.

## Zakres MVP

1. Czytelny, dotykowy ekran menu.
2. Lista przykładowych dań i napojów z nazwą, kategorią i ceną.
3. Dodawanie produktów do koszyka.
4. Zwiększanie i zmniejszanie ilości oraz usuwanie pozycji.
5. Obliczanie sumy zamówienia.
6. Symulowana finalizacja zamówienia.
7. Wydruk niefiskalnego paragonu bezpośrednio na drukarce Bluetooth.
8. Podstawowa obsługa błędów: brak połączenia, anulowanie wyboru urządzenia, błąd wydruku.
9. Krótkie instrukcje uruchomienia i testowania.

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
- Paragon jest drukowany z aplikacji na MX06 Mini Printer bez ręcznego eksportu i bez aplikacji pośredniczącej.
- Aplikacja działa na docelowym tablecie w obsługiwanej wersji Chrome.
- Instrukcja pozwala odtworzyć środowisko i przetestować podstawowe scenariusze.

## Zasady pracy

- Budujemy małymi, sprawdzalnymi krokami.
- Najpierw implementujemy i testujemy przepływ zamówienia, a następnie integrujemy drukowanie.
- Nie dodajemy infrastruktury ani usług płatnych bez wyraźnej potrzeby.
- Decyzje wpływające na architekturę zapisujemy w `docs/DECISIONS.md`.
- Po ukończeniu etapu uruchamiamy odpowiednie kontrole, np. `npm run lint` i `npm run build`, oraz tworzymy opisowy commit.
