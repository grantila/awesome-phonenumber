
import * as fs from 'fs'
import * as path from 'path'

import { parse, getRegionCodeForCountryCode } from '../'


const fixtureDir = path.join( __dirname, '..', 'test', 'fixtures' );
const filename = path.join( fixtureDir, 'random-numbers.json' );

const MAX_NUMBER = 4000;


const numbersByRegion = JSON.parse( fs.readFileSync( filename, 'utf8' ) );

function getAllRegions( )
{
	const regions: Array< string > = [ ];
	for ( let i = 0; i < 9999; ++i )
	{
		const regionCode = getRegionCodeForCountryCode( i );
		if ( regionCode === 'ZZ' )
			continue;
		regions.push( regionCode );
	}
	return regions;
}

function randomNumber( from: number, to: number )
{
	return from + Math.floor( Math.random( ) * ( 1 + to - from ) );
}

function randomNumbers( len: number )
{
	const numbers = [ ];
	for ( let i = 0; i < len; ++i )
		numbers.push( randomNumber( 0, 9 ) );
	return numbers.join( '' );
}

function boolToString( bool: boolean )
{
	return bool ? 'y' : 'n';
}

function makeKey( canBeInternationallyDialled, valid, type, possibility )
{
	return boolToString( canBeInternationallyDialled )
		+ '$$' + boolToString( valid )
		+ '$$' + type
		+ '$$' + possibility;
}

function randomizeNumbers( regionCode: string )
{
	if ( !numbersByRegion[ regionCode ] )
		numbersByRegion[ regionCode ] = { numbers: [ ] };

	for ( let i = 0; i < MAX_NUMBER; ++i )
	{
		const parsed =
			parse( randomNumbers( randomNumber( 4, 15 ) ), regionCode );

		numbersByRegion[ regionCode ].numbers.push( parsed );
	}
}

const allRegions = getAllRegions( );

allRegions.forEach( regionCode =>
{
	randomizeNumbers( regionCode );

	const known = { };

	const numbers = numbersByRegion[ regionCode ].numbers
		.filter( parsed =>
		{
			const key = makeKey(
				parsed.canBeInternationallyDialled,
				parsed.valid,
				parsed.type,
				parsed.possibility
			);

			if ( known[ key ] )
				return false;

			return known[ key ] = true;
		} );

		numbersByRegion[ regionCode ].numbers = numbers;
} );


fs.writeFileSync( filename, JSON.stringify( numbersByRegion, null, 4 ) );
