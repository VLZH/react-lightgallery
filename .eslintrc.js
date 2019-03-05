module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react", "prettier"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-console": "off"
    },
    globals: {
        lightGallery: true
    }
};
