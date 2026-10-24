# Hosting i CI/CD

## Docelowy model

- **CI:** GitHub Actions sprawdza kod po pushu do `main`, przy Pull Requestach do `main` i na żądanie.
- **CD:** Cloudflare Pages pobiera repozytorium z GitHuba, buduje aplikację Vite i publikuje ją pod adresem HTTPS.
- **Urządzenie:** tablet otwiera adres opublikowanej strony w Chrome. Nie instalujemy na nim serwera ani Node.js.

Cloudflare Pages z integracją Git obsługuje prywatne repozytoria i automatyczne wdrożenia po zmianach w repozytorium. Sprawdź aktualne ustawienia konta i limity planu przed wdrożeniem.

## CI w repozytorium

Workflow znajduje się w `.github/workflows/ci.yml`.

Kroki:
1. Checkout repozytorium.
2. Ustawienie Node.js 24.
3. Instalacja zależności przez `npm ci`.
4. `npm run lint`.
5. `npm run build`.

Wynik kompilacji Vite trafia do katalogu `dist/`. CI tylko sprawdza poprawność kodu; samo nie publikuje strony.

## Konfiguracja hostingu Cloudflare Pages

Jednorazowa konfiguracja wymaga zalogowania się do Cloudflare i autoryzacji dostępu do wybranego repozytorium GitHub. Tego kroku nie można wykonać wyłącznie przez commit w repozytorium.

1. Zaloguj się do panelu Cloudflare.
2. Otwórz **Workers & Pages** i wybierz utworzenie aplikacji typu **Pages** z integracją Git.
3. Połącz konto GitHub i udziel dostępu tylko do repozytorium `KwasnikMaciej/restaurant-pos`, jeśli interfejs pozwala ograniczyć zakres instalacji.
4. Wybierz repozytorium `restaurant-pos`.
5. Ustaw gałąź produkcyjną: `main`.
6. Ustaw konfigurację builda:
   - Framework preset: **Vite** (jeśli dostępny)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (katalog główny repozytorium)
7. Zapisz i uruchom pierwsze wdrożenie.
8. Zapisz wygenerowany adres HTTPS `*.pages.dev` — będzie to adres aplikacji na tablecie.

Nie konfiguruj na razie własnej domeny, zmiennych środowiskowych ani backendu.

## Jak wygląda codzienna praca

1. Zmieniasz kod lokalnie w VS Code.
2. Uruchamiasz `npm run lint` i `npm run build`.
3. Commitujesz i wysyłasz zmiany do GitHuba.
4. GitHub Actions wykonuje CI.
5. Cloudflare Pages automatycznie buduje i publikuje nową wersję z gałęzi `main`.
6. Odświeżasz stronę na tablecie.

Uwaga: w podstawowej konfiguracji integracja Cloudflare Pages buduje i publikuje niezależnie od workflow GitHub Actions. Jeśli chcemy bezwzględnie blokować produkcyjne wdrożenie, gdy CI nie przejdzie, należy później skonfigurować odpowiednią ochronę gałęzi / wymagane kontrole albo przenieść CD do workflow zależnego od sukcesu CI.

## Test na tablecie

Po wdrożeniu:
- otwórz adres `https://...` w Chrome na Androidzie;
- sprawdź, czy strona się ładuje;
- sprawdź, czy adres korzysta z HTTPS;
- później zweryfikuj Web Bluetooth z tej konkretnej domeny.

Web Bluetooth wymaga bezpiecznego kontekstu i wsparcia przez przeglądarkę/urządzenie. Test w środowisku lokalnym nie zastępuje testu pod opublikowanym adresem.

## Przydatne linki

- [Dokumentacja Vite — static deployment](https://vite.dev/guide/static-deploy)
- [Cloudflare Pages — integracja Git](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages — integracja z GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
