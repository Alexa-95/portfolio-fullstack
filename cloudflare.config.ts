import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "portfolio",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
      head_sampling_rate: 1,
    },
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
    },
  }),
});
