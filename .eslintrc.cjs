/* eslint-env node */
module.exports = {
  root: true,

  // Typed linting for TS source files
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint', 'import', 'sonarjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'prettier',
  ],

  // Don’t waste cycles on build outputs and config files here; we handle them in overrides.
  ignorePatterns: ['dist/', 'node_modules/', '*.d.ts'],

  overrides: [
    // Allow plain JS/CJS config files without TS project linkage
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      // Use the default ESLint parser (Espree) instead of @typescript-eslint/parser
      parser: null,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script', // CJS
      },
      env: { node: true },
      extends: ['eslint:recommended', 'prettier'],
      rules: {},
    },
    // Your TypeScript files keep the typed rules
    {
      files: ['**/*.ts'],
      rules: {
        // put any TS-only rule tweaks here
      },
    },
  ],
};
