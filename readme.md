# 🌱 Mon Potager en Lasagne

Application web de gestion écoresponsable de potager en carrés (méthode lasagne), avec associations de plantes, calendrier de croissance basé sur les degrés-jours, et alertes météo/sanitaires personnalisées.

## Fonctionnalités

- **Carrés adaptatifs** : grille dynamique (2×2 à 5×5) calculée selon les dimensions réelles du carré et l'espacement optimal des plantes.
- **Catalogue de plantes** : 25+ plantes avec semis, repiquage, vulnérabilités, associations bénéfiques — extensible via formulaire, classé par catégorie dans un menu déroulant.
- **Assistant de plantation** : vérifie l'ensoleillement disponible, l'espacement minimal entre voisins, et suggère des associations (base de connaissance + associations manuelles enrichissables depuis l'interface).
- **Calendrier de récolte** : estimation par degrés-jours de croissance (GDD), propre à chaque plante et à sa météo réelle depuis sa mise en terre — pas une date calendaire fixe.
- **Météo à 3 jours** : températures, pluie, humidité, vent (Open-Meteo), avec un bandeau d'alerte anticipée (gel, canicule, vent fort) et des recommandations d'arrosage/traitement par plante.
- **Zone climatique** : ajustement automatique des périodes de plantation selon la latitude détectée.

## Stockage

Toutes les données (carrés, catalogue, associations, zone climatique) sont sauvegardées dans le `localStorage` du navigateur — aucun serveur, aucune donnée envoyée ailleurs que vers l'API météo Open-Meteo (position GPS uniquement, pour les prévisions).

## Fichiers

- `index.html` — structure de la page
- `app.js` — logique complète de l'application
- `style.css` — mise en forme

## Utilisation

Ouvrez `index.html` dans un navigateur. Autorisez la géolocalisation pour des dates de plantation et une météo ajustées à votre position.
