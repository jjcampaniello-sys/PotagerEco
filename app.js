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
        // Grille de 9 cases (3x3). Chaque case contient null ou un objet { idPlante, datePlantation }
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

// Catalogue avec distances minimales recommandées
const catalogueInitial = [
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 75, distanceMin: 45 },
    { id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Avril - Mai", repiquage: "Mai - Juin", joursMaturation: 60, distanceMin: 60 },
    { id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD", semis: "Février - Mars", repiquage: "Mai", joursMaturation: 85, distanceMin: 40 },
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE", semis: "Mars - Septembre", repiquage: "Avril - Octobre", joursMaturation: 45, distanceMin: 25 },
    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD", semis: "Mars - Juillet", repiquage: "Semis direct", joursMaturation: 80, distanceMin: 10 },
    { id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE", semis: "Mars - Septembre", repiquage: "Semis direct", joursMaturation: 25, distanceMin: 5 },
    { id: "haricot", nom: "Haricot vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD", semis: "Mai - Juillet", repiquage: "Semis direct", joursMaturation: 60, distanceMin: 20 },
    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD", semis: "Avril - Mai", repiquage: "Mai", joursMaturation: 30, distanceMin: 20 },
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD", semis: "Mars - Avril", repiquage: "Mai", joursMaturation: 50, distanceMin: 15 }
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
window.zoneClimatiqueActuelle = { nom: "Standard", decalageJours: 0 };

// =================================================================
// 2. STOCKAGE LOCAL & INITIALISATION
// =================================================================

function sauvegarderDonnees() {
    localStorage.setItem("potager_carres_v5", JSON.stringify(carres));
    localStorage.setItem("potager_plantes_v5", JSON.stringify(plantes));
}

function chargerDonneesStockees() {
    const carresStockes = localStorage.getItem("potager_carres_v5");
    const plantesStockees = localStorage.getItem("potager_plantes_v5");

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
            joursMaturation: 60, distanceMin: 25
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
// 3. AFFICHAGE ET INTERACTION AVEC LES CARRÉS (GRILLE 3x3)
// =================================================================

function renderCarres() {
    const container = document.getElementById("liste-carres");
    container.innerHTML = "";

    carres.forEach(c => {
        const volume = c.getVolumeLitres();
        const brun = (volume * 0.3).toFixed(0);
        const vert = (volume * 0.3).toFixed(0);

        let htmlGrille = `<div class="grille-potager">`;
        for (let index = 0; index < 9; index++) {
            const contenuCase = c.grille[index];
            if (contenuCase) {
                const nomP = getNomPlante(contenuCase.idPlante);
                htmlGrille += `
                    <div class="case-grille plante-occupee" onclick="libererCase(${c.id}, ${index})">
                        🌿 <strong>${nomP}</strong>
                        <small style="font-size:9px;">${contenuCase.datePlantation}</small>
                        <button class="btn-suppr-case" title="Supprimer">❌</button>
                    </div>
                `;
            } else {
                htmlGrille += `
                    <div class="case-grille" 
                         ondragover="allowDrop(event)" 
                         ondragleave="removeDragOver(event)"
                         ondrop="dropPlante(event, ${c.id}, ${index})"
                         onclick="attribuerCaseParClic(${c.id}, ${index})">
                        <span style="color:#aaa;">Emplacement ${index + 1}</span>
                        <small style="color:#888;">+ Ajouter</small>
                    </div>
                `;
            }
        }
        htmlGrille += `</div>`;

        container.innerHTML += `
            <div class="item-card">
                <h4>Carré #${c.id} (${c.exposition})</h4>
                <p><strong>Taille :</strong> ${c.longueur}x${c.largeur}x${c.hauteur} cm</p>
                <p><strong>Lasagne :</strong> ${volume.toFixed(0)}L (Brun: ~${brun}L / Vert: ~${vert}L)</p>
                
                <strong>Grille du carré (Placer vos légumes) :</strong>
                ${htmlGrille}

                <div style="margin-top:10px; padding:8px; background:#fff; border-radius:4px;">
                    ${analyserCarré(c)}
                </div>
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

function attribuerCaseParClic(carreId, indexCase) {
    const carre = carres.find(c => c.id === carreId);
    if (!carre) return;

    const expositionsAdmissibles = COMPATIBILITE_EXPOSITION[carre.exposition] || [];
    const disponibles = plantes.filter(p => expositionsAdmissibles.includes(p.besoinSoleil));

    let optionsStr = disponibles.map((p, idx) => `${idx + 1}. ${p.nom} (Espacement rec.: ${p.distanceMin || 20}cm)`).join("\n");
    let choix = prompt(`Sélectionnez une plante pour la case ${indexCase + 1} du Carré #${carre.id} :\n\n${optionsStr}\n\nEntrez le numéro du choix :`);

    if (choix) {
        const indexPlante = Number(choix.trim()) - 1;
        if (disponibles[indexPlante]) {
            carre.placerPlanteCase(indexCase, disponibles[indexPlante].id);
            sauvegarderDonnees();
            renderCarres();
            renderCalendrier();
        }
    }
}

// Support du Drag-and-Drop
function allowDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
}

function removeDragOver(ev) {
    ev.currentTarget.classList.remove('drag-over');
}

function dropPlante(ev, carreId, indexCase) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    const planteId = ev.dataTransfer.getData("text/plain");

    const carre = carres.find(c => c.id === carreId);
    if (carre && planteId) {
        carre.placerPlanteCase(indexCase, planteId);
        sauvegarderDonnees();
        renderCarres();
        renderCalendrier();
    }
}

// =================================================================
// 4. CATALOGUE ET CLIC SUR PLANTES
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
            <div class="item-card item-cliquable" 
                 draggable="true" 
                 ondragstart="dragStart(event, '${p.id}')"
                 onclick="selectionnerPlantePourPlantation('${p.id}')" 
                 style="cursor: grab; border: 2px solid #e0e0e0;">
                <h4>🌱 ${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Exposition :</strong> ${p.besoinSoleil}</p>
                <p><strong>Espacement :</strong> ${p.distanceMin || 25} cm</p>
                <button class="btn-secondary" style="margin-top: 8px; width: 100%;">➕ Choisir le carré</button>
            </div>
        `;
    });
}

function dragStart(ev, planteId) {
    ev.dataTransfer.setData("text/plain", planteId);
}

function selectionnerPlantePourPlantation(planteId) {
    if (carres.length === 0) {
        alert("⚠️ Veuillez créer un carré potager dans la Section 1 !");
        return;
    }

    const plante = plantes.find(p => p.id === planteId);
    let options = carres.map(c => `Carré #${c.id} (${c.exposition})`).join("\n");
    let choixCarre = prompt(`Dans quel carré placer la "${plante.nom}" ?\n\n${options}\n\nEntrez le N° du carré :`);

    if (choixCarre) {
        const numCarre = Number(choixCarre.trim());
        const carreCible = carres.find(c => c.id === numCarre);

        if (carreCible) {
            const caseLibre = carreCible.grille.findIndex(c => c === null);
            if (caseLibre !== -1) {
                carreCible.placerPlanteCase(caseLibre, planteId);
                sauvegarderDonnees();
                renderCarres();
                renderCalendrier();
                alert(`✅ "${plante.nom}" placée dans le Carré #${carreCible.id} (Emplacement ${caseLibre + 1}) !\n📏 Espacement recommandé : ${plante.distanceMin || 25} cm.`);
            } else {
                alert("❌ Ce carré est complet (9/9 emplacements occupés).");
            }
        }
    }
}

function getNomPlante(id) {
    const p = plantes.find(item => item.id === id);
    return p ? p.nom : id;
}

function analyserCarré(carre) {
    const plantesPresentes = carre.getPlantesUnique();
    if (plantesPresentes.length < 2) return "<p style='color:#666;'><small>Ajoutez au moins 2 plantes dans la grille pour analyser le compagnonnage.</small></p>";

    let alertesBonnes = [];
    let alertesMauvaises = [];

    for (let i = 0; i < plantesPresentes.length; i++) {
        for (let j = i + 1; j < plantesPresentes.length; j++) {
            const p1 = plantesPresentes[i];
            const p2 = plantesPresentes[j];

            if (MATRICE_ASSOCIATIONS[p1]?.amis.includes(p2)) {
                alertesBonnes.push(`✅ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Très bonne association !`);
            }
            if (MATRICE_ASSOCIATIONS[p1]?.ennemis.includes(p2)) {
                alertesMauvaises.push(`⚠️ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Mauvais voisins !`);
            }
        }
    }

    let html = "";
    if (alertesBonnes.length > 0) html += `<div style="color:green; font-size:12px;">${alertesBonnes.join('<br>')}</div>`;
    if (alertesMauvaises.length > 0) html += `<div style="color:red; font-size:12px;">${alertesMauvaises.join('<br>')}</div>`;
    return html || `<div style="color:#555; font-size:12px;">Associations neutres.</div>`;
}

// =================================================================
// 5. CALENDRIER DE RÉCOLTE & CLIMAT DYNAMIQUE
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
        container.innerHTML = "<p style='color:#666;'>Aucune plante actuellement installée dans la grille du potager.</p>";
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
                <p><strong>Espacement :</strong> ${p.distanceMin} cm</p>
                <p style="color:green;"><strong>🌾 Récolte estimée :</strong> ~${dateRecolteEstimee.toLocaleDateString('fr-FR')}</p>
            </div>
        `;
    });
}

// =================================================================
// 6. INTÉGRATION MÉTÉO (OPEN-METEO)
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
                    ${pluie > 5 ? "🌧️ Pluie suffisante. Inutile d'arroser la lasagne." : "🌱 Vérifiez la fraîcheur sous la lasagne."}
                </div>
                <div class="item-card">
                    <h4>🛡️ Santé Plante</h4>
                    ${temp >= 17 && temp <= 25 && humidite >= 80 ? "🚨 <strong>Alerte Mildiou !</strong> Traitez préventivement avec de la prêle." : "✅ Aucun risque sanitaire fort détecté."}
                </div>
            `;
        } catch (error) {
            statusDiv.innerHTML = "<p style='color:red;'>Erreur de connexion météo.</p>";
        }
    });
}
