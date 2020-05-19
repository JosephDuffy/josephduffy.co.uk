module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    "plugin:react/recommended",
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    "plugin:prettier/recommended",
  ],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
  },
  rules: {
    "react/react-in-jsx-scope": "off", // React is imported by Next.js
  }
}
