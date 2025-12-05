import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Réinitialisation des styles par défaut */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Styles de base pour le body */
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors?.text || '#111827'};
    background-color: ${({ theme }) => theme.colors?.background || '#ffffff'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Styles pour les liens */
  a {
    color: ${({ theme }) => theme.colors?.primary || '#3b82f6'};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  /* Styles pour les boutons */
  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

// Types pour le thème
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      background: string;
      text: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
  }
}
