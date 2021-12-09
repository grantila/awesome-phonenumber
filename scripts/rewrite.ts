
import { promises } from 'fs'
import * as path from 'path'

const { readFile, writeFile } = promises;

const distFile = path.resolve( __dirname, '..', 'lib', 'index.js' );

async function rewrite( )
{
	const data = await readFile( distFile, 'utf-8' );
	const res = data.replace( /\bconst /g, 'var ' );
	await writeFile( distFile, res, 'utf-8' );
}
rewrite( );
