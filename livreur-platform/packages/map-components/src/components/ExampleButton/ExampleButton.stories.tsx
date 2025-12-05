import type { Meta, StoryObj } from '@storybook/react';
import ExampleButton from './ExampleButton';

// Configuration du composant dans Storybook
const meta = {
  title: 'Example/Button',
  component: ExampleButton,
  parameters: {
    // Options pour les contrôles dans l'interface de Storybook
    controls: { expanded: true },
  },
  // Définition des propriétés par défaut
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof ExampleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Histoires (variantes) du composant

export const Primary: Story = {
  args: {
    label: 'Bouton',
    backgroundColor: '#3b82f6',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    backgroundColor: '#6b7280',
  },
};

export const Large: Story = {
  args: {
    ...Primary.args,
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'small',
  },
};
