# Sito Pegaso Gym

Sito web multi-pagina realizzato per Pegaso Gym, partendo dagli screenshot del profilo
Instagram **@palestra_pegaso** (logo, palette nero/rosso, foto reali della sala pesi,
del corso di Pilates e del merchandising).

Non è un sito ufficiale della palestra: è una proposta pronta per essere personalizzata
e pubblicata.

## Struttura

```
pegaso-gym/
├── index.html        Home
├── corsi.html         Corsi & aree allenamento
├── shop.html           Shop merch (carrello + ordine WhatsApp)
├── chi-siamo.html   Chi siamo
├── contatti.html     Contatti + form
├── css/style.css      Stile (tema nero/rosso)
├── js/main.js           Menu mobile, carrello, checkout WhatsApp
├── img/                    Foto reali ritagliate dagli screenshot Instagram
└── video/                Video hero della Home (pegaso-hero.mp4 / .webm)
```

Sito statico: nessun server o build necessari. Basta aprire `index.html` in un browser,
oppure pubblicarlo online (vedi sotto).

## Cosa completare prima di pubblicare

Ho lasciato dei **segnaposto in rosso tratteggiato** ovunque mancava un'informazione
reale. Cercali in tutti i file (nel testo compaiono tra `[parentesi quadre]`):

1. **Indirizzo e telefono** — footer di ogni pagina + pagina Contatti (`contatti.html`).
2. **Numero WhatsApp per lo shop** — apri `js/main.js` e sostituisci:
   ```js
   const WHATSAPP_NUMBER = "39XXXXXXXXXX"; // es. 393331234567
   ```
   con il numero reale (senza `+` né spazi). Aggiorna anche il link "Scrivici su
   WhatsApp" in `contatti.html`.
3. **Email di contatto** — sostituisci `info@pegasogym.it` nel form di `contatti.html`
   e nei footer.
4. **Mappa** — in `contatti.html` c'è un riquadro segnaposto al posto della mappa:
   una volta noto l'indirizzo, sostituiscilo con un iframe Google Maps
   (`Condividi → Incorpora mappa` da Google Maps).
5. **Prezzi e abbonamenti** — promo in alto (`topbar`), prezzi dei prodotti in
   `js/main.js` (array `PRODUCTS`) e sezione abbonamenti.
6. **Calendario corsi** — orari precisi delle lezioni di Pilates (e altri corsi) in
   `corsi.html`.
7. **Città** — compare in tutti i footer ("nel cuore della città ___").

## Shop / carrello

Il catalogo prodotti (nome, prezzo, immagine, taglie) è definito nell'array
`PRODUCTS` in `js/main.js`. Per aggiungere, togliere o modificare un prodotto basta
modificare quell'array — la pagina `shop.html` si aggiorna da sola.

Il carrello viene salvato nel browser di chi visita il sito (localStorage). Al
checkout si apre WhatsApp con un messaggio già pronto con l'elenco degli articoli,
le taglie e il totale.

## Immagini

Tutte le immagini in `img/` sono foto reali ritagliate dagli screenshot del profilo
Instagram della palestra (non foto stock). Se in futuro la palestra fornisce foto
professionali a risoluzione più alta, basta sostituire i file mantenendo lo stesso
nome, oppure aggiornare i riferimenti nelle pagine HTML.

## Pubblicare il sito online

Il modo più semplice e gratuito è **GitHub Pages**:

1. Crea un repository su GitHub (es. `pegaso-gym`).
2. Carica tutti i file di questa cartella nel repository.
3. Vai su *Settings → Pages*, seleziona il branch principale e la cartella `/root`.
4. Dopo qualche minuto il sito sarà online su `https://<tuo-utente>.github.io/pegaso-gym/`.

In alternativa funziona con qualunque hosting statico (Netlify, Vercel, hosting
condiviso classico via FTP): basta caricare il contenuto di questa cartella così com'è.
