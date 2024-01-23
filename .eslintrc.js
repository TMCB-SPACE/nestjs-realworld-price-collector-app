module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@darraghor/nestjs-typed',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:@darraghor/nestjs-typed/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    "node": true,
    "jest": true,
    "es2021": true
  },
  ignorePatterns: [
    'test',
    'dist',
    'public',
    '.eslintrc.js'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // @darraghor/nestjs-typed/recommended
    '@darraghor/nestjs-typed/api-methods-should-be-guarded': 'off',
    '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
    '@darraghor/nestjs-typed/api-method-should-specify-api-response': 'error',
    '@darraghor/nestjs-typed/sort-module-metadata-arrays': 'error',

    // @typescript-eslint/strict
    '@typescript-eslint/no-extraneous-class': 'off',
  },
  settings: {
    "node": {
      "allowModules": ["express"],
    },
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".ts",
        ],
        "paths": [
          "src"
        ]
      }
    },
    "import/extensions": [
      ".js",
      ".ts",
    ],
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".js",
        ".ts",
      ]
    }
  },
};
