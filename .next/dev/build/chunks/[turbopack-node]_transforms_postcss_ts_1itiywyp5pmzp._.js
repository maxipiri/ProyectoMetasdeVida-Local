module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/postcss.config.cjs { CONFIG => \"[project]/postcss.config.cjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/node_modules_20v-8wlfss9m1._.js",
  "chunks/[root-of-the-server]__0yg-we9u4am7t._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/postcss.config.cjs { CONFIG => \"[project]/postcss.config.cjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];