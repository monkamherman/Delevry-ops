// Déclaration de type pour @storybook/addon-styling
declare module '@storybook/addon-styling' {
  import { ReactNode } from 'react';
  import { ThemeProviderProps } from 'styled-components';

  export interface ThemeProviderType {
    themes: {
      [key: string]: unknown;
    };
    defaultTheme: string;
    children?: ReactNode;
  }

  export function withThemeFromJSXProvider<Theme = any>({
    themes,
    defaultTheme,
    Provider = ThemeProvider,
    GlobalStyles,
  }: {
    themes: {
      [key: string]: Theme;
    };
    defaultTheme: string;
    Provider?: React.ComponentType<ThemeProviderProps<Theme>>;
    GlobalStyles?: React.ComponentType<{ theme?: Theme }>;
  }): (Story: React.ComponentType) => JSX.Element;
}
