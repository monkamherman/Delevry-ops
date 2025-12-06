import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapContainer } from 'react-leaflet';
import LiveTrackingMap from '../components/LiveTrackingMap';

// Mock des composants enfants
jest.mock('../components/LivreurMarker', () => ({
  __esModule: true,
  default: ({ livreur }: { livreur: any }) => (
    <div data-testid={`livreur-${livreur.id}`} />
  ),
}));

jest.mock('../components/DeliveryMarkers', () => ({
  __esModule: true,
  default: ({ deliveries }: { deliveries: any[] }) => (
    <div data-testid="delivery-markers">
      {deliveries.map((d) => (
        <div key={d.id} data-testid={`delivery-${d.id}`} />
      ))}
    </div>
  ),
}));

jest.mock('../components/RoutePolyline', () => ({
  __esModule: true,
  default: ({ route }: { route: any }) => (
    <div data-testid={`route-${route.id}`} />
  ),
}));

describe('LiveTrackingMap', () => {
  // Configuration de base pour les tests
  const defaultProps = {
    center: [48.8566, 2.3522] as [number, number],
    zoom: 13,
  };

  // Wrapper pour le composant avec MapContainer
  const renderMap = (props = {}) => {
    return render(
      <MapContainer
        center={defaultProps.center}
        zoom={defaultProps.zoom}
        style={{ height: '500px', width: '500px' }}
      >
        <LiveTrackingMap {...defaultProps} {...props} />
      </MapContainer>
    );
  };

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('rendre la carte avec les contrôles par défaut', () => {
    renderMap();
    
    // Vérifier que la carte est rendue
    expect(screen.getByTestId('live-tracking-map')).toBeInTheDocument();
    
    // Vérifier que les contrôles sont présents
    expect(screen.getByRole('button', { name: /me localiser/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zoom avant/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zoom arrière/i })).toBeInTheDocument();
  });

  it('afficher les marqueurs de livreurs', () => {
    const livreurs = [
      { id: '1', name: 'Livreur 1', position: { lat: 48.8566, lng: 2.3522 } },
      { id: '2', name: 'Livreur 2', position: { lat: 48.8666, lng: 2.3622 } },
    ];
    
    renderMap({ livreurs });
    
    // Vérifier que les marqueurs sont rendus
    expect(screen.getByTestId('livreur-1')).toBeInTheDocument();
    expect(screen.getByTestId('livreur-2')).toBeInTheDocument();
  });

  it('afficher les marqueurs de livraisons', () => {
    const deliveries = [
      { id: 'd1', address: 'Adresse 1', position: { lat: 48.8566, lng: 2.3522 } },
      { id: 'd2', address: 'Adresse 2', position: { lat: 48.8666, lng: 2.3622 } },
    ];
    
    renderMap({ deliveries });
    
    // Vérifier que les marqueurs de livraison sont rendus
    const deliveryMarkers = screen.getByTestId('delivery-markers');
    expect(deliveryMarkers).toBeInTheDocument();
    expect(screen.getByTestId('delivery-d1')).toBeInTheDocument();
    expect(screen.getByTestId('delivery-d2')).toBeInTheDocument();
  });

  it('afficher les itinéraires', () => {
    const routes = [
      { id: 'r1', waypoints: [{ lat: 48.8566, lng: 2.3522 }, { lat: 48.8666, lng: 2.3622 }] },
      { id: 'r2', waypoints: [{ lat: 48.8566, lng: 2.3522 }, { lat: 48.8766, lng: 2.3722 }] },
    ];
    
    renderMap({ routes });
    
    // Vérifier que les itinéraires sont rendus
    expect(screen.getByTestId('route-r1')).toBeInTheDocument();
    expect(screen.getByTestId('route-r2')).toBeInTheDocument();
  });

  it('appeler onPositionUpdate lorsque la carte est déplacée', async () => {
    const onPositionUpdate = jest.fn();
    renderMap({ onPositionUpdate, showControls: true });
    
    // Simuler un déplacement de la carte
    const mapContainer = screen.getByTestId('live-tracking-map');
    await userEvent.click(mapContainer);
    
    // Vérifier que le callback a été appelé
    await waitFor(() => {
      expect(onPositionUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: expect.any(Number),
          lng: expect.any(Number),
          timestamp: expect.any(Date),
        })
      );
    });
  });

  it('gérer le clic sur un livreur', async () => {
    const livreurs = [
      { id: '1', name: 'Livreur 1', position: { lat: 48.8566, lng: 2.3522 } },
    ];
    const onLivreurClick = jest.fn();
    
    renderMap({ livreurs, onLivreurClick });
    
    // Simuler un clic sur un livreur
    const livreurMarker = screen.getByTestId('livreur-1');
    await userEvent.click(livreurMarker);
    
    // Vérifier que le callback a été appelé avec le bon livreur
    expect(onLivreurClick).toHaveBeenCalledWith(livreurs[0]);
  });

  it('appeler onDeliveryClick lors du clic sur une livraison', async () => {
    const deliveries = [
      { id: 'd1', address: 'Adresse 1', position: { lat: 48.8566, lng: 2.3522 } },
    ];
    const onDeliveryClick = jest.fn();
    
    renderMap({ deliveries, onDeliveryClick });
    
    // Simuler un clic sur une livraison
    const deliveryMarker = screen.getByTestId('delivery-d1');
    await userEvent.click(deliveryMarker);
    
    // Vérifier que le callback a été appelé avec la bonne livraison
    expect(onDeliveryClick).toHaveBeenCalledWith(deliveries[0]);
  });

  it('appeler onRouteClick lors du clic sur un itinéraire', async () => {
    const routes = [
      { id: 'r1', waypoints: [{ lat: 48.8566, lng: 2.3522 }, { lat: 48.8666, lng: 2.3622 }] },
    ];
    const onRouteClick = jest.fn();
    
    renderMap({ routes, onRouteClick });
    
    // Simuler un clic sur un itinéraire
    const route = screen.getByTestId('route-r1');
    await userEvent.click(route);
    
    // Vérifier que le callback a été appelé avec le bon itinéraire
    expect(onRouteClick).toHaveBeenCalledWith(routes[0]);
  });
});
