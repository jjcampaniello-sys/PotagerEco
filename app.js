// =================================================================
// 1. LOGIQUE MÉTIER & CATALOGUE ÉLARGI
// =================================================================

class CarrePotager {
    constructor(id, longueur, largeur, hauteur, exposition) {
        this.id = id;
        this.longueur = Number(longueur);
        this.largeur = Number(largeur);
        this.hauteur = Number(hauteur);
        this.exposition = exposition;
        this.plantes = []; // Plantes actuellement installées dans ce carré
    }

    getSurface() { return (this.longueur * this.largeur) / 10000; }
    getVolumeLitres() { return (this.longueur * this.largeur * this.hauteur) / 1000; }

    ajouterPlante(planteId) {
        if (!this.plantes.includes(planteId)) {
            this.plantes.push(planteId);
        }
    }

    retirerPlante(planteId) {
        this.plantes = this.plantes.filter(id => id !== planteId);
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

// Catalogue initial
const catalogueInitial = [
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "aubergine", nom: "Aubergine", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "epinard", nom: "Épinard", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "poireau", nom: "Poireau", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },

    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE" },
    { id: "oignon", nom: "Oignon", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "pomme_de_terre", nom: "Pomme de terre", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },

    { id: "haricot", nom: "Haricot vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "petit_pois", nom: "Petit pois", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE" },

    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "persil", nom: "Persil", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE" },

    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "capucine", nom: "Capucine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" }
];

// =================================================================
// 2. MATRICE D'ASSOCIATION (COMPAGNONNAGE)
// =================================================================

const MATRICE_ASSOCIATIONS = {
    tomate: {
        amis: ["basilic", "oeillet_inde", "carotte", "persil", "laitue"],
        ennemis: ["pomme_de_terre", "courgettes", "fève"]
    },
    carotte: {
        amis: ["poireau", "radis", "laitue", "oignon", "tomate"],
        ennemis: ["aneth"]
    },
    poireau: {
        amis: ["carotte", "fève", "laitue", "tomate"],
        ennemis: ["haricot", "petit_pois", "oignon"]
    },
    haricot: {
        amis: ["courgettes", "radis", "maïs", "basilic"],
        ennemis: ["oignon", "poireau", "ail"]
    },
    basilic: {
        amis: ["tomate", "poivron", "courgettes", "oeillet_inde"],
        ennemis: []
    },
    oeillet_inde: {
        amis: ["tomate", "courgettes", "poivron", "aubergine", "basilic"],
        ennemis: []
    }
};

const carres = [];
const plantes = [...catalogueInitial];

// =================================================================
// 3. INTERFACE ET ÉVÉNEMENTS
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

        // Analyse du compagnonnage dans ce carré
        const analyseCompagnonnage = analyserCarré(c);

        container.innerHTML += `
            <div class="item-card">
                <h4>Carré #${c.id} (${c.exposition})</h4>
                <p><strong>Taille :</strong> ${c.longueur}x${c.largeur}x${c.hauteur} cm</p>
                <p><strong>Volume Lasagne :</strong> ${volume.toFixed(0)}L (Brun: ~${brun}L / Vert: ~${vert}L)</p>
                
                <div style="margin-top:10px; padding:8px; background:#fff; border-radius:4px;">
                    <strong>Plantes installées :</strong>
                    <p>${c.plantes.length === 0 ? '<em>Aucune plante</em>' : c.plantes.map(id => getNomPlante(id)).join(', ')}</p>
                    ${analyseCompagnonnage}
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

// Filtre les options de plantes selon l'exposition et évite les doublons
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

// Algorithme d'analyse des associations dans le carré
function analyserCarré(carre) {
    if (carre.plantes.length < 2) return "<p style='color:#666;'><small>Ajoutez au moins 2 plantes pour vérifier le compagnonnage.</small></p>";

    let alertesBonnes = [];
    let alertesMauvaises = [];

    for (let i = 0; i < carre.plantes.length; i++) {
        for (let j = i + 1; j < carre.plantes.length; j++) {
            const p1 = carre.plantes[i];
            const p2 = carre.plantes[j];

            if (MATRICE_ASSOCIATIONS[p1]?.amis.includes(p2)) {
                alertesBonnes.push(`✅ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Excellente association !`);
            }
            if (MATRICE_ASSOCIATIONS[p1]?.ennemis.includes(p2)) {
                alertesMauvaises.push(`⚠️ <strong>${getNomPlante(p1)}</strong> + <strong>${getNomPlante(p2)}</strong> : Mauvais voisins !`);
            }
        }
    }

    let html = "";
    if (alertesBonnes.length > 0) html += `<div style="color:green; font-size:12px;">${alertesBonnes.join('<br>')}</div>`;
    if (alertesMauvaises.length > 0) html += `<div style="color:red; font-size:12px;">${alertesMauvaises.join('<br>')}</div>`;
    if (alertesBonnes.length === 0 && alertesMauvaises.length === 0) {
        html += `<div style="color:#555; font-size:12px;">Associations neutres.</div>`;
    }

    return html;
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
