import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

// vinext's `experimental.inlineCss` only injects its CSS manifest into dist/server/index.js,
// but the Cloudflare plugin writes the worker elsewhere, so the stylesheet stayed a
// render-blocking <link>. Inject the same manifest into the actual worker entry.
function inlineCssIntoWorker(): Plugin {
  const marker = "globalThis.__VINEXT_INLINE_CSS__ = ";
  return {
    name: "inline-css-into-worker",
    apply: "build",
    enforce: "post",
    closeBundle: {
      sequential: true,
      order: "post",
      handler() {
        if (this.environment?.name !== "client") return;
        const config = this.environment.getTopLevelConfig();
        const clientDir = path.resolve(config.root, this.environment.config.build.outDir);
        const workerDir = config.environments.rsc?.build.outDir;
        if (!workerDir) return;
        const entry = path.resolve(config.root, workerDir, "index.js");
        if (!fs.existsSync(entry)) return;
        const code = fs.readFileSync(entry, "utf8");
        if (code.includes(marker)) return;

        const manifest: Record<string, string> = {};
        const walk = (dir: string) => {
          for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const file = path.join(dir, e.name);
            if (e.isDirectory()) walk(file);
            else if (e.name.endsWith(".css"))
              manifest["/" + path.relative(clientDir, file).split(path.sep).join("/")] =
                fs.readFileSync(file, "utf8");
          }
        };
        walk(clientDir);
        if (Object.keys(manifest).length === 0) return;
        fs.writeFileSync(entry, `${marker}${JSON.stringify(manifest)};\n${code}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    vinext({
      images: {
        optimizer: imagesOptimizer(),
      },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
    inlineCssIntoWorker(),
  ],
});
