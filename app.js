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

// Catalogue des plantes
const catalogueInitial = [
    { 
        id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 75, distanceMin: 45,
        descriptionRole: "Bénéficie de la présence du basilic (goût/croissance) et de l'œillet d'Inde (pucerons/nématodes)."
    },
    { 
        id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai - Juin", joursMaturation: 60, distanceMin: 60,
        descriptionRole: "A besoin des abeilles attirées par la bourrache pour féconder ses fleurs."
    },
    { 
        id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", 
        semis: "Mars - Septembre", repiquage: "Avril - Octobre", joursMaturation: 45, distanceMin: 25,
        descriptionRole: "Profite de l'ombre portée des grands légumes."
    },
    { 
        id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", 
        semis: "Mars - Juillet", repiquage: "Semis direct", joursMaturation: 80, distanceMin: 10,
        descriptionRole: "Sensible à la mouche de la carotte."
    },
    { 
        id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 30, distanceMin: 20,
        descriptionRole: "Stimule la croissance de la tomate et repousse le mildiou."
    },
    { 
        id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 50, distanceMin: 15,
        descriptionRole: "🛡️ Répulsi nématodes du sol et pucerons."
    },
    { 
        id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Mars - Mai", repiquage: "Semis direct", joursMaturation: 45, distanceMin: 30,
        descriptionRole: "🐝 Attire massivement les pollinisateurs."
    },
    { 
        id: "capucine", nom: "Capucine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", 
        semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 40, distanceMin: 20,
        descriptionRole: "🌸 Piège à pucerons."
    }
];

// Matrice d'associations croisées (Croissance, Nuisibles, Pollinisation)
const MATRICE_ASSOCIATIONS = {
    tomate: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Anti-nuisibles : L'Œillet d'Inde protège la tomate des nématodes et pucerons." },
        basilic: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🚀 Croissance & Goût : Le basilic stimule le développement de la tomate et éloigne le mildiou." },
        courgettes: { type: "INCOMPATIBILITE", distance: "40-60 cm", conseil: "⚠️ Compétition : Risque d'étouffement entre deux grands feuillages." }
    },
    courgettes: {
        bourrache: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 Pollinisation : La Bourrache attire les abeilles indispensables pour féconder les courgettes." },
        capucine: { type: "PROTECTION_SANITAIRE", distance: "20-30 cm", conseil: "🌸 Fleur-piège : Attire les pucerons à elle pour préserver la courgette." }
    },
    carotte: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ Masque odorant : Repousse la mouche de la carotte." }
    }
};

let carres = [];
let plantes = [...catalogueInitial];
window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0 };

// =================================================================
// 2. INITIALISATION ET SAUVEGARDE
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres_v8", JSON.stringify(carres));
    localStorage.setItem("potager_plantes_v8", JSON.stringify(plantes));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres_v8");
    const plantesStockees = localStorage.getItem("potager_plantes_v8");

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

    document.getElementById("form-carre")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const L = document.getElementById("longueur").value;
        const l = document.getElementById("largeur").value;
        const h = document.getElementById("hauteur").value;
        const expo = document.getElementById("exposition").value;

        carres.push(new CarrePotager(carres.length + 1, L, l, h, expo));
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
        e.target.reset();
    });

    document.getElementById("filter-categorie")?.addEventListener("change", renderPlantes);
});

