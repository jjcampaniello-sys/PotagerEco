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

// Catalogue complet des plantes avec mois de plantation (0 = Janvier, 4 = Mai, etc.)
const catalogueInitial = [
    { 
        id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 75, distanceMin: 45,
        descriptionRole: "Bénéficie du basilic (stimulation/saveur) et de l'œillet d'Inde (protection)."
    },
    { 
        id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai - Juin", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 60, distanceMin: 60,
        descriptionRole: "Nécessite la présence de pollinisateurs attirés par la bourrache."
    },
    { 
        id: "haricot_vert", nom: "Haricot Vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE", 
        semis: "Avril - Juillet", repiquage: "Mai - Juillet", moisMiseEnTerre: 4, moisMax: 6, joursMaturation: 60, distanceMin: 20,
        descriptionRole: "Fixe l'azote dans le sol pour stimuler les plantes voisines."
    },
    { 
        id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Avril - Octobre", moisMiseEnTerre: 3, moisMax: 8, joursMaturation: 45, distanceMin: 25,
        descriptionRole: "Culture rapide s'épanouissant à l'ombre des grands légumes."
    },
    { 
        id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Mars - Juillet", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 6, joursMaturation: 80, distanceMin: 10,
        descriptionRole: "Sensible à la mouche de la carotte."
    },
    { 
        id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 30, distanceMin: 20,
        descriptionRole: "Stimule la croissance de la tomate et éloigne le mildiou."
    },
    { 
        id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 50, distanceMin: 15,
        descriptionRole: "🛡️ Fleur protectrice contre les pucerons et nématodes."
    },
    { 
        id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Mai", repiquage: "Semis direct", moisMiseEnTerre: 3, moisMax: 4, joursMaturation: 45, distanceMin: 30,
        descriptionRole: "🐝 Fleur mellifère attirant les insectes pollinisateurs."
    },
    { 
        id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Mars - Septembre", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 8, joursMaturation: 25, distanceMin: 5,
        descriptionRole: "Culture ultra-rapide, idéale pour marquer les rangs et optimiser l'espace en attendant les légumes plus lents."
    },
    { 
        id: "oignon", nom: "Oignon", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Février - Avril", repiquage: "Avril - Mai", moisMiseEnTerre: 3, moisMax: 4, joursMaturation: 120, distanceMin: 10,
        descriptionRole: "🛡️ Son odeur brouille le repérage olfactif de la mouche de la carotte, protection réciproque classique."
    },
    { 
        id: "betterave", nom: "Betterave", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Avril - Juin", repiquage: "Semis direct", moisMiseEnTerre: 3, moisMax: 5, joursMaturation: 90, distanceMin: 15,
        descriptionRole: "Racine peu exigeante qui valorise bien les cases de petite taille."
    },
    { 
        id: "epinard", nom: "Épinard", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Semis direct", moisMiseEnTerre: 2, moisMax: 8, joursMaturation: 40, distanceMin: 15,
        descriptionRole: "Feuille rustique appréciant la mi-ombre des légumes plus hauts."
    },
    { 
        id: "poivron", nom: "Poivron", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Février - Mars", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 90, distanceMin: 40,
        descriptionRole: "Comme la tomate, apprécie la présence du basilic à proximité."
    },
    { 
        id: "concombre", nom: "Concombre", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai - Juin", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 65, distanceMin: 40,
        descriptionRole: "Bénéficie lui aussi des pollinisateurs attirés par la bourrache."
    },
    { 
        id: "petit_pois", nom: "Petit Pois", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE", 
        semis: "Février - Avril", repiquage: "Semis direct", moisMiseEnTerre: 1, moisMax: 3, joursMaturation: 70, distanceMin: 8,
        descriptionRole: "Comme le haricot, fixe l'azote de l'air et enrichit le sol pour ses voisins."
    },
    { 
        id: "persil", nom: "Persil", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Juin", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 70, distanceMin: 15,
        descriptionRole: "Attire des insectes auxiliaires utiles et se glisse facilement en bordure de case."
    },
    { 
        id: "capucine", nom: "Capucine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 55, distanceMin: 25,
        descriptionRole: "🛡️ Plante-piège : attire les pucerons sur elle plutôt que sur les légumes voisins."
    },
    { 
        id: "souci", nom: "Souci (Calendula)", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Mai", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 55, distanceMin: 20,
        descriptionRole: "🛡️ Fleur comestible répulsive contre nématodes et pucerons, très mellifère."
    },
    { id: "chou_kale", nom: "Chou Kale", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "SUD", semis: "Mars - Juin", repiquage: "Mai - Juillet", moisMiseEnTerre: 4, moisMax: 6, joursMaturation: 65, distanceMin: 40, descriptionRole: "Feuille robuste résistante au froid." },
    { id: "blette", nom: "Blette", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", semis: "Avril - Juin", repiquage: "Mai - Juillet", moisMiseEnTerre: 4, moisMax: 6, joursMaturation: 55, distanceMin: 30, descriptionRole: "Récolte étalée sur plusieurs mois." },
    { id: "chou_fleur", nom: "Chou-fleur", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "SUD", semis: "Mars - Mai", repiquage: "Mai - Juin", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 100, distanceMin: 45, descriptionRole: "Gourmand, à isoler des autres brassicacées." },
    { id: "feve", nom: "Fève", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD", semis: "Février - Avril", repiquage: "Semis direct", moisMiseEnTerre: 1, moisMax: 3, joursMaturation: 90, distanceMin: 20, descriptionRole: "Fixe l'azote, résiste au froid." },
    { id: "ciboulette", nom: "Ciboulette", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE", semis: "Mars - Mai", repiquage: "Avril - Juin", moisMiseEnTerre: 3, moisMax: 5, joursMaturation: 60, distanceMin: 15, descriptionRole: "🛡️ Éloigne pucerons, vivace facile." },
    { id: "thym", nom: "Thym", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", semis: "Mars - Mai", repiquage: "Mai", moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 90, distanceMin: 20, descriptionRole: "Vivace méditerranéenne, peu d'arrosage." },
];

const MATRICE_ASSOCIATIONS = {
    tomate: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ L'Œillet d'Inde repousse les nématodes du sol et les pucerons." },
        basilic: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🚀 Le basilic stimule la pousse de la tomate, améliore sa saveur et éloigne le mildiou." },
        haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "25-30 cm", conseil: "🌿 Le haricot fixe l'azote de l'air pour fertiliser le pied de tomate." },
        carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🤝 Bon compagnonnage racinaire : l'enracinement profond de la carotte n'entre pas en conflit avec la tomate." }
    },
    courgettes: {
        bourrache: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 La Bourrache attire massivement les abeilles nécessaires à la pollinisation des fleurs de courgette." },
        haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "30-35 cm", conseil: "🌿 Le haricot enrichit le sol en azote, profitant au feuillage gourmand de la courgette." },
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "20-25 cm", conseil: "🛡️ Aide à limiter la pression des pucerons sur les jeunes pousses." }
    },
    haricot_vert: {
        tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "25-30 cm", conseil: "🌿 Le haricot fournit de l'azote naturel utilisable par la tomate." },
        courgettes: { type: "COMPAGNONNAGE_DIRECT", distance: "30-35 cm", conseil: "🌿 Synergie idéale : enrichit la terre en azote pour la courgette." },
        carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🤝 Association classique du potager : la carotte profite de l'azote du haricot." },
        laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🥬 La laitue s'épanouit au pied des haricots sans gêner leurs racines." }
    },
    laitue: {
        carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🤝 Les racines superficielles de la salade ne gênent pas le développement bulbeux de la carotte." },
        haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🥬 Profite de l'azote fixé par les fabacées et de leur ombre légère." },
        tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "⛱️ Profite de l'ombrage tamisé du feuillage de la tomate pendant les chaudes journées." }
    },
    carotte: {
        tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🤝 Occupation optimale du sol : occupation racinaire à des profondeurs différentes." },
        laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🤝 Bon gain d'espace : récolte rapide de la laitue libérant l'espace pour la carotte." },
        haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🌿 Bénéficie de la fertilisation azotée naturelle apportée par le haricot." }
    },
    basilic: {
        tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🚀 Alliance phare du potager : amélioration gustative et répulsif anti-moustiques/mouches." },
        courgettes: { type: "PROTECTION_SANITAIRE", distance: "20-25 cm", conseil: "🛡️ Son parfum fort masque les plantes et repousse certains nuisibles." }
    },
    oeillet_inde: {
        tomate: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Protection bio efficace contre les nématodes racinaires." },
        courgettes: { type: "PROTECTION_SANITAIRE", distance: "20-25 cm", conseil: "🛡️ Éloigne les altises et pucerons du feuillage." }
    },
    bourrache: {
        courgettes: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Plante mellifère majeure augmentant le rendement des courgettes." },
        tomate: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Attire les pollinisateurs et repousse le sphinx de la tomate." },
        concombre: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Améliore la pollinisation des fleurs de concombre." }
    },
    oignon: {
        carotte: { type: "PROTECTION_SANITAIRE", distance: "10-15 cm", conseil: "🛡️ Association réciproque classique : l'oignon brouille la mouche de la carotte, et inversement la carotte perturbe la mouche de l'oignon." },
        laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🤝 L'oignon pousse en hauteur pendant que la laitue occupe le sol en surface." }
    },
    radis: {
        carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "5-10 cm", conseil: "🤝 Le radis, récolté en 3-4 semaines, marque le rang et libère vite la place pour la carotte plus lente." },
        laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "10-15 cm", conseil: "🤝 Deux cultures rapides qui optimisent l'espace en attendant les légumes plus longs." }
    },
    capucine: {
        courgettes: { type: "PROTECTION_SANITAIRE", distance: "25-30 cm", conseil: "🛡️ Plante-piège : concentre les pucerons loin des courgettes." },
        concombre: { type: "PROTECTION_SANITAIRE", distance: "25-30 cm", conseil: "🛡️ Détourne les pucerons et attire des auxiliaires pollinisateurs." }
    },
    souci: {
        tomate: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Répulsif reconnu contre les nématodes du sol, en complément de l'œillet d'Inde." },
        carotte: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Aide à limiter la pression des nématodes autour des racines." }
    },
    petit_pois: {
        carotte: { type: "COMPAGNONNAGE_DIRECT", distance: "8-12 cm", conseil: "🌿 Comme le haricot, fixe l'azote de l'air et profite à la carotte voisine." },
        laitue: { type: "COMPAGNONNAGE_DIRECT", distance: "8-12 cm", conseil: "🥬 La laitue profite de l'ombre légère et de l'azote apporté par les petits pois." }
    },
    persil: {
        tomate: { type: "COMPAGNONNAGE_DIRECT", distance: "15-20 cm", conseil: "🤝 Association traditionnelle : le persil profite de l'ombrage léger de la tomate et attire des insectes auxiliaires." }
    }
};


