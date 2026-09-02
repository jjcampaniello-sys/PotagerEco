// =================================================================
// 1. CLASSES ET DONNÉES DU POTAGER
// =================================================================

class CarrePotager {
    constructor(id, longueur, largeur, hauteur, exposition) {
        this.id = id;
        this.longueur = Number(longueur);
        this.largeur = Number(largeur);
        this.hauteur = Number(hauteur);
        this.exposition = exposition;
        this.plantes = []; // [{ idPlante, datePlantation }]
    }

    getSurface() { return (this.longueur * this.largeur) / 10000; }
    getVolumeLitres() { return (this.longueur * this.largeur * this.hauteur) / 1000; }

    ajouterPlante(idPlante) {
        if (!this.plantes.some(p => p.idPlante === idPlante)) {
            this.plantes.push({
                idPlante: idPlante,
                datePlantation: new Date().toISOString().split('T')[0]
            });
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

const COMPATIBILITE_EXPOSITION = {
    "SUD": ["SUD", "MI_OMBRE"],
    "SUD_OUEST": ["SUD", "MI_OMBRE"],
    "SUD_EST": ["SUD", "MI_OMBRE"],
    "OUEST": ["SUD", "MI_OMBRE"],
    "EST": ["MI_OMBRE", "OMBRE"],
    "NORD": ["OMBRE", "MI_OMBRE"]
};

// Détermine la zone climatique selon la latitude
function obtenirZoneClimatique(latitude) {
    if (latitude < 44.0) {
        return { nom: "Méditerranéen / Sud", decalageJours: -21 }; // 3 semaines plus tôt
    } else if (latitude >= 44.0 && latitude < 48.5) {
        return { nom: "Tempéré (ex: Région Parisienne, Ouest)", decalageJours: 0 }; // Référence
    } else {
        return { nom: "Nordique / Continental (ex: Pays-Bas, Nord)", decalageJours: 14 }; // 2 semaines plus tard
    }
}

// Catalogue enrichi avec données phénologiques (semis, repiquage, jours de croissance)
const catalogueInitial = [
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 75 },
    { id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Avril - Mai", repiquage: "Mai - Juin", joursMaturation: 60 },
    { id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Février - Mars", repiquage: "Mai", joursMaturation: 85 },
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", semis: "Mars - Septembre", repiquage: "Avril - Octobre", joursMaturation: 45 },
    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", semis: "Mars - Juillet", repiquage: "Semis direct", joursMaturation: 80 },
    { id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE", semis: "Mars - Septembre", repiquage: "Semis direct", joursMaturation: 25 },
    { id: "haricot", nom: "Haricot vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD", semis: "Mai - Juillet", repiquage: "Semis direct", joursMaturation: 60 },
    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 30 },
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 50 }
];

const MATRICE_ASSOCIATIONS = {
    tomate: { amis: ["basilic", "oeillet_inde", "carotte", "laitue"], ennemis: ["courgettes"] },
    carotte: { amis: ["radis", "laitue", "tomate"], ennemis: [] },
    haricot: { amis: ["courgettes", "radis", "basilic"], ennemis: [] },
    basilic: { amis: ["tomate", "poivron", "oeillet_inde"], ennemis: [] },
    oeillet_inde: { amis: ["tomate", "courgettes", "poivron", "basilic"], ennemis: [] }
};

let carres = [];
let plantes = [...catalogueInitial];

// =================================================================
// 2. SAUVEGARDE LOCALE & INITIALISATION
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres", JSON.stringify(carres));
    localStorage.setItem("potager_plantes", JSON.stringify(plantes));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres");
    const plantesStockees = localStorage.getItem("potager_plantes");

    if (plantesStockees) plantes = JSON.parse(plantesStockees);

    if (carresStockes) {
        const donneesBrutes = JSON.parse(carresStockes);
        carres = donneesBrutes.map(c => {
            const carre = new CarrePotager(c.id, c.longueur, c.largeur, c.hauteur, c.exposition);
            carre.plantes = c.plantes || [];
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

    // Ajout d'un carré
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

    // Ajout d'une plante sur-mesure
    document.getElementById("form-plante").addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("p-nom").value.trim();
        const categorie = document.getElementById("p-categorie").value;
        const besoinSoleil = document.getElementById("p-soleil").value;

        if (!nom) return;
        const id = nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
        
        plantes.push({ 
            id, nom, categorie, besoinSoleil, 
            semis: "Ajuster selon saison", 
            repiquage: "Pleine terre", 
            joursMaturation: 60 
        });

        sauvegarderDonnees();
        document.getElementById("filter-categorie").value = categorie;
        renderPlantes();
        e.target.reset();
    });

    document.getElementById("filter-categorie").addEventListener("change", renderPlantes);
});

// =================================================================
// 3. AFFICHAGE DES COMPOSANTS
// =================================================================

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

function renderCarres() {
    const container = document.getElementById("liste-carres");
    container.innerHTML = "";

    carres.forEach(c => {
        const volume = c.getVolumeLitres();
        const brun = (volume * 0.3).toFixed(0);
        const vert = (volume * 0.3).toFixed(0);

        container.innerHTML += `
            <div class="item-card">
                <h4>Carré #${c.id} (${c.exposition})</h4>
                <p><strong>Taille :</strong> ${c.longueur}x${c.largeur}x${c.hauteur} cm</p>
                <p><strong>Volume Lasagne :</strong> ${volume.toFixed(0)}L (Brun: ~${brun}L / Vert: ~${vert}L)</p>
                
                <div style="margin-top:10px; padding:8px; background:#fff; border-radius:4px;">
                    <strong>Plantes installées :</strong>
                    <p>${c.plantes.length === 0 ? '<em>Aucune plante</em>' : c.plantes.map(p => getNomPlante(p.idPlante)).join(', ')}</p>
                    ${analyserCarré(c)}
                </div>

                <div style="margin-top:10px;">
                    <label><strong>Ajouter une plante :</strong></label>
                    <select onchange="ajouterPlanteAuCarre(${c.id}, this.value)">
                        <option value="">-- Choisir une plante --</option>
                        ${getOptionsPlantesCompatibles(c)}
                    </select>
                </div>
            </div>
        `;
    });
}

function ajouterPlanteAuCarre(carreId, planteId) {
    if (!planteId) return;
    const carre = carres.find(c => c.id === carreId);
    if (carre) {
        carre.ajouterPlante(planteId);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
    }
}

function getNomPlante(id) {
    const p = plantes.find(item => item.id === id);
    return p ? p.nom : id;
}

function getOptionsPlantesCompatibles(carre) {
    const expositionsAdmissibles = COMPATIBILITE_EXPOSITION[carre.exposition] || [];
    return plantes
        .filter(p => expositionsAdmissibles.includes(p.besoinSoleil) && !carre.plantes.some(item => item.idPlante === p.id))
        .map(p => `<option value="${p.id}">${p.nom} (${p.categorie})</option>`)
        .join("");
}

function analyserCarré(carre) {
    if (carre.plantes.length < 2) return "<p style='color:#666;'><small>Ajoutez au moins 2 plantes pour vérifier le compagnonnage.</small></p>";

    let alertesBonnes = [];
    let alertesMauvaises = [];

    for (let i = 0; i < carre.plantes.length; i++) {
        for (let j = i + 1; j < carre.plantes.length; j++) {
            const p1 = carre.plantes[i].idPlante;
            const p2 = carre.plantes[j].idPlante;

            if (MATRICE_ASSOCIATIONS[p1]?.amis.includes(p2)) {
                alertesBonnes.push(`✅ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Bonne association`);
            }
            if (MATRICE_ASSOCIATIONS[p1]?.ennemis.includes(p2)) {
                alertesMauvaises.push(`⚠️ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Mauvaise association`);
            }
        }
    }

    let html = "";
    if (alertesBonnes.length > 0) html += `<div style="color:green; font-size:12px;">${alertesBonnes.join('<br>')}</div>`;
    if (alertesMauvaises.length > 0) html += `<div style="color:red; font-size:12px;">${alertesMauvaises.join('<br>')}</div>`;
    return html || `<div style="color:#555; font-size:12px;">Associations neutres.</div>`;
}

// Affichage du catalogue avec cartes CLIQUABLES
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
            <div class="item-card item-cliquable" onclick="selectionnerPlantePourPlantation('${p.id}')" style="cursor: pointer; border: 2px solid #e0e0e0; transition: all 0.2s;">
                <h4>🌱 ${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Exposition :</strong> ${p.besoinSoleil}</p>
                <p><strong>Espacement :</strong> ${p.distanceMin || 30} cm</p>
                <button class="btn-secondary" style="margin-top: 8px; width: 100%;">➕ Planter dans un carré</button>
            </div>
        `;
    });
}

// Action déclenchée lorsqu'on clique sur une plante du catalogue
function selectionnerPlantePourPlantation(planteId) {
    if (carres.length === 0) {
        alert("⚠️ Veuillez d'abord créer au moins un carré potager dans la Section 1 !");
        return;
    }

    const plante = plantes.find(p => p.id === planteId);
    if (!plante) return;

    // Création d'une liste de choix des carrés disponibles
    let options = carres.map(c => `Carré #${c.id} (${c.exposition})`).join("\n");
    let choixCarre = prompt(`Dans quel carré souhaitez-vous planter la "${plante.nom}" ?\n\nEntrez le numéro du carré :\n${options}`);

    if (choixCarre) {
        const numCarre = Number(choixCarre.trim());
        const carreCible = carres.find(c => c.id === numCarre);

        if (carreCible) {
            carreCible.ajouterPlante(planteId);
            sauvegarderDonnees();
            renderCarres();
            renderCalendrier();
            alert(`✅ "${plante.nom}" a été ajoutée au Carré #${carreCible.id} !\n📏 Conseil : Gardez une distance de ${plante.distanceMin || 30} cm avec les voisins.`);
        } else {
            alert("❌ Numéro de carré invalide.");
        }
    }
}


// =================================================================
// 4. CALENDRIER ET PREDICTION DE RÉCOLTE
// =================================================================

// Dans renderCalendrier(), modifiez la boucle d'affichage :
plantesEnTerre.forEach(p => {
    // Récupération du décalage (par défaut 0 si non géolocalisé)
    const decalage = window.zoneClimatiqueActuelle ? window.zoneClimatiqueActuelle.decalageJours : 0;

    const dateMiseEnTerre = new Date(p.datePlantation);
    const dateRecolteEstimee = new Date(dateMiseEnTerre);
    
    // Ajustement des jours de maturation selon le climat
    dateRecolteEstimee.setDate(dateRecolteEstimee.getDate() + p.joursMaturation + decalage);

    container.innerHTML += `
        <div class="item-card">
            <h4>${p.nom} (Carré #${p.carreId})</h4>
            <p><strong>Climat détecté :</strong> ${window.zoneClimatiqueActuelle ? window.zoneClimatiqueActuelle.nom : "Standard"}</p>
            <p><strong>Semis conseillé :</strong> ${p.semis}</p>
            <p><strong>Mise en lasagne :</strong> ${p.datePlantation}</p>
            <p style="color:green;"><strong>🌾 Récolte estimée :</strong> ~${dateRecolteEstimee.toLocaleDateString('fr-FR')}</p>
        </div>
    `;
});


    if (plantesEnTerre.length === 0) {
        container.innerHTML = "<p style='color:#666;'>Aucune plante actuellement installée dans le potager.</p>";
        return;
    }

    plantesEnTerre.forEach(p => {
        // Estimation de la date de récolte
        const dateMiseEnTerre = new Date(p.datePlantation);
        const dateRecolteEstimee = new Date(dateMiseEnTerre);
        dateRecolteEstimee.setDate(dateRecolteEstimee.getDate() + p.joursMaturation);

        container.innerHTML += `
            <div class="item-card">
                <h4>${p.nom} (Carré #${p.carreId})</h4>
                <p><strong>Semis conseillé :</strong> ${p.semis}</p>
                <p><strong>Mise en lasagne :</strong> ${p.datePlantation}</p>
                <p style="color:green;"><strong>🌾 Récolte estimée :</strong> ~${dateRecolteEstimee.toLocaleDateString('fr-FR')}</p>
            </div>
        `;
    });
}

// =================================================================
// 5. INTÉGRATION MÉTÉO (OPEN-METEO)
// =================================================================

async function chargerMeteoEtAlertes() {
    const statusDiv = document.getElementById("meteo-status");
    const container = document.getElementById("meteo-cards");

    statusDiv.innerHTML = "<p>🔄 Géolocalisation et météo en cours...</p>";

    if (!navigator.geolocation) {
        statusDiv.innerHTML = "<p style='color:red;'>La géolocalisation n'est pas supportée par votre navigateur.</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
// À ajouter juste après : const lat = position.coords.latitude;
window.zoneClimatiqueActuelle = obtenirZoneClimatique(lat);
renderCalendrier(); // Met à jour le calendrier immédiatement avec le bon climat

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            const temp = data.current.temperature_2m;
            const humidite = data.current.relative_humidity_2m;
            const pluie = data.current.precipitation;

            statusDiv.innerHTML = `<p style='color:green;'>📍 Données météo à jour pour votre zone</p>`;

            container.innerHTML = `
                <div class="item-card">
                    <h4>🌡️ Météo Actuelle</h4>
                    <p><strong>Température :</strong> ${temp} °C</p>
                    <p><strong>Humidité :</strong> ${humidite} %</p>
                    <p><strong>Précipitations :</strong> ${pluie} mm</p>
                </div>
                <div class="item-card">
                    <h4>💧 Conseil Arrosage</h4>
                    ${pluie > 5 ? "🌧️ Pluie suffisante. Pas d'arrosage nécessaire." : "🌱 Vérifier la lasagne sous le paillage."}
                </div>
                <div class="item-card">
                    <h4>🛡️ Santé & Pathologies</h4>
                    ${temp >= 17 && temp <= 25 && humidite >= 80 ? "🚨 <strong>Alerte Mildiou !</strong> Pulvérisez de la prêle." : "✅ Aucun risque majeur détecté."}
                </div>
            `;
        } catch (error) {
            statusDiv.innerHTML = "<p style='color:red;'>Erreur lors de la récupération des données météo.</p>";
        }
    });
}
