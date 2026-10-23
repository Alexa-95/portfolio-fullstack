import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

export default defineConfig(({ command }) => {
  const isProductionBuild = command === "build";

  return {
    plugins: [
      vinext({
        ...(isProductionBuild
          ? {
              images: {
                optimizer: imagesOptimizer(),
              },
            }
          : {}),
      }),

      ...(isProductionBuild
        ? [
            cloudflare({
              viteEnvironment: {
                name: "rsc",
                childEnvironments: ["ssr"],
              },
            }),
          ]
        : []),
    ],
  };
});
