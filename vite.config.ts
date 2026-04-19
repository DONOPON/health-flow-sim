import { defineConfig as viteDefineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig as lovableDefineConfig } from "@lovable.dev/vite-tanstack-config";

// In the Lovable sandbox we run as a TanStack Start SSR app on Cloudflare Workers
// (the sandbox proxy expects this). For local builds (GitHub Pages) we emit a
// pure static SPA into dist/ under base "/health-flow-sim/".
const isSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

const sharedPlugins = [
  tsconfigPaths(),
  TanStackRouterVite({
    target: "react",
    autoCodeSplitting: true,
    routesDirectory: "./src/routes",
    generatedRouteTree: "./src/routeTree.gen.ts",
  }),
  tailwindcss(),
];

const sandboxConfig = lovableDefineConfig({
  plugins: sharedPlugins,
});

const staticSpaConfig = viteDefineConfig(({ command }) => ({
  base: command === "build" ? "/portal-salud/" : "/",
  plugins: [...sharedPlugins, react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));

export default isSandbox ? sandboxConfig : staticSpaConfig;
