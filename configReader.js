var paths = {};

module.exports = function ($, config) {

    $.utils.checkMandatory(config, ['sources.rawAssets', 'sources.index']);

    return $.lodash.merge({
        // defaults
        order: {
            pipeminMinify: 100
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
};