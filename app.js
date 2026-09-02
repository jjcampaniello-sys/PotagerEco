// =================================================================
// 1. CLASSES ET STRUCTURATION DES DONNÉES
// =================================================================

class CarrePotager {
    constructor(id, longueur, largeur, hauteur, exposition) {
        this.id = id;
        this.longueur = Number(longueur);
        this.largeur = Number(largeur);
        this.hauteur = Number(hauteur);
        this.exposition = exposition;
        // Grille de 9 cases (3x3). Chaque case contient null ou { idPlante, datePlantation }
        this.grille = Array(9).fill(null);
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

    getPlantesUnique() {
        const occupes = this.grille.filter(c => c !== null);
        return [...new Set(occupes.map(c => c.idPlante))];
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

const COMPATIBILITE_EXPOSITION = {
    "SUD": ["SUD", "MI_OMBRE"],
    "SUD_OUEST": ["SUD", "MI_OMBRE"],
    "SUD_EST": ["SUD", "MI_OMBRE"],
    "OUEST": ["SUD", "MI_OMBRE"],
    "EST": ["MI_OMBRE", "OMBRE"],
    "NORD": ["OMBRE", "MI_OMBRE"]
};

const REGLES_DISTANCES = {
    PROTECTION_SANITAIRE: { icone: "🛡️", libelle: "Protection contre parasites/nuisibles" },
    POLLINISATION: { icone: "🐝", libelle: "Attraction des pollinisateurs" },
    COMPAGNONNAGE_DIRECT: { icone: "🤝", libelle: "Synergie racinaire / Ombrage" },
    INCOMPATIBILITE: { icone: "⚠️", libelle: "Incompatibilité / Éloignement recommandé" }
};

// Catalogue de base des plantes avec fleurs compagnes et descriptions
const catalogueInitial = [
    { 
        id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 75, distanceMin: 45,
        fleursProtections: ["oeillet_inde", "capucine"],
        descriptionRole: "Propritaires d'anti-nématodes et répulsifs pucerons au pied."
    },
    { 
        id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai - Juin", joursMaturation: 60, distanceMin: 60,
        fleursProtections: ["bourrache", "souci"],
        descriptionRole: "Fort besoin en abeilles pour polliniser les fleurs femelles."
    },
    { 
        id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Avril - Octobre", joursMaturation: 45, distanceMin: 25,
        fleursProtections: [],
        descriptionRole: "Apprécie l'ombre portée des grands légumes en été."
    },
    { 
        id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Mars - Juillet", repiquage: "Semis direct", joursMaturation: 80, distanceMin: 10,
        fleursProtections: ["oeillet_inde"],
        descriptionRole: "Sensible à la mouche de la carotte."
    },
    { 
        id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 30, distanceMin: 20,
        fleursProtections: ["oeillet_inde"],
        descriptionRole: "Aromatique protectrice contre le mildiou et le moucheron."
    },
    { 
        id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 50, distanceMin: 15,
        fleursProtections: [],
        descriptionRole: "🛡️ Fleur protectrice : Répulse nématodes du sol et pucerons."
    },
    { 
        id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Mai", repiquage: "Semis direct", joursMaturation: 45, distanceMin: 30,
        fleursProtections: [],
        descriptionRole: "🐝 Fleur pollinisatrice : Attire massivement les abeilles."
    },
    { 
        id: "capucine", nom: "Capucine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 40, distanceMin: 20,
        fleursProtections: [],
        descriptionRole: "🌸 Fleur piège : Concentre les pucerons pour épargner le potager."
    }
];

// Matrice d'associations avec règles de distance préconisées
const MATRICE_ASSOCIATIONS = {
    tomate: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "L'Œillet d'Inde libère des molécules anti-nématodes près des racines de la tomate." },
        basilic: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "Le Basilic profite de l'ombrage léger de la Tomate et stimule son goût." },
        courgettes: { type: "INCOMPATIBILITE", distance: "40-60 cm (Éloigner)", conseil: "Feuillages trop encombrants : risque élevé de compétition." }
    },
    courgettes: {
        bourrache: { type: "POLLINISATION", distance: "25-30 cm", conseil: "La Bourrache attire les abeilles indispensables à la nouaison des courgettes." },
        capucine: { type: "PROTECTION_SANITAIRE", distance: "20-30 cm", conseil: "La Capucine attire les pucerons à elle pour préserver les feuilles de courgette." }
    },
    carotte: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "L'odeur de la fleur masque la carotte face à la mouche de la carotte." }
    }
};

