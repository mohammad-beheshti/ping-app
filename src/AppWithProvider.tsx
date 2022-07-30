import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import App from './App';
import { ToggleColorScheme } from './components/ToggleColorScheme';

export const AppWithProvider = () => {
  const preferredColorScheme = useColorScheme();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  useHotkeys([['mod+J', () => toggleColorScheme()]]);
  return (
    <StrictMode>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ToggleColorScheme />
          <App />
        </MantineProvider>
      </ColorSchemeProvider>
    </StrictMode>
  );
};