let carres = [];
let plantes = [...catalogueInitial];
window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0, latitude: null, longitude: null };

// Taille par défaut (en cm) attribuée à une case vide de la grille
const TAILLE_CASE_PAR_DEFAUT_CM = 25;

// =================================================================
// 2. STOCKAGE ET INITIALISATION
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres_v10", JSON.stringify(carres));
    localStorage.setItem("potager_plantes_v10", JSON.stringify(plantes));
    localStorage.setItem("potager_zone_climatique_v10", JSON.stringify(window.zoneClimatiqueActuelle));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres_v10");
    const plantesStockees = localStorage.getItem("potager_plantes_v10");
    const zoneStockee = localStorage.getItem("potager_zone_climatique_v10");

    if (plantesStockees) plantes = JSON.parse(plantesStockees);
    if (zoneStockee) window.zoneClimatiqueActuelle = JSON.parse(zoneStockee);

    if (carresStockes) {
        const donneesBrutes = JSON.parse(carresStockes);
        carres = donneesBrutes.map(c => {
            const carre = new CarrePotager(c.id, c.longueur, c.largeur, c.hauteur, c.exposition, c.latitude, c.longitude);
            carre.grille = c.grille || Array(9).fill(null);
            return carre;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chargerDonneesStockees();
    initSelects();
    renderCarres();
    renderPlantes();
    renderCalendrier();
    afficherStatutZoneClimatique();
    chargerMeteoEtAlertes(); // Chargement de la météo au lancement

    document.getElementById("form-carre")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const boutonSubmit = e.target.querySelector('button[type="submit"]');
        if (boutonSubmit) {
            boutonSubmit.disabled = true;
            boutonSubmit.dataset.libelleOrigine = boutonSubmit.textContent;
            boutonSubmit.textContent = "📍 Localisation en cours...";
        }

        const L = document.getElementById("longueur").value;
        const l = document.getElementById("largeur").value;
        const h = document.getElementById("hauteur").value;
        const expo = document.getElementById("exposition").value;

        const position = await detecterZoneClimatique();

        const nouveauCarre = new CarrePotager(
            carres.length + 1, L, l, h, expo,
            position ? position.latitude : null,
            position ? position.longitude : null
        );
        carres.push(nouveauCarre);

        if (position) {
            mettreAJourZoneClimatique(position.latitude, position.longitude);
        }

        sauvegarderDonnees();
        renderCarres();
        renderPlantes();
        renderCalendrier();
        afficherStatutZoneClimatique();

        if (boutonSubmit) {
            boutonSubmit.disabled = false;
            boutonSubmit.textContent = boutonSubmit.dataset.libelleOrigine;
        }
        e.target.reset();
    });

    document.getElementById("form-plante")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const nom = document.getElementById("p-nom").value.trim();
        const categorie = document.getElementById("p-categorie").value;
        const besoinSoleil = document.getElementById("p-soleil").value;
        const semis = document.getElementById("p-semis").value.trim() || "À préciser";
        const repiquage = document.getElementById("p-repiquage").value.trim() || "À préciser";
        const associees = document.getElementById("p-associees").value.trim()
            .split(",").map(s => s.trim()).filter(Boolean);
  
        const id = nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_");

        if (plantes.some(p => p.id === id)) {
            alert("Cette plante existe déjà dans le catalogue.");
            return;
        }

        plantes.push({
            id, nom, categorie, besoinSoleil,
            semis, repiquage,
            moisMiseEnTerre: 4, moisMax: 5, joursMaturation: 60, distanceMin: 30,
            descriptionRole: "Plante ajoutée manuellement au catalogue.",
            plantesAssociees: associees
        });

        sauvegarderDonnees();
        renderPlantes();
        e.target.reset();
    });

    document.getElementById("filter-categorie")?.addEventListener("change", renderPlantes);
});

