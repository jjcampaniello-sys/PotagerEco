// =================================================================
// 1. LOGIQUE MÉTIER & CATALOGUE
// =================================================================

class CarrePotager {
    constructor(id, longueur, largeur, hauteur, exposition) {
        this.id = id;
        this.longueur = Number(longueur);
        this.largeur = Number(largeur);
        this.hauteur = Number(hauteur);
        this.exposition = exposition;
        this.plantes = [];
    }

    getSurface() { return (this.longueur * this.largeur) / 10000; }
    getVolumeLitres() { return (this.longueur * this.largeur * this.hauteur) / 1000; }

    ajouterPlante(planteId) {
        if (!this.plantes.includes(planteId)) this.plantes.push(planteId);
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

const catalogueInitial = [
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE" },
    { id: "haricot", nom: "Haricot vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" }
];

const MATRICE_ASSOCIATIONS = {
    tomate: { amis: ["basilic", "oeillet_inde", "carotte", "laitue"], ennemis: ["courgettes"] },
    carotte: { amis: ["radis", "laitue", "tomate"], ennemis: [] },
    haricot: { amis: ["courgettes", "radis", "basilic"], ennemis: [] },
    basilic: { amis: ["tomate", "poivron", "oeillet_inde"], ennemis: [] },
    oeillet_inde: { amis: ["tomate", "courgettes", "poivron", "basilic"], ennemis: [] }
};

const carres = [];
const plantes = [...catalogueInitial];

// =================================================================
// 2. INTÉGRATION API MÉTÉO (OPEN-METEO) & PRÉVENTION
// =================================================================

async function chargerMeteoEtAlertes() {
    const statusDiv = document.getElementById("meteo-status");
    const container = document.getElementById("meteo-cards");

    statusDiv.innerHTML = "<p>🔄 Géolocalisation et récupération des métriques...</p>";

    if (!navigator.geolocation) {
        statusDiv.innerHTML = "<p style='color:red;'>La géolocalisation n'est pas supportée par votre navigateur.</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            // Requete API Open-Meteo (Sans clé API)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            const temp = data.current.temperature_2m;
            const humidite = data.current.relative_humidity_2m;
            const pluie = data.current.precipitation;

            statusDiv.innerHTML = `<p style='color:green;'>📍 Données météo récupérées (Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)})</p>`;
            
            // Analyse des alertes
            let alertesHtml = analyserRisquesMaladies(temp, humidite);
            let arrosageHtml = analyserBesoinsArrosage(pluie, temp);

            container.innerHTML = `
                <div class="item-card">
                    <h4>🌡️ Conditions Actuelles</h4>
                    <p><strong>Température :</strong> ${temp} °C</p>
                    <p><strong>Humidité de l'air :</strong> ${humidite} %</p>
                    <p><strong>Précipitations :</strong> ${pluie} mm</p>
                </div>
                <div class="item-card">
                    <h4>💧 Conseil Arrosage (Lasagne)</h4>
                    ${arrosageHtml}
                </div>
                <div class="item-card">
                    <h4>🛡️ Prévention Santé & Pathologies</h4>
                    ${alertesHtml}
                </div>
            `;
        } catch (error) {
            statusDiv.innerHTML = "<p style='color:red;'>Erreur lors de la récupération des données météo.</p>";
            console.error(error);
        }
    }, () => {
        statusDiv.innerHTML = "<p style='color:red;'>Permission de géolocalisation refusée.</p>";
    });
}

function analyserBesoinsArrosage(pluie, temp) {
    if (pluie > 5) {
        return "<p style='color:blue;'>🌧️ Pluie suffisante. <strong>Arrosage inutile</strong> aujourd'hui. La méthode lasagne retient efficacement cette humidité.</p>";
    } else if (temp > 28) {
        return "<p style='color:orange;'>🔥 Forte chaleur. Arrosez <strong>au pied</strong> tôt le matin ou après le coucher du soleil pour limiter l'évaporation.</p>";
    } else {
        return "<p style='color:green;'>🌱 Humidité stable. Vérifiez au toucher sous la première couche de paillage si le sol demeure frais.</p>";
    }
}

