// =====================================================================
//  DATI DEL PIANO ALIMENTARE
//  Profilo: vegetariano, sedentario, pochi legumi, colon irritabile,
//  169 cm, 57 kg, 1 shaker proteico al giorno.
//  I valori nutrizionali sono STIME medie (tabelle CREA / USDA) utili
//  per orientarsi: non serve pesare tutto al grammo.
// =====================================================================

const SLOTS = [
  { id: "colazione", label: "Colazione", emoji: "☕", share: 0.20 },
  { id: "spuntino",  label: "Spuntino",  emoji: "🍎", share: 0.08 },
  { id: "pranzo",    label: "Pranzo",    emoji: "🍝", share: 0.34 },
  { id: "merenda",   label: "Merenda",   emoji: "🥤", share: 0.12 },
  { id: "cena",      label: "Cena",      emoji: "🌙", share: 0.26 },
];

const DEFAULT_PROFILE = {
  name: "",
  sex: "M",
  age: 30,
  height: 169,
  weight: 57,
  activity: 1.4,      // sedentario / poco attivo
  goal: "maintain",   // maintain | gain | lose
};

const ACTIVITY_LEVELS = [
  { v: 1.3,  label: "Molto sedentario (lavoro seduto, quasi niente movimento)" },
  { v: 1.4,  label: "Poco attivo (qualche camminata)" },
  { v: 1.55, label: "Moderatamente attivo (sport 2-3 volte a settimana)" },
  { v: 1.7,  label: "Attivo (sport 4-5 volte a settimana)" },
];

const GOALS = [
  { v: "maintain", label: "Mantenere il peso e stare bene", adj: 0 },
  { v: "gain",     label: "Mettere su qualche chilo (lentamente)", adj: 250 },
  { v: "lose",     label: "Perdere un po' di peso (lentamente)", adj: -300 },
];

// Calcolo fabbisogno: Mifflin-St Jeor × livello di attività
function computeTargets(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "F" ? -161 : 5);
  const goal = GOALS.find(g => g.v === p.goal) || GOALS[0];
  const kcal = Math.round((bmr * p.activity + goal.adj) / 25) * 25;
  const protein = Math.round(p.weight * 1.5);        // 1.5 g/kg: ottimo per vegetariani
  const fat = Math.round((kcal * 0.30) / 9);          // 30% delle calorie
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  const bmi = p.weight / Math.pow(p.height / 100, 2);
  return { bmr: Math.round(bmr), kcal, protein, fat, carbs, fiber: 25, water: 8, bmi: Math.round(bmi * 10) / 10 };
}

