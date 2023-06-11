import "@/styles/globals.css";
import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import "@fontsource/spline-sans-mono";
import { ChainProvider } from "@/lib/promptContext";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({ config });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ChainProvider>
        <Component {...pageProps} />
      </ChainProvider>
    </ChakraProvider>
  );
}
