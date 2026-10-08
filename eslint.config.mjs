import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    js.configs.recommended,
    ...typescriptEslint.configs["flat/recommended"],
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
        },
    },
];
