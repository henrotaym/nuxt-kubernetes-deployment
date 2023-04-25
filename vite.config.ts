import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vue(),
      eslint(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      lib: {
        entry: "src/lib/index.ts",
        fileName: "index",
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
        },
      },
      sourcemap: true,
    },
    server: {
      host: true,
      port: parseInt(process.env.VITE_PORT), // This is the port which we will use in docker
    },
  });
};
