import { defineConfig } from "@solidjs/start/config";

const hmrPorts = {
  client: 4440,
  server: 4441,
  "server-function": 4442,
};

export default defineConfig({
  server: {
    preset: "cloudflare-pages",

    rollupConfig: {
      external: ["node:async_hooks"],
    },
  },
  // Fix Vite HMR for Devcontainer
  // Ref: https://github.com/solidjs/solid-start/discussions/1355
  vite: ({ router }) => ({
    server: {
      hmr: {
        port: hmrPorts[router],
      },
    },
  }),
  // Add middleware to inject cloudfare locally
  middleware: "./src/lib/cloudfare.ts",
});
