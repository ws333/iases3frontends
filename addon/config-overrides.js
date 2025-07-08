module.exports = function override(config, env) {
    // prevent chunking for all files
    Object.assign(config.optimization, {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
            },
        },
    });

    // prevent hashes for the JS files
    Object.assign(config.output, { filename: "static/js/[name].js" });

    // prevent hashes for the CSS files
    // search for the "MiniCssExtractPlugin" so we can remove the hashing in the filename
    for (const plugin of config.plugins) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue;
        }
        if (plugin.constructor.name === "MiniCssExtractPlugin") {
            Object.assign(plugin.options, {
                filename: "static/css/[name].css",
            });
            delete plugin.options.chunkFilename;
        }
    }

    // minimize only the .min.js files
    for (const plugin of config.optimization.minimizer) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue;
        }

        if (plugin.constructor.name === "OptimizeCssAssetsWebpackPlugin") {
            Object.assign(plugin.options, { assetNameRegExp: /\.min\.css$/ });
        }
    }

    return config;
};
