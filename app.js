// =================================================================
// 1. CLASSES ET STRUCTURATION DES DONNÉES
// =================================================================
class CarrePotager {
    constructor(id, longueur, largeur, hauteur, exposition, latitude = null, longitude = null) {
        this.id = id;
        this.longueur = Number(longueur);
        this.largeur = Number(largeur);
        this.hauteur = Number(hauteur);
        this.exposition = exposition;
        this.grille = Array(9).fill(null);
        this.latitude = latitude;
        this.longitude = longitude;
    }
    getSurface() { return (this.longueur * this.largeur) / 10000; }
    getVolumeLitres() { return (this.longueur * this.largeur * this.hauteur) / 1000; }
    placerPlanteCase(indexCase, idPlante) {
        if (indexCase >= 0 && indexCase < 9) {
            this.grille[indexCase] = {
                idPlante: idPlante,
                datePlantation: new Date().toISOString().split('T')[0]
            };
        }
    }
    retirerPlanteCase(indexCase) {
        if (indexCase >= 0 && indexCase < 9) {
            this.grille[indexCase] = null;
        }
    }
}

const CATEGORIES = {
    LEGUME_FRUIT: "Légumes-Fruits",
    LEGUME_FEUILLE: "Légumes-Feuilles",
    LEGUME_RACINE: "Légumes-Racines",
    LEGUMINEUSE: "Légumineuses",
    AROMATIQUE: "Plantes Aromatiques",
    FLEUR_AMIE: "Fleurs Bénéfiques & Pollinisatrices"
};

const REGLES_DISTANCES = {
    PROTECTION_SANITAIRE: { icone: "🛡️", libelle: "Protection contre parasites/nuisibles" },
    POLLINISATION: { icone: "🐝", libelle: "Attraction des pollinisateurs" },
    COMPAGNONNAGE_DIRECT: { icone: "🤝", libelle: "Synergie racinaire / Ombrage (Stimulation)" },
    INCOMPATIBILITE: { icone: "⚠️", libelle: "Incompatibilité / Éloignement recommandé" }
};

