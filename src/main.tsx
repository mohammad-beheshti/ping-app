import {useState, StrictMode} from "react";
import ReactDOM from "react-dom/client";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  ActionIcon,
  useMantineColorScheme,
  Center,
} from "@mantine/core";
import {useColorScheme, useLocalStorage, useHotkeys} from "@mantine/hooks";
import {IconSun, IconMoonStars} from "@tabler/icons";
import App from "./App";
function ToggleColorScheme() {
  const {colorScheme, toggleColorScheme} = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div style={{position: "absolute", left: "5px"}}>
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
        my="xs"
      >
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
    </div>
  );
}
const AppWithProvider = () => {
  const preferredColorScheme = useColorScheme();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return (
    <StrictMode>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{colorScheme}}
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppWithProvider />,
);