// ---------------------------------------------------------------------
//  TABELLA DEGLI SCAMBI ("porzioni" intercambiabili)
// ---------------------------------------------------------------------
const EXCHANGES = [
  {
    group: "Proteine", emoji: "🥚", color: "#e8a87c",
    note: "1 porzione ≈ 15-20 g di proteine. Puoi scambiare liberamente una voce con l'altra.",
    items: [
      { food: "Uova", qty: "2 uova (≈110 g)", kcal: 140, p: 13, c: 1, f: 10 },
      { food: "Tofu compatto (ben pressato)", qty: "120 g", kcal: 170, p: 17, c: 2, f: 10 },
      { food: "Tempeh", qty: "90 g", kcal: 170, p: 17, c: 8, f: 10 },
      { food: "Seitan", qty: "100 g", kcal: 120, p: 22, c: 4, f: 2 },
      { food: "Yogurt greco 0-2% senza lattosio", qty: "170 g (1 vasetto)", kcal: 110, p: 17, c: 6, f: 2 },
      { food: "Skyr", qty: "150 g", kcal: 95, p: 16, c: 6, f: 0 },
      { food: "Fiocchi di latte senza lattosio", qty: "150 g", kcal: 145, p: 17, c: 5, f: 6 },
      { food: "Mozzarella senza lattosio", qty: "100 g", kcal: 250, p: 18, c: 1, f: 19 },
      { food: "Parmigiano / Grana (naturalmente senza lattosio)", qty: "50 g", kcal: 200, p: 17, c: 0, f: 14 },
      { food: "Edamame sgusciati", qty: "90 g", kcal: 110, p: 11, c: 8, f: 5 },
      { food: "Proteine in polvere (isolate o di riso/pisello)", qty: "30 g (1 misurino)", kcal: 115, p: 24, c: 2, f: 1 },
    ],
  },
  {
    group: "Carboidrati", emoji: "🍞", color: "#f2d184",
    note: "1 porzione ≈ 40-45 g di carboidrati (circa 180-200 kcal). A pranzo di solito 1½-2 porzioni, a cena 1-1½.",
    items: [
      { food: "Pasta di semola o di riso", qty: "55 g", kcal: 195, p: 7, c: 40, f: 1 },
      { food: "Riso (basmati, venere, parboiled)", qty: "55 g", kcal: 195, p: 4, c: 43, f: 0 },
      { food: "Quinoa / grano saraceno", qty: "55 g", kcal: 200, p: 7, c: 35, f: 3 },
      { food: "Fiocchi d'avena", qty: "55 g", kcal: 205, p: 7, c: 33, f: 4 },
      { food: "Pane a lievitazione naturale", qty: "80 g", kcal: 200, p: 7, c: 40, f: 1 },
      { food: "Patate", qty: "250 g", kcal: 190, p: 5, c: 42, f: 0 },
      { food: "Polenta (farina di mais)", qty: "55 g", kcal: 195, p: 4, c: 42, f: 1 },
      { food: "Gallette di riso o mais", qty: "5 gallette (≈45 g)", kcal: 170, p: 4, c: 36, f: 1 },
      { food: "Noodles di riso", qty: "55 g", kcal: 200, p: 3, c: 45, f: 0 },
      { food: "Gnocchi di patate", qty: "180 g", kcal: 230, p: 6, c: 48, f: 1 },
    ],
  },
  {
    group: "Grassi buoni", emoji: "🫒", color: "#a8c686",
    note: "1 porzione ≈ 10 g di grassi (circa 90 kcal). 3-4 porzioni al giorno.",
    items: [
      { food: "Olio extravergine d'oliva", qty: "10 g (1 cucchiaio)", kcal: 90, p: 0, c: 0, f: 10 },
      { food: "Olio aromatizzato all'aglio (low-FODMAP)", qty: "10 g", kcal: 90, p: 0, c: 0, f: 10 },
      { food: "Noci / noci pecan / macadamia", qty: "15 g", kcal: 100, p: 2, c: 1, f: 10 },
      { food: "Mandorle", qty: "10 mandorle (≈12 g)", kcal: 70, p: 3, c: 1, f: 6 },
      { food: "Burro di arachidi 100%", qty: "15 g (1 cucchiaio)", kcal: 90, p: 4, c: 2, f: 8 },
      { food: "Semi di zucca / girasole / chia", qty: "15 g", kcal: 85, p: 4, c: 2, f: 7 },
      { food: "Avocado", qty: "30 g (≈⅛)", kcal: 50, p: 1, c: 1, f: 5 },
      { food: "Cioccolato fondente 70%+", qty: "20 g", kcal: 115, p: 2, c: 9, f: 8 },
    ],
  },
  {
    group: "Frutta", emoji: "🍓", color: "#f19c9c",
    note: "1 porzione ≈ 15 g di zuccheri. 2 porzioni al giorno, meglio distanziate (per l'intestino è meglio un frutto alla volta).",
    items: [
      { food: "Kiwi", qty: "2 piccoli", kcal: 90, p: 2, c: 20, f: 1 },
      { food: "Arancia / mandarini", qty: "1 arancia o 2 mandarini", kcal: 60, p: 1, c: 14, f: 0 },
      { food: "Fragole", qty: "150 g", kcal: 50, p: 1, c: 11, f: 0 },
      { food: "Mirtilli / lamponi", qty: "125 g", kcal: 65, p: 1, c: 14, f: 0 },
      { food: "Banana non troppo matura", qty: "1 piccola", kcal: 90, p: 1, c: 21, f: 0 },
      { food: "Uva", qty: "150 g", kcal: 100, p: 1, c: 24, f: 0 },
      { food: "Ananas", qty: "150 g", kcal: 75, p: 1, c: 18, f: 0 },
      { food: "Papaya / melone cantalupo", qty: "150 g", kcal: 55, p: 1, c: 13, f: 0 },
    ],
  },
  {
    group: "Verdure", emoji: "🥕", color: "#7fb77e",
    note: "Libere: almeno 1 porzione (≈200 g) a pranzo e a cena. Preferisci quelle ben tollerate dal colon.",
    items: [
      { food: "Zucchine, carote, melanzane, peperoni", qty: "200 g", kcal: 50, p: 2, c: 8, f: 0 },
      { food: "Spinaci, lattuga, rucola, valeriana", qty: "200 g", kcal: 40, p: 4, c: 3, f: 0 },
      { food: "Pomodori, cetrioli", qty: "200 g", kcal: 35, p: 2, c: 6, f: 0 },
      { food: "Fagiolini, zucca, bok choy", qty: "200 g", kcal: 50, p: 3, c: 8, f: 0 },
    ],
  },
  {
    group: "Latte & bevande", emoji: "🥛", color: "#9cc9e3",
    note: "Per colazione e merende.",
    items: [
      { food: "Latte senza lattosio parz. scremato", qty: "200 ml", kcal: 92, p: 7, c: 10, f: 3 },
      { food: "Bevanda di riso / mandorla / avena (senza zuccheri)", qty: "200 ml", kcal: 60, p: 1, c: 10, f: 2 },
      { food: "Bevanda di soia (da proteine isolate)", qty: "200 ml", kcal: 70, p: 7, c: 1, f: 4 },
      { food: "Kefir", qty: "150 ml", kcal: 80, p: 5, c: 6, f: 4 },
    ],
  },
];