function analyserRisquesMaladies(temp, humidite) {
    let alertes = [];

    // Alerte Mildiou (17°C <= T <= 25°C et Humidité > 80%)
    if (temp >= 17 && temp <= 25 && humidite >= 80) {
        alertes.push(`
            <div style="color:red; margin-bottom:8px;">
                🚨 <strong>Alerte Mildiou Élevée !</strong><br>
                <em>Risque fort pour tomates et pommes de terre.</em><br>
                <small><strong>Remèdes écoresponsables :</strong> Pulvérisez de la décoction de prêle ou du bicarbonate de soude (5g/L + savon noir). Évitez de mouiller le feuillage.</small>
            </div>
        `);
    }

    // Alerte Nécrose Apicale / Cul-Noir
    if (temp >= 29) {
        alertes.push(`
            <div style="color:darkorange; margin-bottom:8px;">
                ⚠️ <strong>Risque de Cul-Noir (Tomates) !</strong><br>
                <em>Causes : Forte chaleur & régularité d'arrosage perturbée.</em><br>
                <small><strong>Remèdes :</strong> Paillez généreusement la lasagne pour conserver un taux de calcium assimilable constant.</small>
            </div>
        `);
    }

    if (alertes.length === 0) {
        return "<p style='color:green;'>✅ Aucun risque majeur de maladie cryptogamique détecté aujourd'hui.</p>";
    }

    return alertes.join("");
}

// =================================================================
// 3. INITIALISATION DE L'APPLICATION
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    initSelects();
    renderPlantes();

    document.getElementById("form-carre").addEventListener("submit", (e) => {
        e.preventDefault();
        const L = document.getElementById("longueur").value;
        const l = document.getElementById("largeur").value;
        const h = document.getElementById("hauteur").value;
        const expo = document.getElementById("exposition").value;

        const nouveauCarre = new CarrePotager(carres.length + 1, L, l, h, expo);
        carres.push(nouveauCarre);
        
        renderCarres();
        e.target.reset();
    });

    document.getElementById("form-plante").addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("p-nom").value.trim();
        const categorie = document.getElementById("p-categorie").value;
        const besoinSoleil = document.getElementById("p-soleil").value;

        if (!nom) return;
        const id = nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
        
        plantes.push({ id, nom, categorie, besoinSoleil });
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
                    <p>${c.plantes.length === 0 ? '<em>Aucune plante</em>' : c.plantes.map(id => getNomPlante(id)).join(', ')}</p>
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

function getNomPlante(id) {
    const p = plantes.find(item => item.id === id);
    return p ? p.nom : id;
}

function getOptionsPlantesCompatibles(carre) {
    const expositionsAdmissibles = COMPATIBILITE_EXPOSITION[carre.exposition] || [];
    return plantes
        .filter(p => expositionsAdmissibles.includes(p.besoinSoleil) && !carre.plantes.includes(p.id))
        .map(p => `<option value="${p.id}">${p.nom} (${p.categorie})</option>`)
        .join("");
}

function ajouterPlanteAuCarre(carreId, planteId) {
    if (!planteId) return;
    const carre = carres.find(c => c.id === carreId);
    if (carre) {
        carre.ajouterPlante(planteId);
        renderCarres();
    }
}

function analyserCarré(carre) {
    if (carre.plantes.length < 2) return "<p style='color:#666;'><small>Ajoutez au moins 2 plantes pour vérifier le compagnonnage.</small></p>";

    let alertesBonnes = [];
    let alertesMauvaises = [];

    for (let i = 0; i < carre.plantes.length; i++) {
        for (let j = i + 1; j < carre.plantes.length; j++) {
            const p1 = carre.plantes[i];
            const p2 = carre.plantes[j];

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
            <div class="item-card">
                <h4>${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Exposition :</strong> ${p.besoinSoleil}</p>
            </div>
        `;
    });
}