function initSelects() {
    const selectFilter = document.getElementById("filter-categorie");
    const selectPCategorie = document.getElementById("p-categorie");

    if (selectFilter) {
        selectFilter.innerHTML = `<option value="TOUS">-- Toutes les catégories --</option>`;
        Object.values(CATEGORIES).forEach(cat => {
            selectFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    }

    if (selectPCategorie) {
        selectPCategorie.innerHTML = "";
        Object.values(CATEGORIES).forEach(cat => {
            selectPCategorie.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    }
}

// =================================================================
// 2 bis. GÉOLOCALISATION ET ZONE CLIMATIQUE
// =================================================================

function detecterZoneClimatique() {
    return new Promise((resolve) => {
        if (!("geolocation" in navigator)) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 6000, maximumAge: 3600000 }
        );
    });
}

function calculerDecalageDepuisLatitude(latitude) {
    const LATITUDE_REFERENCE = 46.6;
    const JOURS_PAR_DEGRE = 3;
    return Math.round((latitude - LATITUDE_REFERENCE) * JOURS_PAR_DEGRE);
}

function nommerZoneClimatique(decalageJours) {
    if (decalageJours <= -10) return "Climat précoce (Sud / littoral)";
    if (decalageJours >= 10) return "Climat tardif (Nord / altitude)";
    return "Climat tempéré (Standard)";
}

function mettreAJourZoneClimatique(latitude, longitude) {
    const decalageJours = calculerDecalageDepuisLatitude(latitude);
    window.zoneClimatiqueActuelle = {
        nom: nommerZoneClimatique(decalageJours),
        decalageJours,
        latitude,
        longitude
    };
}

function afficherStatutZoneClimatique() {
    const zone = document.getElementById("statut-zone-climatique");
    if (!zone) return;
    const z = window.zoneClimatiqueActuelle;
    if (z && z.latitude !== null && z.latitude !== undefined) {
        zone.innerHTML = `📍 <strong>${z.nom}</strong> (décalage récolte : ${z.decalageJours >= 0 ? "+" : ""}${z.decalageJours} j)`;
    } else {
        zone.innerHTML = `📍 Zone climatique non détectée — autorisez la géolocalisation lors de la création d'un carré pour affiner les dates de récolte.`;
    }
}

// =================================================================
// 2 ter. GRILLE À CASES DE TAILLE VARIABLE
// =================================================================

function calculerPoidsGrille(carre) {
    const poidsColonnes = [TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM];
    const poidsLignes = [TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM, TAILLE_CASE_PAR_DEFAUT_CM];

    for (let i = 0; i < 9; i++) {
        const item = carre.grille[i];
        if (!item) continue;
        const plante = plantes.find(p => p.id === item.idPlante);
        const taille = (plante?.distanceMin || TAILLE_CASE_PAR_DEFAUT_CM) * 0.75;
        const col = i % 3;
        const ligne = Math.floor(i / 3);
        poidsColonnes[col] = Math.max(poidsColonnes[col], taille);
        poidsLignes[ligne] = Math.max(poidsLignes[ligne], taille);
    }

    return { poidsColonnes, poidsLignes };
}

function calculerDistanceEntreCases(carre, index1, index2) {
    const { poidsColonnes, poidsLignes } = calculerPoidsGrille(carre);
    const x1 = index1 % 3, y1 = Math.floor(index1 / 3);
    const x2 = index2 % 3, y2 = Math.floor(index2 / 3);

    let dx = 0;
    for (let c = Math.min(x1, x2); c < Math.max(x1, x2); c++) {
        dx += (poidsColonnes[c] + poidsColonnes[c + 1]) / 2;
    }
    let dy = 0;
    for (let l = Math.min(y1, y2); l < Math.max(y1, y2); l++) {
        dy += (poidsLignes[l] + poidsLignes[l + 1]) / 2;
    }

    return Math.round(Math.sqrt(dx * dx + dy * dy));
}

// =================================================================
// 3. AFFICHAGE ET SUPPRESSION DES CARRÉS
// =================================================================

function renderCarres() {
    const container = document.getElementById("liste-carres");
    if (!container) return;
    container.innerHTML = "";

    carres.forEach(c => {
        const { poidsColonnes, poidsLignes } = calculerPoidsGrille(c);
        const styleGrille = `grid-template-columns: ${poidsColonnes.map(p => `${p}fr`).join(" ")}; grid-template-rows: ${poidsLignes.map(p => `${p}fr`).join(" ")};`;

        let htmlGrille = `<div class="grille-potager" style="${styleGrille}">`;
        for (let i = 0; i < 9; i++) {
            const item = c.grille[i];
            if (item) {
                const plante = plantes.find(p => p.id === item.idPlante);
                htmlGrille += `
    <div class="case-grille plante-occupee" title="Espacement requis : ${plante?.distanceMin || "?"} cm">
        <button class="btn-info-case" onclick="event.stopPropagation(); afficherInfoPlante(${c.id}, ${i})" title="Infos">ℹ️</button>
        <button class="btn-alerte-case" onclick="event.stopPropagation(); afficherAlertesPlante('${item.idPlante}')" title="Alertes">⚠️</button>
        🌿 <strong>${getNomPlante(item.idPlante)}</strong>
        <button class="btn-suppr-case" onclick="libererCase(${c.id}, ${i})">❌</button>
    </div>`;
            } else {
                htmlGrille += `<div class="case-grille"><small>Libre (${i+1})</small></div>`;
            }
        }
        htmlGrille += `</div>`;

        const infoLocalisation = (c.latitude !== null && c.latitude !== undefined)
            ? `<p style="font-size:11px; color:#888;">📍 Localisé (${c.latitude.toFixed(2)}, ${c.longitude.toFixed(2)})</p>`
            : "";

        container.innerHTML += `
            <div class="item-card" style="position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>Carré #${c.id} (${c.exposition})</h4>
                    <button onclick="supprimerCarreComplet(${c.id})" style="background:#ffebee; color:#c62828; border:1px solid #ef9a9a; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;">
                        🗑️ Supprimer le carré
                    </button>
                </div>
                ${infoLocalisation}
                ${htmlGrille}
            </div>`;
    });
}

function supprimerCarreComplet(carreId) {
    if (confirm(`Voulez-vous vraiment supprimer le carré potager #${carreId} ?`)) {
        carres = carres.filter(c => c.id !== carreId);
        carres.forEach((c, index) => c.id = index + 1);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
    }
}

function libererCase(carreId, indexCase) {
    const carre = carres.find(c => c.id === carreId);
    if (carre) {
        carre.retirerPlanteCase(indexCase);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
    }
}

function renderPlantes() {
    const container = document.getElementById("catalogue-plantes");
    const filter = document.getElementById("filter-categorie")?.value;
    if (!container) return;
    container.innerHTML = "";

    let liste = (filter === "TOUS" || !filter) ? plantes : plantes.filter(p => p.categorie === filter);

    liste.forEach(p => {
        container.innerHTML += `
            <div class="item-card">
                <h4>🌱 ${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Espacement requis :</strong> ${p.distanceMin} cm</p>
                <p><small>${p.descriptionRole}</small></p>
                <button class="btn-primary" onclick="ouvrirAssistantPlantation('${p.id}')">⚡ Planter & Associer</button>
            </div>`;
    });
}

// =================================================================
// 4. ASSISTANT D'ASSOCIATION
// =================================================================

function ouvrirAssistantPlantation(planteId) {
    const plante = plantes.find(p => p.id === planteId);
    if (!plante || carres.length === 0) {
        alert("Créez d'abord un carré potager dans la Section 1.");
        return;
    }

    let options = "";
    carres.forEach(c => {
        c.grille.forEach((val, idx) => {
            if (val === null) options += `<option value="${c.id}-${idx}">Carré #${c.id} (${c.exposition}) ➔ Case ${idx + 1}</option>`;
        });
    });

    if (!options) {
        alert("Tous vos carrés potagers sont complets.");
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "modal-assistant";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000;";

    overlay.innerHTML = `
        <div style="background:white; padding:20px; border-radius:8px; max-width:500px; width:90%;">
            <h3>📏 Assistant d'Association : ${plante.nom} (${plante.distanceMin} cm requis)</h3>
            <label>Choisissez l'emplacement :</label>
            <select id="select-emplacement" style="width:100%; padding:8px; margin:10px 0;" onchange="analyserCompatibilite('${plante.id}')">
                ${options}
            </select>
            
            <div id="zone-analyse-association" style="background:#f4f4f4; padding:12px; border-radius:6px; margin-bottom:15px; font-size:13px;"></div>

            <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="fermerAssistant()">Annuler</button>
                <button onclick="validerPlantation('${plante.id}')" style="background:#2e7d32; color:white; border:none; padding:8px 12px; border-radius:4px; font-weight:bold;">Confirmer</button>
            </div>
        </div>`;

    document.body.appendChild(overlay);
    analyserCompatibilite(plante.id);
}

function analyserCompatibilite(planteId) {
    const select = document.getElementById("select-emplacement");
    const zone = document.getElementById("zone-analyse-association");
    if (!select || !zone) return;

    const [carreId, caseIndex] = select.value.split("-").map(Number);
    const carre = carres.find(c => c.id === carreId);
    const planteActuelle = plantes.find(p => p.id === planteId);
    let conseils = [];

    carre.grille.forEach((voisin, idxVoisin) => {
        if (voisin && idxVoisin !== caseIndex) {
            const nomVoisin = getNomPlante(voisin.idPlante);
            const dist = calculerDistanceEntreCases(carre, caseIndex, idxVoisin);
            const planteVoisine = plantes.find(p => p.id === voisin.idPlante);

            const regle = MATRICE_ASSOCIATIONS[planteId]?.[voisin.idPlante] || MATRICE_ASSOCIATIONS[voisin.idPlante]?.[planteId];

            let alerteEspacement = "";
            const FACTEUR_INTENSIF = 0.75; // culture intensive en carré : -25% vs pleine terre
            const espacementRequis = Math.round((((planteActuelle?.distanceMin || 0) + (planteVoisine?.distanceMin || 0)) / 2) * FACTEUR_INTENSIF);
            if (dist < espacementRequis) {
                alerteEspacement = ` <span style="color:#c62828;">⚠️ Trop proche (min. ${espacementRequis} cm)</span>`;
            }

            if (regle) {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong>${alerteEspacement}<br>${regle.conseil} (Distance idéale: ${regle.distance})`);
            } else {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong>${alerteEspacement} Association neutre.`);
            }
        }
    });

    zone.innerHTML = conseils.length > 0 ? conseils.join("<hr style='margin:5px 0;'>") : "✨ Aucun voisin direct dans ce carré.";
}

function validerPlantation(planteId) {
    const [carreId, caseIndex] = document.getElementById("select-emplacement").value.split("-").map(Number);
    const carre = carres.find(c => c.id === carreId);
    if (carre) {
        carre.placerPlanteCase(caseIndex, planteId);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
        fermerAssistant();
    }
}

function fermerAssistant() {
    document.getElementById("modal-assistant")?.remove();
}

function getNomPlante(id) {
    return plantes.find(p => p.id === id)?.nom || id;
}
function afficherInfoPlante(carreId, indexCase) {
    const carre = carres.find(c => c.id === carreId);
    const item = carre?.grille[indexCase];
    const plante = plantes.find(p => p.id === item?.idPlante);
    if (!plante) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
        <div class="modal-box">
            <h3>🌱 ${plante.nom}</h3>
            <p><strong>Planté le :</strong> ${item.datePlantation}</p>
            <p><strong>Semis :</strong> ${plante.semis}</p>
            <p><strong>Repiquage :</strong> ${plante.repiquage}</p>
            <p><strong>Maturation :</strong> ~${plante.joursMaturation} j</p>
            <p><small>${plante.descriptionRole}</small></p>
            <p><strong>Associées :</strong> ${(plante.plantesAssociees||[]).map(getNomPlante).join(", ") || "Aucune définie"}</p>
            <button onclick="this.closest('.modal-overlay').remove()">Fermer</button>
        </div>`;
    document.body.appendChild(overlay);
}
// =================================================================
// 5. CALENDRIER DE RÉCOLTE AVEC DATES COHÉRENTES
// =================================================================

function renderCalendrier() {
    const container = document.getElementById("calendrier-container");
    if (!container) return;
    container.innerHTML = "";

    const idsPlantesEnTerre = new Set();
    carres.forEach(c => {
        c.grille.forEach(caseItem => {
            if (caseItem) idsPlantesEnTerre.add(caseItem.idPlante);
        });
    });

    if (idsPlantesEnTerre.size === 0) {
        container.innerHTML = "<p style='color:#666;'>Aucune plante dans le potager.</p>";
        return;
    }

    const decalage = window.zoneClimatiqueActuelle.decalageJours;
    const dateCourante = new Date();
    const moisCourant = dateCourante.getMonth();

    idsPlantesEnTerre.forEach(idPlante => {
        const infoPlante = plantes.find(p => p.id === idPlante);
        if (infoPlante) {
            let messageAlerteOuRecolte = "";
            const decalageMois = Math.round(decalage / 30);
            const moisMinAjuste = infoPlante.moisMiseEnTerre + decalageMois;
            const moisMaxAjuste = infoPlante.moisMax + decalageMois;

            if (moisCourant < moisMinAjuste || moisCourant > moisMaxAjuste) {
                messageAlerteOuRecolte = `<span style="color:#c62828;">⚠️ <strong>Saison dépassée :</strong> La mise en terre s'effectue habituellement en <strong>${infoPlante.repiquage}</strong> (ajusté à votre climat).</span>`;
            } else {
                const dateCalcul = new Date(dateCourante.getFullYear(), infoPlante.moisMiseEnTerre, 15);
                dateCalcul.setDate(dateCalcul.getDate() + (infoPlante.joursMaturation || 60) + decalage);

                messageAlerteOuRecolte = `<span style="color:#2e7d32;"><strong>🌾 Récolte estimée (si planté en ${infoPlante.repiquage}) :</strong> ~${dateCalcul.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>`;
            }

            container.innerHTML += `
                <div class="item-card">
                    <h4>🌱 ${infoPlante.nom}</h4>
                    <p><strong>Période de semis :</strong> ${infoPlante.semis}</p>
                    <p><strong>Période de repiquage :</strong> ${infoPlante.repiquage}</p>
                    <p>${messageAlerteOuRecolte}</p>
                </div>
            `;
        }
    });
}

