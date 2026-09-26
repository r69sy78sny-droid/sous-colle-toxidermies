/* =====================================================================
   DONNÉES PÉDAGOGIQUES — Item 115 Toxidermies (LiSA 2026) + item 325
   ===================================================================== */

const IMG = __IMAGES__;

const CATS = [
  { id: "semio",  name: "Sémiologie & Diagnostic différentiel",               short: "Sémiologie",        icon: "🔍", css: "--c-semio" },
  { id: "chrono", name: "Chronologie, Imputabilité & Médicaments coupables",  short: "Chronologie",       icon: "⏱",  css: "--c-chrono" },
  { id: "grav",   name: "Critères de gravité & Scores pronostiques",          short: "Gravité & scores",  icon: "⚠",  css: "--c-grav" },
  { id: "urg",    name: "Urgences & Prise en charge thérapeutique",           short: "Urgences",          icon: "✚",  css: "--c-urg" },
  { id: "pv",     name: "Pharmacovigilance & Suites médico-légales",          short: "Pharmacovigilance", icon: "⚖",  css: "--c-pv" }
];

const OIC = {
  "OIC-115-01-A": "Connaître la définition d'une toxidermie",
  "OIC-115-02-B": "Connaître les différents mécanismes des toxidermies",
  "OIC-115-03-B": "Connaître la fréquence des toxidermies, le type le plus fréquent, le pronostic habituel",
  "OIC-115-04-B": "Connaître les deux mécanismes de photosensibilité",
  "OIC-115-05-B": "Connaître le rôle des infections virales et de l'immunosuppression",
  "OIC-115-06-A": "Savoir reconnaître une nécrolyse épidermique toxique (Stevens-Johnson et Lyell)",
  "OIC-115-07-A": "Savoir reconnaître une urticaire médicamenteuse nécessitant l'arrêt du médicament",
  "OIC-115-08-A": "Savoir reconnaître un angiœdème et un choc anaphylactique médicamenteux",
  "OIC-115-09-A": "Connaître les différents types de lésions cutanées induites par un médicament",
  "OIC-115-10-A": "Savoir imputer un médicament devant une manifestation cutanée",
  "OIC-115-11-A": "Savoir reconnaître un DRESS",
  "OIC-325-01-A": "Item 325 · Définition d'un effet indésirable médicamenteux",
  "OIC-325-08-A": "Item 325 · Objectifs et principes de la pharmacovigilance",
  "OIC-325-09-B": "Item 325 · Principe d'imputabilité",
  "OIC-325-10-A": "Item 325 · Déclaration d'un effet indésirable médicamenteux",
  "OIC-325-20-B": "Item 325 · Responsabilité sans faute et rôle de l'ONIAM",
  "OIC-325-21-B": "Item 325 · Modalités de saisine de l'ONIAM",
  "OIC-332-13-A": "Item 332 · Prise en charge du choc anaphylactique"
};

/* Compétences suivies dans le bilan. "the" sert à écrire les phrases du bilan. */
const SKILLS = {
  emp:      { label: "Exanthème maculo-papuleux",             the: "l'exanthème maculo-papuleux",           sec: "c-semio" },
  urti:     { label: "Urticaire, angiœdème, anaphylaxie",     the: "l'urticaire et l'anaphylaxie",           sec: "c-semio" },
  peag:     { label: "PEAG",                                  the: "la PEAG",                                sec: "c-urg" },
  net:      { label: "Nécrolyse épidermique (SJS/Lyell)",     the: "la nécrolyse épidermique",               sec: "c-urg" },
  dress:    { label: "DRESS",                                 the: "le DRESS",                               sec: "c-urg" },
  epf:      { label: "Érythème pigmenté fixe",                the: "l'érythème pigmenté fixe",               sec: "c-semio" },
  photo:    { label: "Photosensibilité",                      the: "la photosensibilité",                    sec: "c-semio" },
  autres:   { label: "Autres toxidermies",                    the: "les toxidermies des thérapies ciblées",  sec: "c-semio" },
  delais:   { label: "Délais d'apparition",                   the: "les délais d'imputabilité",              sec: "c-chrono" },
  imput:    { label: "Imputabilité & médicaments coupables",  the: "l'imputabilité",                         sec: "c-imput" },
  meca:     { label: "Mécanismes, terrain, épidémiologie",    the: "les mécanismes et le terrain",           sec: "c-def" },
  grav:     { label: "Signes de gravité",                     the: "les signes de gravité",                  sec: "c-semio" },
  scorten:  { label: "SCORTEN",                               the: "le SCORTEN",                             sec: "c-scores" },
  regiscar: { label: "RegiSCAR",                              the: "le RegiSCAR",                            sec: "c-scores" },
  ttt:      { label: "Traitement",                            the: "la prise en charge thérapeutique",       sec: "c-cat" },
  pv:       { label: "Pharmacovigilance",                     the: "la pharmacovigilance",                   sec: "c-pv" },
  ml:       { label: "Suites médico-légales",                 the: "les suites médico-légales",              sec: "c-pv" }
};

/* ---------------------------------------------------------------------
   BANQUE DE QUESTIONS DU TRIVIAL (61 questions, 11 à 13 par catégorie)
   type : qcu | qrm | qroc | num | order
   col  : true si la réponse s'appuie sur le Collège au-delà de la fiche LiSA
   --------------------------------------------------------------------- */
