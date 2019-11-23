
import { parse } from '../'

const { numbers } = require( './numbers.json' );

const before = Date.now( );
const times = 10;

for ( var i = 0; i < times; ++i )
	numbers.map( num => JSON.stringify(parse( num, 'US' )) )

const after = Date.now( );

console.error(`Took ${after-before} ms`)
new Proxy( { }, {
	get( target, key )
	{
		;
	}
} );
