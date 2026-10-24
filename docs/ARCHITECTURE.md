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
    history/       # opcjonalna lokalna historia zamówień
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

Na początek menu może być stałą konfiguracją w kodzie. Stan bieżącego koszyka może pozostać w pamięci aplikacji. Trwała historia zamówień będzie dodana tylko wtedy, gdy zdecydujemy, że jest potrzebna w MVP.

Jeżeli potrzebny będzie zapis trwały, rozważymy `localStorage` dla prostych preferencji albo IndexedDB dla danych strukturalnych. Decyzję podejmiemy na podstawie wymagań.

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