// =================================================================
// 6. MÉTÉO ET ALERTES SANITAIRES DU POTAGER
// =================================================================

async function chargerMeteoEtAlertes() {
    const statusDiv = document.getElementById("meteo-status");
    const cardsDiv = document.getElementById("meteo-cards");

    if (!statusDiv || !cardsDiv) return;

    statusDiv.innerHTML = "⏳ Analyse météo complète & calcul des risques du potager...";
    cardsDiv.innerHTML = "";

    let latitude = 48.8566; 
    let longitude = 2.3522;

    if ("geolocation" in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        } catch (err) {
            console.warn("Géolocalisation indisponible, position par défaut utilisée.", err);
        }
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,relative_humidity_2m_mean&forecast_days=3&timezone=auto`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        const data = await response.json();
        const daily = data.daily;
window.dernieresDonneesMeteoJour = daily;
        statusDiv.innerHTML = `📍 Zone localisée (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)})`;

        // Tendance moyenne sur les 3 jours, affichée en complément des cartes
        // quotidiennes (utile pour une vue d'ensemble, mais les alertes
        // restent calculées jour par jour : une gelée le jour 3 ne doit pas
        // être "diluée" par deux jours doux dans une moyenne).
        const moyenne = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
        const humiditeMoy = daily.relative_humidity_2m_mean ? Math.round(moyenne(daily.relative_humidity_2m_mean)) : null;
        const carteTendance = `
            <div class="item-card" style="border-left: 5px solid #1565c0; background:#f0f6ff;">
                <h4>📊 Tendance sur 3 jours</h4>
                <p>🌡️ Moy. min/max : ${moyenne(daily.temperature_2m_min).toFixed(1)}°C / ${moyenne(daily.temperature_2m_max).toFixed(1)}°C</p>
                <p>🌧️ Cumul pluie : ${daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)} mm ${humiditeMoy !== null ? `| 💦 Humidité moy. : ${humiditeMoy}%` : ""}</p>
            </div>`;

        cardsDiv.innerHTML = carteTendance + daily.time.map((dateStr, index) => {
            const tMax = daily.temperature_2m_max[index];
            const tMin = daily.temperature_2m_min[index];
            const pluie = daily.precipitation_sum[index];
            const vent = daily.windspeed_10m_max ? daily.windspeed_10m_max[index] : 0;
            const humidite = daily.relative_humidity_2m_mean ? daily.relative_humidity_2m_mean[index] : null;

            let consigneArrosage = "";
            if (pluie >= 8) {
                consigneArrosage = "💧 <strong>Arrosage inutile :</strong> Pluie suffisante pour combler les besoins du sol.";
            } else if (tMax >= 30) {
                consigneArrosage = "🚰 <strong>Arrosage intensif :</strong> Arrosez abondamment tôt le matin ou tard le soir. Maintenez le paillage humide.";
            } else if (tMax >= 22 && pluie < 2) {
                consigneArrosage = "🚰 <strong>Arrosage modéré :</strong> Maintenez une humidité constante au pied sans détremper les racines.";
            } else {
                consigneArrosage = "💧 <strong>Arrosage léger / réduit :</strong> Limitez l'apport pour éviter la stagnation d'eau au niveau des racines.";
            }

            let alertesEtTraitements = [];

            if (tMax >= 27 && pluie < 2) {
                alertesEtTraitements.push(
                    "🍅 <strong>Risque Cul-Noir (Nécrose apicale) :</strong> Stress hydrique bloquant la fixation du calcium.<br>" +
                    "👉 <em>Action :</em> Arrosez de façon très régulière (sans à-coups) et paillez le sol pour préserver une humidité constante."
                );
            }

            // Mildiou : déclenché par la pluie OU une hygrométrie élevée
            // (l'humidité de l'air favorise le champignon même sans pluie).
            if ((pluie > 4 || (humidite !== null && humidite >= 80)) && tMax >= 18 && tMax <= 26) {
                alertesEtTraitements.push(
                    "⚠️ <strong>Alerte Mildiou :</strong> Humidité" + (humidite !== null ? ` (${humidite}%)` : "") + " et chaleur modérée favorisent les champignons.<br>" +
                    "👉 <em>Action :</em> Pulvérisez du purin de prêle ou du bicarbonate. Ne mouillez jamais le feuillage."
                );
            }

            // Oïdium : temps chaud avec air relativement sec en journée
            // (l'humidité affine le déclenchement au lieu de se baser sur la pluie seule).
            if (tMax >= 22 && tMax <= 30 && pluie < 3 && (humidite === null || humidite <= 70)) {
                alertesEtTraitements.push(
                    "⚪ <strong>Risque Oïdium :</strong> Temps chaud et air sec en journée avec rosée ou variations de température nocturnes.<br>" +
                    "👉 <em>Action :</em> Pulvérisez du lait dilué (10%) ou du bicarbonate de soude. Supprimez les premières feuilles atteintes."
                );
            }

            if (tMax >= 25 && pluie < 1) {
                alertesEtTraitements.push(
                    "🪲 <strong>Prolifération de Ravageurs :</strong> Chaleur sèche propice aux pucerons et altises.<br>" +
                    "👉 <em>Action :</em> Pulvérisez une solution de savon noir dilué (5%) ou utilisez un extrait fermenté de grande ortie."
                );
            }

            // Limaces : pluie fraîche OU humidité ambiante élevée sans pluie
            if (pluie >= 5 || (humidite !== null && humidite >= 85)) {
                alertesEtTraitements.push(
                    "🐌 <strong>Alerte Limaces :</strong> L'humidité fait sortir les gastéropodes.<br>" +
                    "👉 <em>Action :</em> Protégez les jeunes pousses avec du marc de café, des coquilles d'œufs pilées ou du paillis."
                );
            }

            if (tMax >= 32) {
                alertesEtTraitements.push(
                    "🔥 <strong>Alerte Canicule :</strong> Risque de brûlure des feuillages et arrêt de croissance.<br>" +
                    "👉 <em>Action :</em> Ombragez vos carrés avec un voile ou une ombrière. Ne coupez aucun feuillage."
                );
            }

            if (tMin <= 3) {
                alertesEtTraitements.push(
                    "❄️ <strong>Risque de Gelée :</strong> Danger pour les jeunes plants sensibles.<br>" +
                    "👉 <em>Action :</em> Couvrez vos carrés d'un voile de forçage ou de cloches de protection avant la nuit."
                );
            }

            if (vent >= 40) {
                alertesEtTraitements.push(
                    "💨 <strong>Vent Fort (max " + vent + " km/h) :</strong> Risque de casse des tiges et déracinement.<br>" +
                    "👉 <em>Action :</em> Vérifiez le tuteurage des tomates et légumineuses hautes."
                );
            }

            if (alertesEtTraitements.length === 0) {
                alertesEtTraitements.push(
                    "🟢 <strong>Conditions Optimales :</strong> Climat favorable pour la pousse.<br>" +
                    "👉 <em>Action :</em> Entretien classique. Un apport de purin d'ortie peut stimuler les défenses des plants."
                );
            }

            let couleurBordure = '#2e7d32';
            if (tMin <= 3 || tMax >= 32 || (pluie > 4 && tMax >= 18 && tMax <= 26)) {
                couleurBordure = '#c62828';
            } else if (alertesEtTraitements.length > 1) {
                couleurBordure = '#ef6c00';
            }

            return `
                <div class="item-card" style="border-left: 5px solid ${couleurBordure};">
                    <h4>📅 ${new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</h4>
                    <p>🌡️ <strong>Températures :</strong> ${tMin}°C à ${tMax}°C</p>
                    <p>🌧️ <strong>Pluie :</strong> ${pluie} mm ${humidite !== null ? `| 💦 <strong>Humidité :</strong> ${humidite}%` : ""} ${vent ? '| 💨 <strong>Vent :</strong> ' + vent + ' km/h' : ''}</p>
                    <hr style="border:0; border-top:1px solid #e0e0e0; margin:8px 0;">
                    <p style="font-size:12px; margin-bottom:8px;">${consigneArrosage}</p>
                    <div style="font-size:12px; color:#333; display:flex; flex-direction:column; gap:8px;">
                        ${alertesEtTraitements.join('')}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Erreur météo :", error);
        statusDiv.innerHTML = `<span style="color:#c62828;">❌ Impossible d'accéder aux prévisions météo.</span>`;
    }
}
function afficherAlertesPlante(planteId) {
    const plante = plantes.find(p => p.id === planteId);
    const daily = window.dernieresDonneesMeteoJour;
    if (!plante || !daily) { alert("Chargez d'abord la météo (section 3)."); return; }
    const tMax = daily.temperature_2m_max[0], pluie = daily.precipitation_sum[0];
    const humidite = daily.relative_humidity_2m_mean ? daily.relative_humidity_2m_mean[0] : null;
    let conseils = [];
    if (plante.categorie === CATEGORIES.LEGUME_FEUILLE && (pluie >= 5 || (humidite !== null && humidite >= 85)))
        conseils.push("🐌 Feuillage tendre exposé aux limaces : paillis sec conseillé.");
    if (plante.categorie === CATEGORIES.AROMATIQUE && pluie < 2 && tMax < 25)
        conseils.push("🌿 Arrosage minimal suffisant, évitez l'excès.");
    if ((plante.id === "tomate" || plante.id === "poivron") && tMax >= 27 && pluie < 2)
        conseils.push("🍅 Stress hydrique : risque de cul noir, arrosage régulier indispensable.");
    if ((plante.id === "courgettes" || plante.id === "concombre") && tMax >= 27 && pluie < 2)
        conseils.push("🥒 Stress hydrique : baisse de production et fruits amers, arrosage régulier indispensable.");
    if (conseils.length === 0) conseils.push("🟢 Rien de spécifique aujourd'hui.");
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `<div class="modal-box"><h3>⚠️ ${plante.nom}</h3><p>${conseils.join("</p><p>")}</p>
        <button onclick="this.closest('.modal-overlay').remove()">Fermer</button></div>`;
    document.body.appendChild(overlay);
}
