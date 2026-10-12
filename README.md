# Victor AI Sales Agent — interfață

Landing page public și dashboard privat demonstrativ, în română. HTML/CSS/JavaScript native, fonturi de sistem, fără dependențe runtime, imagini sau integrări AI/Gmail. Firmele sunt fictive; nu există bază de date.

## Pornire

Node.js 22 sau mai nou. Din directorul proiectului: `npm start`.
Landing page-ul este disponibil la portul 3000. Dashboard-ul răspunde cu 503 până la configurarea ambelor variabile `DASHBOARD_USER` și `DASHBOARD_PASSWORD`. Furnizează-le prin mediul procesului, fără a le salva în Git. Browserul solicită autentificare HTTP Basic la accesarea dashboard-ului.

`PORT` modifică portul; `HOST` modifică adresa de ascultare (implicit 127.0.0.1). Pentru găzduire este obligatoriu HTTPS printr-un reverse proxy și gestionarea sigură a credențialelor. HTTP Basic nu oferă un flux de deconectare în aplicație; browserul poate păstra credențialele până la închiderea sesiunii. Nu publica directorul `public` printr-un server static separat: protecția dashboard-ului este aplicată de `server.mjs`.

## Comportament demo

Navigarea, căutarea firmelor fictive, salvarea temporară a preferințelor și oprirea simulată funcționează local. Reîncărcarea paginii resetează starea. Niciun mesaj nu este trimis, nicio operațiune plătită nu este executată. Pagina publică afișează numai valori demonstrative și nu încarcă scriptul dashboard-ului.

## Verificări

`npm test` verifică accesul public, refuzul accesului neautorizat și accesul privat autorizat. Verificările browser și rapoartele de performanță sunt descrise în `VALIDATION.md`.

Nu s-a făcut publicarea. Integrarea cu o aplicație reală necesită un proiect separat autorizat.
