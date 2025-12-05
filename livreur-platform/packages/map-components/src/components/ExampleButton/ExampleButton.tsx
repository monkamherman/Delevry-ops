import React from 'react';
import './ExampleButton.css';

interface ExampleButtonProps {
  /**
   * Le texte à afficher sur le bouton
   */
  label: string;
  /**
   * La couleur de fond du bouton
   */
  backgroundColor?: string;
  /**
   * La taille du bouton
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Gestionnaire de clic
   */
  onClick?: () => void;
}

/**
 * Un bouton d'exemple pour tester Storybook
 */
export const ExampleButton = ({
  label,
  backgroundColor = '#3b82f6',
  size = 'medium',
  ...props
}: ExampleButtonProps) => {
  return (
    <button
      type="button"
      className={`example-button ${size}`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

export default ExampleButton;
