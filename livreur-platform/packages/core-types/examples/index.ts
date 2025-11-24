// Exemple d'utilisation des modèles du package @livreur/core-types

// Import des modèles
import { Position } from '../src/models/position';
import { 
  Livreur, 
  LivreurStatus,
  CreateLivreurDto,
  UpdateLivreurDto 
} from '../src/models/livreur';

// Import des interfaces de pagination
import { 
  PaginatedResponse, 
  PaginationOptions 
} from '../src/interfaces/pagination';

/**
 * Exemple d'utilisation du modèle Position
 */
function exemplePosition(): void {
  console.log('=== Exemple Position ===');
  
  // Création d'une position
  const position: Position = {
    latitude: 48.8566,
    longitude: 2.3522,
    accuracy: 10,
    timestamp: new Date().toISOString(),
    altitude: 35,
    speed: 5.5,
    heading: 180
  };
  
  console.log('Position actuelle:', position);
  console.log('Latitude:', position.latitude);
  console.log('Longitude:', position.longitude);
  console.log('Précision (mètres):', position.accuracy);
  console.log('Horodatage:', position.timestamp);
  console.log('\n');
}

/**
 * Exemple d'utilisation du modèle Livreur
 */
function exempleLivreur(): void {
  console.log('=== Exemple Livreur ===');
  
  // Création d'un DTO pour un nouveau livreur
  const newLivreur: CreateLivreurDto = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33612345678',
    vehicle: {
      type: 'scooter',
      identifier: 'AB-123-CD',
      capacity: 50
    }
  };

  // Simulation d'un livreur existant
  const livreur: Livreur = {
    id: 'liv-12345',
    ...newLivreur,
    status: LivreurStatus.AVAILABLE,
    currentPosition: {
      latitude: 48.8566,
      longitude: 2.3522,
      timestamp: new Date().toISOString(),
      accuracy: 10,
      altitude: 35,
      speed: 5.5,
      heading: 180
    },
    isActive: true,
    createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Livreur créé:', `${livreur.firstName} ${livreur.lastName}`);
  console.log('Statut:', livreur.status);
  console.log('Véhicule:', `${livreur.vehicle.type}${livreur.vehicle.identifier ? ` (${livreur.vehicle.identifier})` : ''}`);
  console.log('Position actuelle:', livreur.currentPosition);
  console.log('\n');
}

/**
 * Exemple d'utilisation de la pagination
 */
function exemplePagination(): void {
  console.log('=== Exemple Pagination ===');
  
  // Options de pagination
  const page = 1;
  const limit = 10;
  
  // Réponse paginée simulée
  const paginatedResponse: PaginatedResponse<Livreur> = {
    data: [
      {
        id: 'liv-12345',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33612345678',
        status: LivreurStatus.AVAILABLE,
        vehicle: {
          type: 'scooter',
          identifier: 'AB-123-CD',
          capacity: 50
        },
        isActive: true,
        createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    total: 1,
    page,
    limit,
    totalPages: 1
  };
  
  // Options de pagination pour l'affichage
  const paginationOptions = { page, limit };
  
  console.log('Options de pagination:', paginationOptions);
  console.log('Réponse paginée:', {
    items: paginatedResponse.data.length,
    total: paginatedResponse.total,
    page: paginatedResponse.page,
    totalPages: paginatedResponse.totalPages
  });
  console.log('Premier élément:', {
    id: paginatedResponse.data[0].id,
    name: `${paginatedResponse.data[0].firstName} ${paginatedResponse.data[0].lastName}`,
    status: paginatedResponse.data[0].status
  });
  console.log('\n');
}

/**
 * Exemple de mise à jour d'un livreur
 */
function exempleUpdateLivreur(): void {
  console.log('=== Exemple Mise à jour Livreur ===');
  
  // Données de mise à jour
  const updateData: UpdateLivreurDto = {
    status: LivreurStatus.ON_DELIVERY,
    vehicle: {
      identifier: 'AB-123-CD',
      capacity: 45
    },
    isActive: true
  };
  
  console.log('Données de mise à jour:', updateData);
  console.log('Statut mis à jour:', updateData.status);
  console.log('Capacité du véhicule mise à jour:', updateData.vehicle?.capacity);
  console.log('\n');
}

/**
 * Exemple de filtrage de livreurs
 */
function exempleFiltrageLivreurs(): void {
  console.log('=== Exemple Filtrage Livreurs ===');
  
  const filters = {
    status: LivreurStatus.AVAILABLE,
    vehicleType: 'scooter',
    isActive: true,
    search: 'Dupont'
  };
  
  console.log('Filtres appliqués:');
  console.log('- Statut:', filters.status);
  console.log('- Type de véhicule:', filters.vehicleType);
  console.log('- Uniquement actifs:', filters.isActive);
  console.log('- Recherche:', filters.search);
  
  // Simulation d'une requête filtrée
  const queryString = new URLSearchParams();
  if (filters.status) queryString.append('status', filters.status);
  if (filters.vehicleType) queryString.append('vehicleType', filters.vehicleType);
  if (filters.isActive !== undefined) queryString.append('isActive', String(filters.isActive));
  if (filters.search) queryString.append('search', filters.search);
  
  console.log('\nRequête API générée:');
  console.log(`GET /api/livreurs?${queryString.toString()}`);
  console.log('\n');
}

// Exécution des exemples
function runExamples(): void {
  console.log('=== Démonstration des modèles @livreur/core-types ===\n');
  
  exemplePosition();
  exempleLivreur();
  exempleUpdateLivreur();
  exemplePagination();
  exempleFiltrageLivreurs();
  
  console.log('=== Fin de la démonstration ===');
}

// Exécution du script
runExamples();