let carres = [];
let plantes = [...catalogueInitial];
window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0 };

// =================================================================
// 2. STOCKAGE LOCAL & INITIALISATION
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres_v7", JSON.stringify(carres));
    localStorage.setItem("potager_plantes_v7", JSON.stringify(plantes));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres_v7");
    const plantesStockees = localStorage.getItem("potager_plantes_v7");

    if (plantesStockees) plantes = JSON.parse(plantesStockees);

    if (carresStockes) {
        const donneesBrutes = JSON.parse(carresStockes);
        carres = donneesBrutes.map(c => {
            const carre = new CarrePotager(c.id, c.longueur, c.largeur, c.hauteur, c.exposition);
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

    document.getElementById("form-carre").addEventListener("submit", (e) => {
        e.preventDefault();
        const L = document.getElementById("longueur").value;
        const l = document.getElementById("largeur").value;
        const h = document.getElementById("hauteur").value;
        const expo = document.getElementById("exposition").value;

        const nouveauCarre = new CarrePotager(carres.length + 1, L, l, h, expo);
        carres.push(nouveauCarre);

        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
        e.target.reset();
    });

    document.getElementById("form-plante").addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("p-nom").value.trim();
        const categorie = document.getElementById("p-categorie").value;
        const besoinSoleil = document.getElementById("p-soleil").value;

        if (!nom) return;
        const id = nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');

        plantes.push({
            id, nom, categorie, besoinSoleil,
            semis: "Printemps", repiquage: "Pleine terre",
            joursMaturation: 60, distanceMin: 25,
            fleursProtections: [], descriptionRole: "Plante personnalisée."
        });

        sauvegarderDonnees();
        document.getElementById("filter-categorie").value = categorie;
        renderPlantes();
        e.target.reset();
    });

    document.getElementById("filter-categorie").addEventListener("change", renderPlantes);
});

