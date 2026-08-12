import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Skiper UI registry components. These are pulled in verbatim via
    // `shadcn add @skiper-ui/*` and are overwritten on update, so local lint
    // fixes here would be lost. Code we author against them lives in
    // components/kinetic and components/broadsheet, which are linted normally.
    "components/ui/skiper-ui/**",
  ]),
]);

export default eslintConfig;
