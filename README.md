# ToxiQuest · Toxidermies (item 115)

Sous-colle EDN à trois joueurs sur un seul écran : **item 115 « Toxidermies »** du programme LiSA 2026, plus la pharmacovigilance de l'item 325.

**Jouer en ligne : https://r69sy78sny-droid.github.io/sous-colle-toxidermies/**

**Page de test (contenu fictif, sans spoiler) : https://r69sy78sny-droid.github.io/sous-colle-toxidermies/demo.html** — même moteur, pour vérifier sons, chrono, roue, fiches interactives, cas et bilan avant la vraie session (lien discret tout en bas du vrai jeu).

## Déroulé

0. **Équipe** : trois prénoms, nombre de manches, chronomètre facultatif.
1. **Fiches interactives** : 9 fiches (définition et mécanismes, frise des délais, sémiologie avec photos masquables, tableau DRESS / PEAG / SJS-Lyell, SCORTEN et RegiSCAR, médicaments à haut risque, imputabilité, conduite à tenir, pharmacovigilance). Chacune se travaille en quatre temps : 📖 lire, 🙈 réciter en texte à trous, 🎯 mini-jeu (association, tri en colonnes, photo-quiz), 🧠 cartes flash « Je savais / À revoir ». Tableau de couverture des 18 objectifs (OIC).
2. **Trivial Pursuit EDN** : roue à 5 catégories, 102 questions dont 40 « 💀 EDN+ » difficiles (QCU, QRM notées au barème EDN, QRP à nombre de réponses imposé jusqu'à 11 propositions, QROC, calcul, classement), correction avec [RANG A] / [RANG B] et code OIC, camemberts. Deux façons de jouer :
   - **tour par tour** sur l'écran ;
   - **📱 sur les téléphones** : l'ordinateur affiche un QR code et un code de salle ; chacun rejoint sur son téléphone, tout le monde répond en même temps, puis l'écran révèle la bonne réponse, qui a coché quoi et les points de chacun. Relais temps réel : MQTT sur un broker public gratuit (HiveMQ, secours EMQX), sans compte ; seuls les prénoms et les réponses y transitent.
3. **Deux dossiers progressifs en équipe** : DRESS sous allopurinol (calculateur RegiSCAR, hépatite fulminante, place des corticoïdes) et Lyell aux urgences (calculateur SCORTEN, piège des corticoïdes, soins ophtalmologiques, sepsis). Score d'équipe et stabilité du patient.
4. **Bilan** : podium, radar par catégorie, points forts et faibles par joueur, fiche mémo des erreurs et des cartes flash « à revoir », à imprimer ou télécharger (.html, .md).

Sons synthétisés dans le navigateur (Web Audio, aucun fichier) : crans de la roue, tic-tac du chrono et sonnerie, bonnes et mauvaises réponses, camemberts, alarme du scope, fanfare ; bouton 🔊 ou touche M pour couper. Animations : confettis, annonces de tour, compteurs animés, moniteur cardiaque qui s'accélère quand le patient se dégrade, podium.

Deux fichiers autonomes, `index.html` (vrai jeu) et `demo.html` (page de test), en HTML, CSS et JavaScript sans dépendance ni compilation. La partie est enregistrée dans le navigateur (`localStorage`), séparément pour le jeu et la page de test.

## Sources

- Fiches LiSA 2026 des items 115, 325 et 332 (UNESS / CNCEM). Les délais utilisés sont ceux de LiSA : DRESS 2 à 6 semaines, nécrolyse épidermique 4 à 28 jours.
- PNDS de la HAS : nécrolyse épidermique de l'adulte (2023) et DRESS (2024), pour les questions 💀 EDN+ (signalées « Compl. PNDS »).
- Annales EDN 2023-2025 et ECNi 2020 : format des questions et pièges transversaux (questions rédigées pour l'application, pas recopiées).
- Référentiel du Collège des enseignants de dermatologie (CEDEF) pour ce qui dépasse la fiche LiSA (SCORTEN, RegiSCAR, listes de médicaments, traitements), signalé « Compl. Collège » dans l'application.
- Photographies : Wikimedia Commons, chargées depuis leurs URL d'origine ; auteurs et licences listés en bas de page de l'application.

Outil de révision entre étudiants, sans valeur de recommandation clinique.

## Modifier le contenu

Les deux pages publiées sont générées à partir de `src/` : `head.html` (structure, styles, fiches), `data.js` (questions, cas, cartes flash, mini-jeux), `data_demo.js` et `course_demo.html` (page de test), `fx.js` (sons et animations), `app.js` (moteur commun). Après une modification : `python3 src/build.py`, puis commit et push.
