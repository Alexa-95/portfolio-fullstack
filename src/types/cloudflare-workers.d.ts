// Minimal typing for the Workers runtime module; route.ts narrows `env` itself.
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}