const QUESTIONS = [
  /* ================== 1. SÉMIOLOGIE & DIAGNOSTIC DIFFÉRENTIEL ================== */
  { id: "s1", cat: "semio", type: "qrm", skill: "emp", topic: "la sémiologie de l'EMP", oic: "OIC-115-09-A", img: "emp_dos",
    q: "Exanthème maculo-papuleux (EMP) médicamenteux : quelles caractéristiques sont habituelles ?",
    o: ["Polymorphisme des lésions (macules, papules, parfois plaques)",
        "Aspect morbilliforme (intervalles de peau saine) ou scarlatiniforme (nappes sans intervalle)",
        "Érosions muqueuses multifocales au premier plan",
        "Prurit fréquent",
        "Signe de Nikolsky positif"],
    a: [0, 1, 3],
    exp: "L'EMP est la toxidermie la plus fréquente (<b>40 à 60 %</b> des notifications). Lésions <b>polymorphes</b>, morbilliformes ou scarlatiniformes, souvent prurigineuses. <b>Pas d'énanthème</b> en règle : une atteinte muqueuse érosive ou un Nikolsky doivent faire évoquer une nécrolyse épidermique. Délai typique : <b>4 à 14 jours</b>." },

  { id: "s2", cat: "semio", type: "qcu", skill: "peag", topic: "la reconnaissance d'une PEAG", oic: "OIC-115-09-A", img: "peag",
    q: "Femme de 72 ans. Fièvre à 39,5 °C d'installation brutale 2 jours après le début de pristinamycine. Érythème en nappe prédominant dans les grands plis, couvert de très nombreuses petites pustules non folliculaires. PNN à 14 G/L. Diagnostic le plus probable ?",
    o: ["Psoriasis pustuleux généralisé", "Pustulose exanthématique aiguë généralisée (PEAG)", "Folliculite staphylococcique diffuse", "DRESS", "Varicelle de l'adulte"],
    a: 1,
    exp: "Triade évocatrice : <b>début brutal fébrile</b>, <b>érythème en nappe des grands plis</b>, <b>pustules amicrobiennes non folliculaires</b>, avec hyperleucocytose à PNN. Délai court : <b>1 à 11 jours</b>. Principal diagnostic différentiel : le psoriasis pustuleux (antécédent de psoriasis, début moins brutal). Médicaments classiques (Collège) : aminopénicillines, <b>pristinamycine</b>, diltiazem, hydroxychloroquine, terbinafine." },

  { id: "s3", cat: "semio", type: "qrm", skill: "net", topic: "les signes de la nécrolyse épidermique", oic: "OIC-115-06-A", img: "lyell_dos",
    q: "Quels signes sont en faveur d'une nécrolyse épidermique toxique (Stevens-Johnson / Lyell) ?",
    o: ["Signe de Nikolsky : l'épiderme se détache au frottement d'une peau d'aspect sain",
        "Érosions muqueuses multifocales (bouche, yeux, organes génitaux)",
        "Pustules folliculaires centrées par un poil",
        "Décollements en lambeaux, aspect de « linge mouillé »",
        "Cocardes typiques à trois zones concentriques prédominant aux extrémités"],
    a: [0, 1, 3],
    exp: "La NET associe <b>érosions muqueuses multifocales</b>, <b>bulles et décollements</b> cutanés et <b>Nikolsky positif</b>, dans un contexte fébrile avec douleurs ou brûlures cutanées, <b>4 à 28 jours</b> après l'introduction du médicament. Les <b>cocardes typiques des extrémités</b> orientent vers un érythème polymorphe." },

  { id: "s4", cat: "semio", type: "qcu", skill: "net", topic: "le diagnostic différentiel NET / épidermolyse staphylococcique", oic: "OIC-115-06-A", col: true, img: "ssss",
    q: "Enfant de 3 ans, impétigo péri-orificiel il y a 4 jours. Fièvre, érythème douloureux des plis et autour des orifices, puis décollement superficiel avec Nikolsky positif. AUCUNE érosion muqueuse. Aucun médicament. Diagnostic ?",
    o: ["Syndrome de Stevens-Johnson", "Syndrome de Lyell", "Épidermolyse staphylococcique aiguë (SSSS)", "PEAG", "Érythème pigmenté fixe bulleux généralisé"],
    a: 2,
    exp: "L'épidermolyse staphylococcique est due à une <b>toxine exfoliante</b> qui clive l'épiderme <b>très superficiellement</b> : Nikolsky positif mais <b>muqueuses épargnées</b>, jeune enfant, foyer staphylococcique, pas de médicament. Dans la NET, la nécrose touche <b>toute l'épaisseur</b> de l'épiderme et les muqueuses sont atteintes. La biopsie tranche." },

  { id: "s5", cat: "semio", type: "qcu", skill: "epf", topic: "la reconnaissance de l'EPF", oic: "OIC-115-09-A", img: "epf",
    q: "Homme de 30 ans. Troisième épisode en un an : une macule arrondie de 3 cm, rouge violacé, infiltrée, avec brûlure, sur la lèvre inférieure, survenue moins de 48 h après la prise d'un AINS. Elle récidive toujours au même endroit et laisse une pigmentation brune. Diagnostic ?",
    o: ["Herpès labial récurrent", "Érythème pigmenté fixe", "Érythème polymorphe", "Urticaire", "Lichen plan buccal"],
    a: 1,
    exp: "L'EPF est la toxidermie <b>spécifiquement médicamenteuse</b> : 1 à 10 macules ou plaques arrondies de quelques centimètres, douloureuses, <b>récidivant au même site</b> à chaque prise, en <b>moins de 48 h</b>, avec pigmentation résiduelle. Sièges préférentiels : <b>lèvres et organes génitaux</b>. Forme bulleuse généralisée possible. Médicaments fréquents (Collège) : AINS, paracétamol, sulfamides, cyclines." },

  { id: "s6", cat: "semio", type: "qrm", skill: "urti", topic: "la sémiologie de l'urticaire", oic: "OIC-115-07-A", img: "urticaire",
    q: "Quelles caractéristiques définissent une urticaire superficielle ?",
    o: ["Papules œdémateuses entourées d'un halo érythémateux",
        "Prurit",
        "Chaque lésion disparaît en 24 à 48 h sans laisser de trace",
        "Lésions labiles dans le temps et dans l'espace (migratrices)",
        "Lésions fixes pendant plusieurs jours puis desquamation"],
    a: [0, 1, 2, 3],
    exp: "Urticaire : papules <b>œdémateuses</b> érythémateuses, <b>prurigineuses</b>, <b>fugaces et migratrices</b> (chaque élément disparaît en 24-48 h sans trace), quelques minutes à quelques heures après la prise. Des lésions fixes au-delà de 48 h ou laissant une trace doivent faire évoquer un autre diagnostic." },

  { id: "s7", cat: "semio", type: "qrm", skill: "urti", topic: "les signes d'anaphylaxie", oic: "OIC-115-08-A", img: "angioedeme",
    q: "Urticaire aiguë 20 minutes après une injection IV de céfazoline. Quels signes font redouter une anaphylaxie ?",
    o: ["Dysphonie, hypersialorrhée", "Dyspnée, bronchospasme", "Hypotension artérielle, tachycardie ou bradycardie", "Nausées, vomissements, diarrhée", "Dermographisme"],
    a: [0, 1, 2, 3],
    exp: "Devant toute urticaire superficielle et/ou profonde (angiœdème), rechercher des signes <b>respiratoires</b> (hypersialorrhée, dysphonie, dyspnée, bronchospasme), <b>cardiovasculaires</b> (tachy- ou bradycardie, hypotension) et <b>digestifs</b> (nausées, vomissements, diarrhée). Leur présence impose un traitement en urgence par <b>adrénaline IM</b>." },

  { id: "s8", cat: "semio", type: "qcu", skill: "photo", topic: "les deux mécanismes de photosensibilité", oic: "OIC-115-04-B", img: "photo",
    q: "Éruption eczématiforme très prurigineuse débutant au visage et au dos des mains 12 jours après le début d'un traitement, déclenchée par une exposition solaire minime, puis s'étendant aux zones couvertes. Mécanisme le plus probable ?",
    o: ["Phototoxicité", "Photoallergie", "Urticaire solaire", "Lupus induit", "Coup de soleil simple"],
    a: 1,
    exp: "<b>Phototoxicité</b> : quelques heures après l'exposition, dépend de la dose de médicament ET d'UVA, aspect de coup de soleil ± bulles, <b>strictement limitée</b> aux zones exposées. <b>Photoallergie</b> : délai de <b>7 à 21 jours</b>, expositions minimes suffisantes, aspect <b>eczématiforme</b>, <b>débordant</b> les zones exposées." },

  { id: "s9", cat: "semio", type: "qrm", skill: "autres", topic: "les toxidermies des biothérapies et thérapies ciblées", oic: "OIC-115-09-A",
    q: "Quelles associations médicament → réaction cutanée sont exactes ?",
    o: ["Anti-TNFα → lésions psoriasiformes (paumes, plantes, cuir chevelu)",
        "Anti-EGFR → éruption acnéiforme papulo-pustuleuse du visage et du tronc",
        "Rétinoïdes → chéilite, par effet pharmacodynamique",
        "Antimitotiques → alopécie par hypersensibilité retardée",
        "Lupus subaigu induit → lésions annulaires du décolleté et du dos après des semaines ou des mois de traitement"],
    a: [0, 1, 2, 4],
    exp: "Réactions <b>psoriasiformes</b> chez environ 5 % des patients sous biomédicaments (surtout <b>anti-TNFα</b>). Éruptions <b>acnéiformes</b> : toxicité spécifique des <b>anti-EGFR</b>. Chéilite des rétinoïdes et alopécie des antimitotiques : mécanisme <b>non immunologique</b> (pharmacodynamique, dose-dépendant, prévisible). <b>Lupus subaigu</b> : lésions annulaires érythémateuses du décolleté et du dos." },

  { id: "s10", cat: "semio", type: "qrm", skill: "dress", topic: "la reconnaissance du DRESS", oic: "OIC-115-11-A", img: "erythrodermie",
    q: "Quels éléments du tableau clinico-biologique évoquent un DRESS ?",
    o: ["Œdème du visage", "Adénopathies diffuses", "Fièvre élevée", "Hyperéosinophilie et/ou syndrome mononucléosique", "Délai d'apparition inférieur à 48 h"],
    a: [0, 1, 2, 3],
    exp: "DRESS : éruption <b>infiltrée</b> (de l'EMP à l'érythrodermie), <b>œdème du visage</b> et des extrémités, <b>fièvre élevée</b>, <b>adénopathies diffuses</b>, <b>hyperéosinophilie et/ou lymphocytose avec syndrome mononucléosique</b>, atteintes viscérales. Délai : <b>2 à 6 semaines</b>, jamais moins de 48 h." },

  { id: "s11", cat: "semio", type: "qcu", skill: "net", topic: "le diagnostic différentiel SJS / érythème polymorphe", oic: "OIC-115-06-A", col: true, img: "ep",
    q: "Jeune femme. Cocardes typiques (trois zones concentriques) prédominant aux mains et aux coudes, érosions buccales. Deux épisodes identiques l'an dernier, chacun précédé d'un herpès labial. Aucun médicament. Diagnostic ?",
    o: ["Syndrome de Stevens-Johnson", "Érythème polymorphe", "Urticaire", "Érythème pigmenté fixe", "PEAG"],
    a: 1,
    exp: "L'<b>érythème polymorphe</b> (majeur s'il y a une atteinte muqueuse) est surtout <b>post-infectieux</b> (herpès, <i>Mycoplasma pneumoniae</i>) et récidivant, avec des <b>cocardes typiques des extrémités</b>. Le SJS est médicamenteux, avec des macules sombres ou des cocardes atypiques <b>du tronc</b> et un Nikolsky positif." },

  { id: "s12", cat: "semio", type: "qroc", skill: "net", topic: "le signe de Nikolsky", oic: "OIC-115-06-A",
    q: "Comment s'appelle le signe clinique où l'épiderme se détache au simple frottement d'une peau d'apparence saine ?",
    accept: ["nikolsky", "nikolski", "nicolsky"], expected: "Signe de Nikolsky",
    exp: "Le <b>signe de Nikolsky</b> traduit la perte de cohésion de l'épiderme. Au cours d'une toxidermie, il signe la <b>nécrolyse épidermique</b> (SJS/Lyell) : urgence vitale. Il existe aussi dans l'épidermolyse staphylococcique et le pemphigus." },

  { id: "s13", cat: "semio", type: "qcu", skill: "meca", topic: "la définition d'une toxidermie", oic: "OIC-115-01-A",
    q: "Quelle est la définition d'une toxidermie ?",
    o: ["Toute réaction cutanée IgE-médiée à un médicament",
        "Tout effet cutané indésirable d'un médicament administré à dose thérapeutique, quelle que soit la voie",
        "Toute réaction cutanée à un médicament pris par voie orale",
        "Toute réaction cutanée survenant lors d'un surdosage médicamenteux",
        "Toute éruption fébrile de l'adulte sous traitement"],
    a: 1,
    exp: "Une toxidermie est <b>tout effet cutané indésirable</b> d'un médicament administré <b>à dose thérapeutique</b>, quelle que soit la voie : orale, injectable, sous-cutanée, <b>topique</b>… <b>Tout médicament</b> peut être en cause, et tous les mécanismes (pas seulement IgE)." },

  /* ================== 2. CHRONOLOGIE, IMPUTABILITÉ & MÉDICAMENTS ================== */
  { id: "c1", cat: "chrono", type: "qcu", skill: "delais", topic: "le délai du DRESS", oic: "OIC-115-11-A",
    q: "Délai habituel entre l'introduction du médicament et l'apparition d'un DRESS ?",
    o: ["Quelques minutes à quelques heures", "Moins de 48 heures", "4 à 14 jours", "2 à 6 semaines", "Plus de 6 mois"],
    a: 3,
    exp: "DRESS : <b>2 à 6 semaines</b> (LiSA). C'est la plus tardive des toxidermies graves, ce qui fait souvent oublier d'incriminer le médicament. À distinguer de la NET (<b>4 à 28 jours</b>) et de l'EMP (<b>4 à 14 jours</b>)." },

  { id: "c2", cat: "chrono", type: "qcu", skill: "delais", topic: "le délai de la nécrolyse épidermique", oic: "OIC-115-06-A",
    q: "Délai d'apparition d'une nécrolyse épidermique toxique après l'introduction du médicament ?",
    o: ["Quelques minutes", "Moins de 48 heures", "4 à 28 jours", "2 à 6 mois", "Plus d'un an"],
    a: 2,
    exp: "NET : début <b>4 à 28 jours</b> après le début du traitement inducteur. Un médicament introduit la veille (souvent pour les prodromes) ou pris depuis des années est peu suspect." },

  { id: "c3", cat: "chrono", type: "qcu", skill: "delais", topic: "le délai de l'EMP", oic: "OIC-115-09-A",
    q: "Lors d'une première exposition, un exanthème maculo-papuleux médicamenteux apparaît typiquement…",
    o: ["dans les minutes qui suivent la prise", "en moins de 48 heures", "entre 4 et 14 jours", "entre 2 et 6 semaines", "après plusieurs mois"],
    a: 2,
    exp: "EMP : <b>4 à 14 jours</b> après l'introduction. En cas de réexposition d'un patient déjà sensibilisé, le délai est raccourci (1 à 2 jours, Collège)." },

  { id: "c4", cat: "chrono", type: "order", skill: "delais", topic: "la chronologie comparée des toxidermies", oic: "OIC-115-09-A",
    q: "Classez ces toxidermies de la plus précoce à la plus tardive (délai habituel après l'introduction du médicament). Cliquez-les dans l'ordre.",
    items: ["Urticaire", "Érythème pigmenté fixe", "PEAG", "Exanthème maculo-papuleux", "DRESS"],
    exp: "<b>Urticaire</b> (minutes-heures) → <b>EPF</b> (&lt; 48 h) → <b>PEAG</b> (1-11 j) → <b>EMP</b> (4-14 j) → <b>DRESS</b> (2-6 semaines). La NET (4-28 j) se place entre l'EMP et le DRESS." },

  { id: "c5", cat: "chrono", type: "qrm", skill: "imput", topic: "l'imputabilité intrinsèque et extrinsèque", oic: "OIC-115-10-A",
    q: "Quels critères relèvent de l'imputabilité INTRINSÈQUE ?",
    o: ["Délai compatible entre l'introduction du médicament et l'éruption",
        "Évolution favorable à l'arrêt du médicament",
        "Antécédent de réaction au même médicament",
        "Sémiologie compatible avec le médicament suspecté",
        "Nombre de cas similaires publiés (notoriété du médicament)"],
    a: [0, 1, 2, 3],
    exp: "<b>Intrinsèque</b> = l'histoire du patient : chronologie, évolution à l'arrêt, antécédent au même médicament, sémiologie compatible. <b>Extrinsèque</b> = la <b>notoriété</b> du médicament (accidents identiques connus). Conclusion : médicament(s) suspect(s) contre-indiqué(s) et <b>carte d'allergie</b>." },

  { id: "c6", cat: "chrono", type: "qcu", skill: "imput", topic: "l'imputabilité devant une NET", oic: "OIC-115-10-A",
    q: "Femme de 45 ans, nécrolyse épidermique débutant aujourd'hui. Traitements : lévothyroxine (5 ans), oméprazole (2 ans), lamotrigine (introduite il y a 18 jours), paracétamol (depuis 3 jours pour fièvre et mal de gorge). Médicament le plus suspect ?",
    o: ["Lévothyroxine", "Oméprazole", "Lamotrigine", "Paracétamol", "Tous au même titre"],
    a: 2,
    exp: "<b>Lamotrigine</b> : délai compatible (4-28 j) et molécule à haut risque. Le paracétamol a été pris pour les <b>prodromes</b> (fièvre, pharyngite) de la NET, donc après le début de la maladie (biais protopathique). Les traitements pris depuis des années sont très peu suspects." },

  { id: "c7", cat: "chrono", type: "qrm", skill: "imput", topic: "les médicaments à haut risque de toxidermie grave", oic: "OIC-115-10-A", col: true,
    q: "Quels médicaments sont à haut risque de toxidermie grave (NET et/ou DRESS) ?",
    o: ["Allopurinol", "Carbamazépine", "Cotrimoxazole (sulfaméthoxazole-triméthoprime)", "Névirapine", "Lévothyroxine"],
    a: [0, 1, 2, 3],
    exp: "Médicaments à haut risque (Collège) : <b>allopurinol</b>, <b>antiépileptiques</b> (carbamazépine, oxcarbazépine, phénytoïne, phénobarbital, lamotrigine), <b>sulfamides</b> anti-infectieux, sulfasalazine, dapsone, <b>AINS</b> (oxicams), <b>névirapine</b>." },

  { id: "c8", cat: "chrono", type: "qrm", skill: "imput", topic: "les médicaments de la PEAG", oic: "OIC-115-09-A", col: true,
    q: "Quels médicaments sont classiquement responsables de PEAG ?",
    o: ["Aminopénicillines", "Pristinamycine", "Diltiazem", "Hydroxychloroquine", "Metformine"],
    a: [0, 1, 2, 3],
    exp: "PEAG (Collège) : <b>aminopénicillines</b>, <b>pristinamycine</b>, <b>diltiazem</b>, <b>hydroxychloroquine</b>, terbinafine. Délai court, 1 à 11 jours." },

  { id: "c9", cat: "chrono", type: "qcu", skill: "meca", topic: "les associations HLA", oic: "OIC-115-02-B", col: true,
    q: "Avant de prescrire de la carbamazépine à un patient originaire de Chine (Han), de Thaïlande ou de Malaisie, quel génotypage HLA est recommandé pour prévenir une NET ?",
    o: ["HLA-B*15:02", "HLA-B*58:01", "HLA-B*57:01", "HLA-B27", "HLA-DQ2"],
    a: 0,
    exp: "<b>HLA-B*15:02</b> : carbamazépine et NET (Asie du Sud-Est). <b>HLA-B*58:01</b> : allopurinol et NET ou DRESS. <b>HLA-B*57:01</b> : abacavir et syndrome d'hypersensibilité (dépistage systématique avant abacavir)." },

  { id: "c10", cat: "chrono", type: "qrm", skill: "meca", topic: "les réactivations virales du DRESS", oic: "OIC-115-05-B",
    q: "La réactivation de quels virus est associée au DRESS ?",
    o: ["HHV-6", "HHV-7", "EBV", "CMV", "Papillomavirus (HPV)"],
    a: [0, 1, 2, 3],
    exp: "Le DRESS s'accompagne de <b>réactivations des virus du groupe herpès : HHV-6, HHV-7, EBV et CMV</b>. Elles expliquent en partie les <b>poussées successives</b>." },

  { id: "c11", cat: "chrono", type: "qrm", skill: "meca", topic: "les facteurs favorisants", oic: "OIC-115-05-B",
    q: "Quels facteurs favorisent la survenue d'une toxidermie ?",
    o: ["Infection par le VIH", "Immunosuppression, quelle qu'en soit la cause", "Mononucléose infectieuse (EBV) traitée par aminopénicilline", "Tabagisme", "Âge inférieur à 10 ans"],
    a: [0, 1, 2],
    exp: "Le <b>VIH</b> augmente le risque de toxidermie ; toute <b>immunosuppression</b> est un facteur favorisant (LiSA). L'<b>EBV</b> sous aminopénicilline donne très souvent un exanthème (Collège)." },

  { id: "c12", cat: "chrono", type: "qroc", skill: "epf", topic: "l'EPF", oic: "OIC-115-09-A",
    q: "Quelle toxidermie récidive AU MÊME ENDROIT à chaque nouvelle prise du médicament responsable ?",
    accept: ["erytheme pigmente fixe", "epf", "erytheme fixe", "fixed drug eruption", "toxidermie fixe", "eruption fixe"], expected: "Érythème pigmenté fixe (EPF)",
    exp: "L'<b>érythème pigmenté fixe</b> récidive au même site, en moins de 48 h, et laisse une pigmentation. Lèvres et organes génitaux sont les sièges préférentiels." },

  { id: "c13", cat: "chrono", type: "qrm", skill: "meca", topic: "les mécanismes des toxidermies", oic: "OIC-115-02-B",
    q: "Toxidermies non immunologiques et immuno-allergiques : quelles affirmations sont exactes ?",
    o: ["Les toxidermies non immunologiques sont fréquentes, dose-dépendantes et prévisibles",
        "Les toxidermies immuno-allergiques sont dose-dépendantes",
        "Les toxidermies immuno-allergiques sont imprévisibles",
        "Un même tableau clinique peut relever de mécanismes différents",
        "La mortalité des formes immuno-allergiques peut atteindre 25 % (nécrolyse épidermique)"],
    a: [0, 2, 3, 4],
    exp: "<b>Non immunologique</b> : effet pharmacodynamique, fréquent, <b>dose-dépendant</b>, <b>prévisible</b> (chéilite des rétinoïdes). <b>Immunologique</b> : IgE-médiée ou retardée, peu fréquente, <b>non dose-dépendante</b>, <b>imprévisible</b>, mortalité jusqu'à 25 % pour une NET. Un même tableau peut relever des deux mécanismes." },

  /* ================== 3. GRAVITÉ & SCORES ================== */
  { id: "g1", cat: "grav", type: "qrm", skill: "grav", topic: "les signes de gravité d'une éruption médicamenteuse", oic: "OIC-115-09-A", col: true,
    q: "Devant une éruption médicamenteuse, quels signes doivent faire craindre une forme grave ?",
    o: ["Fièvre élevée, altération de l'état général", "Douleurs ou brûlures cutanées", "Érosions muqueuses", "Œdème du visage, adénopathies", "Prurit"],
    a: [0, 1, 2, 3],
    exp: "Signes de gravité (Collège) : fièvre élevée, altération de l'état général, <b>douleurs cutanées</b>, <b>érosions muqueuses</b>, bulles, <b>Nikolsky</b>, purpura, nécrose, <b>œdème du visage</b>, adénopathies, extension rapide, érythrodermie ; biologie : éosinophilie, lymphocytes atypiques, cytolyse, insuffisance rénale. Le <b>prurit</b> n'est pas un signe de gravité." },

  { id: "g2", cat: "grav", type: "qcu", skill: "net", topic: "la classification SJS / chevauchement / Lyell", oic: "OIC-115-06-A", img: "net_precoce",
    q: "Nécrolyse épidermique avec 18 % de surface corporelle décollée ou décollable. Classification ?",
    o: ["Syndrome de Stevens-Johnson (< 10 %)", "Syndrome de chevauchement SJS/NET (10 à 30 %)", "Syndrome de Lyell (≥ 30 %)", "Érythème polymorphe majeur", "PEAG"],
    a: 1,
    exp: "<b>SJS &lt; 10 %</b>, <b>chevauchement 10-30 %</b>, <b>Lyell ≥ 30 %</b>. La surface se calcule sur l'épiderme <b>décollé + décollable</b> (Nikolsky positif), pas sur l'érythème seul." },

  { id: "g3", cat: "grav", type: "qrm", skill: "scorten", topic: "les items du SCORTEN", oic: "OIC-115-06-A", col: true,
    q: "Quels items composent le SCORTEN ?",
    o: ["Âge ≥ 40 ans", "Fréquence cardiaque ≥ 120 /min", "Urée sanguine > 10 mmol/L", "Bicarbonates < 20 mmol/L", "Éosinophiles > 1,5 G/L"],
    a: [0, 1, 2, 3],
    exp: "SCORTEN, 7 items à 1 point : <b>âge ≥ 40 ans</b>, <b>FC ≥ 120/min</b>, <b>cancer ou hémopathie</b>, <b>surface décollée &gt; 10 %</b>, <b>urée &gt; 10 mmol/L</b>, <b>bicarbonates &lt; 20 mmol/L</b>, <b>glycémie &gt; 14 mmol/L</b>. L'éosinophilie appartient au DRESS (RegiSCAR)." },

  { id: "g4", cat: "grav", type: "num", skill: "scorten", topic: "le calcul du SCORTEN", oic: "OIC-115-06-A", col: true,
    q: "Homme de 52 ans, cancer bronchique en cours de traitement. FC 128 /min. Décollement 25 %. Urée 8 mmol/L, bicarbonates 18 mmol/L, glycémie 16 mmol/L. Calculez le SCORTEN.",
    a: 6, tol: 0, unit: "points",
    exp: "Âge ≥ 40 (1) + FC ≥ 120 (1) + cancer (1) + surface &gt; 10 % (1) + urée 8 ≤ 10 (0) + bicarbonates 18 &lt; 20 (1) + glycémie 16 &gt; 14 (1) = <b>6</b>, soit une mortalité prédite <b>&gt; 90 %</b>." },

  { id: "g5", cat: "grav", type: "qcu", skill: "scorten", topic: "l'interprétation du SCORTEN", oic: "OIC-115-06-A", col: true,
    q: "Un SCORTEN à 3 correspond à une mortalité prédite d'environ…",
    o: ["3 %", "12 %", "35 %", "58 %", "> 90 %"],
    a: 2,
    exp: "SCORTEN 0-1 : 3 % · 2 : 12 % · <b>3 : 35 %</b> · 4 : 58 % · ≥ 5 : &gt; 90 %." },

  { id: "g6", cat: "grav", type: "qrm", skill: "regiscar", topic: "les items du RegiSCAR", oic: "OIC-115-11-A", col: true,
    q: "Quels éléments sont cotés dans le score RegiSCAR du DRESS ?",
    o: ["Fièvre ≥ 38,5 °C", "Adénopathies > 1 cm dans au moins 2 aires", "Éosinophilie", "Lymphocytes atypiques", "Signe de Nikolsky"],
    a: [0, 1, 2, 3],
    exp: "RegiSCAR : fièvre, adénopathies, éosinophilie, lymphocytes atypiques, éruption &gt; 50 %, éruption évocatrice (œdème du visage, infiltration, desquamation, purpura), biopsie, atteinte d'organes, évolution ≥ 15 jours, autres causes éliminées. Le Nikolsky n'y figure pas." },

  { id: "g7", cat: "grav", type: "qcu", skill: "regiscar", topic: "l'interprétation du RegiSCAR", oic: "OIC-115-11-A", col: true,
    q: "Score RegiSCAR à 6 : quelle conclusion ?",
    o: ["DRESS exclu (< 2)", "DRESS possible (2-3)", "DRESS probable (4-5)", "DRESS certain (> 5)"],
    a: 3,
    exp: "RegiSCAR : <b>&lt; 2</b> exclu · <b>2-3</b> possible · <b>4-5</b> probable · <b>&gt; 5</b> certain." },

  { id: "g8", cat: "grav", type: "qcu", skill: "net", topic: "le pronostic de la NET", oic: "OIC-115-02-B",
    q: "Quelle est la mortalité d'une nécrolyse épidermique toxique ?",
    o: ["< 1 %", "Environ 5 %", "Jusqu'à 20-25 %", "Environ 60 %", "> 90 %"],
    a: 2,
    exp: "La mortalité de la nécrolyse épidermique peut atteindre <b>25 %</b> (LiSA). Elle augmente avec l'étendue du décollement, l'âge et les comorbidités, d'où le SCORTEN." },

  { id: "g9", cat: "grav", type: "qrm", skill: "dress", topic: "les atteintes viscérales du DRESS", oic: "OIC-115-11-A",
    q: "Quelles atteintes viscérales du DRESS peuvent engager le pronostic vital ?",
    o: ["Hépatite, jusqu'à l'insuffisance hépatique aiguë", "Néphropathie interstitielle", "Méningite bactérienne", "Myocardite", "Syndrome d'activation macrophagique"],
    a: [0, 1, 3, 4],
    exp: "Atteintes du DRESS : <b>hépatite</b>, <b>néphropathie interstitielle</b>, <b>pneumopathie interstitielle</b>, <b>myocardite</b>, <b>syndrome d'activation macrophagique</b>. Pas de méningite bactérienne : la fièvre du DRESS est inflammatoire." },

  { id: "g10", cat: "grav", type: "qrm", skill: "meca", topic: "l'épidémiologie des toxidermies", oic: "OIC-115-03-B",
    q: "Épidémiologie des toxidermies : quelles affirmations sont exactes ?",
    o: ["L'EMP représente 40 à 60 % des notifications", "L'urticaire représente 20 à 30 % des notifications", "Plus de 90 % des toxidermies sont bénignes", "Les formes graves concernent environ 1 patient traité sur 100", "La prévalence hospitalière est comprise entre 0 et 8 % des patients exposés"],
    a: [0, 1, 2, 4],
    exp: "EMP <b>40-60 %</b>, urticaire <b>20-30 %</b>, <b>&gt; 90 % bénignes</b>, prévalence hospitalière <b>0 à 8 %</b>. Les formes graves sont exceptionnelles : <b>1 cas pour 10 000 à 1 000 000</b> de patients traités." },

  { id: "g11", cat: "grav", type: "qrm", skill: "net", topic: "les séquelles de la NET", oic: "OIC-115-06-A",
    q: "Quelles séquelles peuvent persister après une nécrolyse épidermique ?",
    o: ["Baisse d'acuité visuelle, photophobie", "Troubles pigmentaires et cicatrices", "Syndrome de stress post-traumatique", "Évolution vers un psoriasis", "Syndrome sec oculaire"],
    a: [0, 1, 2, 4],
    exp: "Réépithélialisation en 10 à 30 jours, avec des <b>séquelles fréquentes</b> : baisse de l'acuité visuelle, photophobie, <b>syndrome sec</b> (Collège), troubles pigmentaires, cicatrices, <b>stress post-traumatique</b>." },

  { id: "g12", cat: "grav", type: "qroc", skill: "scorten", topic: "le nom du score de la NET", oic: "OIC-115-06-A", col: true,
    q: "Quel score, calculé à l'admission, prédit la mortalité d'une nécrolyse épidermique ?",
    accept: ["scorten", "score ten", "scoreten"], expected: "SCORTEN",
    exp: "Le <b>SCORTEN</b> (7 items à 1 point) se calcule dans les 24 premières heures : âge, FC, cancer, surface décollée, urée, bicarbonates, glycémie." },

  /* ================== 4. URGENCES & PRISE EN CHARGE ================== */
  { id: "u1", cat: "urg", type: "qcu", skill: "urti", topic: "le traitement du choc anaphylactique", oic: "OIC-332-13-A",
    q: "Choc anaphylactique à l'amoxicilline IV chez une femme de 50 kg. Traitement de première intention ?",
    o: ["Méthylprednisolone IV 1 mg/kg", "Adrénaline IM 0,5 mg, face latérale de la cuisse", "Anti-H1 per os", "Adrénaline 1 mg en IV directe", "Remplissage vasculaire seul"],
    a: 1,
    exp: "<b>Adrénaline IM 0,01 mg/kg</b> (0,5 mg pour 50 kg), face latérale du tiers moyen de la cuisse, <b>à renouveler toutes les 5 minutes</b> si besoin, avec remplissage par cristalloïdes. La voie IV (titration à 0,001 mg/kg) est réservée aux équipes entraînées. Les corticoïdes préviennent le rebond et ne sont pas une urgence ; les anti-H1 n'agissent que sur la peau et les muqueuses." },

  { id: "u2", cat: "urg", type: "qrm", skill: "ttt", topic: "la prise en charge de la NET", oic: "OIC-115-06-A", col: true,
    q: "Nécrolyse épidermique en centre spécialisé : quelles mesures sont adaptées ?",
    o: ["Arrêt de tous les médicaments suspects et non indispensables", "Chambre chauffée (30-32 °C)", "Corticothérapie générale à forte dose", "Antibioprophylaxie systématique", "Nutrition entérale hypercalorique précoce"],
    a: [0, 1, 4],
    exp: "Traitement <b>symptomatique</b>, comme chez un brûlé : réchauffement, compensation hydroélectrolytique, <b>nutrition entérale</b>, antalgie, anticoagulation préventive, soins locaux et <b>oculaires</b>. <b>Pas de corticothérapie générale</b> (aucun bénéfice démontré, risque infectieux) et <b>pas d'antibioprophylaxie</b> : antibiotiques seulement si l'infection est documentée." },

  { id: "u3", cat: "urg", type: "qcu", skill: "net", topic: "l'urgence ophtalmologique de la NET", oic: "OIC-115-06-A", col: true, img: "sjs_oeil",
    q: "Nécrolyse épidermique avec atteinte conjonctivale. Quelle attitude oculaire est correcte ?",
    o: ["Avis ophtalmologique à la sortie de l'hôpital",
        "Examen ophtalmologique dès l'admission puis quotidien ; soins pluriquotidiens (lavages, collyres antiseptiques, vitamine A, lyse des synéchies)",
        "Pansements oculaires occlusifs secs",
        "Collyre anesthésiant au long cours",
        "Aucune mesure si l'acuité visuelle est normale"],
    a: 1,
    exp: "L'atteinte oculaire conditionne les <b>séquelles les plus invalidantes</b> (syndrome sec, synéchies, kératite, baisse de vision). <b>Examen ophtalmologique quotidien</b> et soins pluriquotidiens dès l'admission." },

  { id: "u4", cat: "urg", type: "qrm", skill: "ttt", topic: "le traitement du DRESS", oic: "OIC-115-11-A", col: true,
    q: "DRESS sans atteinte viscérale sévère : quelles mesures sont adaptées ?",
    o: ["Arrêt du médicament suspect", "Dermocorticoïdes de très forte activité", "Corticothérapie générale systématique", "Surveillance clinico-biologique prolongée (poussées, réactivations virales)", "Réintroduction à demi-dose après guérison"],
    a: [0, 1, 3],
    exp: "Sans atteinte viscérale sévère : arrêt et <b>dermocorticoïdes de très forte activité</b>. La <b>corticothérapie générale</b> est réservée aux <b>atteintes viscérales sévères</b>, avec décroissance lente. La réintroduction est contre-indiquée. Surveillance prolongée : poussées, thyroïdite ou diabète auto-immuns à distance (Collège)." },

  { id: "u5", cat: "urg", type: "qcu", skill: "emp", topic: "la conduite à tenir devant un EMP", oic: "OIC-115-09-A", img: "emp_enfant",
    q: "Enfant de 6 ans, EMP prurigineux à J8 d'amoxicilline pour une otite, sans fièvre élevée, sans atteinte muqueuse ni autre signe de gravité. Conduite à tenir ?",
    o: ["Poursuivre l'amoxicilline et ajouter un anti-H1",
        "Arrêter l'amoxicilline, traitement symptomatique (émollients ± dermocorticoïde, anti-H1 si prurit), surveillance, déclaration et bilan allergologique à distance",
        "Hospitalisation en réanimation",
        "Corticothérapie générale 1 mg/kg",
        "Test de réintroduction dès la guérison"],
    a: 1,
    exp: "EMP sans gravité : <b>arrêt</b> du médicament suspect, traitement symptomatique, surveillance (guérison en moins d'une semaine avec desquamation fine). <b>Déclaration</b> au CRPV et <b>bilan allergologique</b> à distance, pour ne pas étiqueter l'enfant « allergique à vie » à tort." },

  { id: "u6", cat: "urg", type: "qrm", skill: "peag", topic: "la prise en charge de la PEAG", oic: "OIC-115-09-A", col: true,
    q: "PEAG chez une femme de 80 ans fébrile : quelles mesures sont adaptées ?",
    o: ["Arrêt du médicament suspect", "Hospitalisation si terrain fragile ou mauvaise tolérance", "Antibiothérapie probabiliste systématique", "Soins locaux, émollients ± dermocorticoïdes", "Corticothérapie générale systématique"],
    a: [0, 1, 3],
    exp: "Les pustules de la PEAG sont <b>amicrobiennes</b> : pas d'antibiotique. Arrêt, soins locaux, dermocorticoïdes ; hospitalisation selon le terrain. Guérison rapide après l'arrêt, avec desquamation ; mortalité faible, surtout chez les sujets âgés." },

  { id: "u7", cat: "urg", type: "qcu", skill: "urti", topic: "l'angiœdème bradykinique des IEC", oic: "OIC-115-08-A", col: true,
    q: "Homme de 65 ans sous IEC depuis 2 ans : angiœdème isolé de la langue, SANS urticaire superficielle. Quelle affirmation est exacte ?",
    o: ["C'est une allergie IgE-médiée : les anti-H1 suffisent",
        "C'est un angiœdème bradykinique : anti-H1 et corticoïdes sont peu efficaces, l'IEC est contre-indiqué définitivement",
        "L'ancienneté du traitement innocente l'IEC",
        "Il suffit de remplacer l'IEC par un autre IEC",
        "C'est une urticaire chronique spontanée"],
    a: 1,
    exp: "Les IEC bloquent la dégradation de la <b>bradykinine</b> : angiœdème <b>sans urticaire</b>, possible après des années de traitement, peu sensible aux anti-H1 et aux corticoïdes, avec un risque d'<b>asphyxie</b>. <b>Contre-indication définitive de tous les IEC</b>." },

  { id: "u8", cat: "urg", type: "qcu", skill: "net", topic: "les complications de la NET", oic: "OIC-115-06-A", col: true,
    q: "Quelle est la principale cause de décès à la phase aiguë d'une nécrolyse épidermique ?",
    o: ["Sepsis (Staphylococcus aureus, Pseudomonas aeruginosa)", "Hépatite fulminante", "Hémorragie digestive", "Embolie pulmonaire", "Choc anaphylactique"],
    a: 0,
    exp: "La peau décollée est une porte d'entrée massive : les <b>sepsis</b> (<i>S. aureus</i>, <i>P. aeruginosa</i>) sont la première cause de décès (Collège). D'où la surveillance infectieuse quotidienne (prélèvements cutanés, hémocultures), sans antibioprophylaxie." },

  { id: "u9", cat: "urg", type: "qcu", skill: "ttt", topic: "l'orientation d'un SJS", oic: "OIC-115-06-A", img: "sjs_visage",
    q: "Syndrome de Stevens-Johnson (décollement 6 %), érosions buccales et génitales, patient hémodynamiquement stable. Orientation ?",
    o: ["Retour à domicile avec bains de bouche",
        "Hospitalisation en urgence en milieu spécialisé (dermatologie avec soins intensifs, réanimation ou centre des brûlés, en lien avec un centre de référence)",
        "Consultation dermatologique dans la semaine",
        "Hospitalisation en médecine polyvalente sans surveillance particulière",
        "Hôpital de jour"],
    a: 1,
    exp: "Toute nécrolyse épidermique, même un SJS limité, peut <b>s'étendre en quelques jours</b> : hospitalisation d'emblée en milieu spécialisé." },

  { id: "u10", cat: "urg", type: "qrm", skill: "urti", topic: "les mécanismes de l'urticaire médicamenteuse", oic: "OIC-115-07-A", img: "urticaire_geante",
    q: "Urticaire médicamenteuse : quelles affirmations sont exactes ?",
    o: ["Une urticaire IgE-médiée nécessite une sensibilisation préalable",
        "Une urticaire IgE-médiée impose une contre-indication formelle du médicament",
        "Les AINS peuvent déclencher une urticaire non immunologique dès la première prise",
        "L'urticaire non immunologique est constante et indépendante de la dose",
        "Le traitement symptomatique repose sur les anti-H1 de 2e génération"],
    a: [0, 1, 2, 4],
    exp: "<b>IgE-médiée</b> : sensibilisation préalable, <b>contre-indication formelle</b> (risque d'anaphylaxie). <b>Non immunologique</b> (AINS, aspirine, codéine) : possible dès la 1re prise, <b>inconstante</b> et <b>dose-dépendante</b>. Traitement : arrêt et <b>anti-H1 de 2e génération</b> (item 187)." },

  { id: "u11", cat: "urg", type: "qroc", skill: "urti", topic: "le médicament du choc anaphylactique", oic: "OIC-332-13-A",
    q: "Quel médicament injecte-t-on en première intention, par voie intramusculaire, devant un choc anaphylactique ?",
    accept: ["adrenaline", "epinephrine", "adrenaline im", "anapen", "epipen", "jext", "emerade"], expected: "Adrénaline (0,01 mg/kg IM)",
    exp: "<b>Adrénaline IM</b> 0,01 mg/kg (0,5 mg pour 50 kg), à renouveler toutes les 5 minutes si besoin." },

  /* ================== 5. PHARMACOVIGILANCE & MÉDICO-LÉGAL ================== */
  { id: "p1", cat: "pv", type: "qrm", skill: "pv", topic: "qui déclare un effet indésirable", oic: "OIC-325-10-A",
    q: "Qui peut ou doit déclarer un effet indésirable médicamenteux ?",
    o: ["Les médecins (obligation)", "Les pharmaciens", "Les sages-femmes et chirurgiens-dentistes", "Les patients et les associations agréées de patients", "Uniquement le médecin prescripteur du médicament"],
    a: [0, 1, 2, 3],
    exp: "Déclaration <b>obligatoire</b> pour les médecins, pharmaciens, chirurgiens-dentistes et sages-femmes (en particulier les effets <b>graves et/ou inattendus</b>). Les <b>patients</b> et associations agréées peuvent aussi déclarer. Pas besoin d'être le prescripteur." },

  { id: "p2", cat: "pv", type: "qcu", skill: "pv", topic: "le circuit de déclaration", oic: "OIC-325-10-A",
    q: "À qui adresse-t-on la déclaration d'une toxidermie ?",
    o: ["Au centre régional de pharmacovigilance (CRPV), notamment via le portail signalement.social-sante.gouv.fr", "Au Conseil de l'Ordre des médecins", "À la CPAM", "Uniquement au laboratoire exploitant", "À l'ARS"],
    a: 0,
    exp: "Déclaration au <b>CRPV</b> du territoire : portail <b>signalement.social-sante.gouv.fr</b> ou formulaire Cerfa." },

  { id: "p3", cat: "pv", type: "qcu", skill: "pv", topic: "les conditions de déclaration", oic: "OIC-325-10-A",
    q: "Faut-il être certain du rôle du médicament pour déclarer une toxidermie ?",
    o: ["Oui, seul un test de réintroduction positif autorise la déclaration",
        "Non : la suspicion suffit, les effets graves et/ou inattendus sont à déclarer en priorité",
        "Oui, il faut un score d'imputabilité maximal",
        "Non, mais seulement si le patient est décédé",
        "Non, mais seulement pour les médicaments commercialisés depuis moins de 5 ans"],
    a: 1,
    exp: "On déclare un effet indésirable <b>suspecté</b> : c'est le CRPV qui établit l'imputabilité. Les effets <b>graves et/ou inattendus</b> sont la priorité." },

  { id: "p4", cat: "pv", type: "qrm", skill: "pv", topic: "les suites d'une toxidermie grave", oic: "OIC-115-10-A",
    q: "Au décours d'un DRESS imputé à l'allopurinol, quelles mesures sont indispensables ?",
    o: ["Contre-indication définitive de l'allopurinol", "Remise d'une carte d'allergie", "Déclaration au CRPV", "Test de réintroduction pour confirmer l'imputabilité", "Information du médecin traitant et mention dans le dossier"],
    a: [0, 1, 2, 4],
    exp: "Contre-indication définitive, <b>carte d'allergie</b>, <b>déclaration au CRPV</b>, courrier au médecin traitant. La <b>réintroduction est contre-indiquée</b> dans les toxidermies graves : elle peut tuer." },

  { id: "p5", cat: "pv", type: "qrm", skill: "pv", topic: "les missions des CRPV", oic: "OIC-325-08-A",
    q: "Quelles sont les missions des centres régionaux de pharmacovigilance ?",
    o: ["Recueil, analyse et imputabilité des notifications", "Détection et transmission des signaux", "Information des professionnels de santé sur la sécurité des médicaments", "Délivrance des autorisations de mise sur le marché", "Indemnisation des victimes"],
    a: [0, 1, 2],
    exp: "CRPV (coordonnés par l'<b>ANSM</b>) : recueil, analyse, <b>imputabilité</b>, détection du signal, réponses aux questions des professionnels, expertise, formation et recherche. L'AMM relève de l'ANSM ou de l'Agence européenne ; l'indemnisation, de l'<b>ONIAM</b>." },

  { id: "p6", cat: "pv", type: "qcu", skill: "pv", topic: "l'organisation de la pharmacovigilance", oic: "OIC-325-08-A",
    q: "Dans quelle base les cas de pharmacovigilance sont-ils centralisés au niveau européen ?",
    o: ["VigiBase (OMS)", "Eudravigilance (Agence européenne du médicament)", "Base nationale de l'ANSM", "Registre du CRPV", "SNIIRAM"],
    a: 1,
    exp: "Circuit : CRPV → <b>base nationale</b> (ANSM) → <b>Eudravigilance</b> (EMA) → base de l'<b>OMS</b>." },

  { id: "p7", cat: "pv", type: "qrm", skill: "ml", topic: "la saisine de la CCI", oic: "OIC-325-21-B",
    q: "Victime d'un syndrome de Lyell sans faute médicale : quels critères de gravité ouvrent la saisine de la CCI ?",
    o: ["Atteinte permanente à l'intégrité physique ou psychique (AIPP) > 24 %",
        "Arrêt des activités professionnelles ≥ 6 mois (consécutifs, ou non consécutifs sur 12 mois)",
        "Déficit fonctionnel temporaire ≥ 50 % pendant ≥ 6 mois",
        "À titre exceptionnel, inaptitude définitive à exercer sa profession antérieure",
        "Procédure payante, avocat obligatoire"],
    a: [0, 1, 2, 3],
    exp: "Seuils : <b>AIPP &gt; 24 %</b>, <b>arrêt ≥ 6 mois</b>, <b>DFT ≥ 50 % pendant ≥ 6 mois</b>, ou à titre exceptionnel inaptitude définitive ou troubles particulièrement graves dans les conditions d'existence. Procédure <b>gratuite</b>, délai de <b>10 ans à compter de la consolidation</b>." },

  { id: "p8", cat: "pv", type: "qcu", skill: "ml", topic: "la responsabilité sans faute", oic: "OIC-325-20-B",
    q: "Un syndrome de Lyell survenu sans faute (prescription conforme) et ayant causé un dommage grave peut être indemnisé…",
    o: ["par l'assurance du médecin prescripteur", "au titre de la solidarité nationale par l'ONIAM, après avis de la CCI", "uniquement par le laboratoire", "jamais : pas d'indemnisation sans faute", "par l'ANSM"],
    a: 1,
    exp: "Accident médical <b>sans faute</b> (affection iatrogène) : indemnisation par l'<b>ONIAM</b> au titre de la <b>solidarité nationale</b>, après saisine de la <b>CCI</b>, sans procès." },

  { id: "p9", cat: "pv", type: "qrm", skill: "imput", topic: "le bilan allergologique", oic: "OIC-115-10-A", col: true,
    q: "Bilan allergologique après une toxidermie : quelles affirmations sont exactes ?",
    o: ["Il est réalisé à distance (en général 6 semaines à 6 mois après la guérison)",
        "Les patch-tests explorent les réactions retardées (EMP, PEAG, DRESS, EPF sur la lésion)",
        "Les prick-tests et IDR explorent les réactions immédiates (urticaire, anaphylaxie)",
        "Un test de réintroduction est indiqué après une NET pour confirmer le diagnostic",
        "Un test cutané négatif autorise toujours la réintroduction"],
    a: [0, 1, 2],
    exp: "Bilan <b>à distance</b>, en milieu spécialisé. <b>Patch-tests</b> pour les réactions retardées, <b>prick-tests et IDR</b> pour les réactions immédiates. Réintroduction <b>contre-indiquée</b> après une NET ou un DRESS ; un test négatif ne suffit pas à innocenter un médicament." },

  { id: "p10", cat: "pv", type: "qrm", skill: "pv", topic: "la définition de l'effet indésirable", oic: "OIC-325-01-A",
    q: "La définition d'un effet indésirable médicamenteux inclut les réactions survenant…",
    o: ["en cas de mésusage", "en cas d'erreur médicamenteuse", "lors d'un usage hors AMM", "en cas de surdosage", "uniquement lors d'un usage conforme à l'AMM"],
    a: [0, 1, 2, 3],
    exp: "Un EIM est une réaction nocive et non voulue <b>suspectée</b> d'être due à un médicament, que l'usage soit conforme ou <b>non</b> (hors AMM, surdosage, mésusage, abus, erreur, interaction, grossesse, allaitement, exposition professionnelle). Nuance : la <b>toxidermie</b> se définit, elle, à dose thérapeutique." },

  { id: "p11", cat: "pv", type: "qroc", skill: "pv", topic: "la carte d'allergie", oic: "OIC-115-10-A",
    q: "Quel document remet-on au patient pour qu'il présente la contre-indication à tout soignant ?",
    accept: ["carte d allergie", "carte allergie", "carte d allergique", "carte de contre indication", "certificat d allergie"], expected: "Une carte d'allergie",
    exp: "Au terme de l'imputabilité, le médicament suspect est <b>contre-indiqué</b> et une <b>carte d'allergie</b> est remise au patient (et la contre-indication notée dans le dossier et le courrier)." },

  { id: "p13", cat: "pv", type: "qrm", skill: "imput", topic: "la méthode française d'imputabilité", oic: "OIC-325-09-B",
    q: "Méthode française d'imputabilité en pharmacovigilance : quelles affirmations sont exactes ?",
    o: ["Elle est évaluée par le CRPV lors de l'analyse de la notification",
        "Elle repose sur des critères chronologiques : délai, évolution à l'arrêt, réadministration",
        "Elle repose sur des critères sémiologiques : facteurs favorisants, absence d'autre diagnostic, propriétés pharmacologiques",
        "Elle intègre des critères bibliographiques",
        "Le médecin doit l'avoir établie avant toute déclaration"],
    a: [0, 1, 2, 3],
    exp: "L'imputabilité estime le lien de causalité entre le médicament et l'effet. Elle est établie par le <b>CRPV</b> à partir de critères <b>chronologiques</b>, <b>sémiologiques</b> et <b>bibliographiques</b>. Le déclarant n'a pas à la prouver : la suspicion suffit." },

  { id: "p12", cat: "pv", type: "qroc", skill: "pv", topic: "le sigle CRPV", oic: "OIC-325-08-A",
    q: "Sigle de la structure régionale qui reçoit et analyse les déclarations d'effets indésirables médicamenteux ?",
    accept: ["crpv", "centre regional de pharmacovigilance"], expected: "CRPV (centre régional de pharmacovigilance)",
    exp: "Les <b>CRPV</b>, coordonnés par l'ANSM, recueillent et analysent les déclarations." }
];

