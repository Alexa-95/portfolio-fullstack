import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "portfolio",
    entrypoint: "vinext/server/fetch-handler",

    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],

    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },

    env: {
      // Existing Cloudflare bindings
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      // Public server configuration
      SITE_URL: bindings.text("https://portfolio.sobanska.workers.dev"),

      TURNSTILE_EXPECTED_HOSTNAME: bindings.text(
        "portfolio.sobanska.workers.dev",
      ),

      // Fill in the real email Worker URL
      CONTACT_WORKER_URL: bindings.text(
        "https://YOUR-EMAIL-WORKER.workers.dev",
      ),

      // Fill in your actual Upstash REST endpoint
      UPSTASH_REDIS_REST_URL: bindings.text(
        "https://YOUR-UPSTASH-ENDPOINT.upstash.io",
      ),

      // Secrets - values are stored in Cloudflare,
      // not in this file
      TURNSTILE_SECRET_KEY: bindings.secret(),

      CONTACT_WORKER_SECRET: bindings.secret(),

      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),
    },

    observability: {
      enabled: true,
    },
  }),
});
