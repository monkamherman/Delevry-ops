import React, { useEffect, useRef, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContext } from '../context';
import { MapContainerProps } from '../types';

// Correction pour le problème de marqueurs manquants dans React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;

const MapContainer: React.FC<MapContainerProps> = ({
  center,
  zoom = 13,
  style = { height: '100%', width: '100%' },
  className = '',
  children,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(mapRef.current);
    }
  }, [map]);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      <div style={style} className={className}>
        <LeafletMap
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {children}
        </LeafletMap>
      </div>
    </MapContext.Provider>
  );
};

export default MapContainer;
