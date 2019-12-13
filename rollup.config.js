const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const { terser } = require("rollup-plugin-terser");

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
        "browser-or-node",
        "lg-autoplay.js",
        "lg-fullscreen.js",
        "lg-hash.js",
        "lg-pager.js",
        "lg-share.js",
        "lg-thumbnail.js",
        "lg-video.js",
        "lg-zoom.js",
        "lightgallery.js",
        "prop-types",
        "react",
        "react-dom",
        "uniqid"
    ],
    inlineDynamicImports: true
};
