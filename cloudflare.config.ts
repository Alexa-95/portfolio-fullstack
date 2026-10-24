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

      // Cloudflare Email Service: the binding may only send form@ -> contact@.
      // contact@ is forwarded to Gmail by Email Routing.
      EMAIL: bindings.sendEmail({
        allowedSenderAddresses: ["form@datenshi.dev"],
        allowedDestinationAddresses: ["contact@datenshi.dev"],
      }),
      EMAIL_FROM: bindings.text("form@datenshi.dev"),
      EMAIL_TO: bindings.text("contact@datenshi.dev"),

      NEXT_PUBLIC_SITE_URL: bindings.text("https://datenshi.dev"),

      NEXT_PUBLIC_TURNSTILE_SITE_KEY: bindings.text("0x4AAAAAAFiy4359HfuGNaGN"),
    },
  }),
});