// ---------------------------------------------------------------------
//  OPZIONI PER OGNI PASTO (con valori stimati, aggiungibili al calendario)
// ---------------------------------------------------------------------
const SNACKS = [
  { title: "Shaker proteico + 2 kiwi", desc: "30 g di proteine in acqua o bevanda di riso, con 2 kiwi.", kcal: 205, p: 26, c: 22, f: 2 },
  { title: "Shaker proteico al latte", desc: "30 g di proteine in 250 ml di latte senza lattosio.", kcal: 230, p: 33, c: 14, f: 5 },
  { title: "Frutto + frutta secca", desc: "1 porzione di frutta + 15 g di noci o 10 mandorle.", kcal: 160, p: 3, c: 15, f: 10 },
  { title: "Yogurt greco + fragole", desc: "1 vasetto di yogurt greco senza lattosio con 150 g di fragole.", kcal: 160, p: 18, c: 17, f: 2 },
  { title: "Gallette + burro di arachidi", desc: "3 gallette di riso con 1 cucchiaio di burro di arachidi.", kcal: 190, p: 6, c: 24, f: 8 },
  { title: "Uovo sodo + arancia", desc: "Pratico da portare in giro.", kcal: 130, p: 7, c: 14, f: 5 },
  { title: "Pane e cioccolato", desc: "40 g di pane + 20 g di cioccolato fondente. Una coccola ogni tanto ci sta!", kcal: 215, p: 6, c: 29, f: 9 },
  { title: "Kefir + mirtilli", desc: "150 ml di kefir con 125 g di mirtilli.", kcal: 145, p: 6, c: 20, f: 4 },
];

