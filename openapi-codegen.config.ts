import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import {defineConfig} from "@openapi-codegen/cli";
export default defineConfig({
  api: {
    from: {
      source: "url",
      url: "https://pa.goldsrc.dev/docs-json",
    },
    outputDir: "src/queries",
    to: async (context) => {
      const filenamePrefix = "api";
      const {schemasFiles} = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