/* ---------------------------------------------------------------------
   CAS CLINIQUES PROGRESSIFS (mode coopératif)
   option : t (texte), pts (points), harm (perte de stabilité si cochée),
            miss (perte si bonne réponse critique non cochée), ok, why
   --------------------------------------------------------------------- */
const CASES = [
  {
    id: "cas1", icon: "🧪", title: "Cas 1 · « La goutte de trop »", subtitle: "Suspicion de DRESS sous allopurinol",
    patient: "M. Bernard L., 71 ans",
    intro: "Adressé aux urgences par son médecin traitant pour fièvre et éruption généralisée.",
    blocks: [
      { h: "Antécédents", html: "HTA, <b>insuffisance rénale chronique</b> (DFG 38 mL/min), goutte récidivante." },
      { h: "Traitements", meds: [["Amlodipine 5 mg", "depuis 5 ans"], ["<b>Allopurinol 300 mg/j</b>", "introduit il y a 5 semaines"], ["Paracétamol 1 g × 3", "depuis 3 jours (fièvre)"], ["Sirop antitussif", "depuis hier"]] },
      { h: "Constantes", vitals: [["39,6 °C", "Température"], ["108 /min", "FC"], ["118/70", "PA"], ["96 %", "SpO₂"], ["20 /min", "FR"], ["15", "Glasgow"]] },
      { h: "Examen", html: "Éruption maculo-papuleuse confluente couvrant <b>plus de 60 %</b> de la surface corporelle, <b>infiltrée</b>. <b>Œdème du visage</b> marqué. <b>Adénopathies</b> cervicales, axillaires et inguinales &gt; 1 cm. Pas d'érosion muqueuse, Nikolsky négatif." }
    ],
    steps: [
      { title: "Premier regard", type: "qrm", skill: "dress", oic: "OIC-115-11-A", img: "erythrodermie",
        q: "Quels éléments orientent d'emblée vers un DRESS plutôt que vers un exanthème maculo-papuleux simple ?",
        o: [
          { t: "Œdème du visage", ok: true, pts: 3, why: "Signe cardinal du DRESS, absent de l'EMP simple." },
          { t: "Adénopathies dans plusieurs aires", ok: true, pts: 3, why: "Adénopathies diffuses : argument fort pour un DRESS." },
          { t: "Fièvre élevée", ok: true, pts: 2, why: "Fièvre élevée = signe de gravité et élément du DRESS." },
          { t: "Éruption infiltrée et étendue (> 50 % de la surface)", ok: true, pts: 2, why: "Éruption infiltrée, cotée dans le RegiSCAR." },
          { t: "Absence d'atteinte muqueuse", ok: false, pts: -1, why: "Non spécifique : elle rend surtout une NET moins probable." },
          { t: "Prurit", ok: false, pts: -1, why: "Le prurit n'est ni spécifique ni un signe de gravité." }
        ],
        exp: "Le DRESS associe éruption infiltrée, <b>œdème du visage</b>, <b>fièvre élevée</b>, <b>adénopathies diffuses</b>, anomalies hématologiques (hyperéosinophilie, syndrome mononucléosique) et atteintes viscérales (OIC-115-11-A)." },

      { title: "Enquête médicamenteuse", type: "qcu", skill: "imput", oic: "OIC-115-10-A",
        q: "Quel médicament est le plus suspect ?",
        o: [
          { t: "Amlodipine (depuis 5 ans)", ok: false, pts: -3, why: "Pris depuis des années sans interruption : délai incompatible." },
          { t: "Allopurinol (depuis 5 semaines)", ok: true, pts: 8, why: "Délai de 2 à 6 semaines compatible, molécule à très haut risque de DRESS, dose non adaptée à l'insuffisance rénale." },
          { t: "Paracétamol (depuis 3 jours)", ok: false, pts: -3, why: "Pris pour la fièvre, donc après le début de la maladie (biais protopathique)." },
          { t: "Sirop antitussif (depuis hier)", ok: false, pts: -3, why: "Délai beaucoup trop court pour un DRESS." },
          { t: "Aucun : c'est une virose", ok: false, pts: -5, harm: 10, why: "Erreur dangereuse : on garderait l'allopurinol, et la réaction continuerait." }
        ],
        exp: "Imputabilité intrinsèque : <b>délai</b> compatible (2-6 semaines), sémiologie évocatrice ; extrinsèque : allopurinol = cause classique. Facteurs de risque (Collège) : <b>dose non adaptée à la fonction rénale</b>, HLA-B*58:01.",
        reveal: "Allopurinol <b>arrêté</b> aux urgences. Médicaments non indispensables suspendus." },

      { title: "Bilan initial", type: "qrm", skill: "dress", oic: "OIC-115-11-A",
        q: "Quels examens demandez-vous en urgence ?",
        o: [
          { t: "NFS avec frottis (éosinophiles, lymphocytes atypiques)", ok: true, pts: 2, why: "Hyperéosinophilie, syndrome mononucléosique." },
          { t: "Bilan hépatique complet avec TP et facteur V", ok: true, pts: 2, miss: 10, why: "Le foie est l'organe le plus souvent atteint, parfois jusqu'à l'insuffisance hépatique aiguë." },
          { t: "Créatininémie, ionogramme, bandelette urinaire et protéinurie", ok: true, pts: 2, why: "Néphropathie interstitielle, d'autant plus sur un rein déjà fragile." },
          { t: "ECG et troponine", ok: true, pts: 2, why: "Recherche d'une myocardite." },
          { t: "PCR HHV-6, EBV, CMV", ok: true, pts: 1, why: "Réactivations virales associées au DRESS." },
          { t: "Biopsie cutanée", ok: true, pts: 1, why: "Non spécifique, mais utile pour écarter un autre diagnostic (et cotée dans le RegiSCAR)." },
          { t: "Prick-tests et patch-tests à l'allopurinol en urgence", ok: false, pts: -3, harm: 5, why: "Les tests se font à distance (plusieurs mois après la guérison), jamais en phase aiguë." },
          { t: "Test de réintroduction de l'allopurinol pour confirmer", ok: false, pts: -8, harm: 25, why: "Contre-indiqué : risque de récidive plus grave, voire mortelle." }
        ],
        exp: "Le bilan cherche les <b>atteintes d'organes</b> (foie, rein, cœur, poumon), les anomalies de la NFS et les réactivations virales. Les tests allergologiques se font à distance ; la réintroduction est proscrite.",
        reveal: "<b>Résultats</b> : leucocytes 18 G/L, <b>éosinophiles 3,1 G/L</b>, <b>lymphocytes atypiques 12 %</b>. <b>ASAT 14 N, ALAT 18 N</b>, bilirubine 45 µmol/L, <b>TP 52 %</b>, facteur V 55 %. <b>Créatinine 210 µmol/L</b> (habituelle 150), protéinurie 0,8 g/24 h, leucocyturie aseptique. ECG et troponine normaux. Biopsie : infiltrat lymphocytaire avec éosinophiles, sans nécrose épidermique. Hémocultures stériles, sérologies des hépatites A, B, C négatives, anticorps antinucléaires négatifs. PCR HHV-6 faiblement positive." },

      { title: "Score RegiSCAR", type: "regiscar", skill: "regiscar", oic: "OIC-115-11-A", col: true,
        truth: { fievre: 1, adp: 1, eo: 2, lympho: 1, etendue: 1, evoc: 2, biopsie: 1, organes: 2, evol: 0, autres: 1 }, cls: 3,
        q: "Calculez le score RegiSCAR avec les données disponibles aujourd'hui (J1), puis concluez.",
        exp: "Fièvre (0) + adénopathies (+1) + éosinophiles ≥ 1,5 G/L (+2) + lymphocytes atypiques (+1) + éruption &gt; 50 % (+1) + éruption évocatrice (+1) + biopsie compatible (0) + 2 organes, foie et rein (+2) + évolution ≥ 15 jours inconnue à J1 (−1) + autres causes éliminées (+1) = <b>8 : DRESS certain</b>." },

      { title: "Aggravation hépatique", type: "qrm", skill: "grav", oic: "OIC-115-11-A", col: true,
        pre: "<b>J3</b> : patient confus, astérixis, ictère franc. <b>TP 32 %</b>, <b>facteur V 30 %</b>, bilirubine 110 µmol/L.",
        q: "Quelle est votre analyse et votre conduite ?",
        o: [
          { t: "Insuffisance hépatique aiguë grave avec encéphalopathie : tableau d'hépatite fulminante", ok: true, pts: 3, why: "TP et facteur V &lt; 50 % + encéphalopathie = insuffisance hépatique aiguë grave." },
          { t: "Contact immédiat avec un centre de transplantation hépatique et transfert en réanimation", ok: true, pts: 4, miss: 20, why: "Seule attitude qui peut sauver le patient si l'évolution se poursuit." },
          { t: "Arrêt de tout médicament hépatotoxique non indispensable, dont le paracétamol", ok: true, pts: 2, why: "Limiter toute agression hépatique supplémentaire." },
          { t: "Vitamine K et poursuite en hospitalisation conventionnelle", ok: false, pts: -3, harm: 10, why: "Le facteur V bas signe une insuffisance hépatocellulaire, pas une carence en vitamine K." },
          { t: "Reprise de l'allopurinol à dose réduite car la goutte flambe", ok: false, pts: -6, harm: 25, why: "Réintroduction formellement contre-indiquée." }
        ],
        exp: "L'atteinte hépatique est la plus fréquente et la plus grave du DRESS : elle peut aller jusqu'à l'<b>hépatite fulminante</b>. Devant une encéphalopathie avec facteur V &lt; 50 %, contacter sans attendre un <b>centre de transplantation hépatique</b>." },

      { title: "Place des corticoïdes", type: "qcu", skill: "ttt", oic: "OIC-115-11-A", col: true,
        q: "Quel traitement de la réaction instaurez-vous, en lien avec le centre de référence ?",
        o: [
          { t: "Aucun : l'arrêt de l'allopurinol suffit toujours", ok: false, pts: -2, harm: 5, why: "Insuffisant devant une atteinte viscérale sévère." },
          { t: "Dermocorticoïdes de très forte activité seuls", ok: false, pts: -1, why: "Adapté aux DRESS sans atteinte viscérale sévère, pas ici." },
          { t: "Corticothérapie générale (≈ 1 mg/kg/j d'équivalent prednisone) avec décroissance lente", ok: true, pts: 8, why: "Indiquée en cas d'atteinte viscérale sévère (Collège)." },
          { t: "Antibiothérapie probabiliste à large spectre pour la fièvre", ok: false, pts: -3, harm: 5, why: "La fièvre est celle du DRESS ; hémocultures stériles. Tout nouveau médicament expose en plus à une nouvelle réaction." },
          { t: "Immunoglobulines IV seules en première intention", ok: false, pts: -1, why: "Pas de place en première intention." }
        ],
        exp: "DRESS : <b>dermocorticoïdes très forts</b> sans atteinte viscérale sévère ; <b>corticothérapie générale</b> en cas d'atteinte viscérale sévère (hépatite sévère, néphropathie, pneumopathie, myocardite), avec <b>décroissance très progressive</b> (Collège).",
        reveal: "Corticothérapie générale débutée. Transfert en réanimation hépatologique : le facteur V remonte à J6, l'encéphalopathie régresse sans greffe." },

      { title: "La rechute", type: "qrm", skill: "dress", oic: "OIC-115-05-B", col: true,
        pre: "<b>J21</b> : nette amélioration ; un interne décide une décroissance rapide de la corticothérapie. <b>J28</b> : nouvelle poussée fébrile, éruption, remontée des éosinophiles. <b>PCR HHV-6 franchement positive.</b>",
        q: "Quelles affirmations sont exactes ?",
        o: [
          { t: "Les poussées successives sont classiques dans le DRESS, souvent liées à des réactivations virales (HHV-6…)", ok: true, pts: 3, why: "Réactivations HHV-6, HHV-7, EBV, CMV (LiSA)." },
          { t: "La décroissance de la corticothérapie doit être lente, sur plusieurs mois", ok: true, pts: 3, why: "Une décroissance rapide favorise la rechute." },
          { t: "Cette poussée prouve que le diagnostic initial était faux", ok: false, pts: -2, why: "Non : l'évolution en poussées fait partie du DRESS." },
          { t: "Un suivi prolongé est nécessaire : maladies auto-immunes possibles à distance (thyroïdite, diabète de type 1)", ok: true, pts: 3, why: "Complications tardives connues (Collège)." },
          { t: "Il faut vérifier qu'aucun nouveau médicament n'a été introduit récemment", ok: true, pts: 1, why: "Pendant un DRESS, un nouveau médicament peut déclencher une poussée." }
        ],
        exp: "Le DRESS évolue souvent en <b>plusieurs poussées</b>, favorisées par les <b>réactivations virales</b> (OIC-115-05-B) et les décroissances trop rapides. Suivi prolongé : TSH, glycémie." },

      { title: "Sortie et suites", type: "qrm", skill: "pv", oic: "OIC-115-10-A",
        q: "Quelles mesures prenez-vous à la sortie ?",
        o: [
          { t: "Contre-indication définitive de l'allopurinol, notée dans le dossier et le courrier de sortie", ok: true, pts: 2, miss: 10, why: "Indispensable (OIC-115-10-A)." },
          { t: "Carte d'allergie remise au patient", ok: true, pts: 2, why: "Il la présentera à tout soignant." },
          { t: "Déclaration au CRPV", ok: true, pts: 2, why: "Obligatoire pour un effet grave (OIC-325-10-A)." },
          { t: "Bilan allergologique (patch-tests) à distance, en milieu spécialisé", ok: true, pts: 1, why: "Utile pour les autres médicaments suspects." },
          { t: "Surveillance de la TSH et de la glycémie dans les mois suivants", ok: true, pts: 1, why: "Maladies auto-immunes tardives." },
          { t: "Relais immédiat par un autre hypo-uricémiant pendant la phase aiguë", ok: false, pts: -2, why: "Aucun nouveau médicament non indispensable en phase aiguë ; le traitement de fond de la goutte se discutera à distance avec un spécialiste." },
          { t: "Autoriser à nouveau l'allopurinol à faible dose dans un an", ok: false, pts: -5, harm: 10, why: "La contre-indication est définitive." }
        ],
        exp: "Suites : <b>contre-indication définitive</b>, <b>carte d'allergie</b>, <b>déclaration au CRPV</b>, courrier au médecin traitant, bilan allergologique à distance, suivi prolongé." }
    ],
    outcomes: {
      good: { emoji: "🎉", title: "Patient sauvé", text: "M. L. sort à J45, bilan hépatique normalisé, sans greffe. Il a sa carte d'allergie et l'allopurinol est contre-indiqué à vie. Le CRPV vous remercie pour la déclaration." },
      mid:  { emoji: "🩹", title: "Survie avec complications", text: "M. L. survit après un séjour prolongé en réanimation et une récidive évitable. Revoyez les étapes où la stabilité a chuté." },
      bad:  { emoji: "🕯️", title: "Issue défavorable", text: "Des décisions dangereuses ont précipité l'insuffisance hépatique : M. L. a dû être greffé en urgence. Reprenez la fiche DRESS et rejouez le cas." }
    }
  },

  {
    id: "cas2", icon: "🔥", title: "Cas 2 · « La peau qui part en lambeaux »", subtitle: "Suspicion de syndrome de Lyell aux urgences",
    patient: "Mme Sofia R., 46 ans",
    intro: "Amenée par les pompiers : fièvre, « brûlures » de la peau et des yeux depuis 3 jours.",
    blocks: [
      { h: "Antécédents", html: "<b>Épilepsie focale</b> diagnostiquée il y a 1 mois. Pas de cancer ni d'hémopathie." },
      { h: "Traitements", meds: [["<b>Lamotrigine</b> (titration rapide) + valproate", "introduite il y a 17 jours"], ["Contraception œstroprogestative", "depuis 4 ans"], ["Ibuprofène 400 mg × 3", "depuis 3 jours (« angine »)"], ["Paracétamol 1 g × 3", "depuis 3 jours"]] },
      { h: "Constantes", vitals: [["39,2 °C", "Température"], ["128 /min", "FC"], ["105/65", "PA"], ["95 %", "SpO₂"], ["22 /min", "FR"], ["8/10", "EVA douleur"]] },
      { h: "Examen", html: "Macules rouge sombre confluentes du tronc et du visage, <b>bulles flasques</b>, <b>Nikolsky positif</b>, décollement (décollé + décollable) estimé à <b>35 %</b> de la surface corporelle. <b>Érosions buccales</b> hémorragiques, <b>conjonctivite bilatérale</b>, <b>érosions génitales</b>." },
      { h: "Biologie d'entrée", html: "Urée <b>8,4 mmol/L</b> · bicarbonates <b>21 mmol/L</b> · glycémie <b>11 mmol/L</b> · NFS : lymphopénie, pas d'éosinophilie." }
    ],
    steps: [
      { title: "Triage", type: "qrm", skill: "net", oic: "OIC-115-06-A", img: "lyell_dos",
        q: "Décrivez d'abord la photo à voix haute. Quels éléments font suspecter une nécrolyse épidermique toxique ?",
        o: [
          { t: "Signe de Nikolsky positif", ok: true, pts: 2, why: "Signe de décollement épidermique." },
          { t: "Érosions muqueuses d'au moins deux sites", ok: true, pts: 2, why: "Érosions muqueuses multifocales (LiSA)." },
          { t: "Bulles flasques et décollement", ok: true, pts: 2, why: "Phase d'état de la NET." },
          { t: "Douleurs cutanées intenses", ok: true, pts: 1, why: "Signe précoce et signe de gravité." },
          { t: "Début 17 jours après l'introduction de la lamotrigine", ok: true, pts: 2, why: "Délai compatible (4 à 28 jours)." },
          { t: "Pustules non folliculaires des plis", ok: false, pts: -1, why: "C'est la PEAG." }
        ],
        exp: "NET : prodromes (fièvre, brûlures oculaires, pharyngite), puis <b>érosions muqueuses multifocales</b>, bulles, <b>Nikolsky</b>, décollements, 4 à 28 jours après l'introduction du médicament (OIC-115-06-A)." },

      { title: "Classification", type: "qcu", skill: "net", oic: "OIC-115-06-A",
        q: "Décollement (décollé + décollable) d'environ 35 % : vous retenez…",
        o: [
          { t: "Syndrome de Stevens-Johnson", ok: false, pts: -2, why: "SJS = moins de 10 %." },
          { t: "Syndrome de chevauchement SJS/NET", ok: false, pts: -1, why: "Chevauchement = 10 à 30 %." },
          { t: "Syndrome de Lyell (NET ≥ 30 %)", ok: true, pts: 5, why: "35 % ≥ 30 %." },
          { t: "Érythème polymorphe majeur", ok: false, pts: -2, why: "Cocardes typiques des extrémités, post-infectieux, décollement limité." },
          { t: "Épidermolyse staphylococcique", ok: false, pts: -2, why: "Pas d'atteinte muqueuse dans le SSSS ; ici, trois muqueuses sont atteintes." }
        ],
        exp: "<b>SJS &lt; 10 %</b> · chevauchement 10-30 % · <b>Lyell ≥ 30 %</b>, en comptant l'épiderme décollé et décollable." },

      { title: "Imputabilité", type: "qcu", skill: "imput", oic: "OIC-115-10-A",
        q: "Quel médicament est le plus probablement responsable ?",
        o: [
          { t: "Lamotrigine (J−17)", ok: true, pts: 6, why: "Délai idéal (4-28 j), molécule à haut risque, surtout avec une titration rapide et le valproate." },
          { t: "Ibuprofène (J−3)", ok: false, pts: -2, why: "Pris pour les prodromes : biais protopathique, délai trop court." },
          { t: "Paracétamol (J−3)", ok: false, pts: -2, why: "Même raisonnement : introduit pour les premiers symptômes." },
          { t: "Contraception (4 ans)", ok: false, pts: -2, why: "Prise ancienne et continue : non suspecte." },
          { t: "Impossible de conclure", ok: false, pts: -1, why: "La chronologie désigne clairement un coupable principal." }
        ],
        exp: "La chronologie désigne la <b>lamotrigine</b>. Les AINS et le paracétamol pris pour les prodromes ne sont en général pas responsables, mais ils sont arrêtés eux aussi s'ils ne sont pas indispensables (Collège : algorithme ALDEN)." },

      { title: "Confirmer le diagnostic", type: "qrm", skill: "net", oic: "OIC-115-06-A", col: true,
        q: "Quels examens confirment le diagnostic et écartent les diagnostics différentiels ?",
        o: [
          { t: "Biopsie cutanée : nécrose de toute l'épaisseur de l'épiderme, décollement sous-épidermique", ok: true, pts: 3, why: "Aspect histologique de la NET." },
          { t: "Immunofluorescence directe, qui doit être négative", ok: true, pts: 2, why: "Écarte une dermatose bulleuse auto-immune." },
          { t: "Prélèvements bactériologiques cutanés et hémocultures", ok: true, pts: 1, why: "Surveillance infectieuse dès l'admission." },
          { t: "Patch-tests à la lamotrigine en urgence", ok: false, pts: -3, harm: 5, why: "Jamais en phase aiguë." },
          { t: "Attendre 48 heures l'évolution avant tout examen", ok: false, pts: -2, harm: 5, why: "Perte de temps dans une urgence vitale." }
        ],
        exp: "Biopsie : <b>nécrose épidermique de toute l'épaisseur</b> ; <b>IFD négative</b>. Surveillance bactériologique dès l'entrée." },

      { title: "SCORTEN", type: "scorten", skill: "scorten", oic: "OIC-115-06-A", col: true,
        truth: { age: true, fc: true, k: false, sc: true, uree: false, bic: false, gly: false },
        q: "Calculez le SCORTEN à l'admission à partir du dossier, puis estimez la mortalité prédite.",
        exp: "Âge 46 ≥ 40 (1) + FC 128 ≥ 120 (1) + pas de cancer (0) + décollement 35 % &gt; 10 % (1) + urée 8,4 ≤ 10 (0) + bicarbonates 21 ≥ 20 (0) + glycémie 11 ≤ 14 (0) = <b>3</b>, soit une mortalité prédite d'environ <b>35 %</b>." },

      { title: "Orientation", type: "qcu", skill: "ttt", oic: "OIC-115-06-A",
        q: "Où hospitalisez-vous Mme R. ?",
        o: [
          { t: "Dermatologie conventionnelle", ok: false, pts: -3, harm: 10, why: "Insuffisant pour un Lyell à SCORTEN 3." },
          { t: "Transfert en urgence en réanimation ou centre des brûlés, en lien avec un centre de référence des toxidermies graves", ok: true, pts: 8, why: "Seule structure capable d'assurer réchauffement, nutrition, soins cutanés et oculaires, surveillance infectieuse." },
          { t: "Retour à domicile avec surveillance infirmière", ok: false, pts: -8, harm: 30, why: "Mise en danger vitale." },
          { t: "Maintien 48 h aux urgences pour voir l'évolution", ok: false, pts: -3, harm: 10, why: "Retard de prise en charge spécialisée." }
        ],
        exp: "Nécrolyse épidermique = <b>transfert en urgence</b> en milieu spécialisé (réanimation, centre des brûlés, centre de référence)." },

      { title: "Le piège thérapeutique", type: "qrm", skill: "ttt", oic: "OIC-115-06-A", col: true,
        pre: "Le réanimateur de garde propose une liste de prescriptions. Cochez celles que vous retenez.",
        q: "Quelles mesures retenez-vous ?",
        o: [
          { t: "Arrêt immédiat de la lamotrigine et de tout médicament non indispensable", ok: true, pts: 3, miss: 20, why: "Mesure la plus importante : plus l'arrêt est précoce, meilleur est le pronostic." },
          { t: "Relais antiépileptique par une molécule de structure différente (ex. lévétiracétam)", ok: true, pts: 2, why: "L'épilepsie reste à traiter ; on évite les antiépileptiques aromatiques." },
          { t: "Méthylprednisolone en bolus IV « pour stopper la réaction »", ok: false, pts: -6, harm: 15, why: "Piège classique : pas de bénéfice démontré, risque infectieux accru." },
          { t: "Chambre chauffée à 30-32 °C", ok: true, pts: 2, why: "La peau décollée ne régule plus la température." },
          { t: "Compensation hydroélectrolytique et nutrition entérale hypercalorique", ok: true, pts: 2, why: "Pertes cutanées et hypercatabolisme, comme chez un brûlé." },
          { t: "Antalgie par morphiniques et anticoagulation préventive", ok: true, pts: 2, why: "Douleur intense, alitement." },
          { t: "Antibiothérapie prophylactique systématique à large spectre", ok: false, pts: -3, harm: 5, why: "Sélectionne des bactéries résistantes ; antibiotiques seulement si l'infection est documentée." },
          { t: "Pansements non adhérents, sans arracher l'épiderme décollé", ok: true, pts: 1, why: "Soins locaux atraumatiques." }
        ],
        exp: "NET : <b>arrêt</b> de tout médicament suspect ou non indispensable ; traitement <b>symptomatique</b> comme chez un brûlé ; <b>pas de corticothérapie générale</b> ; <b>pas d'antibioprophylaxie</b>." },

      { title: "Les yeux", type: "qrm", skill: "net", oic: "OIC-115-06-A", col: true, img: "sjs_oeil",
        pre: "Conjonctivite bilatérale avec pseudomembranes, photophobie.",
        q: "Que faites-vous pour les yeux ?",
        o: [
          { t: "Examen ophtalmologique aujourd'hui, puis tous les jours", ok: true, pts: 3, miss: 15, why: "Prévenir les séquelles, parfois cécitantes." },
          { t: "Lavages pluriquotidiens au sérum physiologique, collyres antiseptiques, pommade à la vitamine A", ok: true, pts: 2, why: "Soins oculaires pluriquotidiens." },
          { t: "Lyse des synéchies (débridement des adhérences conjonctivales)", ok: true, pts: 2, why: "Évite le symblépharon." },
          { t: "Attendre la cicatrisation cutanée avant d'examiner les yeux", ok: false, pts: -4, harm: 15, why: "Les séquelles oculaires se constituent pendant la phase aiguë." },
          { t: "Pansements occlusifs secs sur les deux yeux", ok: false, pts: -2, why: "Favorisent les adhérences et la kératite." }
        ],
        exp: "L'atteinte oculaire fait les <b>séquelles les plus invalidantes</b> (baisse de vision, photophobie, syndrome sec). Examen ophtalmologique <b>quotidien</b> dès l'admission." },

      { title: "J6 : fièvre et hypotension", type: "qcu", skill: "ttt", oic: "OIC-115-06-A", col: true,
        pre: "<b>J6</b> : 39,8 °C, frissons, PA 85/45, lactates 3,1 mmol/L. Prélèvements cutanés : <i>Staphylococcus aureus</i>.",
        q: "Quelle est votre conduite ?",
        o: [
          { t: "Fièvre attendue au cours d'une NET : simple surveillance", ok: false, pts: -4, harm: 20, why: "Hypotension et lactates élevés : choc septique jusqu'à preuve du contraire." },
          { t: "Choc septique probable : hémocultures, antibiothérapie probabiliste adaptée (S. aureus, P. aeruginosa), remplissage", ok: true, pts: 8, why: "Le sepsis est la première cause de décès de la NET." },
          { t: "Bolus de corticoïdes", ok: false, pts: -5, harm: 15, why: "Aggraverait l'infection." },
          { t: "Arrêt de l'anticoagulation préventive", ok: false, pts: -1, why: "Sans rapport avec le problème." }
        ],
        exp: "Le <b>sepsis</b> (<i>S. aureus</i>, <i>P. aeruginosa</i>) est la <b>première cause de décès</b> à la phase aiguë : antibiothérapie <b>curative</b> dès les signes d'infection, jamais en prophylaxie.",
        reveal: "Choc septique contrôlé en 48 h. Réépithélialisation complète à J24." },

      { title: "Suites", type: "qrm", skill: "pv", oic: "OIC-115-10-A",
        q: "Quelles mesures prévoyez-vous pour la sortie et l'avenir ?",
        o: [
          { t: "Contre-indication définitive de la lamotrigine, carte d'allergie", ok: true, pts: 2, miss: 10, why: "Indispensable." },
          { t: "Éviction prudente des antiépileptiques aromatiques (réactions croisées possibles)", ok: true, pts: 1, why: "Carbamazépine, oxcarbazépine, phénytoïne, phénobarbital (Collège)." },
          { t: "Déclaration au CRPV", ok: true, pts: 2, why: "Effet grave : déclaration obligatoire." },
          { t: "Suivi des séquelles : ophtalmologique, cutané, psychologique (stress post-traumatique)", ok: true, pts: 2, why: "Séquelles fréquentes (LiSA)." },
          { t: "Information sur la saisine possible de la CCI (ONIAM) en cas de séquelles graves", ok: true, pts: 1, why: "Accident médical sans faute (item 325, rang B)." },
          { t: "Test de réintroduction à faible dose pour confirmer", ok: false, pts: -6, harm: 20, why: "Formellement contre-indiqué." }
        ],
        exp: "Suites : <b>contre-indication</b> et <b>carte d'allergie</b>, <b>déclaration au CRPV</b>, suivi des <b>séquelles</b>, information sur l'indemnisation (ONIAM) et sur les associations de patients." }
    ],
    outcomes: {
      good: { emoji: "🎉", title: "Patiente sauvée", text: "Mme R. sort à J32. Elle garde un syndrome sec oculaire modéré, suivi en ophtalmologie. Son épilepsie est équilibrée sous lévétiracétam et elle a sa carte d'allergie." },
      mid:  { emoji: "🩹", title: "Survie avec séquelles", text: "Mme R. survit, mais les retards de décision ont laissé des séquelles oculaires sévères. Revoyez les étapes où la stabilité a chuté." },
      bad:  { emoji: "🕯️", title: "Issue défavorable", text: "Corticoïdes, retard de transfert ou sepsis négligé : Mme R. décède en réanimation. Reprenez les fiches NET et SCORTEN et rejouez le cas." }
    }
  }
];