const MEAL_OPTIONS = {
  colazione: [
    { title: "Porridge con mirtilli e burro di arachidi", desc: "50 g avena cotti in 200 ml latte senza lattosio, 125 g mirtilli, 1 cucchiaio di burro di arachidi.", kcal: 440, p: 17, c: 57, f: 14 },
    { title: "Yogurt greco, cereali, kiwi e noci", desc: "170 g yogurt greco senza lattosio, 40 g corn flakes o fiocchi d'avena, 2 kiwi, 15 g noci.", kcal: 460, p: 22, c: 60, f: 13 },
    { title: "Toast con uova strapazzate", desc: "80 g pane a lievitazione naturale, 2 uova strapazzate con 5 g olio, spinacini, 1 arancia.", kcal: 445, p: 20, c: 55, f: 16 },
    { title: "Colazione all'italiana leggera", desc: "Caffellatte (200 ml latte senza lattosio), 4 gallette con 20 g marmellata e 1 cucchiaio di burro di arachidi.", kcal: 400, p: 13, c: 55, f: 12 },
    { title: "Toast salato all'avocado", desc: "70 g pane, 30 g avocado, 30 g emmental o grana, pomodorini, caffè con un po' di latte.", kcal: 410, p: 17, c: 42, f: 17 },
    { title: "Pancake proteici alla banana", desc: "Vedi ricetta: avena, uovo, proteine in polvere e banana.", kcal: 430, p: 32, c: 50, f: 11 },
  ],
  spuntino: SNACKS,
  merenda: SNACKS,
  pranzo: [
    { title: "Pasta al pomodoro con tofu", desc: "90 g pasta, sugo di pomodoro, 120 g tofu a cubetti saltato, zucchine, 10 g olio, 10 g grana.", kcal: 690, p: 32, c: 80, f: 25 },
    { title: "Riso con frittata e verdure", desc: "80 g riso basmati, frittata di 2 uova con 20 g grana, 200 g verdure grigliate, 10 g olio.", kcal: 655, p: 27, c: 72, f: 26 },
    { title: "Bowl di quinoa e tempeh", desc: "80 g quinoa, 100 g tempeh, zucca al forno, spinacino, 10 g semi di zucca, 10 g olio.", kcal: 665, p: 33, c: 68, f: 31 },
    { title: "Panino caprese", desc: "120 g pane, 100 g mozzarella senza lattosio, pomodoro, rucola, 5 g olio + 1 frutto.", kcal: 655, p: 28, c: 75, f: 24 },
    { title: "Patate al forno con seitan", desc: "300 g patate al forno, 100 g seitan alla piastra, fagiolini, 10 g olio, 50 g pane.", kcal: 640, p: 36, c: 85, f: 14 },
    { title: "Riso saltato con edamame e uovo", desc: "80 g riso, 90 g edamame, 1 uovo, carote e zucchine saltate, salsa di soia, 10 g olio.", kcal: 615, p: 26, c: 73, f: 21 },
    { title: "Trofie al pesto con patate e fagiolini", desc: "Vedi ricetta: pesto senza aglio, una porzione generosa.", kcal: 690, p: 24, c: 88, f: 26 },
  ],
  cena: [
    { title: "Frittata di patate e spinaci", desc: "2 uova, 20 g grana, 200 g patate, spinaci, 5 g olio + insalata.", kcal: 515, p: 25, c: 42, f: 25 },
    { title: "Vellutata, crostini e fiocchi di latte", desc: "Vellutata di carote/zucca, 60 g pane tostato, 150 g fiocchi di latte senza lattosio, 15 g semi.", kcal: 500, p: 26, c: 55, f: 18 },
    { title: "Tofu saltato con riso e verdure", desc: "150 g tofu, 70 g riso, verdure saltate, salsa di soia, zenzero, 5 g olio.", kcal: 565, p: 29, c: 65, f: 20 },
    { title: "Polenta, uova e spinaci", desc: "70 g polenta, 2 uova al tegamino, spinaci saltati, 10 g grana, 5 g olio.", kcal: 505, p: 22, c: 60, f: 19 },
    { title: "Ramen della scogliera", desc: "Vedi ricetta: noodles, brodo, uovo, tofu e verdure.", kcal: 560, p: 30, c: 66, f: 18 },
    { title: "Burger di seitan nel pane", desc: "Panino (80 g) con 100 g seitan alla piastra, lattuga, pomodoro, 1 fetta di formaggio + verdure.", kcal: 540, p: 38, c: 52, f: 18 },
    { title: "Pizza margherita (serata libera)", desc: "Una volta a settimana va benissimo! Meglio con mozzarella senza lattosio e impasto ben lievitato.", kcal: 800, p: 30, c: 110, f: 25 },
  ],
};

// Giornate tipo di esempio
const SAMPLE_DAYS = [
  {
    name: "Giornata del prato",
    meals: {
      colazione: "Porridge con mirtilli e burro di arachidi",
      spuntino: "Frutto + frutta secca",
      pranzo: "Pasta al pomodoro con tofu",
      merenda: "Shaker proteico + 2 kiwi",
      cena: "Frittata di patate e spinaci",
    },
  },
  {
    name: "Giornata del vento",
    meals: {
      colazione: "Toast con uova strapazzate",
      spuntino: "Yogurt greco + fragole",
      pranzo: "Bowl di quinoa e tempeh",
      merenda: "Shaker proteico + 2 kiwi",
      cena: "Polenta, uova e spinaci",
    },
  },
  {
    name: "Giornata della scogliera",
    meals: {
      colazione: "Yogurt greco, cereali, kiwi e noci",
      spuntino: "Gallette + burro di arachidi",
      pranzo: "Riso saltato con edamame e uovo",
      merenda: "Shaker proteico al latte",
      cena: "Ramen della scogliera",
    },
  },
];

