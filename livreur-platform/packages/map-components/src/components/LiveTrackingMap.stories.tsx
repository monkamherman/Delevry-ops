import type { Meta, StoryObj } from '@storybook/react';
import { LiveTrackingMap } from './LiveTrackingMap';
import { Delivery, Livreur, Route } from '../types';

// Données de démonstration
const mockDeliveries: Delivery[] = [
  {
    id: 'delivery-1',
    position: { lat: 48.8566, lng: 2.3522 },
    status: 'pending',
    address: '10 Rue de la Paix, 75002 Paris',
    recipientName: 'Jean Dupont',
  },
  {
    id: 'delivery-2',
    position: { lat: 48.8584, lng: 2.2945 },
    status: 'in-progress',
    address: 'Tour Eiffel, Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
  },
];

const mockLivreurs: Livreur[] = [
  {
    id: 'livreur-1',
    name: 'Thomas Martin',
    position: { lat: 48.8534, lng: 2.3488 },
    status: 'on-delivery',
    vehicleType: 'bike',
    lastUpdated: new Date(),
    currentDeliveryId: 'delivery-2',
  },
  {
    id: 'livreur-2',
    name: 'Sophie Bernard',
    position: { lat: 48.8575, lng: 2.3515 },
    status: 'available',
    vehicleType: 'scooter',
    lastUpdated: new Date(),
  },
];

const mockRoute: Route = {
  id: 'route-1',
  segments: [
    {
      from: { lat: 48.8534, lng: 2.3488 },
      to: { lat: 48.8584, lng: 2.2945 },
      distance: 4200,
      duration: 900,
      instructions: 'Prendre à droite sur Rue de Rivoli',
    },
  ],
  totalDistance: 4200,
  totalDuration: 900,
  waypoints: [
    [48.8534, 2.3488],
    [48.8584, 2.2945],
  ],
  polyline: JSON.stringify([
    [48.8534, 2.3488],
    [48.8535, 2.35],
    [48.854, 2.36],
    [48.855, 2.37],
    [48.856, 2.38],
    [48.857, 2.29],
    [48.8584, 2.2945],
  ]),
};

const meta: Meta<typeof LiveTrackingMap> = {
  title: 'Components/LiveTrackingMap',
  component: LiveTrackingMap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Une carte interactive pour le suivi en temps réel des livreurs et des livraisons.',
      },
    },
  },
  argTypes: {
    center: {
      control: 'object',
      description: 'Centre initial de la carte [lat, lng]',
      defaultValue: [48.8566, 2.3522],
    },
    zoom: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Niveau de zoom initial',
      defaultValue: 13,
    },
    onPositionUpdate: { action: 'positionUpdated' },
    onDeliveryClick: { action: 'deliveryClicked' },
    onLivreurClick: { action: 'livreurClicked' },
    onRouteClick: { action: 'routeClicked' },
  },
};

export default meta;
type Story = StoryObj<typeof LiveTrackingMap>;

export const Default: Story = {
  args: {
    center: [48.8566, 2.3522],
    zoom: 13,
    deliveries: mockDeliveries,
    livreurs: mockLivreurs,
    routes: [mockRoute],
  },
};

export const WithCustomStyle: Story = {
  args: {
    ...Default.args,
    style: { height: '500px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px' },
    className: 'shadow-md',
  },
};

export const WithControls: Story = {
  args: {
    ...Default.args,
    showControls: true,
    minZoom: 10,
    maxZoom: 18,
    zoomControl: true,
    scrollWheelZoom: true,
  },
};

export const EmptyState: Story = {
  args: {
    center: [48.8566, 2.3522],
    zoom: 13,
    deliveries: [],
    livreurs: [],
    routes: [],
  },
};
