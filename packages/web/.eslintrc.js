module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        "prettier",
        "prettier/@typescript-eslint",
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        "indent": "off",
        ["@typescript-eslint/indent"]: ["error", 2],
        ["@typescript-eslint/explicit-member-accessibility"]: ["error", {
            "accessibility": "off"
        }],
        ["@typescript-eslint/no-use-before-define"]: ["error", {
            "functions": false,
            "classes": true
        }]
    },
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
}