// ---------------------------------------------------------------------
//  CONSIGLI
// ---------------------------------------------------------------------
const TIPS = {
  general: [
    { t: "Niente divieti, solo equilibrio", d: "Nessun cibo è proibito. Usa la tabella degli scambi per comporre i pasti come preferisci: l'importante è che, nell'arco della giornata, ci siano proteine, carboidrati, grassi buoni, frutta e verdura." },
    { t: "Proteine a ogni pasto", d: "Da vegetariano che mangia pochi legumi, la sfida principale sono le proteine. Cerca di avere una fonte proteica a ogni pasto principale (uova, tofu, tempeh, seitan, yogurt greco, formaggi stagionati). Lo shaker giornaliero copre circa ¼ del fabbisogno." },
    { t: "Ferro e vitamina C", d: "Il ferro vegetale (spinaci, tofu, avena, semi) si assorbe meglio se accompagnato da vitamina C: aggiungi kiwi, arancia, peperoni o un filo di limone. Evita tè e caffè subito dopo i pasti principali." },
    { t: "Vitamina B12", d: "Con uova e latticini ne assumi un po', ma per un vegetariano è consigliato controllarla periodicamente con le analisi del sangue e, se serve, integrarla su consiglio del medico." },
    { t: "Omega-3", d: "Noci, semi di chia e lino (macinati) sono ottime fonti vegetali di omega-3: una manciata al giorno basta." },
    { t: "Sei normopeso", d: "Con 57 kg per 169 cm il tuo BMI è circa 20: sei nel range ideale. Il piano è impostato sul mantenimento; se vuoi mettere su un po' di massa puoi cambiare obiettivo nel Profilo." },
    { t: "Muoviti un pochino", d: "Anche 20-30 minuti di camminata al giorno aiutano l'intestino, l'umore e l'appetito. Non serve fare sport intenso!" },
  ],
  ibs: [
    { t: "Pasti regolari e con calma", d: "Mangia a orari simili, mastica bene e non saltare i pasti: l'intestino irritabile ama la routine." },
    { t: "Attenzione ai FODMAP", d: "Alcuni zuccheri fermentabili (FODMAP) causano gonfiore. I più comuni: aglio, cipolla, lattosio, mele, pere, anguria, cavolfiore, funghi, legumi non sciacquati. Non devi eliminarli per sempre: testa la tua tolleranza poco alla volta." },
    { t: "Aglio e cipolla senza fastidi", d: "Usa olio aromatizzato all'aglio (i FODMAP non passano nell'olio), la parte verde del cipollotto, erba cipollina, zenzero ed erbe aromatiche per dare sapore." },
    { t: "Latticini senza lattosio", d: "Preferisci latte e yogurt senza lattosio. Parmigiano, grana, pecorino ed emmental stagionati sono naturalmente privi di lattosio." },
    { t: "Lo shaker giusto", d: "Scegli proteine isolate (whey isolate, praticamente senza lattosio) o vegetali di riso/pisello. Evita prodotti con sorbitolo, maltitolo, xilitolo e inulina: sono tra le cause più frequenti di gonfiore." },
    { t: "Fibre gentili", d: "Le fibre solubili aiutano: avena, kiwi (ottimi per la regolarità), semi di chia, patate, carote. Aumenta le fibre gradualmente e bevi molta acqua." },
    { t: "Se proprio vuoi i legumi", d: "Lenticchie e ceci in scatola, ben sciacquati, in piccole porzioni (2-3 cucchiai) sono spesso tollerati. Tofu compatto, tempeh ed edamame sono le opzioni a base di soia più adatte al colon irritabile." },
    { t: "Ascolta la tua pancia", d: "Usa le note di fine giornata per segnare come stai: dopo qualche settimana potrai notare quali cibi ti fanno stare bene e quali meno. Per un percorso low-FODMAP strutturato fatti seguire da un gastroenterologo o dietista." },
  ],
};

