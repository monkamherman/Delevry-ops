---
trigger: always_on
description: Développer une plateforme SaaS de suivi de livreurs en temps réel avec optimisation intelligente d'itinéraires, conçue comme une solution modulaire et réutilisable. Objectifs Principaux
---

PROMPT: Développement d'une Plateforme de Suivi de Livreurs en Temps Réel
🎯 CONTEXTE ET OBJECTIFS
Contexte du Projet

Développer une plateforme SaaS de suivi de livreurs en temps réel avec optimisation intelligente d'itinéraires, conçue comme une solution modulaire et réutilisable.
Objectifs Principaux

    Côté Client: Visualisation temps réel, estimations d'arrivée, notifications

    Côté Livreur: Itinéraires optimisés, recalcul dynamique, gestion de tournées

    Architecture: Microservices modulaires avec packages NPM et services hébergés

    Réutilisabilité: SDK et composants installables par d'autres développeurs

🏗️ ARCHITECTURE TECHNIQUE COMPLÈTE
Stack Technologique Recommandée
Frontend (Applications Séparées)
text

React 18 + TypeScript

- Client App: Interface utilisateur finale
- Livreur App: Dashboard livreur
- Admin App: Interface de gestion
  State Management: Zustand/Redux Toolkit
  Cartographie: Leaflet/OpenStreetMap + React-Leaflet
  Styling: Tailwind CSS + Shadcn/UI
  Build Tool: Vite

Backend (Microservices)
text

Node.js + TypeScript + Express
Base de données: MongoDB avec Mongoose
Cache: Redis pour données temps réel
Message Broker: Redis Pub/Sub
Authentification: JWT + bcrypt
Validation: Zod
API: REST + WebSocket

Optimisation et Cartographie
text

Moteur d'optimisation: VROOM + OSRM
Service de directions: OpenRouteService
Cartographie: Leaflet (OpenStreetMap) ou Google Maps API
Géocodage: Nominatim ou Google Geocoding

Infrastructure et Déploiement
text

Conteneurisation: Docker + Docker Compose
Orchestration: Kubernetes (optionnel)
Hébergement: Render.com (services) + Vercel (frontend)
CDN: Cloudflare
Monitoring: Prometheus + Grafana

📁 STRUCTURE DU PROJET DÉTAILLÉE
Architecture des Répertoires
text

livreur-platform/
├── 📦 packages/ # Modules NPM réutilisables
│ ├── @livreur/core-types # Types TypeScript partagés
│ ├── @livreur/utils # Utilitaires et helpers
│ ├── @livreur/api-client # SDK client HTTP
│ ├── @livreur/ws-client # Client WebSocket
│ ├── @livreur/map-components # Composants cartographie
│ ├── @livreur/route-utils # Utilitaires d'optimisation
│ └── @livreur/auth # SDK authentification
├── 🐳 services/ # Microservices hébergés
│ ├── api-gateway/ # Point d'entrée API
│ ├── auth-service/ # Service d'authentification
│ ├── tracking-service/ # Service de tracking temps réel
│ ├── route-service/ # Service d'optimisation d'itinéraires
│ ├── delivery-service/ # Gestion des livraisons
│ ├── notification-service/ # Service de notifications
│ └── user-service/ # Gestion des utilisateurs
├── 🎨 apps/ # Applications frontend
│ ├── web-client/ # Application client final
│ ├── livreur-app/ # Application livreur
│ ├── admin-dashboard/ # Dashboard administrateur
│ └── shared-components/ # Composants UI partagés
├── 📚 docs/ # Documentation
├── 🛠️ scripts/ # Scripts de déploiement
└── 🔧 infrastructure/ # Configuration infrastructure

🔄 PHASES DE DÉVELOPPEMENT DÉTAILLÉES
Phase 1: Setup et Architecture (Semaine 1-2)
1.1. Initialisation du Projet
bash

# Création de la structure avec workspaces

npm create vite@latest livreur-platform -- --template react-ts
cd livreur-platform
npm init -y

# Configuration des workspaces

mkdir packages services apps docs

1.2. Configuration des Outils

    Setup TypeScript configuration partagée

    Configuration ESLint + Prettier

    [ Setup Docker + Docker Compose

    Configuration MongoDB + Redis

    Setup Vite pour les applications frontend

1.3. Architecture de Base

    Définition des interfaces TypeScript partagées

    Configuration de la base de données

    Setup des environnements de développement

Phase 2: Développement des Packages NPM (Semaine 3-4)
2.1. Package Core Types
typescript

// packages/core-types/src/index.ts
export interface Position {
lat: number;
lng: number;
timestamp: Date;
accuracy?: number;
}

export interface Delivery {
id: string;
clientId: string;
livreurId?: string;
status: DeliveryStatus;
addresses: DeliveryAddress[];
optimizedRoute?: OptimizedRoute;
estimatedDuration?: number;
actualDuration?: number;
}

export interface OptimizedRoute {
waypoints: Position[];
totalDistance: number;
estimatedDuration: number;
polyline: string;
steps: RouteStep[];
}

2.2. Package API Client
typescript

// packages/api-client/src/LivreurClient.ts
export class LivreurClient {
private baseURL: string;

constructor(config: ClientConfig) {
this.baseURL = config.baseURL;
}

async trackDelivery(deliveryId: string): Promise<Delivery> {
return this.request(`/deliveries/${deliveryId}/track`);
}

async getETA(deliveryId: string): Promise<number> {
return this.request(`/deliveries/${deliveryId}/eta`);
}
}

2.3. Package Map Components
typescript

// packages/map-components/src/LiveTrackingMap.tsx
export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
delivery,
livePosition,
onPositionUpdate
}) => {
// Implémentation avec Leaflet
};