// Catalogue enrichi avec distances minimales optimisées pour la culture en carré
const catalogueInitial = [
    // --- LÉGUMES-FRUITS ---
    { 
        id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 75, distanceMin: 40,
        descriptionRole: "Bénéficie du basilic (stimulation/saveur) et de l'œillet d'Inde (protection)."
    },
    { 
        id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai - Juin", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 60, distanceMin: 50,
        descriptionRole: "Nécessite la présence de pollinisateurs attirés par la bourrache."
    },
    { 
        id: "aubergine", nom: "Aubergine", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Février - Mars", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 80, distanceMin: 40,
        descriptionRole: "Exigeante en chaleur. S'associe bien avec les haricots qui fixent l'azote."
    },
    { 
        id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Février - Mars", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 70, distanceMin: 35,
        descriptionRole: "Aime la proximité des aromates comme le basilic et la marjolaine."
    },

    // --- LÉGUMES-FEUILLES ---
    { 
        id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Avril - Octobre", moisMiseEnTerre: 3, moisMax: 8, joursMaturation: 45, distanceMin: 20,
        descriptionRole: "Culture rapide s'épanouissant à l'ombre des grands légumes."
    },
    { 
        id: "epinard", nom: "Épinard", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Mai / Août - Sept", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 8, joursMaturation: 50, distanceMin: 15,
        descriptionRole: "Couvre le sol. Ses racines sécrètent des saponines bénéfiques au sol."
    },
    { 
        id: "blette", nom: "Blette (Poirée)", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Avril - Juin", repiquage: "Mai - Juin", moisMiseEnTerre: 3, moisMax: 5, joursMaturation: 60, distanceMin: 30,
        descriptionRole: "Très productive. S'accorde parfaitement avec les carottes et les haricots."
    },
    { 
        id: "chou_kale", nom: "Chou Kale", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mai - Juin", repiquage: "Juin - Juillet", moisMiseEnTerre: 5, moisMax: 6, joursMaturation: 70, distanceMin: 35,
        descriptionRole: "Rustique. Apprécie la compagnie des plantes aromatiques à forte odeur."
    },

    // --- LÉGUMES-RACINES ---
    { 
        id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Mars - Juillet", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 6, joursMaturation: 80, distanceMin: 8,
        descriptionRole: "Sensible à la mouche de la carotte. Protégée par les poireaux ou oignons."
    },
    { 
        id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 8, joursMaturation: 25, distanceMin: 5,
        descriptionRole: "Intercalaire idéal. Se récolte vite avant que les voisins ne prennent l'espace."
    },
    { 
        id: "betterave", nom: "Betterave", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE", 
        semis: "Avril - Juillet", repiquage: "Mai - Juillet", moisMiseEnTerre: 3, moisMax: 6, joursMaturation: 65, distanceMin: 15,
        descriptionRole: "Aime la proximité des oignons, de la laitue et des choux."
    },
    { 
        id: "oignon", nom: "Oignon", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Février - Avril", repiquage: "Mars - Avril (Bulbilles)", moisMiseEnTerre: 2, moisMax: 3, joursMaturation: 110, distanceMin: 10,
        descriptionRole: "Répulsif naturel pour de nombreux parasites, notamment la mouche de la carotte."
    },

    // --- LÉGUMINEUSES ---
    { 
        id: "haricot_vert", nom: "Haricot Vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE", 
        semis: "Avril - Juillet", repiquage: "Mai - Juillet", moisMiseEnTerre: 4, moisMax: 6, joursMaturation: 60, distanceMin: 15,
        descriptionRole: "Fixe l'azote dans le sol pour stimuler les plantes voisines."
    },
    { 
        id: "pois", nom: "Pois Nain", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Juin", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 5, joursMaturation: 70, distanceMin: 15,
        descriptionRole: "Enrichit naturellement la terre en azote. Préfère les climats tempérés et frais."
    },
    { 
        id: "feve", nom: "Fève", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD", 
        semis: "Février - Avril", repiquage: "Semis direct", moisMiseEnTerre: 1, moisMax: 3, joursMaturation: 90, distanceMin: 20,
        descriptionRole: "Excellente plante de début de saison. Attire les pucerons, protégeant ainsi les autres."
    },

    // --- PLANTES AROMATIQUES ---
    { 
        id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 30, distanceMin: 15,
        descriptionRole: "Stimule la croissance de la tomate et éloigne le mildiou."
    },
    { 
        id: "persil", nom: "Persil", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Août", repiquage: "Avril - Septembre", moisMiseEnTerre: 2, moisMax: 7, joursMaturation: 60, distanceMin: 15,
        descriptionRole: "Croissance initiale lente. Apprécie l'ombre tamisée des tomates et poivrons."
    },
    { 
        id: "ciboulette", nom: "Ciboulette", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Mai", repiquage: "Avril - Mai", moisMiseEnTerre: 2, moisMax: 4, joursMaturation: 60, distanceMin: 15,
        descriptionRole: "Vivace. Son odeur d'alliacée aide à repousser les pucerons et l'oïdium."
    },

    // --- FLEURS BÉNÉFIQUES & POLLINISATRICES ---
    { 
        id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 50, distanceMin: 15,
        descriptionRole: "🛡️ Fleur protectrice contre les pucerons et nématodes."
    },
    { 
        id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Mai", repiquage: "Semis direct", moisMiseEnTerre: 3, moisMax: 4, joursMaturation: 45, distanceMin: 25,
        descriptionRole: "🐝 Fleur mellifère attirant les insectes pollinisateurs."
    },
    { 
        id: "souci", nom: "Souci", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Juin", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 5, joursMaturation: 50, distanceMin: 20,
        descriptionRole: "🛡️ Attire les syrphes (mangeuses de pucerons) et nettoie le sol des parasites."
    },
    { 
        id: "capucine", nom: "Capucine Naine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Semis direct", moisMiseEnTerre: 3, moisMax: 4, joursMaturation: 55, distanceMin: 20,
        descriptionRole: "🐛 Fleur sacrifice : elle attire volontairement les pucerons noirs loin de vos légumes."
    }
];

