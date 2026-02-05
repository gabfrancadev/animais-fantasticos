import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,

  {
    files: ["js/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
    },
  },

  prettier,
];
