import React, { useEffect, useRef } from 'react';
import { Polyline as LeafletPolyline } from 'react-leaflet';
import { PolylineProps } from '../types';

const Polyline: React.FC<PolylineProps> = ({
  positions,
  color = '#3388ff',
  weight = 3,
  opacity = 1,
  dashArray = null,
  lineCap = 'round',
  lineJoin = 'round',
  className = '',
  onClick,
}) => {
  const polylineRef = useRef<L.Polyline>(null);

  useEffect(() => {
    if (polylineRef.current && onClick) {
      polylineRef.current.on('click', onClick);
      return () => {
        if (polylineRef.current) {
          polylineRef.current.off('click', onClick);
        }
      };
    }
  }, [onClick]);

  return (
    <LeafletPolyline
      pathOptions={{
        color,
        weight,
        opacity,
        lineCap,
        lineJoin,
        dashArray,
        className,
      }}
      positions={positions}
      ref={polylineRef}
    />
  );
};

export default Polyline;
