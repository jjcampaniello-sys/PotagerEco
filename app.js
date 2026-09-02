// =================================================================
// 1. LOGIQUE MÉTIER (Classes & Données)
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
    FLEUR_AMIE: "Fleurs Bénéfiques"
};

const catalogueInitial = [
    { id: "tomate", nom: "Tomate", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "courgette", nom: "Courgette", categorie: CATEGORIES.LEGUME_FRUIT, besoinSoleil: "SUD" },
    { id: "laitue", nom: "Laitue", categorie: CATEGORIES.LEGUME_FEUILLE, besoinSoleil: "MI_OMBRE" },
    { id: "carotte", nom: "Carotte", categorie: CATEGORIES.LEGUME_RACINE, besoinSoleil: "SUD" },
    { id: "haricot", nom: "Haricot vert", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
    { id: "basilic", nom: "Basilic", categorie: CATEGORIES.AROMATIQUE, besoinSoleil: "SUD" },
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" },
    { id: "bourrache", nom: "Bourrache", categorie: CATEGORIES.FLEUR_AMIE, besoinSoleil: "SUD" }
];

// État de l'application
const carres = [];
const plantes = [...catalogueInitial];

// =================================================================
// 2. INTERFACE UTILISATEUR & DOM
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    initSelects();
    renderPlantes();

    // Événement : Ajouter un carré
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

    // Événement : Ajouter une plante personnalisée
    document.getElementById("form-plante").addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("p-nom").value;
        const categorie = document.getElementById("p-categorie").value;
        const besoinSoleil = document.getElementById("p-soleil").value;

        const id = nom.toLowerCase().replace(/\s+/g, '_');
        
        plantes.push({ id, nom, categorie, besoinSoleil });
        renderPlantes();
        e.target.reset();
    });

    // Événement : Filtrer le catalogue
    document.getElementById("filter-categorie").addEventListener("change", renderPlantes);
});

// Initialiser les menus déroulants dynamiques
function initSelects() {
    const selectCat = document.getElementById("p-categorie");
    const selectFilter = document.getElementById("filter-categorie");

    selectFilter.innerHTML = `<option value="TOUS">Toutes les catégories</option>`;

    Object.values(CATEGORIES).forEach(cat => {
        selectCat.innerHTML += `<option value="${cat}">${cat}</option>`;
        selectFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

// Rendu visuel des carrés ajoutés
function renderCarres() {
    const container = document.getElementById("liste-carres");
    container.innerHTML = "";

    carres.forEach(c => {
        const volume = c.getVolumeLitres();
        // Calcul du volume pour les lasagnes (30% brun, 30% vert, 40% compost/terre)
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

// Rendu visuel du catalogue de plantes
function renderPlantes() {
    const container = document.getElementById("catalogue-plantes");
    const filter = document.getElementById("filter-categorie").value;
    container.innerHTML = "";

    const plantesFiltrees = filter === "TOUS" || !filter
        ? plantes 
        : plantes.filter(p => p.categorie === filter);

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
