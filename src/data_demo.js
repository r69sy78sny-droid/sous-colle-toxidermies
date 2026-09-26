/* =====================================================================
   PAGE DE TEST — contenu fictif, aucune vraie question de l'item 115
   ===================================================================== */
const DEMO_MODE = true;

const IMG = {
  demo_vesicules: {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/V%C3%A9sicules_varicelle_chickenpox.jpg",
    page: "https://commons.wikimedia.org/wiki/File:V%C3%A9sicules_varicelle_chickenpox.jpg",
    credit: "Grook da oger", lic: "CC BY-SA 4.0",
    cap: "Exemple de test : vésicules (varicelle), petites élevures translucides à contenu clair."
  }
};

const CATS = [
  { id: "semio",  name: "Sémiologie & Diagnostic différentiel",               short: "Sémiologie",        icon: "🔍", css: "--c-semio" },
  { id: "chrono", name: "Chronologie, Imputabilité & Médicaments coupables",  short: "Chronologie",       icon: "⏱",  css: "--c-chrono" },
  { id: "grav",   name: "Critères de gravité & Scores pronostiques",          short: "Gravité & scores",  icon: "⚠",  css: "--c-grav" },
  { id: "urg",    name: "Urgences & Prise en charge thérapeutique",           short: "Urgences",          icon: "✚",  css: "--c-urg" },
  { id: "pv",     name: "Pharmacovigilance & Suites médico-légales",          short: "Pharmacovigilance", icon: "⚖",  css: "--c-pv" }
];

const OIC = {
  "OIC-TEST-A": "Objectif d'exemple de rang A (page de test)",
  "OIC-TEST-B": "Objectif d'exemple de rang B (page de test)"
};

const SKILLS = {
  liq:    { label: "Lésions à contenu liquide", the: "les lésions à contenu liquide", sec: "d-1" },
  sol:    { label: "Lésions solides",           the: "les lésions solides",           sec: "d-2" },
  calc:   { label: "Calcul mental",             the: "le calcul mental",              sec: "" },
  divers: { label: "Règles du jeu",             the: "les règles du jeu",             sec: "" }
};

