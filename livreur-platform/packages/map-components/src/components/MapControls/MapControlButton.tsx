import React, { memo } from 'react';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';

interface MapControlButtonProps {
  /**
   * Icône ou texte à afficher dans le bouton
   */
  icon: string;
  
  /**
   * Fonction appelée lors du clic sur le bouton
   */
  onClick: () => void;
  
  /**
   * Texte d'aide au survol
   */
  title: string;
  
  /**
   * Désactive le bouton
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Classe CSS personnalisée
   */
  className?: string;
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 2px 0;
  padding: 0;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f4f4f4;
    border-color: #999;
  }
  
  &:active {
    background-color: #e8e8e8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Bouton de contrôle pour la carte
 * 
 * @example
 * ```tsx
 * <MapControlButton 
 *   icon="+" 
 *   onClick={() => console.log('Zoom in')} 
 *   title="Zoom avant"
 * />
 * ```
 */
export const MapControlButton: React.FC<MapControlButtonProps> = memo(({ 
  icon, 
  onClick, 
  title, 
  disabled = false,
  className = ''
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`leaflet-control-zoom-${title.toLowerCase().replace(/\s+/g, '-')} ${className}`}
      aria-label={title}
    >
      {icon}
    </Button>
  );
});

MapControlButton.displayName = 'MapControlButton';

export default MapControlButton;