// ---------------------------------------------------------------------
//  RICETTE SUGGERITE
// ---------------------------------------------------------------------
const BUILTIN_RECIPES = [
  {
    id: "b-porridge", builtin: true, emoji: "🥣", title: "Porridge del mattino nebbioso", category: "Colazione",
    time: 10, servings: 1, kcal: 440, p: 17, c: 57, f: 14, tags: ["veloce", "fibre gentili"],
    ingredients: ["50 g fiocchi d'avena", "200 ml latte senza lattosio (o bevanda di riso)", "125 g mirtilli", "1 cucchiaio di burro di arachidi", "Cannella q.b.", "Un pizzico di sale"],
    steps: ["Metti avena, latte e un pizzico di sale in un pentolino.", "Cuoci a fuoco medio-basso 4-5 minuti mescolando finché diventa cremoso.", "Versa in una ciotola, aggiungi mirtilli, burro di arachidi e cannella."],
    notes: "Variante notturna: lascia l'avena nel latte in frigo tutta la notte e mangiala fredda.",
  },
  {
    id: "b-pancake", builtin: true, emoji: "🥞", title: "Pancake proteici alla banana", category: "Colazione",
    time: 15, servings: 1, kcal: 430, p: 32, c: 50, f: 11, tags: ["proteico", "usa lo shaker"],
    ingredients: ["40 g fiocchi d'avena frullati", "1 uovo", "15 g proteine in polvere (½ misurino)", "1 banana piccola non troppo matura", "50 ml latte senza lattosio", "½ cucchiaino di lievito", "Fragole o mirtilli per servire"],
    steps: ["Frulla tutti gli ingredienti fino a ottenere una pastella liscia.", "Scalda una padella antiaderente appena unta.", "Versa un mestolino di pastella, cuoci finché compaiono le bollicine, gira e cuoci un altro minuto.", "Servi con frutta fresca."],
    notes: "Se usi metà misurino qui, l'altra metà può andare nello shaker del pomeriggio.",
  },
  {
    id: "b-castello", builtin: true, emoji: "🍳", title: "Colazione del castello errante", category: "Colazione",
    time: 10, servings: 1, kcal: 445, p: 20, c: 55, f: 16, tags: ["salato", "proteico"],
    ingredients: ["2 uova", "80 g pane a lievitazione naturale", "1 manciata di spinacini", "5 g olio extravergine", "10 g grana grattugiato", "Pepe ed erba cipollina"],
    steps: ["Tosta il pane in padella o nel tostapane.", "Nella stessa padella scalda l'olio e fai appassire gli spinacini 1 minuto.", "Aggiungi le uova sbattute con il grana e mescola dolcemente finché sono morbide.", "Servi sulle fette di pane con pepe ed erba cipollina."],
    notes: "Ispirata alla colazione in padella preparata davanti al fuoco… in versione vegetariana!",
  },
  {
    id: "b-ramen", builtin: true, emoji: "🍜", title: "Ramen della scogliera", category: "Primo",
    time: 25, servings: 1, kcal: 560, p: 30, c: 66, f: 18, tags: ["comfort food", "senza aglio e cipolla"],
    ingredients: ["70 g noodles di riso o ramen", "500 ml brodo vegetale (senza aglio e cipolla)", "1 uovo", "80 g tofu compatto", "1 manciata di spinaci o bok choy", "1 carota a julienne", "Parte verde di 1 cipollotto", "1 cucchiaio di salsa di soia", "1 fettina di zenzero fresco", "1 cucchiaino di olio di sesamo"],
    steps: ["Cuoci l'uovo 6 minuti e mezzo in acqua bollente, poi raffreddalo in acqua fredda e sgusciato.", "Scalda il brodo con zenzero e salsa di soia.", "Rosola il tofu a cubetti in padella finché dorato.", "Cuoci i noodles nel brodo, aggiungendo carota e spinaci negli ultimi 2 minuti.", "Versa in una ciotola grande, aggiungi tofu, uovo tagliato a metà, cipollotto e olio di sesamo."],
    notes: "Un piatto caldo da gustare in una sera di pioggia.",
  },
  {
    id: "b-pesto", builtin: true, emoji: "🌿", title: "Trofie al pesto con patate e fagiolini", category: "Primo",
    time: 25, servings: 2, kcal: 690, p: 24, c: 88, f: 26, tags: ["classico", "senza aglio"],
    ingredients: ["180 g trofie (o altra pasta)", "1 patata media", "100 g fagiolini", "40 g basilico fresco", "20 g pinoli", "40 g parmigiano grattugiato", "25 g olio extravergine (meglio se aromatizzato all'aglio)", "Sale q.b."],
    steps: ["Frulla basilico, pinoli, parmigiano, olio e un pizzico di sale con un cubetto di ghiaccio (resta verde).", "Taglia la patata a cubetti e i fagiolini a pezzetti.", "Cuoci patate e fagiolini nell'acqua della pasta per 5 minuti, poi aggiungi la pasta.", "Scola tenendo un po' d'acqua di cottura e condisci con il pesto, allungando se serve."],
    notes: "Il pesto senza aglio è delicato sull'intestino e buonissimo lo stesso.",
  },
  {
    id: "b-riso-tofu", builtin: true, emoji: "🍚", title: "Riso saltato del mercato", category: "Piatto unico",
    time: 20, servings: 1, kcal: 600, p: 28, c: 72, f: 20, tags: ["riciclo", "proteico"],
    ingredients: ["70 g riso (meglio cotto il giorno prima)", "120 g tofu compatto", "1 zucchina", "1 carota", "½ peperone", "1 uovo", "1 cucchiaio di salsa di soia", "10 g olio aromatizzato all'aglio", "Zenzero e parte verde del cipollotto"],
    steps: ["Taglia il tofu a cubetti e rosolalo con metà olio finché croccante, poi mettilo da parte.", "Salta le verdure a julienne con il resto dell'olio e lo zenzero per 4-5 minuti.", "Aggiungi il riso freddo e saltalo a fuoco alto.", "Fai spazio in padella, rompi l'uovo e strapazzalo, poi mescola tutto.", "Unisci tofu, salsa di soia e cipollotto."],
    notes: "",
  },
  {
    id: "b-onigiri", builtin: true, emoji: "🍙", title: "Onigiri del picnic", category: "Pranzo al sacco",
    time: 30, servings: 1, kcal: 520, p: 22, c: 80, f: 12, tags: ["da portare via", "picnic"],
    ingredients: ["80 g riso per sushi", "80 g tempeh o tofu affumicato", "1 cucchiaio di salsa di soia", "1 cucchiaino di sciroppo d'acero", "Semi di sesamo", "Alga nori (facoltativa)", "Cetriolo a bastoncini per accompagnare"],
    steps: ["Cuoci il riso secondo le istruzioni e lascialo intiepidire.", "Sbriciola il tempeh e rosolalo con soia e sciroppo d'acero finché caramellato.", "Con le mani bagnate e salate prendi un po' di riso, metti al centro il ripieno e chiudi formando un triangolo.", "Avvolgi con una striscia di nori e cospargi di sesamo."],
    notes: "Perfetti da mettere in una scatolina per una gita in mezzo al verde.",
  },
  {
    id: "b-quinoa", builtin: true, emoji: "🎃", title: "Bowl d'autunno con quinoa e tempeh", category: "Piatto unico",
    time: 35, servings: 1, kcal: 665, p: 33, c: 68, f: 31, tags: ["meal prep", "proteico"],
    ingredients: ["80 g quinoa", "100 g tempeh", "150 g zucca", "1 manciata di spinacino", "10 g semi di zucca", "10 g olio extravergine", "1 cucchiaio di salsa di soia", "Succo di ½ arancia"],
    steps: ["Taglia la zucca a cubetti e cuocila in forno a 200° per 20-25 minuti.", "Sciacqua la quinoa e cuocila in acqua salata per 12-15 minuti.", "Taglia il tempeh a fettine e rosolalo, poi sfuma con soia e succo d'arancia.", "Componi la bowl con spinacino, quinoa, zucca, tempeh, semi e un filo d'olio."],
    notes: "Si conserva 2-3 giorni in frigo: ottima da preparare in anticipo.",
  },
  {
    id: "b-frittata", builtin: true, emoji: "🥔", title: "Frittata al forno di patate e spinaci", category: "Secondo",
    time: 35, servings: 2, kcal: 515, p: 25, c: 42, f: 25, tags: ["forno", "si porta via"],
    ingredients: ["4 uova", "400 g patate", "150 g spinaci", "40 g grana grattugiato", "10 g olio extravergine", "Erba cipollina, sale e pepe"],
    steps: ["Lessa o cuoci al vapore le patate a fette per 10 minuti.", "Fai appassire gli spinaci in padella.", "Sbatti le uova con grana, erba cipollina, sale e pepe.", "Unisci patate e spinaci, versa in una teglia oliata e cuoci a 180° per 20 minuti."],
    notes: "Buonissima anche fredda il giorno dopo.",
  },
  {
    id: "b-vellutata", builtin: true, emoji: "🥕", title: "Vellutata di carote e zenzero", category: "Zuppa",
    time: 30, servings: 2, kcal: 500, p: 26, c: 55, f: 18, tags: ["leggera", "intestino felice"],
    ingredients: ["500 g carote", "1 patata", "1 pezzetto di zenzero fresco", "Brodo vegetale (senza aglio e cipolla)", "10 g olio extravergine", "120 g pane a lievitazione naturale", "300 g fiocchi di latte senza lattosio", "30 g semi misti"],
    steps: ["Taglia carote e patata a pezzi e mettili in pentola con lo zenzero.", "Copri con il brodo e cuoci 20 minuti.", "Frulla fino a ottenere una crema e completa con l'olio a crudo.", "Servi con crostini tostati, fiocchi di latte e semi tostati."],
    notes: "",
  },
  {
    id: "b-curry", builtin: true, emoji: "🍛", title: "Curry dolce di tofu e zucca", category: "Piatto unico",
    time: 30, servings: 2, kcal: 620, p: 26, c: 70, f: 25, tags: ["speziato", "comfort food"],
    ingredients: ["250 g tofu compatto", "300 g zucca", "1 zucchina", "200 ml latte di cocco light", "1 cucchiaio di curry in polvere (senza aglio/cipolla)", "Zenzero fresco", "140 g riso basmati", "5 g olio", "Coriandolo o prezzemolo"],
    steps: ["Rosola il tofu a cubetti nell'olio finché dorato e mettilo da parte.", "Nella stessa pentola tosta curry e zenzero 30 secondi.", "Aggiungi zucca e zucchina a cubetti, il latte di cocco e un bicchiere d'acqua; cuoci 15 minuti.", "Rimetti il tofu, aggiusta di sale e servi con il riso e le erbe."],
    notes: "",
  },
  {
    id: "b-polenta", builtin: true, emoji: "🌽", title: "Polenta della baita con uova e spinaci", category: "Piatto unico",
    time: 20, servings: 1, kcal: 505, p: 22, c: 60, f: 19, tags: ["montagna", "senza glutine"],
    ingredients: ["70 g farina per polenta istantanea", "2 uova", "200 g spinaci", "10 g grana", "5 g olio extravergine", "Sale e pepe"],
    steps: ["Cuoci la polenta in acqua salata secondo le istruzioni.", "Salta gli spinaci in padella con l'olio.", "Cuoci le uova al tegamino nella stessa padella.", "Servi la polenta con spinaci, uova e grana grattugiato."],
    notes: "",
  },
];

