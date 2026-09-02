// =================================================================
// 1. CONFIGURATION & CATALOGUE COMPLET
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
        return (this.longueur * this.largeur) / 10000; // Surface en m²
    }

    getVolumeLitres() {
        return (this.longueur * this.largeur * this.hauteur) / 1000; // Volume en Litres
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

// Tolérance d'exposition : associe l'orientation du carré aux besoins solaires tolérés
const COMPATIBILITE_EXPOSITION = {
    "SUD": ["SUD", "MI_OMBRE"],
    "SUD_OUEST": ["SUD", "MI_OMBRE"],
    "SUD_EST": ["SUD", "MI_OMBRE"], // Le Sud-Est accepte les légumes-fruits (7-8h de soleil estival)
    "OUEST": ["SUD", "MI_OMBRE"],
    "EST": ["MI_OMBRE", "OMBRE"],
    "NORD": ["OMBRE", "MI_OMBRE"]
};

// Catalogue initial de plantes
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
    { id: "feve", nom: "Fève", categorie: CATEGORIES.LEGUMINEUSE, besoinSoleil: "SUD" },
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
    { id: "oeillet_inde", nom: "Œillet d'Inde", categorie: CATEGORIES.
