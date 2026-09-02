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
    }
];

const MATRICE_ASSOCIATIONS = {
    tomate: {
        oeillet_inde: { type: "PROTECTION_SANITAIRE", distance: "15-20 cm", conseil: "🛡️ L'Œillet d'Inde repousse les nématodes et pucerons." },
        basilic: { type: "COMPAGNONNAGE_DIRECT", distance: "20-25 cm", conseil: "🚀 Le basilic stimule la pousse de la tomate et améliore sa saveur." },
        haricot_vert: { type: "COMPAGNONNAGE_DIRECT", distance: "25-30 cm", conseil: "🌿 Le haricot fournit de l'azote assimilable au pied de la tomate." }
    },
    courgettes: {
        bourrache: { type: "POLLINISATION", distance: "25-30 cm", conseil: "🐝 La Bourrache attire les abeilles indispensables à la formation des courgettes." }
    }
};

let carres = [];
let plantes = [...catalogueInitial];
window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0 };

// =================================================================
// 2. STOCKAGE ET INITIALISATION
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres_v10", JSON.stringify(carres));
    localStorage.setItem("potager_plantes_v10", JSON.stringify(plantes));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres_v10");
    const plantesStockees = localStorage.getItem("potager_plantes_v10");

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
        renderPlantes();
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

function calculerDistanceEntreCases(index1, index2, tailleCaseCm = 30) {
    const x1 = index1 % 3, y1 = Math.floor(index1 / 3);
    const x2 = index2 % 3, y2 = Math.floor(index2 / 3);
    const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return Math.round(dist * tailleCaseCm);
}

// =================================================================
// 3. AFFICHAGE ET SUPPRESSION DES CARRÉS
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
            <div class="item-card" style="position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>Carré #${c.id} (${c.exposition})</h4>
                    <button onclick="supprimerCarreComplet(${c.id})" style="background:#ffebee; color:#c62828; border:1px solid #ef9a9a; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;">
                        🗑️ Supprimer le carré
                    </button>
                </div>
                ${htmlGrille}
            </div>`;
    });
}

function supprimerCarreComplet(carreId) {
    if (confirm(`Voulez-vous vraiment supprimer le carré potager #${carreId} ?`)) {
        carres = carres.filter(c => c.id !== carreId);
        // Réindexation simple des IDs
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
            
            const regle = MATRICE_ASSOCIATIONS[planteId]?.[voisin.idPlante] || MATRICE_ASSOCIATIONS[voisin.idPlante]?.[planteId];

            if (regle) {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong><br>${regle.conseil} (Distance idéale: ${regle.distance})`);
            } else {
                conseils.push(`<strong>${nomVoisin} (${dist} cm) :</strong> Association neutre.`);
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
    const moisCourant = dateCourante.getMonth(); // 0 = Janvier, 8 = Septembre

    idsPlantesEnTerre.forEach(idPlante => {
        const infoPlante = plantes.find(p => p.id === idPlante);
        if (infoPlante) {
            let messageAlerteOuRecolte = "";

            // Contrôle si la période actuelle est hors saison
            if (moisCourant < infoPlante.moisMiseEnTerre || moisCourant > infoPlante.moisMax) {
                messageAlerteOuRecolte = `<span style="color:#c62828;">⚠️ <strong>Saison dépassée :</strong> La mise en terre s'effectue habituellement en <strong>${infoPlante.repiquage}</strong>.</span>`;
            } else {
                // Calcul basé sur la période recommandée de plantation au printemps
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
