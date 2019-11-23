'use strict';

const {
	parse,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	getExample,
	getAsYouType,
} = require( '../../' );

describe( 'general', function( ) {
	it( 'should be able to parse a phone number', function( ) {
		const pn = parse( '0707123456', 'SE' );
		expect( pn.valid ).toBe( true );
		expect( pn.possible ).toBe( true );
		expect( pn.mobile ).toBe( true );
		expect( pn.number.significant ).toBe( '707123456' );
		expect( pn.canBeInternationallyDialled ).toBe( true );
	} );

	it( 'should be able to create an example phone number', function( ) {
		const pn1 = getExample( 'SE' );
		expect( pn1.valid ).toBe( true );
		expect( pn1.possible ).toBe( true );

		const pn2 = getExample( 'SE', 'mobile' );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
		expect( pn2.mobile ).toBe( true );
		expect( pn2.fixedLine ).toBe( false );

		const pn3 = getExample( 'SE', 'fixed-line' );
		expect( pn3.valid ).toBe( true );
		expect( pn3.possible ).toBe( true );
		expect( pn3.mobile ).toBe( false );
		expect( pn3.fixedLine ).toBe( true );
	} );

	it( 'should be able to format as-you-type', function( ) {
		const ayt = getAsYouType( 'SE' );
		expect( ayt.addChar( '0' ) ).toBe( '0' );
		expect( ayt.addChar( '7' ) ).toBe( '07' );
		expect( ayt.addChar( '0' ) ).toBe( '070' );
		expect( ayt.addChar( '7' ) ).toBe( '070-7' );
		expect( ayt.addChar( '1' ) ).toBe( '070-71' );
		expect( ayt.addChar( '2' ) ).toBe( '070-712' );

		const pn1 = ayt.getPhoneNumber( );
		expect( pn1.valid ).toBe( false );

		expect( ayt.addChar( '3' ) ).toBe( '070-712 3' );
		expect( ayt.addChar( '4' ) ).toBe( '070-712 34' );
		expect( ayt.addChar( '5' ) ).toBe( '070-712 34 5' );
		expect( ayt.addChar( '6' ) ).toBe( '070-712 34 56' );

		const pn2 = ayt.getPhoneNumber( );
		expect( pn2.valid ).toBe( true );
		expect( pn2.possible ).toBe( true );
	} );

	it( 'should be able to convert country code <-> region code', function( ) {
		expect( getCountryCodeForRegionCode( 'SE' ) ).toBe( 46 );
		expect( getRegionCodeForCountryCode( 46 ) ).toBe( 'SE' );
	} );

	it( 'should be possible to get region code', function( ) {
		const pn = parse( '0707123456', 'SE' );
		expect( pn.regionCode ).toBe( 'SE' );
	} );

	it( 'should have supported calling codes', function( ) {
		const codes = getSupportedCallingCodes( );
		expect( codes.length ).toBeGreaterThanOrEqual( 100 );
	} );

	it( 'should have supported calling regions', function( ) {
		const regions = getSupportedRegionCodes( );
		expect( regions.length ).toBeGreaterThanOrEqual( 100 );
	} );
} );
