
var gulp        = require( 'gulp' );
var runSequence = require( 'run-sequence' );

var child   = require( 'child_process' );
var path    = require( 'path' );
var Promise = require( 'bluebird' );
var rimraf  = require( 'rimraf-promise' );
var mkdirp  = require( 'mkdirp' );


mkdirp = Promise.promisify( mkdirp );


var buildRoot = './build';
var libphonenumberUrl = 'https://github.com/googlei18n/libphonenumber/';
var closureLibraryUrl = 'https://github.com/google/closure-library/';
var closureLinterUrl = 'https://github.com/google/closure-linter';
var pythonGflagsUrl = 'https://github.com/google/python-gflags.git';

var isDebug = process.env.DEBUG && process.env.DEBUG !== '0';

gulp.task( 'clean', ( ) =>
	rimraf( buildRoot )
);

gulp.task( 'make-build-dir', ( ) =>
	mkdirp( buildRoot )
);

gulp.task( 'clone-libphonenumber', [ 'make-build-dir' ], ( ) =>
	gitClone( libphonenumberUrl, 'libphonenumber' )
);

gulp.task( 'clone-closure-library', [ 'make-build-dir' ], ( ) =>
	gitClone( closureLibraryUrl, 'closure-library' )
);

gulp.task( 'checkout-closure-linter', [ 'make-build-dir' ], ( ) =>
	gitClone( closureLinterUrl, 'closure-linter' )
);

gulp.task( 'checkout-python-gflags', [ 'make-build-dir' ], ( ) =>
	gitClone( pythonGflagsUrl, 'python-gflags' )
);

gulp.task( 'download-deps', [
	'clone-libphonenumber',
	'clone-closure-library',
	'checkout-closure-linter',
	'checkout-python-gflags'
] );

gulp.task( 'build-deps', [ 'download-deps' ] );

gulp.task( 'build-libphonenumber', ( ) => {
	var args = [ '-f', 'build.xml', 'compile-exports' ];
	return runCommand( 'ant', args, { cwd: '.' } );
} );

gulp.task( 'build', cb =>
	runSequence(
		'build-deps',
		'build-libphonenumber',
		cb
	)
);

gulp.task( 'default', [ 'clean' ], ( ) =>
	gulp.start( 'build' )
);

function gitClone( url, name )
{
	return runCommand( 'git', [ 'clone', '--depth=1', url, name ] );
}

function runCommand( cmd, args, opts )
{
	opts = opts || {
		cwd   : './build',
		stdio : [ null, null, isDebug ? process.stderr : null ]
	};

	return new Promise( function( resolve, reject ) {
		var cp = child.spawn( cmd, args, opts );
		cp.stdout.on( 'data', data => {
			if ( isDebug )
				console.log( data.toString( ) );
		} );
		cp.on( 'close', code => {
			if ( code === 0 )
				return resolve( );
			reject( new Error( cmd + " exited with exitcode " + code ) );
		} );
		cp.on( 'error', err => reject( err ) );
	} );
}