const QUESTIONS = [
  { id: "t1", cat: "semio", type: "qcu", skill: "liq", topic: "la vésicule", oic: "OIC-TEST-A", img: "demo_vesicules",
    q: "[TEST] Élevure translucide de 2 mm contenant un liquide clair : quelle lésion élémentaire ?",
    o: ["Macule", "Papule", "Vésicule", "Pustule", "Nodule"], a: 2,
    exp: "Question de test (QCU avec photo à révéler). La <b>vésicule</b> est une petite élevure à contenu clair." },
  { id: "t2", cat: "semio", type: "qrm", skill: "sol", topic: "les lésions en relief", oic: "OIC-TEST-B",
    q: "[TEST] Quelles lésions sont en relief ?",
    o: ["Papule", "Nodule", "Macule", "Vésicule", "Purpura plan"], a: [0, 1, 3],
    exp: "Question de test (QRM, barème EDN). La macule et le purpura plan n'ont pas de relief." },
  { id: "t3", cat: "chrono", type: "order", skill: "divers", topic: "le classement", oic: "OIC-TEST-A",
    q: "[TEST] Classez ces durées de la plus courte à la plus longue. Cliquez-les dans l'ordre.",
    items: ["1 minute", "1 heure", "1 jour", "1 semaine", "1 mois"],
    exp: "Question de test (classement). Une seule inversion rapporte 5 points." },
  { id: "t4", cat: "chrono", type: "qcu", skill: "calc", topic: "le calcul des jours", oic: "OIC-TEST-B",
    q: "[TEST] Combien de jours dans 3 semaines ?",
    o: ["14", "18", "21", "28", "30"], a: 2,
    exp: "Question de test (QCU) : 3 × 7 = 21." },
  { id: "t5", cat: "grav", type: "num", skill: "calc", topic: "le calcul d'un score", oic: "OIC-TEST-A",
    q: "[TEST] Un score compte 1 point par critère présent. 4 critères sur 7 sont présents : quel est le score ?",
    a: 4, tol: 0, unit: "points",
    exp: "Question de test (calcul numérique). Réponse : 4." },
  { id: "t6", cat: "grav", type: "qcu", skill: "liq", topic: "la pustule", oic: "OIC-TEST-B",
    q: "[TEST] Une pustule contient…",
    o: ["un liquide clair", "du pus (liquide trouble)", "du sang", "de l'air", "rien"], a: 1,
    exp: "Question de test (QCU). La pustule contient un liquide trouble." },
  { id: "t7", cat: "urg", type: "qroc", skill: "sol", topic: "la macule", oic: "OIC-TEST-A",
    q: "[TEST] Nom de la lésion élémentaire plane, sans relief, visible par un changement de couleur ?",
    accept: ["macule"], expected: "Macule",
    exp: "Question de test (QROC). Tapez une mauvaise réponse pour essayer le bouton « Le jury valide »." },
  { id: "t8", cat: "urg", type: "qrm", skill: "divers", topic: "les constantes", oic: "OIC-TEST-B",
    q: "[TEST] Quels paramètres font partie des constantes vitales ?",
    o: ["Fréquence cardiaque", "Pression artérielle", "Température", "Couleur des yeux", "Saturation en oxygène"], a: [0, 1, 2, 4],
    exp: "Question de test (QRM)." },
  { id: "t9", cat: "pv", type: "qroc", skill: "divers", topic: "le champ de réponse", oic: "OIC-TEST-A",
    q: "[TEST] Tapez le mot « test » pour vérifier le champ de réponse courte.",
    accept: ["test"], expected: "test",
    exp: "Question de test (QROC). Les accents et majuscules sont ignorés." },
  { id: "t10", cat: "pv", type: "qcu", skill: "divers", topic: "le barème", oic: "OIC-TEST-B",
    q: "[TEST] Dans ce jeu, combien rapporte une réponse parfaite ?",
    o: ["5 points", "10 points", "20 points", "0 point", "100 points"], a: 1,
    exp: "Question de test. Une réponse parfaite rapporte 10 points et le camembert de la catégorie." }
];

const CASES = [
  {
    id: "test1", icon: "🧸", title: "Cas test · « Le patient imaginaire »", subtitle: "Dossier fictif pour vérifier le mode équipe",
    patient: "M. Test, 72 ans (personnage fictif)",
    intro: "Ce dossier n'a aucun rapport avec les vrais cas : il sert seulement à vérifier les boutons, le scope et le calculateur.",
    blocks: [
      { h: "Antécédents", html: "Cancer de la prostate traité (fictif)." },
      { h: "Constantes", vitals: [["37,8 °C", "Température"], ["96 /min", "FC"], ["130/80", "PA"]] },
      { h: "Biologie fictive", html: "Urée <b>12 mmol/L</b> · bicarbonates <b>22 mmol/L</b> · glycémie <b>9 mmol/L</b> · surface atteinte <b>12 %</b>." }
    ],
    steps: [
      { title: "Choix unique", type: "qcu", skill: "divers", oic: "OIC-TEST-A",
        q: "[TEST] Choisissez la bonne réponse pour gagner des points, ou la mauvaise pour voir l'alarme et la chute de stabilité.",
        o: [
          { t: "Bonne décision", ok: true, pts: 5, why: "Rapporte 5 points." },
          { t: "Décision dangereuse", ok: false, pts: -5, harm: 20, why: "Fait perdre 5 points et 20 % de stabilité (alarme)." },
          { t: "Décision inutile", ok: false, pts: -1, why: "Fait perdre 1 point." }
        ],
        exp: "Étape de test : QCU d'équipe.", reveal: "Le patient fictif va bien." },
      { title: "Choix multiples", type: "qrm", skill: "divers", oic: "OIC-TEST-B",
        q: "[TEST] Cochez les deux bonnes options.",
        o: [
          { t: "Bonne option n° 1", ok: true, pts: 2, why: "Juste." },
          { t: "Bonne option n° 2", ok: true, pts: 2, miss: 10, why: "Juste, et l'oublier coûte de la stabilité." },
          { t: "Mauvaise option", ok: false, pts: -2, why: "Fausse." }
        ],
        exp: "Étape de test : QRM d'équipe avec un oubli critique possible." },
      { title: "Calculateur", type: "scorten", skill: "calc", oic: "OIC-TEST-A",
        truth: { age: true, fc: false, k: true, sc: true, uree: true, bic: false, gly: false },
        q: "[TEST] Remplissez le calculateur à partir du dossier fictif (âge 72, FC 96, cancer, surface 12 %, urée 12, bicarbonates 22, glycémie 9).",
        exp: "Étape de test : le score attendu est 4 (≈ 58 %)." }
    ],
    outcomes: {
      good: { emoji: "🎉", title: "Test réussi", text: "Le mode équipe fonctionne : points, stabilité, scope et calculateur." },
      mid:  { emoji: "🩹", title: "Test terminé", text: "Tout marche ; la stabilité a baissé comme prévu après les mauvaises décisions." },
      bad:  { emoji: "🕯️", title: "Test terminé (issue défavorable)", text: "Vous avez vu la fin défavorable et la musique triste : tout fonctionne." }
    }
  }
];

