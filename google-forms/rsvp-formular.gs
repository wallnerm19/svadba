/**
 * ============================================================
 *  VYTVORENIE GOOGLE FORMULÁRA NA POTVRDENIE ÚČASTI (RSVP)
 * ============================================================
 *  Postup:
 *  1. Otvorte https://script.google.com → „Nový projekt“.
 *  2. Zmažte ukážkový kód a vložte celý tento súbor.
 *  3. Hore vyberte funkciu „vytvorFormular“ a kliknite „Spustiť“.
 *  4. Povoľte prístup (Google sa spýta na oprávnenia k Formulárom a Tabuľkám).
 *  5. V „Denníku vykonávania“ nájdete odkaz na formulár – ten s „/viewform“
 *     vložte do src/config/wedding.ts → rsvp.formUrl.
 *
 *  Skript vytvorí:
 *  • formulár so všetkými otázkami a vetvením (kto nepríde, preskočí detaily),
 *  • Google Tabuľku, do ktorej sa budú odpovede automaticky ukladať.
 *
 *  Texty upravíte v objekte NASTAVENIA nižšie. Ak skript spustíte znova,
 *  vytvorí sa NOVÝ formulár (starý ostane vo vašom Google Drive).
 * ============================================================
 */

const NASTAVENIA = {
  nazov: 'Potvrdenie účasti – Marek & Veronika',
  popis:
    'Milí naši,\n' +
    'budeme nesmierne radi, ak 30. apríla 2027 oslávite náš veľký deň s nami v Bašte Pajštún v Borinke.\n\n' +
    'Prosíme, vyplňte tento krátky formulár najneskôr do 31. marca 2027 – každý hosť alebo pár iba raz. ' +
    'Ak sa vaše plány zmenia, dajte nám vedieť.\n\n' +
    'Ďakujeme! Marek & Veronika',
  potvrdenie:
    'Ďakujeme, vaša odpoveď bola uložená! 💚\n' +
    'Tešíme sa na vás 30. apríla 2027 v Bašte Pajštún.\n\n' +
    'Marek & Veronika',
  nazovTabulky: 'Potvrdenie účasti – Marek & Veronika (odpovede)',
  maxPocetOsob: 6,
};

function vytvorFormular() {
  const form = FormApp.create(NASTAVENIA.nazov)
    .setDescription(NASTAVENIA.popis)
    .setConfirmationMessage(NASTAVENIA.potvrdenie)
    .setCollectEmail(false)
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false)
    .setAllowResponseEdits(true);

  // Hostia nepotrebujú Google účet (pri bežnom účte je to predvolené;
  // pri firemnom Google Workspace by sa inak vyžadovalo prihlásenie).
  try {
    form.setRequireLogin(false);
  } catch (e) {
    // Bežné (nie firemné) účty toto nastavenie nepodporujú – nevadí.
  }

  // ---------- 1. strana: kto ste a či prídete ----------
  form.addTextItem().setTitle('Meno').setRequired(true);
  form.addTextItem().setTitle('Priezvisko').setRequired(true);

  const ucast = form
    .addMultipleChoiceItem()
    .setTitle('Prídete na našu svadbu?')
    .setRequired(true);

  // ---------- 2. strana: detaily (len pre tých, ktorí prídu) ----------
  const stranaDetaily = form
    .addPageBreakItem()
    .setTitle('Detaily účasti')
    .setHelpText('Pomôže nám to pripraviť zasadací poriadok, menu aj ubytovanie.');

  const pocty = [];
  for (let i = 1; i <= NASTAVENIA.maxPocetOsob; i++) pocty.push(String(i));
  form
    .addListItem()
    .setTitle('Koľko osôb (vrátane vás) príde?')
    .setHelpText('Prosíme, uveďte len osoby, ktoré sú uvedené vo vašom pozvaní.')
    .setChoiceValues(pocty)
    .setRequired(true);

  form
    .addParagraphTextItem()
    .setTitle('Mená ďalších hostí')
    .setHelpText('Napr. partner/partnerka alebo deti, s ktorými prídete.');

  form
    .addTextItem()
    .setTitle('Prídete s deťmi? Uveďte počet a vek detí')
    .setHelpText('Napr. „2 deti – 4 a 7 rokov“. Ak nie, nechajte prázdne.');

  form
    .addCheckboxItem()
    .setTitle('Stravovanie')
    .setHelpText('Označte všetko, čo platí pre vás alebo vašich spoluhostí.')
    .setChoiceValues(['Bez obmedzení', 'Vegetariánske', 'Vegánske', 'Bezlepkové', 'Bez laktózy'])
    .showOtherOption(true);

  form
    .addParagraphTextItem()
    .setTitle('Alergie alebo iné obmedzenia')
    .setHelpText('Napr. orechy, morské plody… Kuchyňa sa im prispôsobí.');

  form
    .addMultipleChoiceItem()
    .setTitle('Budete mať záujem o ubytovanie v okolí?')
    .setChoiceValues(['Áno', 'Nie', 'Ešte neviem']);

  // ---------- 3. strana: odkaz (pre všetkých) ----------
  const stranaOdkaz = form.addPageBreakItem().setTitle('Odkaz pre nás');

  form
    .addParagraphTextItem()
    .setTitle('Chcete nám niečo odkázať?')
    .setHelpText('Pieseň, ktorú si chcete zatancovať, milé slovo alebo otázka – čokoľvek. 🙂');

  form
    .addTextItem()
    .setTitle('Kontakt (telefón alebo e-mail)')
    .setHelpText('Nepovinné – ak by sme vás potrebovali kontaktovať.');

  // Vetvenie: kto nepríde, preskočí detaily a ide rovno na odkaz.
  ucast.setChoices([
    ucast.createChoice('Áno, rád/rada prídem 🥂', stranaDetaily),
    ucast.createChoice('Žiaľ, nemôžem prísť', stranaOdkaz),
  ]);

  // Novšie formuláre vytvorené skriptom môžu byť predvolene nezverejnené – zverejníme ho.
  try {
    if (typeof form.setPublished === 'function') form.setPublished(true);
  } catch (e) {
    Logger.log('⚠️ Formulár sa nepodarilo zverejniť automaticky – kliknite vo formulári na „Zverejniť“.');
  }

  // Odpovede do Google Tabuľky
  const tabulka = SpreadsheetApp.create(NASTAVENIA.nazovTabulky);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, tabulka.getId());

  Logger.log('✅ Formulár je hotový!');
  Logger.log('👉 Odkaz pre hostí (vložte do wedding.ts → rsvp.formUrl):');
  Logger.log(form.getPublishedUrl());
  Logger.log('✏️ Úprava formulára: ' + form.getEditUrl());
  Logger.log('📊 Tabuľka s odpoveďami: ' + tabulka.getUrl());
}
