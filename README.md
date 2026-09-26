# ToxiQuest · Toxidermies (item 115)

Sous-colle EDN à trois joueurs sur un seul écran : **item 115 « Toxidermies »** du programme LiSA 2026, plus la pharmacovigilance de l'item 325.

**Jouer en ligne : https://r69sy78sny-droid.github.io/sous-colle-toxidermies/**

**Page de test (contenu fictif, sans spoiler) : https://r69sy78sny-droid.github.io/sous-colle-toxidermies/demo.html** — même moteur, pour vérifier sons, chrono, roue, fiches interactives, cas et bilan avant la vraie session (lien discret tout en bas du vrai jeu).

## Déroulé

0. **Équipe** : trois prénoms, nombre de manches, chronomètre facultatif.
1. **Fiches interactives** : 9 fiches (définition et mécanismes, frise des délais, sémiologie avec photos masquables, tableau DRESS / PEAG / SJS-Lyell, SCORTEN et RegiSCAR, médicaments à haut risque, imputabilité, conduite à tenir, pharmacovigilance). Chacune se travaille en quatre temps : 📖 lire, 🙈 réciter en texte à trous, 🎯 mini-jeu (association, tri en colonnes, photo-quiz), 🧠 cartes flash « Je savais / À revoir ». Tableau de couverture des 18 objectifs (OIC).
2. **Trivial Pursuit EDN** : roue à 5 catégories, 62 questions (QCU, QRM notées au barème EDN, QROC, calcul, classement), correction avec [RANG A] / [RANG B] et code OIC, camemberts.
3. **Deux dossiers progressifs en équipe** : DRESS sous allopurinol (calculateur RegiSCAR, hépatite fulminante, place des corticoïdes) et Lyell aux urgences (calculateur SCORTEN, piège des corticoïdes, soins ophtalmologiques, sepsis). Score d'équipe et stabilité du patient.
4. **Bilan** : podium, radar par catégorie, points forts et faibles par joueur, fiche mémo des erreurs et des cartes flash « à revoir », à imprimer ou télécharger (.html, .md).

Sons synthétisés dans le navigateur (Web Audio, aucun fichier) : crans de la roue, tic-tac du chrono et sonnerie, bonnes et mauvaises réponses, camemberts, alarme du scope, fanfare ; bouton 🔊 ou touche M pour couper. Animations : confettis, annonces de tour, compteurs animés, moniteur cardiaque qui s'accélère quand le patient se dégrade, podium.

Deux fichiers autonomes, `index.html` (vrai jeu) et `demo.html` (page de test), en HTML, CSS et JavaScript sans dépendance ni compilation. La partie est enregistrée dans le navigateur (`localStorage`), séparément pour le jeu et la page de test.

## Sources

- Fiches LiSA 2026 des items 115, 325 et 332 (UNESS / CNCEM). Les délais utilisés sont ceux de LiSA : DRESS 2 à 6 semaines, nécrolyse épidermique 4 à 28 jours.
- Référentiel du Collège des enseignants de dermatologie (CEDEF) pour ce qui dépasse la fiche LiSA (SCORTEN, RegiSCAR, listes de médicaments, traitements), signalé « Compl. Collège » dans l'application.
- Photographies : Wikimedia Commons, chargées depuis leurs URL d'origine ; auteurs et licences listés en bas de page de l'application.

Outil de révision entre étudiants, sans valeur de recommandation clinique.
