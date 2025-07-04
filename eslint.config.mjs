import { defineConfig, globalIgnores } from "eslint/config"

import tsParser from "@typescript-eslint/parser"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import react from "eslint-plugin-react"
import globals from "globals"
import js from "@eslint/js"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,

      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
    },

    extends: compat.extends(
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "next",
      "plugin:@next/next/recommended",
    ),

    settings: {
      react: {
        pragma: "React",
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    "**/node_modules",
    "**/.lighthouseci",
    "**/.next",
    "**/out",
    "**/next.config.js",
    "**/public",
  ]),
])
