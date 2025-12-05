import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../src/styles/global';

declare module '@storybook/react' {
  interface Parameters {
    theme?: 'light' | 'dark';
  }
}

// Configuration du thème par défaut
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    text: '#111827',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Configuration pour les tests d'accessibilité
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    // Configuration pour les viewports
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
  decorators: [
    (Story, context) => {
      const currentTheme = context.parameters.theme || 'light';
      const themeToUse = currentTheme === 'dark' 
        ? { ...theme, colors: { ...theme.colors, background: '#1f2937', text: '#f9fafb' } }
        : theme;
      
      return (
        <ThemeProvider theme={themeToUse}>
          <GlobalStyles />
          <div style={{ margin: '1rem' }}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
