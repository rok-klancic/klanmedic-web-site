// Klanmedic site search index. Hand-maintained.
//
// WHEN YOU ADD A PAGE, A CARD (subservices item) OR A PRICE-LIST SECTION,
// ADD AN ENTRY HERE. Loaded lazily by the header search (src/js/main.js,
// siteHeader) the first time the search icon is clicked. It is a JS file
// rather than a .json so search also works when pages are opened from disk.
//
// Entry fields
//   title    Result title (what the visitor sees first).
//   section  Meta line prefix: the page/group the entry lives in.
//   url      Path from the site root (no ./ or ../ — the header adds the
//            right prefix for the current page depth). Card entries use
//            "#sub-<slug>": opening that URL expands the card.
//   desc     One line from the page's own copy.
//   keywords Words taken from the page's copy (device names, bullets, ...).
//   syn      Optional. Colloquial synonyms and spellings the copy does not
//            use (e.g. "mozolji" for "akne"). Written by hand — review them.
//
// Matching ignores case and diacritics ("ciscenje" finds "čiščenje"), so no
// need to repeat words without diacritics.
//
// Keep whole-page entries generic. Specific terms belong on the card entries,
// so a search such as "invisalign" ranks the card first.

window.KLANMEDIC_SEARCH = [
  // ---------------------------------------------------------------- Pages
  {
    title: "Domov",
    section: "Klanmedic",
    url: "index.html#home",
    desc: "Zdravje. Lepota. Vitalnost.",
    keywords:
      "Klanmedic medicinski center estetska medicina zobozdravstvo gastroenterologija",
    syn: "domača stran začetna stran",
  },
  {
    title: "Zobozdravstvo",
    section: "Storitve",
    url: "storitve/zobozdravstvo.html",
    desc: "Celovita zobozdravstvena obravnava — od preventivnih pregledov do estetskih rešitev.",
    keywords: "zobozdravstvo zobna ambulanta",
    syn: "zobar zobozdravnik zobje",
  },
  {
    title: "Gastroenterologija",
    section: "Storitve",
    url: "storitve/interna-medicina.html",
    desc: "Ambulanta je namenjena odkrivanju in zdravljenju bolezni trebuha (želodca, črevesja, hemoroidov, analnega srbeža, žolčnika in žolčnih kamnov ter trebušne slinavke).",
    keywords: "gastroenterologija gastroenterološka ambulanta interna medicina",
    syn: "gastroenterolog želodec črevesje prebava trebuh",
  },
  {
    title: "Estetika",
    section: "Storitve",
    url: "storitve/estetika.html",
    desc: "Medicinsko vodene estetske storitve z vrhunskimi, CE certificiranimi aparati — nežno, varno in učinkovito.",
    keywords: "estetika estetska medicina KlanMedic Estetika",
    syn: "lepota",
  },
  {
    title: "Oblikovanje telesa",
    section: "Estetika",
    url: "storitve/estetika/oblikovanje-telesa.html",
    desc: "Zmanjšanje maščobe, tonus kože in mišic, strije in celulit, vodena vadba.",
    keywords: "oblikovanje telesa oblikovanje postave",
    syn: "postava telo",
  },
  {
    title: "Zdravljenje debelosti",
    section: "Estetika",
    url: "storitve/estetika/ambulanta-debelost.html",
    desc: "V naši ambulanti celostno, strokovno in individualno pomagamo pri izgubi telesne teže, izboljšanju zdravja ter oblikovanju postave.",
    keywords: "zdravljenje debelosti ambulanta za debelost izguba telesne teže hipnoza",
    syn: "hujšanje shujševanje kilogrami prekomerna teža",
  },
  {
    title: "Nega in pomlajevanje kože",
    section: "Estetika",
    url: "storitve/estetika/nega-koze.html",
    desc: "Pomlajevanje kože, akne, hiperpigmentacije, kuperoza, brazgotine, lasersko odstranjevanje dlak.",
    keywords: "nega kože pomlajevanje kože analiza kože",
    syn: "obraz koža",
  },
  {
    title: "Stimulacija rasti las",
    section: "Estetika",
    url: "storitve/estetika/lasje.html",
    desc: "Izvajamo terapije pri zmanjšanju kvalitete las, povečanem izpadanju las in plešavosti.",
    keywords:
      "stimulacija rasti las izpadanje las plešavost analiza las lasišča HaiRestart Dermapen 4 eksosomi MG-EXO-GROW PRP rastni faktorji Dermalux TriWave",
    syn: "lasje lasišče alopecija izpadanje las",
  },
  {
    title: "Laserske terapije",
    section: "Estetika",
    url: "storitve/estetika/laserske-terapije.html",
    desc: "Laser SP Dynamis in StarWalker MaQX Fotona: lasje, dlake, žilice, tetovaže, pomlajevanje, ustnice, pigmentacije, strije, brazgotine, bradavice, znamenja, nohti, smrčanje.",
    keywords: "laserske terapije laser Fotona SP Dynamis StarWalker MaQX",
    syn: "laserji",
  },
  {
    title: "Magnetne terapije",
    section: "Estetika",
    url: "storitve/estetika/magnetne-terapije.html",
    desc: "Pri funkcionalni magnetni stimulaciji na stolu Magneto Stym stimuliramo mišice medeničnega dna in hrbta.",
    keywords:
      "magnetne terapije funkcionalna magnetna stimulacija Magneto Stym urinska inkontinenca fekalna inkontinenca mišice medeničnega dna prolaps medeničnih organov hemoroidi kronični prostatitis poporodna regeneracija",
    syn: "inkontinenca uhajanje urina magnetno polje prostata",
  },
  {
    title: "Hiperbarične kisikove terapije",
    section: "Estetika",
    url: "storitve/estetika/hiperbaricna-terapija.html",
    desc: "Pri terapiji dihamo 90–100 % kisik na povišanem tlaku.",
    keywords:
      "hiperbarična kisikova terapija komora OXY kisik povišan tlak stres izgorelost spanje utrujenost glavobol migrena regeneracija po poškodbah in operacijah celjenje ran",
    syn: "kisikova komora kisik hiperbarična komora",
  },
  {
    title: "Fotobiomodulacija (PBM)",
    section: "Estetika",
    url: "storitve/estetika/fotobiomodulacija.html",
    desc: "Fotobiomodulacija je terapija, pri kateri uporabljamo svetlobo točno določenih valovnih dolžin za povečano produkcijo energije (ATP) v mitohondrijih celic.",
    keywords:
      "fotobiomodulacija PBM Dermalux TriWave SP Dynamis Fotona sklepno-mišične bolečine celjenje ran sindrom pekočih ust nevralgije vnetja ustne sluznice onkološko zdravljenje",
    syn: "svetlobna terapija LED terapija",
  },
  {
    title: "Naročanje",
    section: "Informacije",
    url: "narocanje.html",
    desc: "Gastroenterološka ambulanta, zobna ambulanta in KlanMedic Estetika — e-pošta in telefon za naročanje.",
    keywords:
      "naročanje z napotnico samoplačniki info@klanmedic.si lucija.klancic@klanmedic.si estetika@klanmedic.si 05 99 12340 041 442 901 051 415 868 031 391 662 Cesta Prekomorskih brigad 3 b Šempeter pri Gorici",
    syn: "kontakt kontakti telefon telefonska številka e-pošta email naslov naročilo termin rezervacija",
  },
  {
    title: "Urnik",
    section: "Informacije",
    url: "urnik.html",
    desc: "Delovni časi ambulant in čakalne dobe.",
    keywords: "urnik delovni časi čakalne dobe",
    syn: "ura",
  },
  {
    title: "Delovni časi",
    section: "Urnik",
    url: "urnik.html#delovni-casi",
    desc: "Urnik naročanja, zobna ambulanta in gastroenterološka ambulanta po dnevih.",
    keywords:
      "ponedeljek torek sreda četrtek petek 12:00–20:00 8:00–15:00 samoplačniki po dogovoru",
    syn: "odpiralni čas odpiralni časi delovni čas obratovalni čas ura kdaj ste odprti",
  },
  {
    title: "Čakalne dobe",
    section: "Urnik",
    url: "urnik.html#cakalne-dobe",
    desc: "Čakalne dobe za zobno in gastroenterološko ambulanto.",
    keywords:
      "prvi pregled protetika gastroskopija ezofagodastroduodenskopija EGDSK kolonoskopija SVIT UZ trebuha zelo hitro hitro redno",
    syn: "čakalna doba čakalna vrsta koliko se čaka",
  },
  {
    title: "Cenik",
    section: "Informacije",
    url: "cenik.html",
    desc: "Cenik po skupinah: oblikovanje telesa, vodena vadba, dobro počutje, nega obraza, magnetne in laserske terapije.",
    keywords: "cenik cene",
    syn: "cena koliko stane stroški",
  },

  // ----------------------------------------------- Zobozdravstvo (cards)
  {
    title: "Estetsko zobozdravstvo",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-estetsko-zobozdravstvo",
    desc: "Beljenje zob (klasično in lasersko), keramične fasete, polne keramične prevleke.",
    keywords:
      "estetsko zobozdravstvo beljenje zob klasično lasersko keramične fasete polne keramične prevleke",
    syn: "beli zobje bel nasmeh lep nasmeh",
  },
  {
    title: "Implantologija",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-implantologija",
    desc: "Z vsadki nadomeščamo posamezne ali več manjkajočih zob.",
    keywords:
      "implantologija vsadki brezzobe čeljusti dvig sinusnega dna kost sistem Advan fiksni snemni protetični nadomestki",
    syn: "implantat implantati zobni vsadek manjkajoč zob",
  },
  {
    title: "Ortodontija",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-ortodontija",
    desc: "Invisalign opornice so udobne, snemljive, skoraj nevidne in ne vplivajo na vaše vsakodnevno življenje.",
    keywords:
      "ortodontija sistem Invisalign opornice premik zob popoln nasmeh 3D posnetek zob plan terapij",
    syn: "zobni aparat ravnanje zob zobna opornica",
  },
  {
    title: "Endodontija",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-endodontija",
    desc: "Vse posege izvajamo z mikroskopom, sistemom za strojno širjenje kanalov in UZ irigacijo.",
    keywords: "endodontija mikroskop strojno širjenje kanalov UZ irigacija",
    syn: "zdravljenje kanalov koreninski kanal",
  },
  {
    title: "Zobna protetika",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-zobna-protetika",
    desc: "Opremljeni smo s 3D intraoralnim skenerjem 3Shape TRIOS 3.",
    keywords:
      "zobna protetika snemna fiksna na vsadkih 3D intraoralni skener 3Shape TRIOS 3",
    syn: "zobna proteza proteze",
  },
  {
    title: "Preventivno zobozdravstvo",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-preventivno-zobozdravstvo",
    desc: "Odstranjevanje trdih in mehkih zobnih oblog, peskanje, kiretaža žepkov, laserska dezinfekcija.",
    keywords:
      "preventivno zobozdravstvo zobne obloge peskanje kiretaža žepkov ob zobeh in vsadkih laserska dezinfekcija",
    syn: "čiščenje zob zobni kamen ustna higiena",
  },
  {
    title: "A-PRF centrifuga",
    section: "Zobozdravstvo",
    url: "storitve/zobozdravstvo.html#sub-a-prf-centrifuga",
    desc: "PRF – s trombociti bogati fibrinski čepi so bogat vir rastnih faktorjev in celic, ki vplivajo na celjenje in obnovo tkiv.",
    keywords:
      "A-PRF PRF centrifuga trombociti fibrinski čepi rastni faktorji celjenje rane volumen kosti implantologija",
    syn: "",
  },

  // ------------------------------------------- Gastroenterologija (cards)
  {
    title: "Nazalna in klasična gastroskopija",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-gastroskopija",
    desc: "Gastroskopija je preiskava, pri kateri pregledamo sluznico požiralnika, želodca in dvanajstnika.",
    keywords:
      "gastroskopija nazalna transnazalna skozi nos skozi usta požiralnik želodec dvanajstnik Helicobacter pylori celiakija vzorci",
    syn: "pregled želodca endoskopija",
  },
  {
    title: "Kolonoskopija",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-kolonoskopija",
    desc: "Kolonoskopija je preiskava, ki omogoča natančen pregled sluznice spodnjega dela prebavil.",
    keywords:
      "kolonoskopija debelo črevo tanko črevo CAD EYE umetna inteligenca AI polipi",
    syn: "pregled črevesja endoskopija",
  },
  {
    title: "Ultrazvočna preiskava trebuha",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-ultrazvocna-preiskava-trebuha",
    desc: "Ultrazvočno preiskavo uporabljamo pri ugotavljanju bolezenskih sprememb v trebušni votlini.",
    keywords:
      "ultrazvočna preiskava trebuha UZ trebuha trebušna votlina togost jeter zamaščenost jeter",
    syn: "ultrazvok jetra",
  },
  {
    title: "Anoskopija",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-anoskopija",
    desc: "Anoskopija je pregled analnega kanala in začetnega dela rektuma.",
    keywords: "anoskopija analni kanal rektum hemoroidi",
    syn: "",
  },
  {
    title: "Sedacija",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-sedacija",
    desc: "Sedacija je postopek, pri katerem pacientu med posegom dovajamo protibolečinsko terapijo.",
    keywords: "sedacija protibolečinska terapija propofol anesteziolog",
    syn: "anestezija uspavanje",
  },
  {
    title: "Testiranja",
    section: "Gastroenterologija",
    url: "storitve/interna-medicina.html#sub-testiranja",
    desc: "Dihalni test za določitev bakterije Helicobacter pylori, krvni test za celiakijo, kalprotektin v blatu.",
    keywords:
      "testiranja dihalni test Helicobacter pylori krvni test celiakija testiranje blata kalprotektin biokemična analiza krvi",
    syn: "test na celiakijo test blata",
  },

  // ---------------------------------------- Oblikovanje telesa (cards)
  {
    title: "Zmanjšanje maščobe",
    section: "Oblikovanje telesa",
    url: "storitve/estetika/oblikovanje-telesa.html#sub-zmanjsanje-mascobe",
    desc: "Za zmanjševanje maščobe na posameznem predelu telesa uporabljamo ultrazvočno razbijanje maščobnih celic.",
    keywords:
      "zmanjšanje maščobe Sonic Shaper Iskra Medical TightSculpting SP Dynamis Fotona maščobne obloge trebuh stegna kolena roke podbradek",
    syn: "liposukcija debelina salo",
  },
  {
    title: "Povečanje tonusa kože in mišične mase",
    section: "Oblikovanje telesa",
    url: "storitve/estetika/oblikovanje-telesa.html#sub-tonus-koze-in-misic",
    desc: "Za dodajanje definicije in povečanje mišične mase uporabljamo funkcionalno magnetno stimulacijo mišic.",
    keywords:
      "tonus kože mišična masa Tesla Former Iskra Medical radiofrekvenčna terapija Cryo Derm laser SP Dynamis Fotona učvrstitev kože",
    syn: "mišice učvrstitev",
  },
  {
    title: "Zmanjševanje strij in celulita",
    section: "Oblikovanje telesa",
    url: "storitve/estetika/oblikovanje-telesa.html#sub-strije-in-celulit",
    desc: "Za zmanjševanje videza strij in izboljšanja videza kože uporabljamo lasersko terapijo z SP Dynamis Fotona.",
    keywords:
      "strije celulit Sonic Shaper Cryo Derm TightSculpting ultrazvočno razbijanje maščobnih celic radiofrekvenčna terapija",
    syn: "celulitis pomarančna koža",
  },
  {
    title: "Vodena vadba",
    section: "Oblikovanje telesa",
    url: "storitve/estetika/oblikovanje-telesa.html#sub-vodena-vadba",
    desc: "Vodene vadbe izvajamo individualno s trenerko na vibracijski plošči Power Plate PRO7 HC in vibracijskem kolesu Power Plate REV.",
    keywords:
      "vodena vadba trenerka vibracijska plošča vibracijsko kolo Power Plate PRO7 HC Power Plate REV",
    syn: "vadba telovadba trening",
  },

  // --------------------------------------- Zdravljenje debelosti (cards)
  {
    title: "Zdravljenje z zdravili",
    section: "Zdravljenje debelosti",
    url: "storitve/estetika/ambulanta-debelost.html#sub-zdravljenje-z-zdravili",
    desc: "Pod zdravniškim nadzorom izvajamo zdravljenje debelosti z registriranimi zdravili.",
    keywords: "zdravljenje debelosti zdravila registrirana zdravila Wegovy Mounjaro",
    syn: "hujšanje zdravila za hujšanje",
  },
  {
    title: "Želodčni balon",
    section: "Zdravljenje debelosti",
    url: "storitve/estetika/ambulanta-debelost.html#sub-zelodcni-balon",
    desc: "Nekirurška metoda za pomoč pri zmanjševanju telesne teže.",
    keywords: "želodčni balon občutek lakote nadzor vnosa hrane prehranske navade",
    syn: "balon hujšanje",
  },
  {
    title: "Neinvazivni tretmaji za oblikovanje telesa",
    section: "Zdravljenje debelosti",
    url: "storitve/estetika/ambulanta-debelost.html#sub-neinvazivni-tretmaji",
    desc: "Po izgubi telesne teže ali kot podpora procesu hujšanja nudimo sodobne neinvazivne tretmaje za oblikovanje telesa.",
    keywords:
      "neinvazivni tretmaji maščobne obloge stimulacija mišic učvrstitev kože celulit lasersko oblikovanje postave radiofrekvenčna terapija vakuumska terapija limfna drenaža ultrazvočno zmanjševanje maščob funkcionalna magnetna stimulacija mišic",
    syn: "liposukcija",
  },
  {
    title: "Nutricionistično svetovanje",
    section: "Zdravljenje debelosti",
    url: "storitve/estetika/ambulanta-debelost.html#sub-nutricionisticno-svetovanje",
    desc: "Naša izkušena nutricionistka pripravi individualni prehranski načrt glede na potrebe posameznika.",
    keywords:
      "nutricionistično svetovanje nutricionistka prehranski načrt prehranske navade prenajedanje diete",
    syn: "prehrana dietetik dieta",
  },
  {
    title: "Strokovno vodena vadba",
    section: "Zdravljenje debelosti",
    url: "storitve/estetika/ambulanta-debelost.html#sub-strokovno-vodena-vadba",
    desc: "Gibanje je ključni del uspešnega hujšanja in dolgoročnega vzdrževanja rezultatov.",
    keywords: "strokovno vodena vadba program vadbe telesna pripravljenost",
    syn: "vadba telovadba trening",
  },

  // ------------------------------------ Nega in pomlajevanje kože (cards)
  {
    title: "Pomlajevanje kože",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-pomlajevanje-koze",
    desc: "Pri pomlajevanju kože uporabljamo celosten in individualen pristop glede na analizo kože.",
    keywords:
      "pomlajevanje kože 4D pomlajevanje SmoothEye VectorLift LipLase SP Dynamis StarWalker MaQX Fotona FaceStim frakcijska plazma Jovena Brera kislinski pilingi LED terapija Dermalux TriWave gubice pigmentni madeži obraz vrat dekolte okoli oči čelo veke ustnice",
    syn: "gube staranje anti age",
  },
  {
    title: "Akne",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-akne",
    desc: "Pri obravnavi aken uporabljamo celosten in individualen pristop glede na analizo kože.",
    keywords:
      "akne atravmatsko čiščenje kože kislinski pilingi vnetje ogrci brazgotine po aknah pigmentacije Dermalux TriWave kozmetika domača nega prehrana",
    syn: "mozolji aknasta koža",
  },
  {
    title: "Hiperpigmentacije",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-hiperpigmentacije",
    desc: "Za zmanjšanje sončnih peg, pegic, pigmentnih madežev in melazme uporabljamo laserske terapije.",
    keywords:
      "hiperpigmentacije sončne pege pegice pigmentni madeži melazma StarWalker MaQX Fotona obraz dekolte roke",
    syn: "pege madeži",
  },
  {
    title: "Kuperoza",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-kuperoza",
    desc: "Za odstranjevanje žilic in hemangiomov uporabljamo laserske terapije z laserjem SP Dynamis Fotona.",
    keywords: "kuperoza žilice hemangiomi SP Dynamis Fotona",
    syn: "razširjene žilice rdečica",
  },
  {
    title: "Brazgotine",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-brazgotine",
    desc: "Za odstranjevanje ali zmanjšanje videza brazgotin na obrazu in telesu uporabljamo laserske terapije.",
    keywords: "brazgotine SP Dynamis Fotona StarWalker MaQX obraz telo",
    syn: "brazgotina",
  },
  {
    title: "Lasersko odstranjevanje dlak",
    section: "Nega in pomlajevanje kože",
    url: "storitve/estetika/nega-koze.html#sub-odstranjevanje-dlak",
    desc: "Za trajno odstranjevanje dlak na obrazu in telesu uporabljamo medicinski laser SP Dynamis Fotona.",
    keywords:
      "lasersko odstranjevanje dlak trajno odstranjevanje dlak fototip kože dlačni mešiček SP Dynamis Fotona",
    syn: "depilacija epilacija dlake",
  },

  // ------------------------------------------- Laserske terapije (cards)
  {
    title: "Stimulacija rasti las",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-stimulacija-rasti-las",
    desc: "Izvajamo terapije pri zmanjšanju kvalitete las, povečanem izpadanju las in plešavosti.",
    keywords:
      "stimulacija rasti las HaiRestart SP Dynamis Fotona microneedling Dermapen 4 eksosomi MG-EXO-GROW PRP rastni faktorji LED terapija Dermalux TriWave analiza las lasišča",
    syn: "izpadanje las plešavost lasje alopecija",
  },
  {
    title: "Trajno odstranjevanje dlak",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-trajno-odstranjevanje-dlak",
    desc: "Za trajno odstranjevanje dlak na obrazu in telesu uporabljamo medicinski laser SP Dynamis Fotona.",
    keywords:
      "trajno odstranjevanje dlak fototip kože dlačni mešiček SP Dynamis Fotona",
    syn: "depilacija epilacija dlake",
  },
  {
    title: "Žilice in vene",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-zilice-in-vene",
    desc: "Za odstranjevanje žilic in hemangiomov uporabljamo laserske terapije z laserjem SP Dynamis Fotona.",
    keywords: "žilice vene hemangiomi SP Dynamis Fotona",
    syn: "kuperoza",
  },
  {
    title: "Odstranjevanje tetovaž",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-odstranjevanje-tetovaz",
    desc: "Za odstranjevanje tetovaž ali dela tetovaže ter kozmetičnih tetovaž (obrvi, obrob ustnic) uporabljamo laser StarWalker MaQX Fotona.",
    keywords:
      "odstranjevanje tetovaž kozmetične tetovaže obrvi obrob ustnic StarWalker MaQX Fotona",
    syn: "tetovaža tattoo",
  },
  {
    title: "Pomlajevanje",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-pomlajevanje",
    desc: "Pri pomlajevanju kože uporabljamo celosten in individualen pristop glede na analizo kože.",
    keywords:
      "pomlajevanje 4D pomlajevanje SmoothEye VectorLift LipLase FaceStim frakcijska plazma Jovena Brera kislinski pilingi Dermalux TriWave gubice",
    syn: "gube staranje anti age",
  },
  {
    title: "Oblikovanje ustnic",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-oblikovanje-ustnic",
    desc: "Za povečanje polnosti, gladkosti in izboljšanje videza ustnic uporabljamo lasersko terapijo Liplase z laserjem SP Dynamis Fotona.",
    keywords:
      "oblikovanje ustnic Liplase SP Dynamis Fotona volumen simetričnost ustnic kupidov lok drobne gubice",
    syn: "ustnice povečanje ustnic",
  },
  {
    title: "Hiperpigmentacije",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-hiperpigmentacije",
    desc: "Za zmanjšanje sončnih peg, pegic, pigmentnih madežev in melazme uporabljamo laserske terapije.",
    keywords:
      "hiperpigmentacije sončne pege pegice pigmentni madeži melazma StarWalker MaQX Fotona obraz dekolte roke",
    syn: "pege madeži",
  },
  {
    title: "Strije in brazgotine",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-strije-in-brazgotine",
    desc: "Z lasersko terapijo z laserjema StarWalker MaQX in SP Dynamis Fotona spodbudimo obnovo kože in s tem izboljšamo videz rdečih, belih strij in brazgotin.",
    keywords:
      "strije brazgotine rdeče strije bele strije StarWalker MaQX SP Dynamis Fotona obraz telo",
    syn: "strija brazgotina",
  },
  {
    title: "Bradavice, kurja očesa",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-bradavice-kurja-ocesa",
    desc: "Terapiji izvajamo z laserskim sistemom SP Dynamis Fotona.",
    keywords:
      "bradavice kurja očesa koagulacija žil poroženela koža ponovna okužba SP Dynamis Fotona",
    syn: "bradavica kurje oko",
  },
  {
    title: "Benigna kožna znamenja",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-benigna-kozna-znamenja",
    desc: "Izvajamo odstranjevanje z laserjem SP Dynamis Fotona.",
    keywords: "benigna kožna znamenja odstranjevanje SP Dynamis Fotona",
    syn: "mladeži znamenje mladež",
  },
  {
    title: "Glivične spremembe na nohtih",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-glivicne-spremembe-na-nohtih",
    desc: "Z laserjem SP Dynamis Fotona prodremo globoko v obolelo tkivo in noht, s čimer glivice oslabimo in uničimo.",
    keywords:
      "glivične spremembe na nohtih glivice noht nohti rast nohta imunski procesi SP Dynamis Fotona",
    syn: "glivica na nohtu nohtna gliva",
  },
  {
    title: "Smrčanje",
    section: "Laserske terapije",
    url: "storitve/estetika/laserske-terapije.html#sub-smrcanje",
    desc: "Z lasersko terapijo NightLase z SP Dynamis Fotona učvrstimo ohlapno tkivo, ki povzroča smrčanje in otežuje dihanje.",
    keywords: "smrčanje NightLase SP Dynamis Fotona ohlapno tkivo dihanje apneja v spanju",
    syn: "smrkanje",
  },

  // ------------------------------------------------- Cenik (sections)
  {
    title: "Oblikovanje telesa",
    section: "Cenik",
    url: "cenik.html#oblikovanje-telesa",
    desc: "Oblikovanje postave — analiza telesne sestave s Tanita MC-980 MA in estetsko 3D fotografijo.",
    keywords:
      "analiza telesne sestave posvet pri specialistu funkcionalna magnetna stimulacija FMS neinvazivna liposukcija CPT RDT FIT paket FIT EXTREME želodčni balon TightSculpting Fotona Sonic Shaper Prestige Tanita",
    syn: "cena cene koliko stane",
  },
  {
    title: "Vodena vadba",
    section: "Cenik",
    url: "cenik.html#vodena-vadba",
    desc: "Individualna vadba pod nadzorom osebne trenerke — z vibracijsko ploščo in kolesom Power Plate.",
    keywords: "vodena vadba osebna trenerka Power Plate 1 vadba tedensko obiski na mesec",
    syn: "cena cene koliko stane vadba telovadba",
  },
  {
    title: "Dobro počutje",
    section: "Cenik",
    url: "cenik.html#dobro-pocutje",
    desc: "Hiperbarična kisikova terapija s komoro OXY, terapevtska medicinska hipnoza in terapije za splošno počutje.",
    keywords:
      "dobro počutje hiperbarična kisikova terapija OXY paket 5 terapij paket 10 terapij terapevtska medicinska hipnoza magnetna refleksoterapija stopal sprostitvena nega obraza",
    syn: "cena cene koliko stane",
  },
  {
    title: "Nega obraza",
    section: "Cenik",
    url: "cenik.html#nega-obraza",
    desc: "Pomlajevalna in specializirana nega z analizo kože (estetska 3D fotografija) in personalizirano kozmetiko.",
    keywords:
      "nega obraza pomlajevalna nega specializirana nega čiščenje akne suha koža kuperoza anti age gubice starostne pege microneedling Dermapen 4 PRP lastni rastni faktorji",
    syn: "cena cene koliko stane",
  },
  {
    title: "Magnetne terapije",
    section: "Cenik",
    url: "cenik.html#magnetne-terapije",
    desc: "Terapije s Tesla Care, Tesla Stym in Magneto Stym Iskra Medical.",
    keywords:
      "magnetne terapije Tesla Care Tesla Stym Magneto Stym Iskra Medical TESLA ON erektilna disfunkcija kronični prostatitis TESLA ONA poporodna regeneracija prolaps maternice TESLA STOL inkontinenca TESLA SACRUM bolečine v križu rehabilitacija paket 15 terapij obnovitvena terapija",
    syn: "cena cene koliko stane",
  },
  {
    title: "Laserske terapije",
    section: "Cenik",
    url: "cenik.html#laserske-terapije",
    desc: "Z laserskima sistemoma SP Dynamis Pro in StarWalker MaQX (Fotona) — pomlajevanje, odstranjevanje dlak in pigmentacij, zdravljenje žilic, brazgotin in las.",
    keywords:
      "laserske terapije SP Dynamis Pro StarWalker MaQX Fotona 4D pomlajevanje FRACRevive Smootheye Vectorlift Liplase Nightlase Hairestart trajno odstranjevanje dlak paket 5+1",
    syn: "cena cene koliko stane",
  },

  // ---------------------------------------------- Domov (landing sections)
  {
    title: "Storitve",
    section: "Domov",
    url: "index.html#services",
    desc: "Preverite, kaj ponujamo.",
    keywords: "storitve zobozdravstvo gastroenterologija estetika",
    syn: "ponudba",
  },
  {
    title: "Zakaj Klanmedic",
    section: "Domov",
    url: "index.html#why-us",
    desc: "Zažarite od znotraj navzven.",
    keywords:
      "individualen pristop sodobna medicinska oprema naprave slovenskega razvoja strokovno znanje zdravnikov varnost pregled zdravnik",
    syn: "zakaj mi",
  },
  {
    title: "Ekipa",
    section: "Domov",
    url: "index.html#team",
    desc: "Spoznajte ekipo.",
    keywords: "ekipa zdravnica zdravnik medicinska sestra zobozdravnik fizioterapevtka",
    syn: "zdravniki osebje kdo smo",
  },
  {
    title: "O nas",
    section: "Domov",
    url: "index.html#o-kliniki",
    desc: "Že 20 let soustvarjamo boljše počutje.",
    keywords:
      "o nas klinika koncesija samoplačniško fizioterapija zdravljenje debelosti terapije z magnetnim poljem medicinska hipnoza vodene vadbe hiperbarične kisikove terapije Zavarovalnica Triglav Zavarovalnica Generali Zavarovalnica Vzajemna Iskra Medical Dermapen OxyHelp Fotona CE certificirani",
    syn: "o kliniki zavarovalnica zavarovanje",
  },
];