const MATRICE_ASSOCIATIONS = {
    tomate: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ L'Œillet d'Inde repousse les nématodes du sol et les pucerons." },
Use code with caution.basilic: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🚀 Le basilic stimule la pousse de la tomate, améliore sa saveur et éloigne le mildiou." },haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🌿 Le haricot fixe l'azote de l'air pour fertiliser le pied de tomate." },carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🤝 Bon compagnonnage racinaire : l'enracinement profond de la carotte n'entre pas en conflit avec la tomate." }},courgettes: {bourrache: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 La Bourrache attire massivement les abeilles nécessaires à la pollinisation des fleurs de courgette." },haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "25-30 cm", conseil: "🌿 Le haricot enrichit le sol en azote, profitant au feuillage gourmand de la courgette." },oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "20-25 cm", conseil: "🛡️ Aide à limiter la pression des pucerons sur les jeunes pousses." }},haricot_vert: {tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🌿 Le haricot fournit de l'azote naturel utilisable par la tomate." },courgettes: { type: "COMPAGNONNAGE_DIRECT", distance: "25-30 cm", conseil: "🌿 Synergie idéale : enrichit la terre en azote pour la courgette." },carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🤝 Association classique du potager : la carotte profite de l'azote du haricot." },laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🥬 La laitue s'épanouit au pied des haricots sans gêner leurs racines." }},laitue: {carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🤝 Les racines superficielles de la salade ne gênent pas le développement bulbeux de la carotte." },haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🥬 Profite de l'azote fixé par les fabacées et de leur ombre légère." },tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "⛱️ Profite de l'ombrage tamisé du feuillage de la tomate pendant les chaudes journées." }},carotte: {tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🤝 Occupation optimale du sol : occupation racinaire à des profondeurs différentes." },laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🤝 Bon gain d'espace : récolte rapide de la laitue libérant l'espace pour la carotte." },haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🌿 Bénéficie de la fertilisation azotée naturelle apportée par le haricot." }},basilic: {tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🚀 Alliance phare du potager : amélioration gustative et répulsif anti-moustiques/mouches." },courgettes: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Son parfum fort masque les plantes et repousse certains nuisibles." }},oeillet_inde: {tomate: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Protection bio efficace contre les nématodes racinaires." },courgettes: { type: "PROTECTION_SANITAIRE", distance: "20-25 cm", conseil: "🛡️ Éloigne les altises et pucerons du feuillage." }},bourrache: {courgettes: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Plante mellifère majeure augmentant le rendement des courgettes." },tomate: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Attire les pollinisateurs et repousse le sphinx de la tomate." }}};let carres = [];let plantes = [...catalogueInitial];window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0, latitude: null, longitude: null };// Réduit à 20cm pour resserrer la grille par défautconst TAILLE_CASE_PAR_DEFAUT_CM = 20;// =================================================================// 2. STOCKAGE ET INITIALISATION// =================================================================function sauvegarderDonnees() {localStorage.setItem("potager_carres_v10", JSON.stringify(carres));localStorage.setItem("potager_plantes_v10", JSON.stringify(plantes));localStorage.setItem("potager_zone_climatique_v10", JSON.stringify(window.zoneClimatiqueActuelle));}function chargerDonneesStockees() {const carresStockes = localStorage.getItem("potager_carres_v10");const plantesStockees = localStorage.getItem("potager_plantes_v10");const zoneStockee = localStorage.getItem("potager_zone_climatique_v10");if (plantesStockees) plantes = JSON.parse(plantesStockees);if (zoneStockee) window.zoneClimatiqueActuelle = JSON.parse(zoneStockee);if (carresStockes) {const donneesBrutes = JSON.parse(carresStockes);carres = donneesBrutes.map(c => {const carre = new CarrePotager(c.id, c.longueur, c.largeur, c.hauteur, c.exposition, c.latitude, c.longitude);carre.grille = c.grille || Array(9).fill(null);return carre;});}}document.addEventListener("DOMContentLoaded", () => {chargerDonneesStockees();initSelects();renderCarres();renderPlantes();renderCalendrier();afficherStatutZoneClimatique();chargerMeteoEtAlertes();document.getElementById("form-carre")?.addEventListener("submit", async (e) => {e.preventDefault();const boutonSubmit = e.target.querySelector('button[type="submit"]');if (boutonSubmit) {boutonSubmit.disabled = true;boutonSubmit.dataset.libelleOrigine = boutonSubmit.textContent;boutonSubmit.textContent = "📍 Localisation en cours...";}const L = document.getElementById("longueur").value;const l = document.getElementById("largeur").value;const h = document.getElementById("hauteur").value;const expo = document.getElementById("exposition").value;const position = await detecterZoneClimatique();const nouveauCarre = new CarrePotager(carres.length + 1, L, l, h, expo,position ? position.latitude : null,position ? position.longitude : null);carres.push(nouveauCarre);if (position) {mettreAJourZoneClimatique(position.latitude, position.longitude);}sauvegarderDonnees();renderCarres();renderPlantes();renderCalendrier();afficherStatutZoneClimatique();if (boutonSubmit) {boutonSubmit.disabled = false;boutonSubmit.textContent = boutonSubmit.dataset.libelleOrigine;}e.target.reset();});document.getElementById("filter-categorie")?.addEventListener("change", renderPlantes);});function initSelects() {const selectFilter = document.getElementById("filter-categorie");if (!selectFilter) return;selectFilter.innerHTML = <option value="TOUS">-- Toutes les catégories --</option>;Object.values(CATEGORIES).forEach(cat => {selectFilter.innerHTML += <option value="${cat}">${cat}</option>;});}// =================================================================// 2 bis. GÉOLOCALISATION ET ZONE CLIMATIQUE// =================================================================function detecterZoneClimatique() {return new Promise((resolve) => {if (!("geolocation" in navigator)) {resolve(null);return;}navigator.geolocation.getCurrentPosition((pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),() => resolve(null),{ timeout: 6000, maximumAge: 3600000 });});}function calculerDecalageDepuisLatitude(latitude) {const LATITUDE_REFERENCE = 46.6;const JOURS_PAR_DEGRE = 3;return Math.round((latitude - LATITUDE_REFERENCE) * JOURS_PAR_DEGRE);}function nommerZoneClimatique(decalageJours) {if (decalageJours <= -10) return "Climat précoce (Sud / littoral)";if (decalageJours >= 10) return "Climat tardif (Nord / altitude)";return "Climat tempéré (Standard)";}function mettreAJourZoneClimatique(latitude, longitude) {const decalageJours = calculerDecalageDepuisLatitude(latitude);window.zoneClimatiqueActuelle = {nom: nommerZoneClimatique(decalageJours),decalageJours,latitude,longitude};}function afficherStatutZoneClimatique() {const zone = document.getElementById("statut-zone-climatique");if (!zone) return;const z = window.zoneClimatiqueActuelle;if (z && z.latitude !== null && z.latitude !== undefined) {zone.innerHTML = 📍 <strong>${z.nom}</strong> (décalage récolte : ${z.decalageJours >= 0 ? "+" : ""}${z.decalageJours} j);} else {zone.innerHTML = 📍 Zone climatique non détectée — autorisez la géolocalisation lors de la création d'un carré pour affiner les dates de récolte.;}}// =================================================================// 2 ter. GRILLE À CASES DE TAILLE VARIABLE// =================================================================function calculerPoidsGrille(carre) {const poidsColonnes = [TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM];const poidsLignes = [TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM];for (let i = 0; i < 9; i++) {const item = carre.grille[i];if (!item) continue;const plante = plantes.find(p => p.id === item.idPlante);const taille = plante?.distanceMin || TAILLE_CASE_PAR_DEFAUT_CM;const col = i % 3;const ligne = Math.floor(i / 3);poidsColonnes[col] = Math.max(poidsColonnes[col], taille);poidsLignes[ligne] = Math.max(poidsLignes[ligne], taille);}return { poidsColonnes, poidsLignes };}function calculerDistanceEntreCases(carre, index1, index2) {const { poidsColonnes, poidsLignes } = calculerPoidsGrille(carre);const x1 = index1 % 3, y1 = Math.floor(index1 / 3);const x2 = index2 % 3, y2 = Math.floor(index2 / 3);let dx = 0;for (let c = Math.min(x1, x2); c < Math.max(x1, x2); c++) {dx += (poidsColonnes[c] + poidsColonnes[c + 1]) / 2;}let dy = 0;for (let l = Math.min(y1, y2); l < Math.max(y1, y2); l++) {dy += (poidsLignes[l] + poidsLignes[l + 1]) / 2;}return Math.round(Math.sqrt(dx * dx + dy * dy));}// =================================================================// 3. AFFICHAGE ET SUPPRESSION DES CARRÉS// =================================================================function renderCarres() {const container = document.getElementById("liste-carres");if (!container) return;container.innerHTML = "";carres.forEach(c => {const { poidsColonnes, poidsLignes } = calculerPoidsGrille(c);const styleGrille = grid-template-columns: ${poidsColonnes.map(p => ${p}fr).join(" ")}; grid-template-rows: ${poidsLignes.map(p => ${p}fr).join(" ")};;let htmlGrille = <div class="grille-potager" style="${styleGrille}">;for (let i = 0; i < 9; i++) {const item = c.grille[i];if (item) {const plante = plantes.find(p => p.id === item.idPlante);htmlGrille +=  <div class="case-grille plante-occupee" title="Espacement requis : ${plante?.distanceMin || "?"} cm"> 🌿 <strong>${getNomPlante(item.idPlante)}</strong> <button class="btn-suppr-case" onclick="libererCase(${c.id}, ${i})">❌</button> </div>;} else {htmlGrille += <div class="case-grille"><small>Libre (${i+1})</small></div>;}}htmlGrille += </div>;const infoLocalisation = (c.latitude !== null && c.latitude !== undefined)? <p style="font-size:11px; color:#888;">📍 Localisé (${c.latitude.toFixed(2)}, ${c.longitude.toFixed(2)})</p>: "";container.innerHTML +=  <div class="item-card" style="position:relative;"> <div style="display:flex; justify-content:space-between; align-items:center;"> <h4>Carré #${c.id} (${c.exposition})</h4> <button onclick="supprimerCarreComplet(${c.id})" style="background:#ffebee; color:#c62828; border:1px solid #ef9a9a; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;"> 🗑️ Supprimer le carré </button> </div> ${infoLocalisation} ${htmlGrille} </div>;});}function supprimerCarreComplet(carreId) {if (confirm(Voulez-vous vraiment supprimer le carré potager #${carreId} ?)) {carres = carres.filter(c => c.id !== carreId);carres.forEach((c, index) => c.id = index + 1);sauvegarderDonnees();renderCarres();renderCalendrier();}}function libererCase(carreId, indexCase) {const carre = carres.find(c => c.id === carreId);if (carre) {carre.retirerPlanteCase(indexCase);sauvegarderDonnees();renderCarres();renderCalendrier();}}function renderPlantes() {const container = document.getElementById("catalogue-plantes");const filter = document.getElementById("filter-categorie")?.value;if (!container) return;container.innerHTML = "";let liste = (filter === "TOUS" || !filter) ? plantes : plantes.filter(p => p.categorie === filter);liste.forEach(p => {container.innerHTML += `🌱 ${p.nom}Catégorie : ${p.categorie}Espacement requis : ${p.distanceMin} cm${p.descriptionRole}⚡ Planter & Associer; }); } // ================================================================= // 4. ASSISTANT D'ASSOCIATION // ================================================================= function ouvrirAssistantPlantation(planteId) { const plante = plantes.find(p => p.id === planteId); if (!plante || carres.length === 0) { alert("Créez d'abord un carré potager dans la Section 1."); return; } let options = ""; carres.forEach(c => { c.grille.forEach((val, idx) => { if (val === null) options += Carré #${c.id} (${c.exposition}) ➔ Case ${idx + 1}; }); }); if (!options) { alert("Tous vos carrés potagers sont complets."); return; } const overlay = document.createElement("div"); overlay.id = "modal-assistant"; overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000;"; overlay.innerHTML = 📏 Assistant d'Association : ${plante.nom} (${plante.distanceMin} cm requis)Choisissez l'emplacement :${options}AnnulerConfirmer; document.body.appendChild(overlay); analyserCompatibilite(plante.id); } function analyserCompatibilite(planteId) { const select = document.getElementById("select-emplacement"); const zone = document.getElementById("zone-analyse-association"); if (!select || !zone) return; const [carreId, caseIndex] = select.value.split("-").map(Number); const carre = carres.find(c => c.id === carreId); const planteActuelle = plantes.find(p => p.id === planteId); let conseils = []; carre.grille.forEach((voisin, idxVoisin) => { if (voisin && idxVoisin !== caseIndex) { const nomVoisin = getNomPlante(voisin.idPlante); const dist = calculerDistanceEntreCases(carre, caseIndex, idxVoisin); const planteVoisine = plantes.find(p => p.id === voisin.idPlante); const regle = MATRICE_ASSOCIATIONS[planteId]?.[voisin.idPlante] || MATRICE_ASSOCIATIONS[voisin.idPlante]?.[planteId]; let alerteEspacement = ""; const espacementRequis = Math.max(planteActuelle?.distanceMin || 0, planteVoisine?.distanceMin || 0); if (dist < espacementRequis) { alerteEspacement =  ⚠️ Trop proche (min. ${espacementRequis} cm); } if (regle) { conseils.push(${nomVoisin} (${dist} cm) :${alerteEspacement}${regle.conseil} (Distance idéale: ${regle.distance})); } else { conseils.push(${nomVoisin} (${dist} cm) :${alerteEspacement} Association neutre.); } } }); zone.innerHTML = conseils.length > 0 ? conseils.join("<hr style='margin:5px 0;'>") : "✨ Aucun voisin direct dans ce carré."; } function validerPlantation(planteId) { const [carreId, caseIndex] = document.getElementById("select-emplacement").value.split("-").map(Number); const carre = carres.find(c => c.id === carreId); if (carre) { carre.placerPlanteCase(caseIndex, planteId); sauvegarderDonnees(); renderCarres(); renderCalendrier(); fermerAssistant(); } } function fermerAssistant() { document.getElementById("modal-assistant")?.remove(); } function getNomPlante(id) { return plantes.find(p => p.id === id)?.nom || id; } // ================================================================= // 5. CALENDRIER DE RÉCOLTE AVEC DATES COHÉRENTES // ================================================================= function renderCalendrier() { const container = document.getElementById("calendrier-container"); if (!container) return; container.innerHTML = ""; const idsPlantesEnTerre = new Set(); carres.forEach(c => { c.grille.forEach(caseItem => { if (caseItem) idsPlantesEnTerre.add(caseItem.idPlante); }); }); if (idsPlantesEnTerre.size === 0) { container.innerHTML = "<p style='color:#666;'>Aucune plante dans le potager.</p>"; return; } const decalage = window.zoneClimatiqueActuelle.decalageJours; const dateCourante = new Date(); const moisCourant = dateCourante.getMonth(); idsPlantesEnTerre.forEach(idPlante => { const infoPlante = plantes.find(p => p.id === idPlante); if (infoPlante) { let messageAlerteOuRecolte = ""; if (moisCourant < infoPlante.moisMiseEnTerre || moisCourant > infoPlante.moisMax) { messageAlerteOuRecolte = ⚠️ Saison dépassée : La mise en terre s'effectue habituellement en ${infoPlante.repiquage}.; } else { const dateCalcul = new Date(dateCourante.getFullYear(), infoPlante.moisMiseEnTerre, 15); dateCalcul.setDate(dateCalcul.getDate() + (infoPlante.joursMaturation || 60) + decalage); messageAlerteOuRecolte = 🌾 Récolte estimée (si planté en ${infoPlante.repiquage}) : ~${dateCalcul.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}; } container.innerHTML += 🌱 ${infoPlante.nom}Période de semis : ${infoPlante.semis}Période de repiquage : ${infoPlante.repiquage}${messageAlerteOuRecolte}; } }); } // ================================================================= // 6. MÉTÉO ET ALERTES SANITAIRES DU POTAGER // ================================================================= async function chargerMeteoEtAlertes() { const statusDiv = document.getElementById("meteo-status"); const cardsDiv = document.getElementById("meteo-cards"); if (!statusDiv || !cardsDiv) return; statusDiv.innerHTML = "⏳ Analyse météo complète & calcul des risques du potager..."; cardsDiv.innerHTML = ""; let latitude = 48.8566;  let longitude = 2.3522; if ("geolocation" in navigator) { try { const position = await new Promise((resolve, reject) => { navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }); }); latitude = position.coords.latitude; longitude = position.coords.longitude; } catch (err) { console.warn("Géolocalisation indisponible, position par défaut utilisée.", err); } } const apiUrl = open-meteo.com{latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto; try { const response = await fetch(apiUrl); if (!response.ok) throw new Error(Erreur HTTP ${response.status}); const data = await response.json(); const daily = data.daily; statusDiv.innerHTML = 📍 Zone localisée (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`;cardsDiv.innerHTML = daily.time.map((dateStr, index) => {const tMax = daily.temperature_2m_max[index];const tMin = daily.temperature_2m_min[index];const pluie = daily.precipitation_sum[index];const vent = daily.windspeed_10m_max ? daily.windspeed_10m_max[index] : 0;let consigneArrosage = "";if (pluie >= 8) {consigneArrosage = "💧 Arrosage inutile : Pluie suffisante pour combler les besoins du sol.";} else if (tMax >= 30) {consigneArrosage = "🚰 Arrosage intensif : Arrosez abondamment tôt le matin ou tard le soir. Maintenez le paillage humide.";} else if (tMax >= 22 && pluie < 2) {consigneArrosage = "🚰 Arrosage modéré : Maintenez une humidité constante au pied sans détremper les racines.";} else {consigneArrosage = "💧 Arrosage léger / réduit : Limitez l'apport pour éviter la stagnation d'eau au niveau des racines.";}let alertesEtTraitements = [];if (tMax >= 27 && pluie < 2) {alertesEtTraitements.push("🍅 Risque Cul-Noir (Nécrose apicale) : Stress hydrique bloquant la fixation du calcium." +"👉 Action : Arrosez de façon très régulière (sans à-coups) et paillez le sol pour préserver une humidité constante.");}if (pluie > 4 && tMax >= 18 && tMax <= 26) {alertesEtTraitements.push("⚠️ Alerte Mildiou : Humidité et chaleur modérée favorisent les champignons." +"👉 Action : Pulvérisez du purin de prêle ou du bicarbonate. Ne mouillez jamais le feuillage.");}if (tMax >= 22 && tMax <= 30 && pluie < 3) {alertesEtTraitements.push("⚪ Risque Oïdium : Temps chaud et sec avec rosée ou variations de température nocturnes." +"👉 Action : Pulvérisez du lait dilué (10%) ou du bicarbonate de soude. Supprimez les premières feuilles atteintes.");}if (tMax >= 25 && pluie < 1) {alertesEtTraitements.push("🪲 Prolifération de Ravageurs : Chaleur sèche propice aux pucerons et altises." +"👉 Action : Pulvérisez une solution de savon noir dilué (5%) ou utilisez un extrait fermenté de grande ortie.");}if (pluie >= 5) {alertesEtTraitements.push("🐌 Alerte Limaces : L'humidité fait sortir les gastéropodes." +"👉 Action : Protégez les jeunes pousses avec du marc de café, des coquilles d'œufs pilées ou du paillis.");}if (tMax >= 32) {alertesEtTraitements.push("🔥 Alerte Canicule : Risque de brûlure des feuillages et arrêt de croissance." +"👉 Action : Ombragez vos carrés avec un voile ou une ombrière. Ne coupez aucun feuillage.");}if (tMin <= 3) {alertesEtTraitements.push("❄️ Risque de Gelée : Danger pour les jeunes plants sensibles." +"👉 Action : Couvrez vos carrés d'un voile de forçage ou de cloches de protection avant la nuit.");}if (vent >= 40) {alertesEtTraitements.push("💨 Vent Fort (max " + vent + " km/h) : Risque de casse des tiges et déracinement." +"👉 Action : Vérifiez le tuteurage des tomates et légumineuses hautes.");}if (alertesEtTraitements.length === 0) {alertesEtTraitements.push("🟢 Conditions Optimales : Climat favorable pour la pousse." +"👉 Action : Entretien classique. Un apport de purin d'ortie peut stimuler les défenses des plants.");}let couleurBordure = '#2e7d32';if (tMin <= 3 || tMax >= 32 || (pluie > 4 && tMax >= 18 && tMax <= 26)) {couleurBordure = '#c62828';} else if (alertesEtTraitements.length > 1) {couleurBordure = '#ef6c00';}return <div class="item-card" style="border-left: 5px solid ${couleurBordure};"> <h4>📅 ${new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</h4> <p>🌡️ <strong>Températures :</strong> ${tMin}°C à ${tMax}°C</p> <p>🌧️ <strong>Pluie :</strong> ${pluie} mm ${vent ? '| 💨 <strong>Vent :</strong> ' + vent + ' km/h' : ''}</p> <hr style="border:0; border-top:1px solid #e0e0e0; margin:8px 0;"> <p style="font-size:12px; margin-bottom:8px;">${consigneArrosage}</p> <div style="font-size:12px; color:#333; display:flex; flex-direction:column; gap:8px;"> ${alertesEtTraitements.join('')} </div> </div>;}).join('');} catch (error) {console.error("Erreur météo :", error);statusDiv.innerHTML = <span style="color:#c62828;">❌ Impossible d'accéder aux prévisions météo.</span>;}}
