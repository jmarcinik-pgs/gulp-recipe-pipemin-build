'use strict';

// Dependencies

module.exports = function ($, config, sources) {
    var _ = $.lodash;

    // lazy shortcuts
    function rev() {
        return $.rev();
    }

    var pipes = {
        // asset pipes, goes into pipemin in asset pipe
        assetRaw: sources.rawAssets
            .pipe($.utils.sortFiles),

        // process pipes, used inside pipemin only on referenced assets
        processJsUglify: [100, $.lazypipe()
            .pipe(function () {
                return $.uglify({preserveComments: $.uglifySaveLicense});
            })
            .pipe(rev)],

        processCssCsso: [100, $.lazypipe()
            .pipe(function () {
                return $.csso();
            })
            .pipe(rev)],

        processHtmlMinify: [100, $.lazypipe()
            .pipe(function () {
                return $.minifyHtml({empty: true, spare: true, quotes: true, conditionals: true});
            })],

        // build pipes, merged to pipemin output
        buildFonts: $.lazypipe()
            .pipe(sources.fonts)
            .pipe(rev),

        buildTranslations: $.lazypipe()
            .pipe(sources.translations)
            .pipe(rev),

        buildImages: $.lazypipe()
            .pipe(sources.images)
            // Takes too long to be always enabled. Its good to enable it sometimes and save minified files
            //.pipe($.imagemin, {optimizationLevel: 3, progressive: true, interlaced: true})
            .pipe(rev),

        buildHtml: $.lazypipe()
            .pipe(sources.html)
            .pipe(function () {
                return pipes.processHtmlMinify[1]();
            })
            .pipe(rev)
    };

    // Clean dist directory
    $.gulp.task(config.tasks.pipeminCleanDist, function (cb) {
        return $.rimraf(config.paths.pipeminDist, cb);
    });

    // merge multiple lazypipes into one
    $.gulp.task(config.tasks.pipeminBuild, [config.tasks.pipeminCleanDist], function () {
        var assetPipe = $.utils.mergedLazypipe($.utils.getPipes('asset'));
        var buildPipe = $.utils.mergedLazypipe($.utils.getPipes('build'));
        var preBuildPipe = $.utils.sequentialLazypipe($.utils.getPipes('preBuild'));
        var postBuildPipe = $.utils.sequentialLazypipe($.utils.getPipes('postBuild'));
        var processJsPipe = $.utils.sequentialLazypipe($.utils.getPipes('processJs'));
        var processCssPipe = $.utils.sequentialLazypipe($.utils.getPipes('processCss'));
        var processHtmlPipe = $.utils.sequentialLazypipe($.utils.getPipes('processHtml'));

        var pipeminPipe = $.lazypipe()
            .pipe(sources.index)
            .pipe(preBuildPipe)
            .pipe($.pipemin, {
                assetsStream: assetPipe,
                js: processJsPipe,
                css: processCssPipe,
                html: processHtmlPipe
            });

        return $.utils.mergedLazypipe([pipeminPipe, buildPipe])
            .pipe($.revReplace, {replaceInExtensions: config.revReplaceExtensions})
            .pipe(postBuildPipe)
            .pipe($.gulp.dest, config.paths.pipeminDist)
            .pipe($.size)();
    });

    $.gulp.task('package', ['build'], function () {
        return $.gulp.src(config.paths.pipeminDist+ '**/*')
            .pipe($.zip(config.paths.pipeminZip))
            .pipe($.gulp.dest('.'));
    });

    return {
        pipes: pipes
    };
};

