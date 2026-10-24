# Restaurant POS

Minimalna aplikacja POS na tablet z Androidem do symulowania zamówień restauracyjnych. Docelowo umożliwi wybór dań i napojów, podsumowanie zamówienia oraz bezpośredni wydruk niefiskalnego paragonu na drukarce Bluetooth.

## Status

Projekt jest na etapie konfiguracji fundamentów. Aplikacja React + TypeScript + Vite uruchamia się lokalnie. Połączenie i testowy wydruk na drukarce `MX06 Mini Printer` zostały sprawdzone osobno w Chrome na Androidzie 16; integracja drukarki z aplikacją nie jest jeszcze zaimplementowana.

## Dokumentacja

- [Założenia projektu i zakres MVP](docs/PROJECT-OVERVIEW.md)
- [Plan prac i checklista](docs/ROADMAP.md)
- [Architektura początkowa](docs/ARCHITECTURE.md)
- [Rejestr decyzji technicznych](docs/DECISIONS.md)
- [Hosting i CI/CD](docs/DEPLOYMENT.md)
- [Indeks dokumentacji](docs/README.md)

## Wymagania

- Node.js i npm
- Git
- Przeglądarka wspierająca funkcje używane przez aplikację
- Do testów drukowania: tablet z Androidem 16, Chrome i drukarka `MX06 Mini Printer`

## Uruchomienie lokalne

W katalogu projektu:

```powershell
npm install
npm run dev
```

Vite pokaże adres lokalny, zwykle `http://localhost:5173/`.

## Kontrole

```powershell
npm run lint
npm run build
```

## CI/CD i hosting

Workflow GitHub Actions znajduje się w `.github/workflows/ci.yml` i wykonuje lint oraz build. Instrukcja jednorazowej konfiguracji hostingu i publikacji strony znajduje się w [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Sam hosting wymaga jednorazowego połączenia konta GitHub z dostawcą hostingu.

## Ważne ograniczenia

- Płatność jest wyłącznie symulowana.
- Aplikacja nie obsługuje fiskalizacji i nie generuje paragonów fiskalnych.
- MVP nie wymaga backendu ani kont użytkowników.
- Bezpośredni wydruk zależy od wsparcia Web Bluetooth w docelowej przeglądarce oraz od protokołu konkretnej drukarki. Nie zakładamy zgodności z ESC/POS bez potwierdzenia.
- Jeśli aplikacja będzie hostowana zdalnie, Web Bluetooth wymaga bezpiecznego kontekstu, zwykle HTTPS.

## Workflow Git

- `main` ma zawierać działającą wersję.
- Większe funkcjonalności rozwijamy na gałęziach `feature/nazwa`.
- Przed zakończeniem etapu uruchamiamy lint i build oraz tworzymy opisowy commit.
