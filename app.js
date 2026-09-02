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
    }

    getSurface() {
        return (this.longueur * this.largeur) / 10000; // m²
    }

    getVolumeLitres() {
        return (this.longueur * this.largeur * this.hauteur) / 1000; // Litres
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

// Matrice de compatibilité ajustée : Sud-Est, Sud-Ouest et Ouest acceptent le Plein Soleil ("SUD")
const COMPATIBILITE_EXPOSITION = {
    "SUD": ["SUD", "MI_OMBRE"],
    "SUD_OUEST": ["SUD", "MI_OMBRE"],
    "SUD_EST": ["SUD", "MI_OMBRE"],
    "OUEST": ["SUD", "MI_OMBRE"],
    "EST": ["MI_OMBRE", "OMBRE"],
    "NORD": ["OMBRE", "MI_OMBRE"]
};

// Catalogue initial étoffé
const catalogueInitial = [
    // Légumes-Fruits
    { id: "aubergine", nom: "Aubergine", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "concombre", nom: "Concombre", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "courgettes", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "melon", nom: "Melon", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "poivron", nom: "Poivron / Piment", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "potiron", nom: "Potiron / Potimarron", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },

    // Légumes-Feuilles
    { id: "artichaut", nom: "Artichaut", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "SUD" },
    { id: "blette", nom: "Blette / Bette", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "chou_fleur", nom: "Chou-fleur", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "chou_pomme", nom: "Chou pommé", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "epinard", nom: "Épinard", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "mache", nom: "Mâche", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "poireau", nom: "Poireau", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "roquette", nom: "Roquette", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },

    // Légumes-Racines
    { id: "ail", nom: "Ail", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "betterave", nom: "Betterave", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "celeri_rave", nom: "Céleri-rave", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE" },
    { id: "echalote", nom: "Échalote", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "navet", nom: "Navet", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE" },
    { id: "oignon", nom: "Oignon", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "panais", nom: "Panais", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "patate_douce", nom: "Patate douce", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "pomme_de_terre", nom: "Pomme de terre", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "radis", nom: "Radis", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "MI_OMBRE" },

    // Légumineuses
    { id: "fève", nom: "Fève", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "garrance", nom: "Gesse / Pois carré", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "haricot_a_rames", nom: "Haricot à rames", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "haricot_nain", nom: "Haricot nain", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "lentille", nom: "Lentille", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "pois_chiche", nom: "Pois chiche", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "petit_pois", nom: "Pois gourmand / Petit pois", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "MI_OMBRE" },

    // Aromatiques
    { id: "aneth", nom: "Aneth", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "ciboulette", nom: "Ciboulette", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE" },
    { id: "coriandre", nom: "Coriandre", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE" },
    { id: "menthe", nom: "Menthe", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE" },
    { id: "persil", nom: "Persil", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "MI_OMBRE" },
    { id: "romarin", nom: "Romarin", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "thym", nom: "Thym", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },

    // Fleurs Amies
    { id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "calendula", nom: "Souci (Calendula)", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "capucine", nom: "Capucine", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "lavande", nom: "Lavande", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "phacelie", nom: "Phacélie", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" }
];

const carres = [];
const plantes = [...catalogueInitial];

// =================================================================
// 2. INTERFACE UTILISATEUR & ÉVÉNEMENTS
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    initSelects();
    renderPlantes();

    // Gestion de l'ajout d'un carré
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

    // Gestion de l'ajout d'une nouvelle plante
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

    // Filtrage dynamique lors du changement dans le menu déroulant
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
                <p><strong>Surface :</strong> ${c.getSurface().toFixed(2)} m²</p>
                <p><strong>Volume :</strong> ${volume.toFixed(0)} Litres</p>
                <span class="badge">Lasagne : ~${brun}L Brun / ~${vert}L Vert</span>
            </div>
        `;
    });
}

function renderPlantes() {
    const container = document.getElementById("catalogue-plantes");
    const filter = document.getElementById("filter-categorie").value;
    container.innerHTML = "";

    let plantesFiltrees = (filter === "TOUS" || !filter)
        ? [...plantes]
        : plantes.filter(p => p.categorie === filter);

    // Tri par ordre alphabétique
    plantesFiltrees.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));

    if (plantesFiltrees.length === 0) {
        container.innerHTML = `<p>Aucune plante dans cette catégorie pour le moment.</p>`;
        return;
    }

    plantesFiltrees.forEach(p => {
        container.innerHTML += `
            <div class="item-card">
                <h4>${p.nom}</h4>
                <p><strong>Catégorie :</strong> ${p.categorie}</p>
                <p><strong>Exposition recommandée :</strong> ${p.besoinSoleil}</p>
            </div>
        `;
    });
}
