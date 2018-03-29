
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const sync = require('run-sequence');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
var fs = require('fs');

    function decideDist()
    {
        if(process.env.buildFor == 'deploy')
        {
            return {
                root: 'app/dist/'
            }
        }
        else
        {
            return {
                root: '../../../dist/content/viewers/atomic/v1/js/'
            }
        }
    }

	var config = {};
	config.dist = decideDist();

gulp.task('copy-version' , () => {
    var pkg = require('./package.json');
    fs.writeFileSync(path.join(__dirname, 'web/dist/sarine.viewer.360player.config'), JSON.stringify({version: pkg.version}));
});

gulp.task('copy-2-env-dist', () => {
    return gulp.src('web/dist/**/*').pipe(gulp.dest(config.dist.root))
});

gulp.task('build', function(done)
{
    sync('copy-version' , 'copy-2-env-dist' , done);
});

gulp.task('default', function(done)
{
    sync('build');
});

gulp.task('watch', function(done)
{
    watch('./libs/*.js' , batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task('dev', function(done)
{
    sync('build' , 'watch' , done);
});


