# Verificări executate

Mediu: Node 24.19.0, Chromium 154.0.8037.57 (Linux), Lighthouse 13.5.0. Testare locală, headless, profil Lighthouse mobil implicit (simulare rețea/CPU) și profil desktop. Rezultatele reprezintă câte o rulare de laborator; nu garantează performanța unei găzduiri viitoare.

| Pagină / profil | Performance | Accessibility | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- |
| Landing / mobil | 100 | 100 | 0,906 s | 0 | 0 ms |
| Landing / desktop | 100 | 100 | 0,242 s | 0 | 0 ms |
| Dashboard / mobil | 99 | 100 | 0,957 s | 0,069 | 0 ms |

Profilul desktop a fost măsurat înainte de adăugarea faviconului și înlocuirea săgeților tipografice cu SVG. Profilurile mobile au fost măsurate după aceste corecții. INP real nu a fost validat: necesită măsurători ale interacțiunilor în utilizare reală; TBT nu este INP.

- `npm test`: 6 teste trecute, 0 eșuate; acces public, protecție dashboard/script, credențiale greșite, lipsa configurării, antete și rute/metode refuzate.
- Chromium + Playwright: 390, 768 și 1440 px; fără overflow orizontal pe ambele pagini. Navigarea în toate cele șase secțiuni, căutarea cu/fără rezultate, oprirea simulată și salvarea preferințelor temporare au trecut.
- Axe: zero încălcări detectate pentru WCAG 2 A/AA și 2.1 AA pe landing și overview, la toate cele trei lățimi. Acesta nu este un audit complet de accesibilitate.
- Consolă: zero erori în ultima rulare la cele trei lățimi.
- Capturi desktop și mobil inspectate vizual. Fonturi de sistem, fără cereri pentru fonturi externe. Preferința de mișcare redusă este respectată în CSS și folosită în verificarea browser.

## Reproducere

Din rădăcina proiectului, instalează exclusiv instrumentele de verificare în afara aplicației:

```sh
npm install --prefix /tmp/victor-checks --cache /tmp/victor-npm-cache --no-audit --no-fund playwright-core @axe-core/playwright lighthouse@13.5.0
```

Pornește serverul separat, cu `PORT=3001`, `DASHBOARD_USER` și `DASHBOARD_PASSWORD` configurate pentru test. Apoi:

```sh
npm test
TEST_USER="$DASHBOARD_USER" TEST_PASSWORD="$DASHBOARD_PASSWORD" node scripts/check-browser.mjs
/tmp/victor-checks/node_modules/.bin/lighthouse http://127.0.0.1:3001/ --chrome-path=/usr/bin/chromium --chrome-flags='--headless --no-sandbox' --only-categories=performance,accessibility --output=json --output-path=/tmp/victor-checks/lighthouse-mobile.json --quiet
```

Pentru desktop adaugă `--preset=desktop`. Pentru dashboard folosește `/dashboard` și un antet Authorization pentru contul de test prin opțiunea Lighthouse `--extra-headers`; nu introduce credențiale reale în istoricul shell sau în rapoarte. Scriptul browser folosește implicit credențiale fictive de test; suprascrie-le prin `TEST_USER` / `TEST_PASSWORD`. `TEST_URL` permite schimbarea adresei, `TEST_TOOLS` schimbarea directorului instrumentelor. Capturile și rezultatele brute se află în `/tmp/victor-checks` în mediul curent.

Autentificarea privată este HTTP Basic pe server. Publicarea necesită HTTPS. Nu există integrare AI, Gmail, bază de date sau agent real; toate interacțiunile administrative sunt demo.