/* Données des calculateurs */
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

const REGISCAR_ITEMS = [
  { k: "fievre", t: "Fièvre ≥ 38,5 °C", choices: [["Non / inconnu", -1], ["Oui", 0]] },
  { k: "adp",    t: "Adénopathies (> 1 cm, ≥ 2 aires)", choices: [["Non / inconnu", 0], ["Oui", 1]] },
  { k: "eo",     t: "Éosinophilie", choices: [["Non", 0], ["0,7 à 1,49 G/L", 1], ["≥ 1,5 G/L", 2]] },
  { k: "lympho", t: "Lymphocytes atypiques", choices: [["Non / inconnu", 0], ["Oui", 1]] },
  { k: "etendue",t: "Éruption > 50 % de la surface", choices: [["Non / inconnu", 0], ["Oui", 1]] },
  { k: "evoc",   t: "Éruption évocatrice (≥ 2 : œdème du visage, infiltration, desquamation, purpura)", choices: [["Non", -1], ["Inconnu", 0], ["Oui", 1]] },
  { k: "biopsie",t: "Biopsie évoquant un autre diagnostic", choices: [["Oui", -1], ["Non / inconnu", 0]] },
  { k: "organes",t: "Atteinte d'organes", choices: [["Aucune", 0], ["1 organe", 1], ["≥ 2 organes", 2]] },
  { k: "evol",   t: "Évolution ≥ 15 jours", choices: [["Non / inconnu", -1], ["Oui", 0]] },
  { k: "autres", t: "Autres causes éliminées (≥ 3 examens négatifs)", choices: [["Non", 0], ["Oui", 1]] }
];
const REGISCAR_CLASSES = ["Exclu (< 2)", "Possible (2-3)", "Probable (4-5)", "Certain (> 5)"];

