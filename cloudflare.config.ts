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
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),

      SITE_URL: bindings.text("https://portfolio.sobanska.workers.dev"),

      TURNSTILE_EXPECTED_HOSTNAME: bindings.text(
        "portfolio.sobanska.workers.dev",
      ),

      TURNSTILE_SECRET_KEY: bindings.secret(),

      UPSTASH_REDIS_REST_URL: bindings.text(
        "https://modest-hamster-43752.upstash.io",
      ),

      UPSTASH_REDIS_REST_TOKEN: bindings.secret(),

      GMAIL_ADDRESS: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      GOOGLE_REFRESH_TOKEN: bindings.secret(),

      CONTACT_WORKER_URL: bindings.text(
        "https://portfolio.sobanska.workers.dev",
      ),

      CONTACT_WORKER_SECRET: bindings.secret(),

      NEXT_PUBLIC_SITE_URL: bindings.text(
        "https://portfolio.sobanska.workers.dev",
      ),

      NEXT_PUBLIC_TURNSTILE_SITE_KEY: bindings.text("0x4AAAAAAFiy4359HfuGNaGN"),
    },
  }),
});
