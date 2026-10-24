# Hosting i CI/CD

## Docelowy model

- **CI:** GitHub Actions sprawdza kod po pushu do `main`, przy Pull Requestach do `main` i na żądanie.
- **CD:** ten sam workflow publikuje aplikację na GitHub Pages dopiero po udanym lintowaniu i buildzie.
- **Urządzenie:** tablet otwiera stronę przez HTTPS w Chrome. Nie instalujemy na nim serwera ani Node.js.

GitHub Pages jest bezpłatne dla publicznego repozytorium na GitHub Free. Kod repozytorium jest publiczny, a opublikowana aplikacja dostępna publicznie.

## CI/CD w repozytorium

Workflow znajduje się w `.github/workflows/ci.yml`.

1. Checkout repozytorium.
2. Ustawienie Node.js 24.
3. Instalacja zależności przez `npm ci`.
4. `npm run lint`.
5. `npm run build`.
6. Przekazanie katalogu `dist/` jako artefaktu Pages.
7. Po sukcesie walidacji na gałęzi `main`: publikacja na GitHub Pages.

Pull Requesty uruchamiają lint i build, ale nie publikują strony. Wdrożenie nie nastąpi, jeśli walidacja zakończy się błędem.

## Jednorazowa konfiguracja GitHub Pages

1. Otwórz [Settings → Pages w repozytorium](https://github.com/KwasnikMaciej/restaurant-pos/settings/pages).
2. W sekcji **Build and deployment** ustaw **Source: GitHub Actions**.
3. Zapisz zmianę, jeśli GitHub pokazuje przycisk zapisu.
4. Otwórz zakładkę **Actions** i wybierz workflow **CI and Deploy**.
5. Sprawdź przebieg uruchomiony przez ostatni push do `main`. Poczekaj, aż zadania walidacji i wdrożenia zakończą się sukcesem.
6. Wróć do **Settings → Pages**. GitHub pokaże adres opublikowanej strony.

Oczekiwany adres projektu: [https://kwasnikmaciej.github.io/restaurant-pos/](https://kwasnikmaciej.github.io/restaurant-pos/).

## Jak wygląda codzienna praca

1. Zmieniasz kod lokalnie w VS Code.
2. Przed commitem możesz uruchomić `npm run lint` i `npm run build`.
3. Commitujesz i wysyłasz zmiany na GitHuba.
4. GitHub Actions sprawdza kod.
5. Jeśli push trafił na `main` i walidacja się powiedzie, workflow publikuje nową wersję.
6. Odświeżasz stronę na tablecie.

## Ważne: ścieżka Vite

W `vite.config.ts` ustawiono `base: '/restaurant-pos/'`, ponieważ aplikacja jest publikowana pod ścieżką repozytorium, a nie bezpośrednio pod domeną `github.io`.

## Test na tablecie

Po wdrożeniu:
- otwórz adres HTTPS w Chrome na Androidzie;
- sprawdź, czy strona się ładuje;
- później zweryfikuj Web Bluetooth z tej konkretnej domeny.

Web Bluetooth wymaga bezpiecznego kontekstu i wsparcia przez przeglądarkę/urządzenie. Test w środowisku lokalnym nie zastępuje testu pod opublikowanym adresem.

## Przydatne linki

- [Dokumentacja Vite — static deployment](https://vite.dev/guide/static-deploy)
- [GitHub Pages — źródło publikacji](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
