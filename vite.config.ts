import { defineConfig as viteDefineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig as lovableDefineConfig } from "@lovable.dev/vite-tanstack-config";

// In the Lovable sandbox we run as a TanStack Start SSR app on Cloudflare Workers.
// For local builds targeting GitHub Pages, we emit a static SPA into dist/
// under the repository base path "/health-flow-sim/".
const isSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

const sharedPlugins = [
  tsconfigPaths(),
  TanStackRouterVite({
    target: "react",
    autoCodeSplitting: true,
    routesDirectory: "./src/routes",
    generatedRouteTree: "./src/routeTree.gen.ts",
    codeSplittingOptions: {
      addHmr: false,
    },
  }),
  tailwindcss(),
];

const sandboxConfig = lovableDefineConfig({
  plugins: sharedPlugins,
});

const staticSpaConfig = viteDefineConfig(({ command }) => ({
  base: command === "build" ? "/health-flow-sim/" : "/",
  plugins: [...sharedPlugins, react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));

export default isSandbox ? sandboxConfig : staticSpaConfig;