/* Les incontournables, repris dans la fiche mémo */
const ESSENTIALS = [
  "Toxidermie = tout effet cutané indésirable d'un médicament à dose thérapeutique, quelle que soit la voie [A].",
  "EMP = 40-60 % des toxidermies, urticaire 20-30 % ; > 90 % bénignes ; formes graves : 1/10 000 à 1/1 000 000 [B].",
  "Délais : urticaire minutes-heures, EPF < 48 h, PEAG 1-11 j, EMP 4-14 j, NET 4-28 j, photoallergie 7-21 j, DRESS 2-6 semaines [A].",
  "NET : érosions muqueuses multifocales, bulles, Nikolsky ; SJS < 10 %, Lyell ≥ 30 % ; mortalité jusqu'à 25 % [A].",
  "DRESS : éruption infiltrée, œdème du visage, fièvre, adénopathies, hyperéosinophilie ou syndrome mononucléosique, atteintes viscérales [A].",
  "DRESS : réactivations HHV-6, HHV-7, EBV, CMV ; VIH et immunosuppression favorisent les toxidermies [B].",
  "PEAG : fièvre brutale, érythème des grands plis, pustules amicrobiennes non folliculaires, PNN [A].",
  "EPF : 1 à 10 macules arrondies, lèvres et organes génitaux, récidive au même site en < 48 h [A].",
  "Urticaire IgE-médiée : sensibilisation préalable, contre-indication formelle ; toujours chercher l'anaphylaxie [A].",
  "Choc anaphylactique : adrénaline IM 0,01 mg/kg (0,5 mg pour 50 kg), cuisse, toutes les 5 min [A].",
  "Photosensibilité : phototoxicité (heures, dose-dépendante, zones exposées) vs photoallergie (7-21 j, eczéma débordant) [B].",
  "Imputabilité : intrinsèque (délai, arrêt, antécédent, sémiologie) + extrinsèque (notoriété) → contre-indication + carte d'allergie [A].",
  "Déclaration au CRPV obligatoire pour les soignants (graves et/ou inattendus), la suspicion suffit [A].",
  "ONIAM / CCI : AIPP > 24 %, arrêt ≥ 6 mois, DFT ≥ 50 % ≥ 6 mois ; délai 10 ans après consolidation [B]."
];

