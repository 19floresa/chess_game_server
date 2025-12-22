module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescipt-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    env: {
        node: true,
        es6: true
    }
}