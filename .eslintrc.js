module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  env: {
    browser: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off", // React is imported by Next.js
  },
}
