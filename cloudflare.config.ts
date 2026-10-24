import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "portfolio",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    workersDev: true,
    previewUrls: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    domains: ["datenshi.dev", "www.datenshi.dev"],
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      SITE_URL: bindings.text("https://datenshi.dev"),

      TURNSTILE_EXPECTED_HOSTNAME: bindings.text("datenshi.dev"),

      TURNSTILE_SECRET_KEY: bindings.secret(),

      UPSTASH_REDIS_REST_URL: bindings.text(
        "https://modest-hamster-43752.upstash.io",
      ),

      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),

      GMAIL_ADDRESS: bindings.secret(),
      GMAIL_TO: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      GOOGLE_REFRESH_TOKEN: bindings.secret(),

      CONTACT_WORKER_URL: bindings.text("https://datenshi.dev"),

      CONTACT_WORKER_SECRET: bindings.secret(),

      NEXT_PUBLIC_SITE_URL: bindings.text("https://datenshi.dev"),

      NEXT_PUBLIC_TURNSTILE_SITE_KEY: bindings.text("0x4AAAAAAFiy4359HfuGNaGN"),
    },
  }),
});
