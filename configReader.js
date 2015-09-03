var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;
    $.utils.checkMandatory(config, ['sources.assets', 'sources.index']);

    config = _.merge({
        // defaults
        sources: {
            build: []
        },
        order: {
            pipeminMinify: 100,
            assetSort: 100,
            pipeminConcatJs: 0,
            pipeminConcatCss: 0
        },
        tasks: {
            pipeminBuild: 'build',
            pipeminCleanDist: 'clean:dist',
            pipeminPackage: 'package'
        },
        paths: {
            pipeminDist: 'dist/',
            pipeminPackage: 'package.zip'
        },
        pipeminBuild: {
            htmlMinify: {empty: true, spare: true, quotes: true, conditionals: true},
            csso: {},
            uglify: {preserveComments: function () { return $.uglifySaveLicense.apply(this, arguments); }}
        }
    }, {
        // config names fallback to generics
        order: {
            pipeminMinify: config.order.minify,
            pipeminConcatJs: config.order.concatJs !== void 0 ? config.order.concatJs : config.order.concat,
            pipeminConcatCss: config.order.concatCss !== void 0 ? config.order.concatCss : config.order.concat
        },
        tasks: {
            pipeminBuild: config.tasks.build,
            pipeminCleanDist: config.tasks.cleanDist,
            pipeminPackage: config.tasks.package
        },
        paths: {
            pipeminDist: config.paths.dist,
            pipeminPackage: config.paths.package
        }
        // specific config
    }, config);
    config.sources = _.pick(config.sources, 'index', 'build', 'assets');
    return config;
};