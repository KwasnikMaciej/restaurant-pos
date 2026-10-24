# Architektura — wersja początkowa

## Zasady

- Bez backendu i bez infrastruktury dodatkowej w MVP.
- Logika zamówienia powinna być niezależna od interfejsu i drukarki.
- Dostęp do Bluetooth i protokołu drukarki izolujemy w osobnym module.
- Ceny przechowujemy w całkowitych groszach, aby uniknąć błędów arytmetyki zmiennoprzecinkowej.
- Stan koszyka i zamówienia powinien mieć jednoznaczny model TypeScript.
- Nie zapisujemy danych płatniczych — płatność jest symulowana.
- Drukowanie może się nie udać niezależnie od finalizacji zamówienia; UI powinien rozróżniać te stany.

## Proponowany podział modułów

Struktura docelowa, do wdrożenia stopniowo — nie oznacza, że wszystkie katalogi już istnieją:

```text
src/
  app/             # punkt wejścia i kompozycja głównego ekranu
  features/
    menu/          # menu, kategorie i wybór produktów
    order/         # koszyk, pozycje i obliczenia
    checkout/      # podsumowanie i symulowana finalizacja
    history/       # historia zamówień przechowywana lokalnie
  printing/        # Web Bluetooth i adapter protokołu drukarki
  storage/         # lokalny zapis, jeśli potrzebny
```

Nie tworzymy wszystkich warstw na zapas. Dodajemy je, gdy pojawi się odpowiadająca im funkcjonalność.

## Główne przepływy

### Zamówienie

1. Użytkownik wybiera produkt z menu.
2. Logika koszyka dodaje pozycję lub zwiększa jej ilość.
3. UI pokazuje ilości i sumę obliczoną na podstawie cen w groszach.
4. Użytkownik przegląda podsumowanie i wybiera symulowaną finalizację.
5. Aplikacja tworzy dane zamówienia.
6. Aplikacja próbuje wydrukować niefiskalny paragon.
7. UI komunikuje osobno status zamówienia i status wydruku.

### Drukowanie

1. Użytkownik inicjuje połączenie z drukarką (wymagania Web Bluetooth mogą wymagać gestu użytkownika).
2. Aplikacja wybiera urządzenie i usługę / charakterystykę zgodnie z faktycznym protokołem drukarki.
3. Warstwa drukowania formatuje paragon i przesyła dane.
4. Błędy połączenia lub transmisji są obsługiwane i komunikowane użytkownikowi.

Szczegóły protokołu nie są jeszcze zatwierdzone. Nie zakładamy zgodności z ESC/POS bez weryfikacji.

## Przechowywanie danych

Menu pozostaje stałą konfiguracją w kodzie, a koszyk w pamięci aplikacji. Ukończone zamówienia są przechowywane w `localStorage` pod kluczem `franczesko:order-history`; numer ostatniego zamówienia nadal jest zapisany pod `franczesko:last-order-number` dla zachowania ciągłości numeracji. Historia przechowuje maksymalnie 100 ostatnich zamówień wraz z pozycjami, cenami, sumą i datą. Dane są lokalne dla danej przeglądarki i urządzenia — nie synchronizują się z innymi urządzeniami. Jeśli zapis historii się nie powiedzie, aplikacja informuje użytkownika, a zamówienie pozostaje dostępne w bieżącej sesji.

## Uruchamianie i ograniczenia przeglądarki

- W trakcie lokalnego developmentu Vite zwykle działa pod `http://localhost:5173`.
- Web Bluetooth wymaga bezpiecznego kontekstu (zwykle HTTPS; localhost jest wyjątkiem dla developmentu) oraz przeglądarki i urządzenia, które obsługują wymagane API.
- Należy sprawdzić zachowanie na docelowym tablecie i wersji Chrome, nie tylko na komputerze.
- Hostowanie aplikacji pod HTTPS będzie potrzebne, jeśli nie będzie uruchamiana lokalnie w bezpiecznym kontekście.

## Kontrole jakości

Przed większym commitem uruchamiamy:

```powershell
npm run lint
npm run build
```

Dalsze testy automatyczne dodamy wraz z logiką koszyka i zamówienia.


## Stoliki i rachunki

- Jeden otwarty rachunek jest przypisany do stolika; status stolika wynika z istnienia rachunku `open`.
- Kolejne pozycje dopisujemy do tego samego rachunku, zachowując jego numer.
- Rozliczenie jest osobną operacją, zapisuje metodę `cash` lub `card` i czas rozliczenia.
- Płatność jest symulowana; nie przechowujemy danych karty i nie komunikujemy się z terminalem.