function initSelects() {
    const selectFilter = document.getElementById("filter-categorie");
    if (!selectFilter) return;
    selectFilter.innerHTML = `<option value="TOUS">-- Toutes les catégories --</option>`;
    Object.values(CATEGORIES).forEach(cat => {
        selectFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

// =================================================================
// 3. CALCULATEUR DE DISTANCE (GRILLE 3x3)
// =================================================================

function calculerDistanceEntreCases(index1, index2, tailleCaseCm = 30) {
    const x1 = index1 % 3, y1 = Math.floor(index1 / 3);
    const x2 = index2 % 3, y2 = Math.floor(index2 / 3);
    const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return Math.round(dist * tailleCaseCm);
}

// =================================================================
// 4. AFFICHAGE DES CARRÉS
// =================================================================

function renderCarres() {
    const container = document.getElementById("liste-carres");
    if (!container) return;
    container.innerHTML = "";

    carres.forEach(c => {
        let htmlGrille = `<div class="grille-potager">`;
        for (let i = 0; i < 9; i++) {
            const item = c.grille[i];
            if (item) {
                htmlGrille += `
                    <div class="case-grille plante-occupee">
                        🌿 <strong>${getNomPlante(item.idPlante)}</strong>
                        <button class="btn-suppr-case" onclick="libererCase(${c.id}, ${i})">❌</button>
                    </div>`;
            } else {
                htmlGrille += `<div class="case-grille"><small>Libre (${i+1})</small></div>`;
            }
        }
        htmlGrille += `</div>`;

        container.innerHTML += `
            <div class="item-card">
                <h4>Carré #${c.id} (${c.exposition})</h4>
                ${htmlGrille}
            </div>`;
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
// 5. CATALOGUE & ASSISTANT AVEC RECOMMANDATION D'ASSOCIATIONS
// =================================================================

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
                <p><small>${p.descriptionRole}</small></p>
                <button class="btn-primary" onclick="ouvrirAssistantPlantation('${p.id}')">⚡ Planter & Associer</button>
            </div>`;
    });
}

function ouvrirAssistantPlantation(planteId) {
    const plante = plantes.find(p => p.id === planteId);
    if (!plante || carres.length === 0) {
        alert("Créez d'abord un carré potager dans la Section 1.");
        return;
    }

    let options = "";
    carres.forEach(c => {
        c.grille.forEach((val, idx) => {
            if (val === null) options += `<option value="${c.id}-${idx}">Carré #${c.id} ➔ Case ${idx + 1}</option>`;
        });
    });

    if (!options) {
        alert("Tous vos carrés sont pleins.");
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "modal-assistant";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000;";

    overlay.innerHTML = `
        <div style="background:white; padding:20px; border-radius:8px; max-width:500px; width:90%;">
            <h3>📏 Assistant d'Association : ${plante.nom}</h3>
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

// Affiche les effets (stimuler croissance, répulser nuisibles, polliniser)
function analyserCompatibilite(planteId) {
    const select = document.getElementById("select-emplacement");
    const zone = document.getElementById("zone-analyse-association");
    if (!select || !zone) return;

    const [carreId, caseIndex] = select.value.split("-").map(Number);
    const carre = carres.find(c => c.id === carreId);
    let conseils = [];

    carre.grille.forEach((voisin, idxVoisin) => {
        if (voisin && idxVoisin !== caseIndex) {
            const nomVoisin = getNomPlante(voisin.idPlante);
            const dist = calculerDistanceEntreCases(caseIndex, idxVoisin);
            
            // Recherche synergie
            const regle = MATRICE_ASSOCIATIONS[planteId]?.[voisin.idPlante] || MATRICE_ASSOCIATIONS[voisin.idPlante]?.[planteId];

            if (regle) {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong><br>${regle.conseil} (Distance recommandée: ${regle.distance})`);
            } else {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong> Association neutre.`);
            }
        }
    });

    zone.innerHTML = conseils.length > 0 ? conseils.join("<hr style='margin:5px 0;'>") : "✨ Aucune plante voisine. Emplacement libre.";
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

// =================================================================
// 6. CALENDRIER DE RÉCOLTE OPTIMISÉ (SANS RÉPÉTITION DES MÊMES PLANTES)
// =================================================================

function renderCalendrier() {
    const container = document.getElementById("calendrier-container");
    if (!container) return;
    container.innerHTML = "";

    // 1. Récupérer uniquement les identifiants de plantes UNIQUE présentes dans les carrés
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

    // 2. Affichage unique des informations de calendrier par type de plante
    idsPlantesEnTerre.forEach(idPlante => {
        const infoPlante = plantes.find(p => p.id === idPlante);
        if (infoPlante) {
            const dateRecolteEstimee = new Date();
            dateRecolteEstimee.setDate(dateRecolteEstimee.getDate() + (infoPlante.joursMaturation || 60) + decalage);

            container.innerHTML += `
                <div class="item-card">
                    <h4>🌱 ${infoPlante.nom}</h4>
                    <p><strong>Période de semis :</strong> ${infoPlante.semis}</p>
                    <p><strong>Période de repiquage :</strong> ${infoPlante.repiquage}</p>
                    <p style="color:#2e7d32;"><strong>🌾 Récolte estimée (si plantée aujourd'hui) :</strong> ~${dateRecolteEstimee.toLocaleDateString('fr-FR')}</p>
                </div>
            `;
        }
    });
}
