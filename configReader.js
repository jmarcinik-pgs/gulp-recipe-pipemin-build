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
            assetSort: 100
        },
        tasks: {
            pipeminBuild: 'build',
            pipeminCleanDist: 'clean:dist',
            pipeminPackage: 'package'
        },
        paths: {
            pipeminDist: 'dist/',
            pipeminPackage: 'package.zip'
        }
    }, {
        // config names fallback to generics
        order: {
            pipeminMinify: config.order.minify
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