/* ---------------------------------------------------------------------
   FICHES INTERACTIVES : cartes flash et mini-jeux par fiche
   game.type : match (association) | sort (tri en colonnes) | photo (photo-quiz)
   --------------------------------------------------------------------- */
const COURSE_FX = {
  "c-def": {
    cards: [
      ["Définition d'une toxidermie ?", "Tout effet cutané indésirable d'un médicament pris à dose thérapeutique, quelle que soit la voie (y compris topique)."],
      ["Les deux toxidermies les plus fréquentes, et leur part ?", "Exanthème maculo-papuleux 40-60 %, urticaire 20-30 % des notifications ; plus de 90 % sont bénignes."],
      ["Fréquence des formes graves ?", "Exceptionnelles : 1 cas pour 10 000 à 1 000 000 de patients traités."],
      ["Quels virus se réactivent au cours d'un DRESS ?", "HHV-6, HHV-7, EBV et CMV (groupe herpès)."]
    ],
    game: { type: "sort", title: "Non immunologique ou immuno-allergique ?", buckets: ["Non immunologique", "Immuno-allergique"],
      items: [["Fréquent", 0], ["Dose-dépendant", 0], ["Prévisible", 0], ["Chéilite sous rétinoïdes", 0], ["Alopécie des antimitotiques", 0],
              ["Peu fréquent", 1], ["Imprévisible", 1], ["IgE-médiée ou retardée (lymphocytes T)", 1], ["DRESS à l'allopurinol", 1], ["Mortalité jusqu'à 25 % (NET)", 1]] }
  },
  "c-chrono": {
    cards: [
      ["Délai d'apparition d'un DRESS ?", "2 à 6 semaines après l'introduction du médicament."],
      ["Délai d'une nécrolyse épidermique (SJS/Lyell) ?", "4 à 28 jours."],
      ["Délai de l'érythème pigmenté fixe ?", "Moins de 48 heures."],
      ["Délai d'une photoallergie ?", "7 à 21 jours (la phototoxicité survient en quelques heures)."]
    ],
    game: { type: "match", title: "Associe chaque toxidermie à son délai",
      pairs: [["Urticaire", "Minutes à heures"], ["Érythème pigmenté fixe", "Moins de 48 heures"], ["PEAG", "1 à 11 jours"], ["Exanthème maculo-papuleux", "4 à 14 jours"],
              ["Nécrolyse épidermique", "4 à 28 jours"], ["Photoallergie", "7 à 21 jours"], ["DRESS", "2 à 6 semaines"], ["Lupus induit, psoriasiforme", "Semaines à mois"]] }
  },
  "c-semio": {
    cards: [
      ["Qu'est-ce que le signe de Nikolsky ?", "L'épiderme se détache au frottement d'une peau d'aspect sain : il évoque une nécrolyse épidermique."],
      ["Seuils de surface : SJS, chevauchement, Lyell ?", "SJS < 10 %, chevauchement 10-30 %, Lyell ≥ 30 % de surface décollée ou décollable."],
      ["Phototoxicité ou photoallergie : comment les distinguer ?", "Phototoxicité : quelques heures, dose-dépendante, limitée aux zones exposées. Photoallergie : 7-21 j, eczéma qui déborde sur les zones couvertes."],
      ["Où siège préférentiellement l'érythème pigmenté fixe ?", "Lèvres et organes génitaux ; il récidive au même endroit à chaque prise."],
      ["Quels signes d'anaphylaxie chercher devant une urticaire ?", "Respiratoires (dysphonie, hypersialorrhée, dyspnée, bronchospasme), cardiovasculaires (tachy- ou bradycardie, hypotension), digestifs."]
    ],
    game: { type: "photo", title: "Photo-quiz : quelle toxidermie ?", ask: "de quelle lésion s'agit-il ?",
      choices: ["Exanthème maculo-papuleux", "Urticaire", "Angiœdème", "PEAG", "Nécrolyse épidermique", "Érythème pigmenté fixe", "Photosensibilité"],
      items: [["emp_dos", "Exanthème maculo-papuleux"], ["urticaire", "Urticaire"], ["angioedeme", "Angiœdème"], ["peag", "PEAG"],
              ["lyell_dos", "Nécrolyse épidermique"], ["epf", "Érythème pigmenté fixe"], ["photo", "Photosensibilité"]] }
  },
  "c-urg": {
    cards: [
      ["Biologie typique du DRESS ?", "Hyperéosinophilie et/ou lymphocytose avec syndrome mononucléosique ; cytolyse hépatique, insuffisance rénale."],
      ["Biologie de la PEAG ?", "Hyperleucocytose à polynucléaires neutrophiles ; les pustules sont amicrobiennes."],
      ["Organe le plus menacé dans le DRESS ?", "Le foie (hépatite pouvant aller jusqu'à l'insuffisance hépatique aiguë), puis le rein, le poumon, le cœur."]
    ],
    game: { type: "sort", title: "DRESS, PEAG ou nécrolyse épidermique ?", buckets: ["DRESS", "PEAG", "SJS / Lyell"],
      items: [["Œdème du visage", 0], ["Adénopathies diffuses", 0], ["Hyperéosinophilie", 0], ["Délai de 2 à 6 semaines", 0], ["Réactivation HHV-6", 0], ["Score RegiSCAR", 0],
              ["Pustules amicrobiennes des plis", 1], ["Début brutal, PNN élevés", 1], ["Délai de 1 à 11 jours", 1], ["Pristinamycine, diltiazem", 1],
              ["Nikolsky positif", 2], ["Érosions muqueuses multifocales", 2], ["Délai de 4 à 28 jours", 2], ["Score SCORTEN", 2]] }
  },
  "c-scores": {
    cards: [
      ["Les 7 items du SCORTEN ?", "Âge ≥ 40 ans, FC ≥ 120/min, cancer ou hémopathie, décollement > 10 %, urée > 10 mmol/L, bicarbonates < 20 mmol/L, glycémie > 14 mmol/L."],
      ["Mortalité prédite pour un SCORTEN à 3 ? à 5 ?", "≈ 35 % ; plus de 90 %."],
      ["RegiSCAR : à partir de quel score le DRESS est-il certain ?", "Au-delà de 5 (4-5 probable, 2-3 possible, moins de 2 exclu)."]
    ],
    game: { type: "sort", title: "SCORTEN ou RegiSCAR ?", buckets: ["SCORTEN (nécrolyse)", "RegiSCAR (DRESS)"],
      items: [["Âge ≥ 40 ans", 0], ["FC ≥ 120 /min", 0], ["Cancer ou hémopathie", 0], ["Surface décollée > 10 %", 0], ["Urée > 10 mmol/L", 0], ["Bicarbonates < 20 mmol/L", 0], ["Glycémie > 14 mmol/L", 0],
              ["Fièvre ≥ 38,5 °C", 1], ["Éosinophilie", 1], ["Lymphocytes atypiques", 1], ["Éruption > 50 % de la surface", 1], ["Atteinte d'organes", 1], ["Évolution ≥ 15 jours", 1]] }
  },
  "c-drugs": {
    cards: [
      ["Médicaments classiques de la PEAG ?", "Aminopénicillines, pristinamycine, diltiazem, hydroxychloroquine, terbinafine."],
      ["Quel médicament donne un angiœdème sans urticaire, même après des années ?", "Les IEC (angiœdème bradykinique) : contre-indication définitive."],
      ["Cinq médicaments à haut risque de NET ou de DRESS ?", "Allopurinol, antiépileptiques (carbamazépine, lamotrigine…), sulfamides (cotrimoxazole), AINS (oxicams), névirapine."]
    ],
    game: { type: "match", title: "Associe le médicament à sa toxidermie typique",
      pairs: [["Allopurinol", "DRESS (dose à adapter au rein)"], ["Carbamazépine", "NET (HLA-B*15:02)"], ["Pristinamycine", "PEAG"], ["IEC", "Angiœdème bradykinique"],
              ["Anti-TNFα", "Lésions psoriasiformes"], ["Anti-EGFR", "Éruption acnéiforme"], ["Aminopénicilline + mononucléose", "Exanthème maculo-papuleux"],
              ["Kétoprofène topique", "Photoallergie"], ["Paracétamol, AINS, cyclines", "Érythème pigmenté fixe"]] }
  },
  "c-imput": {
    cards: [
      ["Critères d'imputabilité intrinsèque ?", "Délai compatible, évolution à l'arrêt, antécédent au même médicament, sémiologie compatible (et absence d'autre cause)."],
      ["Pourquoi le paracétamol pris pour la fièvre est-il rarement coupable d'une NET ?", "Il a été introduit pour les prodromes, après le début de la maladie (biais protopathique)."],
      ["Quand et comment faire le bilan allergologique ?", "À distance (6 semaines à 6 mois), en milieu spécialisé : patch-tests (réactions retardées), prick et IDR (immédiates). Jamais de réintroduction après NET ou DRESS."]
    ],
    game: { type: "sort", title: "Imputabilité intrinsèque ou extrinsèque ?", buckets: ["Intrinsèque (le patient)", "Extrinsèque (le médicament)"],
      items: [["Délai compatible", 0], ["Évolution favorable à l'arrêt", 0], ["Antécédent au même médicament", 0], ["Sémiologie compatible", 0], ["Absence d'autre cause", 0],
              ["Accidents identiques déjà publiés", 1], ["Notoriété du médicament", 1]] }
  },
  "c-cat": {
    cards: [
      ["Dose d'adrénaline dans le choc anaphylactique ?", "0,01 mg/kg en IM (0,5 mg pour 50 kg), face latérale de la cuisse, à renouveler toutes les 5 minutes."],
      ["Place des corticoïdes dans la nécrolyse épidermique ?", "Aucune : pas de bénéfice démontré et risque infectieux accru."],
      ["Quand une corticothérapie générale dans le DRESS ?", "En cas d'atteinte viscérale sévère (Collège), avec une décroissance lente ; sinon dermocorticoïdes très forts."]
    ],
    game: { type: "sort", title: "Nécrolyse épidermique : à faire ou à éviter ?", buckets: ["✅ À faire", "⛔ À éviter"],
      items: [["Arrêter tout médicament non indispensable", 0], ["Chambre chauffée à 30-32 °C", 0], ["Nutrition entérale", 0], ["Examen ophtalmologique quotidien", 0],
              ["Anticoagulation préventive", 0], ["Pansements non adhérents", 0], ["Corticothérapie générale", 1], ["Antibioprophylaxie systématique", 1],
              ["Test de réintroduction", 1], ["Hospitalisation en service conventionnel", 1]] }
  },
  "c-pv": {
    cards: [
      ["Qui doit déclarer un effet indésirable médicamenteux ?", "Médecins, pharmaciens, chirurgiens-dentistes et sages-femmes (obligation) ; les patients et associations agréées peuvent aussi déclarer."],
      ["Faut-il être sûr de l'imputabilité pour déclarer ?", "Non : la suspicion suffit, surtout pour les effets graves et/ou inattendus."],
      ["Seuils de gravité pour saisir la CCI ?", "AIPP > 24 %, arrêt d'activité ≥ 6 mois, ou DFT ≥ 50 % pendant ≥ 6 mois ; délai de 10 ans après consolidation."]
    ],
    game: { type: "match", title: "Pharmacovigilance : qui fait quoi ?",
      pairs: [["CRPV", "Recueille, analyse et impute les déclarations"], ["ANSM", "Coordonne les CRPV, base nationale"], ["EMA", "Base européenne Eudravigilance"],
              ["OMS", "Base mondiale de pharmacovigilance"], ["CCI", "Examine la demande d'indemnisation"], ["ONIAM", "Indemnise l'accident médical sans faute"]] }
  }
};
