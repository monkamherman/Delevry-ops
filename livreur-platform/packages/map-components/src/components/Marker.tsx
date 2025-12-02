import React, { useEffect, useRef } from 'react';
import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MarkerProps } from '../types';

// Configuration des icônes par défaut
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Marker: React.FC<MarkerProps> = ({
  position,
  icon = defaultIcon,
  draggable = false,
  title = '',
  onClick,
  onDragEnd,
  children,
}) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current && onClick) {
      markerRef.current.on('click', onClick);
    }

    if (markerRef.current && onDragEnd) {
      markerRef.current.on('dragend', onDragEnd);
    }

    return () => {
      if (markerRef.current) {
        if (onClick) {
          markerRef.current.off('click', onClick);
        }
        if (onDragEnd) {
          markerRef.current.off('dragend', onDragEnd);
        }
      }
    };
  }, [onClick, onDragEnd]);

  return (
    <LeafletMarker
      position={position}
      icon={icon}
      draggable={draggable}
      ref={markerRef}
    >
      {children || (title && <Popup>{title}</Popup>)}
    </LeafletMarker>
  );
};

export default Marker;