const SCORTEN_ITEMS = [
  { k: "age",  t: "Âge ≥ 40 ans" },
  { k: "fc",   t: "Fréquence cardiaque ≥ 120 /min" },
  { k: "k",    t: "Cancer ou hémopathie" },
  { k: "sc",   t: "Surface décollée ou décollable > 10 %" },
  { k: "uree", t: "Urée > 10 mmol/L" },
  { k: "bic",  t: "Bicarbonates < 20 mmol/L" },
  { k: "gly",  t: "Glycémie > 14 mmol/L" }
];
const SCORTEN_MORT = [["0-1", "≈ 3 %"], ["2", "≈ 12 %"], ["3", "≈ 35 %"], ["4", "≈ 58 %"], ["≥ 5", "> 90 %"]];
const REGISCAR_ITEMS = [];
const REGISCAR_CLASSES = [];

const ESSENTIALS = [
  "Ceci est une page de test : les vraies notions de l'item 115 sont dans le vrai jeu.",
  "Vésicule : petite élevure à contenu clair ; pustule : contenu trouble (exemple).",
  "Macule : lésion plane ; papule et nodule : lésions solides en relief (exemple)."
];

const COURSE_FX = {
  "d-1": {
    cards: [["[TEST] Taille d'une vésicule ?", "Moins de 5 mm (souvent 1 à 2 mm)."], ["[TEST] Contenu d'une pustule ?", "Un liquide trouble (du pus)."]],
    game: { type: "match", title: "Test : associer chaque lésion à sa définition",
      pairs: [["Vésicule", "Petite, liquide clair"], ["Bulle", "Plus de 5 mm, liquide clair"], ["Pustule", "Liquide trouble"]] }
  },
  "d-2": {
    cards: [["[TEST] Taille d'une papule ?", "Moins de 1 cm."], ["[TEST] Une macule a-t-elle du relief ?", "Non, elle est plane."]],
    game: { type: "sort", title: "Test : sans relief ou en relief ?", buckets: ["Sans relief", "En relief"],
      items: [["Macule", 0], ["Érythème", 0], ["Purpura plan", 0], ["Papule", 1], ["Nodule", 1], ["Vésicule", 1]] }
  },
  "d-3": {
    cards: [["[TEST] Que faire avant de révéler une photo ?", "La décrire à voix haute : lésion élémentaire, topographie, couleur."]],
    game: { type: "photo", title: "Test : photo-quiz", ask: "quelle lésion élémentaire ?",
      choices: ["Macule", "Papule", "Vésicule", "Pustule"], items: [["demo_vesicules", "Vésicule"]] }
  }
};
