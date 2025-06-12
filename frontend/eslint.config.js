import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: pluginPrettier,
    },
    rules: {
      // ------------ React 관련 규칙 ------------
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "error",
      "prettier/prettier": "warn",

      // ------------ 코드 품질 규칙 ------------
      "no-empty": "error",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      eqeqeq: ["error", "always"],
      "no-cond-assign": ["error", "always"],
      "no-constant-condition": "error",
      "no-self-compare": "error",
      "no-use-before-define": "error",
      "no-multi-assign": "error",
      "max-depth": ["error", 4],

      // ------------ 코드 스타일 규칙 ------------
      quotes: ["error", "double"],
      "eol-last": ["error", "always"],
      "no-trailing-spaces": "error",
      curly: "error",
      "no-lonely-if": "error",
      yoda: "error",
      "func-style": ["error", "expression"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "arrow-parens": ["warn", "always"],
      "array-bracket-spacing": ["error", "never"],
      camelcase: ["error", { properties: "never" }],

      // ------------ ES6+ 관련 규칙 ------------
      "prefer-const": "error",
      "no-var": "error",
      "prefer-template": "warn",
      "prefer-destructuring": ["warn", { array: true, object: true }],
      "prefer-spread": "warn",

      // ------------ TypeScript 관련 규칙 ------------
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // ------------ import 관련 규칙 ------------
      "no-duplicate-imports": "error",
      "import/no-self-import": "error",
      "import/no-cycle": "error",
      "import/no-unused-modules": "error",
      "import/first": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
);