function initSelects() {
    const selectCat = document.getElementById("p-categorie");
    const selectFilter = document.getElementById("filter-categorie");

    selectCat.innerHTML = "";
    selectFilter.innerHTML = `<option value="TOUS">-- Toutes les catégories --</option>`;

    Object.values(CATEGORIES).forEach(cat => {
        selectCat.innerHTML += `<option value="${cat}">${cat}</option>`;
        selectFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

// =================================================================
// 3. FONCTIONS MATHÉMATIQUES & GEOMÉTRIE DE LA GRILLE
// =================================================================

// Calcule la distance physique réelle (en cm) entre 2 cases d'une grille 3x3 de 90x90cm
function calculerDistanceEntreCases(indexCase1, indexCase2, tailleCaseCm = 30) {
    const x1 = indexCase1 % 3;
    const y1 = Math.floor(indexCase1 / 3);
    const x2 = indexCase2 % 3;
    const y2 = Math.floor(indexCase2 / 3);

    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);

    const distanceEuclidienne = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return Math.round(distanceEuclidienne * tailleCaseCm);
}

// =================================================================
// 4. AFFICHAGE ET GESTION DES CARRÉS POTAGERS
// =================================================================

function renderCarres() {
    const container = document.getElementById("liste-carres");
    container.innerHTML = "";

    carres.forEach(c => {
        const volume = c.getVolumeLitres();
        let htmlGrille = `<div class="grille-potager">`;
        
        for (let index = 0; index < 9; index++) {
            const contenuCase = c.grille[index];
            if (contenuCase) {
                const nomP = getNomPlante(contenuCase.idPlante);
                htmlGrille += `
                    <div class="case-grille plante-occupee">
                        🌿 <strong>${nomP}</strong>
                        <small style="font-size:9px;">${contenuCase.datePlantation}</small>
                        <button class="btn-suppr-case" onclick="libererCase(${c.id}, ${index})" title="Retirer">❌</button>
                    </div>
                `;
            } else {
                htmlGrille += `
                    <div class="case-grille">
                        <span style="color:#aaa;">Emp. ${index + 1}</span>
                        <small style="color:#888;">Libre</small>
                    </div>
                `;
            }
        }
        htmlGrille += `</div>`;

        container.innerHTML += `
            <div class="item-card" id="carre-card-${c.id}">
                <h4>Carré #${c.id} (${c.exposition})</h4>
                <p><strong>Dimensions :</strong> ${c.longueur}x${c.largeur}x${c.hauteur} cm (${volume.toFixed(0)}L)</p>
                <strong>Grille des emplacements :</strong>
                ${htmlGrille}
            </div>
        `;
    });
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

// =================================================================
// 5. CATALOGUE ET ASSISTANT DE PLANTATION INTERACTIF
// =================================================================

function renderPlantes() {
    const container = document.getElementById("catalogue-plantes");
    const filter = document.getElementById("filter-categorie").value;
    container.innerHTML = "";

    let plantesFiltrees = (filter === "TOUS" || !filter)
        ? [...plantes]
        : plantes.filter(p => p.categorie === filter);

    plantesFiltrees.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));

    plantesFiltrees.forEach(p => {
        container.innerHTML += `
            <div class="item-card" style="border: 2px solid #e0e0e0;">
                <h4>🌱 ${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Espacement :</strong> ${p.distanceMin || 25} cm</p>
                <button class="btn-primary" onclick="ouvrirAssistantPlantation('${p.id}')" style="margin-top: 8px; width: 100%;">
                    ⚡ Choisir et Placer
                </button>
            </div>
        `;
    });
}

function ouvrirAssistantPlantation(planteId) {
    const plante = plantes.find(p => p.id === planteId);
    if (!plante) return;

    if (carres.length === 0) {
        alert("⚠️ Veuillez créer un carré potager dans la Section 1 avant de placer une plante.");
        return;
    }

    let optionsCarres = "";
    carres.forEach(c => {
        const casesLibres = c.grille.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
        
        if (casesLibres.length > 0) {
            optionsCarres += `<optgroup label="Carré #${c.id} (${c.exposition} - ${casesLibres.length} libre(s))">`;
            casesLibres.forEach(idx => {
                optionsCarres += `<option value="${c.id}-${idx}">Carré #${c.id} ➔ Emplacement ${idx + 1}</option>`;
            });
            optionsCarres += `</optgroup>`;
        }
    });

    if (!optionsCarres) {
        alert("⚠️ Vos carrés potagers sont tous complets (9/9 emplacements occupés).");
        return;
    }

    // Modal / Fenêtre surgissante
    const overlay = document.createElement("div");
    overlay.id = "modal-assistant";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000; padding:15px;";

    overlay.innerHTML = `
        <div style="background: white; border-radius: 8px; padding: 20px; max-width: 520px; width: 100%; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
            <h3 style="color:#2e7d32; margin-top:0;">🌱 Assistant & Guidage : ${plante.nom}</h3>
            
            <label style="font-weight:bold; display:block; margin-bottom:5px;">Sélectionnez l'emplacement cible :</label>
            <select id="select-emplacement-guide" style="width:100%; padding:8px; margin-bottom:12px; border-radius:4px; border:1px solid #ccc;" onchange="mettreAJourConseilDistance('${plante.id}')">
                ${optionsCarres}
            </select>

            <!-- Zone de guidage dynamique des distances et associations -->
            <div id="zone-conseil-distance" style="padding:12px; background:#f9f9f9; border-radius:6px; border:1px solid #ddd; margin-bottom:15px; font-size:13px;">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="fermerAssistant()" style="padding:8px 15px; background:#e0e0e0; border:none; border-radius:4px; cursor:pointer;">Annuler</button>
                <button onclick="validerPlantationDepuisAssistant('${plante.id}')" style="padding:8px 15px; background:#2e7d32; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Confirmer la plantation</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    mettreAJourConseilDistance(plante.id);
}

function mettreAJourConseilDistance(planteId) {
    const select = document.getElementById("select-emplacement-guide");
    const containerConseil = document.getElementById("zone-conseil-distance");
    if (!select || !containerConseil) return;

    const [carreId, indexCaseCible] = select.value.split("-").map(Number);
    const carre = carres.find(c => c.id === carreId);
    if (!carre) return;

    let retoursDistance = [];

    carre.grille.forEach((contenuCase, indexVoisin) => {
        if (contenuCase && indexVoisin !== indexCaseCible) {
            const idVoisin = contenuCase.idPlante;
            const nomVoisin = getNomPlante(idVoisin);
            
            // Calcul de la distance réelle sur la grille
            const distReelle = calculerDistanceEntreCases(indexCaseCible, indexVoisin);

            // Recherche de la règle d'association dans la matrice
            const regleDirecte = MATRICE_ASSOCIATIONS[planteId]?.[idVoisin];
            const regleInverse = MATRICE_ASSOCIATIONS[idVoisin]?.[planteId];
            const regle = regleDirecte || regleInverse;

            if (regle) {
                const regleInfo = REGLES_DISTANCES[regle.type] || { icone: "💡" };
                retoursDistance.push(`
                    <div style="margin-bottom:8px;">
                        ${regleInfo.icone} <strong>Voisin (${nomVoisin}) à ${distReelle} cm :</strong><br>
                        <small>• Distance préconisée : <strong>${regle.distance}</strong></small><br>
                        <small style="color:#2e7d32;">• ${regle.conseil}</small>
                    </div>
                `);
            } else {
                retoursDistance.push(`
                    <div style="margin-bottom:5px;">
                        📍 <strong>Voisin (${nomVoisin}) à ${distReelle} cm :</strong>
                        <small style="color:#555;">Association neutre. Distance observée correcte.</small>
                    </div>
                `);
            }
        }
    });

    if (retoursDistance.length === 0) {
        containerConseil.innerHTML = "✨ <strong>Emplacement Isolé :</strong> Aucun voisin direct dans ce carré. Emplacement idéal pour débuter la plantation.";
    } else {
        containerConseil.innerHTML = retoursDistance.join("<hr style='border:0; border-top:1px dashed #ccc; margin:6px 0;'>");
    }
}

function fermerAssistant() {
    const modal = document.getElementById("modal-assistant");
    if (modal) modal.remove();
}

function validerPlantationDepuisAssistant(planteId) {
    const select = document.getElementById("select-emplacement-guide");
    if (!select) return;

    const [carreId, indexCase] = select.value.split("-").map(Number);
    const carre = carres.find(c => c.id === carreId);

    if (carre) {
        carre.placerPlanteCase(indexCase, planteId);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
        fermerAssistant();
    }
}

function getNomPlante(id) {
    const p = plantes.find(item => item.id === id);
    return p ? p.nom : id;
}

// =================================================================
// 6. CALENDRIER DE RÉCOLTE ET CLIMAT DYNAMIQUE
// =================================================================

function obtenirZoneClimatique(latitude) {
    if (latitude < 44.0) {
        return { nom: "Méditerranéen / Sud", decalageJours: -21 };
    } else if (latitude >= 44.0 && latitude < 48.5) {
        return { nom: "Tempéré (ex: Région Parisienne / Ouest)", decalageJours: 0 };
    } else {
        return { nom: "Nordique / Continental (ex: Pays-Bas / Nord)", decalageJours: 14 };
    }
}

function renderCalendrier() {
    const container = document.getElementById("calendrier-container");
    container.innerHTML = "";

    let plantesEnTerre = [];
    carres.forEach(c => {
        c.grille.forEach((item, index) => {
            if (item) {
                const infoPlante = plantes.find(p => p.id === item.idPlante);
                if (infoPlante) {
                    plantesEnTerre.push({
                        carreId: c.id,
                        caseIndex: index + 1,
                        nom: infoPlante.nom,
                        datePlantation: item.datePlantation,
                        semis: infoPlante.semis,
                        joursMaturation: infoPlante.joursMaturation || 60,
                        distanceMin: infoPlante.distanceMin || 25
                    });
                }
            }
        });
    });

    if (plantesEnTerre.length === 0) {
        container.innerHTML = "<p style='color:#666;'>Aucune plante actuellement installée dans le potager.</p>";
        return;
    }

    const decalage = window.zoneClimatiqueActuelle.decalageJours;

    plantesEnTerre.forEach(p => {
        const dateMiseEnTerre = new Date(p.datePlantation);
        const dateRecolteEstimee = new Date(dateMiseEnTerre);
        dateRecolteEstimee.setDate(dateRecolteEstimee.getDate() + p.joursMaturation + decalage);

        container.innerHTML += `
            <div class="item-card">
                <h4>${p.nom} (Carré #${p.carreId} - Case ${p.caseIndex})</h4>
                <p><strong>Climat local :</strong> ${window.zoneClimatiqueActuelle.nom}</p>
                <p><strong>Semis conseillé :</strong> ${p.semis}</p>
                <p><strong>Plantation :</strong> ${p.datePlantation}</p>
                <p style="color:green;"><strong>🌾 Récolte estimée :</strong> ~${dateRecolteEstimee.toLocaleDateString('fr-FR')}</p>
            </div>
        `;
    });
}

// =================================================================
// 7. INTÉGRATION MÉTÉO EN TEMPS RÉEL (OPEN-METEO)
// =================================================================

async function chargerMeteoEtAlertes() {
    const statusDiv = document.getElementById("meteo-status");
    const container = document.getElementById("meteo-cards");

    statusDiv.innerHTML = "<p>🔄 Géolocalisation et récupération météo...</p>";

    if (!navigator.geolocation) {
        statusDiv.innerHTML = "<p style='color:red;'>La géolocalisation n'est pas supportée par votre navigateur.</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        window.zoneClimatiqueActuelle = obtenirZoneClimatique(lat);
        renderCalendrier();

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            const temp = data.current.temperature_2m;
            const humidite = data.current.relative_humidity_2m;
            const pluie = data.current.precipitation;

            statusDiv.innerHTML = `<p style='color:green;'>📍 Météo synchronisée pour votre position (${window.zoneClimatiqueActuelle.nom})</p>`;

            container.innerHTML = `
                <div class="item-card">
                    <h4>🌡️ Météo Locale</h4>
                    <p><strong>Température :</strong> ${temp} °C</p>
                    <p><strong>Humidité :</strong> ${humidite} %</p>
                    <p><strong>Précipitations :</strong> ${pluie} mm</p>
                </div>
                <div class="item-card">
                    <h4>💧 Conseil Arrosage</h4>
                    ${pluie > 5 ? "🌧️ Pluie suffisante." : "🌱 Arrosage recommandé si le sol est sec."}
                </div>
                <div class="item-card">
                    <h4>🛡️ Santé Plante</h4>
                    ${temp >= 17 && temp <= 25 && humidite >= 80 ? "🚨 <strong>Alerte Mildiou !</strong> Traitez préventivement à la prêle." : "✅ Aucun risque sanitaire fort détecté."}
                </div>
            `;
        } catch (error) {
            statusDiv.innerHTML = "<p style='color:red;'>Erreur de connexion météo.</p>";
        }
    });
}
