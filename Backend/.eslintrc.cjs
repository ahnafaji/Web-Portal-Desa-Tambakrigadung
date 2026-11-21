module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  plugins: ["security"],
  extends: ["eslint:recommended", "plugin:security/recommended-legacy"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "security/detect-object-injection": "off"
  },
};
