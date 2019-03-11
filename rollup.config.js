const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
// const { uglify } = require("rollup-plugin-uglify");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    input: "src/index.js",
    output: {
        file: "./dist/index.js",
        format: "cjs"
    },
    plugins: [
        resolve({
            // pass custom options to the resolve plugin
            customResolveOptions: {
                moduleDirectory: "node_modules"
            }
        }),
        babel({
            exclude: "node_modules/**" // only transpile our source code
        }),
        commonjs({
            include: "node_modules/**",
            namedExports: {}
        }),
        // production plugins
        ...(isProduction ? [terser()] : [])
    ],
    external: [
        "react",
        "react-dom",
        "lightgallery.js",
        "lg-fullscreen.js",
        "lg-zoom.js",
        "lg-thumbnail.js",
        "browser-or-node",
        "prop-types",
        "uniqid"
    ],
    inlineDynamicImports: true
};
