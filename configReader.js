var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;
    return _.merge({
        tasks: {
            pipeminBuild: config.tasks.build || 'build',
            pipeminCleanDist: config.tasks.cleanDist || 'clean:dist',
        },
        paths: {
            pipeminDist: config.paths.dist || 'dist/',
            pipeminPackage: config.paths.package || 'package.zip'
        },
        revReplaceExtensions: config.revReplaceExtensions || ['.js', '.css', '.html', '.json']
    }, config);
};