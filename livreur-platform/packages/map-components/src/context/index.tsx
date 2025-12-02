import React, { createContext, useContext } from 'react';
import { Map } from 'leaflet';

export interface MapContextType {
  map: Map | null;
  setMap: (map: Map) => void;
}

export const MapContext = createContext<MapContextType>({
  map: null,
  setMap: () => {},
});

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
