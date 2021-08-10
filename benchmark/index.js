'use strict';

var child_process = require( 'child_process' );
var rimraf        = require( 'rimraf-promise' );

var libs = [
	'awesome-phonenumber',
	'google-libphonenumber',
	'libphonenumber-js',
];

function runCommand( cmd, args, opts )
{
	var buffers = [ ];
	return new Promise( function( resolve, reject ) {
		var cp = child_process.spawn( cmd, args );
		cp.stdout.on( 'data', data => {
			if ( opts && opts.out )
				buffers.push( data );
		} );
		cp.on( 'close', code => {
			if ( code === 0 )
			{
				if ( opts && opts.out )
					return resolve( Buffer.concat( buffers ).toString( ) );
				else
					return resolve( );
			}
			reject( new Error( cmd + " exited with exitcode " + code ) );
		} );
		cp.on( 'error', err => reject( err ) );
	} );
}

function test( lib )
{
	return new Promise( ( resolve, reject ) => {
		var cp = child_process.spawn( 'node', [ 'test.js', lib ] );

		cp.stdout.on( 'data', data => {
			// Assume only one 'data' packet, I don't really care
			resolve( JSON.parse( data.toString( ) ) );
		} );

		cp.stdout.on( 'error', err =>
			reject( new Error( err ) )
		);
	} );
}

function install_all( )
{
	return runCommand( 'npm', [ 'install' ] );
}

var iterations = 100;

function run_tests( lib )
{
	console.log( `Testing speeds of ${lib}` );

	var results = [ ];
	var iteration = iterations;

	function test_speeds( )
	{
		return test( lib )
		.then( result => {
			if ( results.length === 0 )
				results = result;
			else
			{
				results[ 0 ] += result[ 0 ];
				results[ 1 ] += result[ 1 ];
				results[ 2 ] += result[ 2 ];
				results[ 3 ] += result[ 3 ];
			}
		} )
		.then( _ => {
			if ( --iteration > 0 )
				return test_speeds( );
		} );
	}

	function install_test( )
	{
		var iterations = 5;
		var iteration = iterations;
		var time = 0;

		if ( process.env.NO_INSTALL_TEST )
			return { };

		function recurse( )
		{
			return rimraf( './node_modules' )
			.then( _ => {
				var start = Date.now( );
				return runCommand( 'npm', [ 'install', lib ] )
				.then( _ => {
					var end = Date.now( );
					time += ( end - start );
				} );
			} )
			.then( _ => {
				if ( --iteration )
					return recurse( );
			} );
		}

		return recurse( )
		.then( _ => time / iterations )
		.then( time => {
			var findArgs = [ `node_modules/${lib}`, '-type', 'f' ];
			return runCommand( 'find', findArgs, { out: true } )
			.then( files => {
				files = files.split( "\n" ).length;

				var duArgs = [ '-hs', `node_modules/${lib}` ];
				return runCommand( 'du', duArgs, { out: true } )
				.then( size => {
					size = size.split( "\t" )[ 0 ];
					return {
						time  : time,
						files : files,
						size  : size
					};
				} );
			} );
		} );
	}

	return install_all( )
	.then( test_speeds )
	.then( install_test )
	.then( data => {
		console.log( {
			load   : results[ 0 ] / iterations,
			parse  : results[ 1 ] / iterations,
			parse2 : results[ 2 ] / iterations,
			mem    : results[ 3 ] / iterations,
			time   : data.time,
			files  : data.files,
			size   : data.size
		} );
	} );
}

Promise.resolve( )
.then( _ => run_tests( libs[ 0 ] ) )
.then( _ => run_tests( libs[ 1 ] ) )
.then( _ => run_tests( libs[ 2 ] ) )
.catch( err => console.error( err ) );
