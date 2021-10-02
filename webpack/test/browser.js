import { fileURLToPath } from 'node:url'
import path from 'node:path'

import puppeteer from 'puppeteer'

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const pagePath =
	path.normalize( path.resolve( __dirname, '../dist/index.html' ) );

( async ( ) =>
{
	const browser = await puppeteer.launch( );
	const page = await browser.newPage( );
	await page.goto( `file://${pagePath}` );

	const text = await page.$eval( '#rootdiv', page => page.innerHTML );

	await browser.close( );

	if ( text !== 'Formatted: 070-712 34 56' )
	{
		console.error( `text = ${text}` );
		throw new Error( 'webpack test failed' );
	}
} )( );
