---
trigger: manual
---

Packages NPM (PHASE 1)

@livreur/core-types
Définition des types partagés
Modèles de données (Delivery, Livreur, etc.)
Événements WebSocket
Enums et constantes

@livreur/utils (en cours)
Fonctions utilitaires de date (businessDays.ts)
Fonctions de géolocalisation
Validation des données
Tests unitaires en cours

@livreur/auth
Structure de base du package d'authentification
À implémenter : logique d'authentification

@livreur/api-client
Structure de base du client API
À implémenter : logique des appels HTTP

@livreur/ws-client
Structure de base du client WebSocket
À impléter : gestion des connexions temps réel

@livreur/map-components
Structure de base pour les composants de carte
À implémenter : composants React pour l'affichage cartographique

@livreur/route-utils
Structure de base pour l'optimisation d'itinéraires
À implémenter : logique d'optimisation
Applications (PHASE 3 - partiellement démarrée)
web-client (client final)
Structure de base créée
À implémenter : interface utilisateur
livreur-app (application livreur)
Structure de base créée
À implémenter : interface livreur
admin-dashboard (administration)
Structure de base créée
À implémenter : tableau de bord d'administration
Services Backend (PHASE 2 - à démarrer)
Aucun service backend n'est encore implémenté dans le dossier services/. Les prochaines étapes devraient inclure :

Service d'authentification
Service de tracking temps réel
Service d'optimisation d'itinéraire
Service de gestion des livraisons
Prochaines étapes recommandées
Priorité haute : Compléter les tests unitaires de @livreur/utils
Priorité moyenne : Démarrer l'implémentation du service d'authentification
Priorité basse : Avancer sur les interfaces utilisateur des applications