// ---------------------------------------------------------------------
//  CIBI INTERESSANTI SUGGERITI
// ---------------------------------------------------------------------
const FOOD_SUGGESTIONS = [
  { name: "Tempeh", category: "Proteine", notes: "Soia fermentata, ricca di proteine e ben tollerata dal colon irritabile." },
  { name: "Tofu affumicato", category: "Proteine", notes: "Già saporito, ottimo a cubetti in padella o nei panini." },
  { name: "Edamame", category: "Proteine", notes: "Fagioli di soia verdi: snack proteico, porzione da 90 g." },
  { name: "Seitan", category: "Proteine", notes: "Molto proteico e magro, perfetto alla piastra." },
  { name: "Skyr", category: "Latticini", notes: "Yogurt islandese super proteico." },
  { name: "Halloumi", category: "Latticini", notes: "Formaggio da grigliare, povero di lattosio." },
  { name: "Grano saraceno", category: "Cereali", notes: "Senza glutine, sapore rustico, ottimo in insalata." },
  { name: "Riso venere", category: "Cereali", notes: "Riso nero aromatico, bellissimo nel piatto." },
  { name: "Noodles di riso", category: "Cereali", notes: "Base perfetta per piatti orientali." },
  { name: "Lievito alimentare in scaglie", category: "Condimenti", notes: "Sapore di formaggio, contiene vitamine del gruppo B." },
  { name: "Olio aromatizzato all'aglio", category: "Condimenti", notes: "Il sapore dell'aglio senza i FODMAP." },
  { name: "Tahina", category: "Condimenti", notes: "Crema di sesamo, 1 cucchiaio per condire verdure e bowl." },
  { name: "Miso", category: "Condimenti", notes: "Pasta di soia fermentata per zuppe saporite." },
  { name: "Semi di canapa", category: "Semi", notes: "Proteine e omega-3, da spolverare ovunque." },
  { name: "Semi di chia", category: "Semi", notes: "Fibre solubili, ottimi nel porridge o in un pudding." },
  { name: "Noci pecan", category: "Frutta secca", notes: "Dolci e burrose, ben tollerate." },
  { name: "Kiwi gold", category: "Frutta", notes: "Kiwi giallo, più dolce: aiuta la regolarità intestinale." },
  { name: "Papaya", category: "Frutta", notes: "Delicata e digeribile." },
  { name: "Bok choy", category: "Verdure", notes: "Cavolo cinese tenero, perfetto nel ramen." },
  { name: "Zenzero fresco", category: "Spezie", notes: "Aiuta la digestione e profuma tutto." },
];