Phase 3: Développement des Microservices (Semaine 5-8)
3.1. Service d'Authentification

    Implémentation JWT

    Gestion des rôles (client, livreur, admin)

    Middleware d'authentification

    API endpoints sécurisés

3.2. Service de Tracking Temps Réel
typescript

// services/tracking-service/src/SocketManager.ts
export class SocketManager {
handlePositionUpdate(livreurId: string, position: Position): void {
// Stockage Redis
redis.set(`pos:${livreurId}`, JSON.stringify(position));

    // Diffusion WebSocket
    this.io.to(`delivery:${deliveryId}`).emit('position_update', position);

}
}

3.3. Service d'Optimisation d'Itinéraires
typescript

// services/route-service/src/RouteOptimizer.ts
export class RouteOptimizer {
async optimizeDeliveryRoute(
deliveries: Delivery[],
startPosition: Position
): Promise<OptimizedRoute> {
// Intégration VROOM + OSRM
const vroomSolution = await this.callVROOM(deliveries, startPosition);
return this.formatVROOMResponse(vroomSolution);
}
}

Phase 4: Applications Frontend (Semaine 9-12)
4.1. Application Client

    Interface de suivi en temps réel

    Composant de carte avec trajectoire

    Notifications push

    Estimation temps d'arrivée

4.2. Application Livreur

    Dashboard des livraisons

    Carte avec itinéraire optimisé

    Mise à jour statut livraison

    Recalcul automatique itinéraire

4.3. Dashboard Admin

    Gestion des livreurs

    Monitoring des livraisons

    Analytics et rapports

Phase 5: Intégration et Tests (Semaine 13-14)
5.1. Tests Automatisés
typescript

// Tests E2E avec Playwright
test('should track delivery in real-time', async ({ page }) => {
await page.goto('/tracking/delivery-123');
await expect(page.locator('.livreur-marker')).toBeVisible();
});

5.2. Tests de Performance

    Tests de charge sur les WebSockets

    Performance optimisation VROOM

    Tests de montée en charge

Phase 6: Déploiement et Documentation (Semaine 15-16)
6.1. Déploiement des Services
yaml

# docker-compose.prod.yml

services:
api-gateway:
build: ./services/api-gateway
environment: - AUTH_SERVICE_URL=auth-service:3001 - TRACKING_SERVICE_URL=tracking-service:3002
ports: - "80:3000"

6.2. Publication des Packages NPM
json

{
"name": "@livreur/tracking-sdk",
"version": "1.0.0",
"exports": {
".": {
"import": "./dist/index.js",
"types": "./dist/index.d.ts"
}
}
}

📚 DOCUMENTATION À PRODUIRE
Documentation Technique
text

docs/
├── ARCHITECTURE.md # Architecture détaillée
├── API_REFERENCE.md # Référence API complète
├── DEPLOYMENT_GUIDE.md # Guide de déploiement
├── MICROSERVICES.md # Documentation microservices
└── PACKAGES.md # Documentation packages NPM

Documentation Utilisateur
text

guides/
├── GETTING_STARTED.md # Guide de démarrage
├── CLIENT_APP_GUIDE.md # Guide application client
├── LIVREUR_APP_GUIDE.md # Guide application livreur
├── ADMIN_GUIDE.md # Guide administrateur
└── API_INTEGRATION.md # Guide d'intégration API

Documentation Développeur
text

development/
├── SETUP_DEV_ENV.md # Setup environnement dev
├── CONTRIBUTING.md # Guide contribution
├── CODING_STANDARDS.md # Standards de code
└── TESTING_GUIDE.md # Guide des tests

🚀 PLAN DE DÉPLOIEMENT ET HÉBERGEMENT
Environnements

    Development: Docker Compose local

    Staging: Render.com + Vercel Preview

    Production: Render.com (services) + Vercel (frontend) + MongoDB Atlas

Services Hébergés sur Render
text

https://auth.livreur.render.com
https://tracking.livreur.render.com  
https://routes.livreur.render.com
https://api.livreur.render.com (Gateway)

Modules NPM Publiques
text

@livreur/tracking-sdk
@livreur/map-components
@livreur/api-client
@livreur/core-types

🔍 METRICS ET MONITORING
Metrics à Surveiller

    Temps de réponse API

    Concurrence WebSocket

    Performance optimisation VROOM

    Précision estimations ETA

    Taux de livraisons réussies

Alerting

    Disponibilité des services

    Latence anormale

    Erreurs d'optimisation

    Problèmes de connexion temps réel

💡 BONNES PRATIQUES IMPÉRATIVES
Développement

    ✅ Tests unitaires et E2E pour chaque composant

    ✅ Validation des données avec Zod

    ✅ Gestion d'erreurs centralisée

    ✅ Logging structuré

    ✅ Documentation à jour

Performance

    ✅ Cache Redis pour données fréquentes

    ✅ Compression des polyline

    ✅ Lazy loading des composants

    ✅ Optimisation des images cartes

Sécurité

    ✅ Validation input/output

    ✅ Rate limiting sur les APIs

    ✅ HTTPS obligatoire

    ✅ Sanitization des données

🎯 CRITÈRES DE SUCCÈS
Fonctionnels

    Suivi temps réel avec < 2s de latence

    Optimisation itinéraire < 5s

    Recalcul automatique après livraison

    Notifications push fiables

    Interface responsive et intuitive

Techniques

    Tests coverage > 80%

    Documentation complète

    Packages NPM publiés

    Services hébergés et stables

    Monitoring en place

Business

    SDK réutilisable par autres développeurs

    Architecture scalable

    Coûts d'hébergement maîtrisés

    Temps de développement respecté
